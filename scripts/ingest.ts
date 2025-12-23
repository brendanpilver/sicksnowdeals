import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

type Category = "board" | "boots" | "bindings";
type Stock = "in_stock" | "out_of_stock" | "unknown";

type FeedProduct = {
  merchantName: string;
  network: string;
  external_id: string;
  category: Category;
  brand?: string;
  title: string;
  canonical_url: string;
  affiliate_url?: string;
  image_url?: string;
  price_cents?: number;
  sale_price_cents?: number;
  stock?: Stock;
  attrs: Record<string, any>;
};

function cleanImageUrl(url?: string) {
  if (!url) return null;
  return url.trim().replace(/\$\d+$/, ""); // strips trailing $0, $1, etc
}

async function ensureMerchant(
  supabase: ReturnType<typeof createClient>,
  name: string,
  network: string
) {
  const { data: existing, error: selErr } = await supabase
    .from("merchants")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing?.id) return existing.id as string;

  const { data: inserted, error: insErr } = await supabase
    .from("merchants")
    .insert({ name, network })
    .select("id")
    .single();

  if (insErr) throw insErr;
  return inserted.id as string;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
    );
  }

  const supabase = createClient(url, serviceKey);

  const feedPath = path.join(process.cwd(), "scripts", "feed.normalized.json");
  const raw = fs.readFileSync(feedPath, "utf8");
  const feed: FeedProduct[] = JSON.parse(raw);

  console.log(`Loaded ${feed.length} items from feed.normalized.json`);

  // Cache merchants so we don’t repeatedly query
  const merchantCache = new Map<string, string>();

  for (const item of feed) {
    const merchantKey = `${item.merchantName}::${item.network}`;
    let merchantId = merchantCache.get(merchantKey);

    if (!merchantId) {
      merchantId = await ensureMerchant(supabase, item.merchantName, item.network);
      merchantCache.set(merchantKey, merchantId);
    }

    const { data: prod, error: upErr } = await supabase
      .from("products")
      .upsert(
        {
          merchant_id: merchantId,
          external_id: item.external_id,
          category: item.category,
          brand: item.brand ?? null,
          title: item.title,
          canonical_url: item.canonical_url,
          affiliate_url: item.affiliate_url ?? null,
          image_url: cleanImageUrl(item.image_url),
          currency: "USD",
          price_cents: item.price_cents ?? null,
          sale_price_cents: item.sale_price_cents ?? null,
          stock: item.stock ?? "unknown",
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "merchant_id,external_id" }
      )
      .select("id")
      .single();

    if (upErr) {
      console.error("Upsert product failed:", item.title, upErr.message);
      continue;
    }

    const { error: aErr } = await supabase
      .from("product_attributes")
      .upsert({ product_id: prod.id, attrs: item.attrs });

    if (aErr) {
      console.error("Upsert attrs failed:", item.title, aErr.message);
      continue;
    }

    console.log(`Upserted: ${item.category} - ${item.title}`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
