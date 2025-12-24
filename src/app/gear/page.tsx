import { getProducts, type SortKey } from "@/lib/db";
import { getBrandsForCategory } from "@/lib/brands";
import { Filters } from "@/components/Filters";
import { ProductCard } from "@/components/ProductCard";

type RouteCategory = "all" | "boards" | "boots" | "bindings";
type ProductCategory = "board" | "boots" | "bindings";

const ROUTE_TO_PRODUCT: Record<Exclude<RouteCategory, "all">, ProductCategory> = {
  boards: "board",
  boots: "boots",
  bindings: "bindings",
};

export default async function GearPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // Category from URL (?cat=...)
  const cat =
    typeof sp.cat === "string" &&
    (sp.cat === "all" || sp.cat === "boards" || sp.cat === "boots" || sp.cat === "bindings")
      ? sp.cat
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

  // Data
  const brands = await getBrandsForCategory(productCategory);
  const products = await getProducts({
    category: productCategory,
    q,
    brand,
    minPrice: min,
    maxPrice: max,
    sort,
  });

  return (
    <main className="stackable-two-col" style={{ padding: 18 }}>
      {/* LEFT SIDEBAR */}
      <aside>
        <h1>Gear Finder</h1>
        <div style={{ fontSize: 12, color: "#555", margin: "6px 0 12px", display: "grid", gap: 2 }}>
          <div>As an Amazon Associate I earn from qualifying purchases.</div>
          <div>Some links are affiliate links; we may earn a commission at no extra cost to you.</div>
        </div>

        {/* Category selector */}
        <form action="/gear" style={{ marginBottom: 12 }}>
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
        <Filters category="gear" brands={brands} basePath="/gear" />
      </aside>

      {/* PRODUCT GRID */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </section>
    </main>
  );
}
