import { supabaseServer } from "./supabase/server";

export type ProductCategory = "board" | "boots" | "bindings";
export type SortKey = "best_deal" | "price_asc" | "price_desc" | "newest";

export type ProductRow = {
  id: string;
  merchant_id: string;
  merchant_name: string | null;
  category: ProductCategory;
  brand: string | null;
  title: string;
  image_url: string | null;
  currency: string;
  price_cents: number | null;
  sale_price_cents: number | null;
  stock: string;
  last_seen_at: string | null;
};

export async function getProducts(params: {
  category?: ProductCategory; // optional => "All categories"
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sort?: SortKey;
}) {
  const supabase = await supabaseServer();

  let query = supabase
    .from("products")
    .select(
      `id,merchant_id,category,brand,title,image_url,currency,price_cents,sale_price_cents,stock,last_seen_at,
       merchants:merchant_id(name)`
    );

  // ✅ Only filter by category if provided (prevents enum errors)
  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.brand) query = query.eq("brand", params.brand);
  if (params.q) query = query.ilike("title", `%${params.q}%`);

  // Price filter: use sale price if present, else price
  if (params.minPrice != null) {
    query = query.or(
      `sale_price_cents.gte.${params.minPrice},and(sale_price_cents.is.null,price_cents.gte.${params.minPrice})`
    );
  }
  if (params.maxPrice != null) {
    query = query.or(
      `sale_price_cents.lte.${params.maxPrice},and(sale_price_cents.is.null,price_cents.lte.${params.maxPrice})`
    );
  }

  const sort: SortKey = params.sort ?? "best_deal";

  if (sort === "newest") {
    query = query.order("last_seen_at", { ascending: false });
  } else if (sort === "price_desc") {
    query = query
      .order("sale_price_cents", { ascending: false, nullsFirst: false })
      .order("price_cents", { ascending: false, nullsFirst: false });
  } else if (sort === "best_deal") {
    // We'll sort by discount percentage client-side
    query = query.order("sale_price_cents", { ascending: true, nullsFirst: false });
  } else {
    // price_asc
    query = query
      .order("sale_price_cents", { ascending: true, nullsFirst: false })
      .order("price_cents", { ascending: true, nullsFirst: false });
  }

  const { data, error } = await query.limit(60);

  if (error) {
    throw new Error(`getProducts failed: ${error.message}`);
  }

  // Map the data to include merchant_name in the root
  return (data ?? []).map(product => ({
    ...product,
    merchant_name: (product as any).merchants?.name ?? null
  })) as ProductRow[];
}
