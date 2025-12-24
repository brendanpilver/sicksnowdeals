import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ProductCard } from "@/components/ProductCard";
import { Filters } from "@/components/Filters";
import { getProducts, type SortKey } from "@/lib/db";
import { getBrandsForCategory } from "@/lib/brands";

type RouteCategory = "all" | "boards" | "boots" | "bindings";
type ProductCategory = "board" | "boots" | "bindings";

const ROUTE_TO_PRODUCT: Record<Exclude<RouteCategory, "all">, ProductCategory> = {
  boards: "board",
  boots: "boots",
  bindings: "bindings",
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Category from URL (?cat=...)
  const cat =
    typeof sp.cat === "string" &&
    (sp.cat === "all" || sp.cat === "boards" || sp.cat === "boots" || sp.cat === "bindings")
      ? (sp.cat as RouteCategory)
      : "all";

  const productCategory: ProductCategory | undefined =
    cat === "all" ? undefined : ROUTE_TO_PRODUCT[cat];

  // Filters
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const brand = typeof sp.brand === "string" ? sp.brand : undefined;

  const min =
    typeof sp.min === "string" && sp.min ? Math.round(Number(sp.min) * 100) : undefined;
  const max =
    typeof sp.max === "string" && sp.max ? Math.round(Number(sp.max) * 100) : undefined;

  const sort: SortKey =
    typeof sp.sort === "string" ? (sp.sort as SortKey) : "best_deal";

  const brands = await getBrandsForCategory(productCategory);
  const products = await getProducts({
    category: productCategory,
    q,
    brand,
    minPrice: min,
    maxPrice: max,
    sort,
  });

  // Hottest deals: must have an affiliate link, must have a discount, sorted by biggest discount.
  // If your column names differ, tell me and I’ll adjust.
  const { data: hottestDeals, error } = await supabase
    .from("products")
    .select("*")
    .not("affiliate_url", "is", null)
    .gt("discount_percent", 0)
    .order("discount_percent", { ascending: false })
    .order("sale_price_cents", { ascending: true })
    .limit(12);

  return (
    <main style={{ padding: 20, display: "grid", gap: 16 }}>
      {/* Top strip */}
      <div style={{ display: "grid", gap: 6 }}>
        <h1 style={{ margin: 0 }}>Sick Snow Deals</h1>
        <p style={{ margin: 0 }}>Sick deals, matched to how you ride.</p>

        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
          {/* Quiz CTA (can point to a placeholder page for now) */}
          <Link href="/quiz" style={{ fontWeight: 800 }}>
            Find Your Ride →
          </Link>

          {/* Browse deals button that jumps to the deals section */}
          <a href="#deals" style={{ fontWeight: 800 }}>
            Browse All The Deals ↓
          </a>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
          <Link href="/boards">Boards</Link>
          <Link href="/boots">Boots</Link>
          <Link href="/bindings">Bindings</Link>
        </div>

        {/* Affiliate disclosure (required for networks) */}
        <div style={{ margin: "10px 0 0", fontSize: 12, opacity: 0.85, display: "grid", gap: 2 }}>
          <div>As an Amazon Associate I earn from qualifying purchases.</div>
          <div>Some links are affiliate links; if you buy, we may earn a commission at no extra cost to you.</div>
        </div>
      </div>

      {/* Hottest deals */}
      <section id="deals" style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>🔥 Hottest Deals Right Now</h2>
          <Link href="/gear">See all →</Link>
        </div>

        {error ? (
          <p style={{ color: "crimson" }}>
            Couldn’t load deals yet: {error.message}
          </p>
        ) : !hottestDeals?.length ? (
          <p>No deals found yet. (Once ingest runs with prices + discounts, they’ll show here.)</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {hottestDeals.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Full finder */}
      <section style={{ display: "grid", gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>Browse All Deals</h2>
          <div style={{ color: "#555" }}>
            Use the filters to find the right board, boots, or bindings.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18 }}>
          <aside>
            <h3 style={{ marginTop: 0 }}>Gear Finder</h3>

            {/* Category selector */}
            <form action="/" style={{ marginBottom: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Category</span>
                <select name="cat" defaultValue={cat}>
                  <option value="all">All</option>
                  <option value="boards">Boards</option>
                  <option value="boots">Boots</option>
                  <option value="bindings">Bindings</option>
                </select>
              </label>
              <button type="submit" style={{ marginTop: 8 }}>
                Apply
              </button>
            </form>

            {/* Filters */}
            <Filters category="gear" brands={brands} basePath="/" />
          </aside>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {products.length ? (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <p style={{ margin: 0, color: "#555" }}>No products match these filters yet.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
