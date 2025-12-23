import { getProducts, type SortKey } from "@/lib/db";
import { getBrandsForCategory } from "@/lib/brands";
import { Filters } from "@/components/Filters";
import { ProductCard } from "@/components/ProductCard";

type RouteCategory = "boards" | "boots" | "bindings";
type ProductCategory = "board" | "boots" | "bindings";

const ROUTE_TO_PRODUCT: Record<RouteCategory, ProductCategory> = {
  boards: "board",
  boots: "boots",
  bindings: "bindings",
};

const TITLES: Record<RouteCategory, string> = {
  boards: "Snowboards",
  boots: "Snowboard Boots",
  bindings: "Snowboard Bindings",
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;

  // Validate category from URL
  if (category !== "boards" && category !== "boots" && category !== "bindings") {
    return (
      <main style={{ padding: 18 }}>
        <h1>Not found</h1>
        <p>Unknown category: {category}</p>
      </main>
    );
  }

  const routeCategory = category as RouteCategory;
  const productCategory = ROUTE_TO_PRODUCT[routeCategory];

  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q : undefined;
  const brand = typeof sp.brand === "string" ? sp.brand : undefined;

  const min =
    typeof sp.min === "string" && sp.min ? Math.round(Number(sp.min) * 100) : undefined;
  const max =
    typeof sp.max === "string" && sp.max ? Math.round(Number(sp.max) * 100) : undefined;

  const sort = (typeof sp.sort === "string" ? (sp.sort as SortKey) : undefined) ?? "best_deal";

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
    <main style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, padding: 18 }}>
      <aside>
        <h1>{TITLES[routeCategory]}</h1>
        <Filters category={routeCategory} brands={brands} />
      </aside>

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
