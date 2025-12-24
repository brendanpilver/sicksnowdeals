import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

function money(cents?: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      category,
      brand,
      title,
      image_url,
      currency,
      price_cents,
      sale_price_cents,
      stock,
      canonical_url,
      affiliate_url,
      last_seen_at,
      merchants:merchant_id ( id, name, network ),
      product_attributes ( attrs )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    // You can log if you want: console.error(error)
    notFound();
  }

  if (!data) notFound();

  const priceToShow = data.sale_price_cents ?? data.price_cents ?? null;
  const attrs = (data.product_attributes?.[0]?.attrs ?? {}) as Record<string, any>;
  const merchant = Array.isArray(data.merchants) ? data.merchants[0] : data.merchants;

  return (
    <main style={{ padding: 18, maxWidth: 1000, margin: "0 auto", display: "grid", gap: 14 }}>
      <a href="/gear" style={{ textDecoration: "none" }}>
        ← Back to Gear Finder
      </a>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 18 }}>
        <div>
          {data.image_url ? (
            <img
              src={data.image_url}
              alt={data.title}
              style={{
                width: "100%",
                height: 360,
                objectFit: "contain",
                background: "#fafafa",
                border: "1px solid #eee",
                borderRadius: 6,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 360,
                background: "#f0f0f0",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              No image
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#666", textTransform: "uppercase" }}>
            {data.category}
          </div>

          <h1 style={{ margin: 0 }}>{data.title}</h1>

          {data.brand ? <div style={{ fontSize: 16, color: "#555" }}>{data.brand}</div> : null}

          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{money(priceToShow)}</div>
            {data.sale_price_cents && data.price_cents ? (
              <div style={{ textDecoration: "line-through", color: "#777" }}>
                {money(data.price_cents)}
              </div>
            ) : null}
          </div>

          <div style={{ color: "#666", fontSize: 14 }}>
            {merchant?.name ? (
              <>
                Sold by <b>{merchant.name}</b>
                {merchant.network ? ` (${merchant.network})` : ""}
              </>
            ) : (
              "Merchant unknown"
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <a
              href={`/api/out/${data.id}`}
              style={{
                display: "inline-block",
                padding: "10px 12px",
                borderRadius: 6,
                background: "#000",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Buy (affiliate)
            </a>

            {data.canonical_url ? (
              <a
                href={data.canonical_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  textDecoration: "none",
                }}
              >
                View source
              </a>
            ) : null}
          </div>

          <div style={{ marginTop: 10 }}>
            <h3 style={{ marginBottom: 6 }}>Specs (from feed)</h3>
            {Object.keys(attrs).length ? (
              <pre
                style={{
                  background: "#fafafa",
                  border: "1px solid #eee",
                  padding: 12,
                  borderRadius: 6,
                  overflowX: "auto",
                  fontSize: 13,
                }}
              >
                {JSON.stringify(attrs, null, 2)}
              </pre>
            ) : (
              <div style={{ color: "#777" }}>No specs available yet.</div>
            )}
          </div>

          {data.last_seen_at ? (
            <div style={{ fontSize: 12, color: "#777" }}>
              Price last seen: {new Date(data.last_seen_at).toLocaleString()}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
