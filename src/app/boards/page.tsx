import { getBrandsForCategory } from "@/lib/brands";
import { getProducts } from "@/lib/db";
import { Filters } from "@/components/Filters";
import { ProductCard } from "@/components/ProductCard";

export default async function BoardsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q : undefined;
  const brand = typeof sp.brand === "string" ? sp.brand : undefined;
  const min =
    typeof sp.min === "string" && sp.min ? Math.round(Number(sp.min) * 100) : undefined;
  const max =
    typeof sp.max === "string" && sp.max ? Math.round(Number(sp.max) * 100) : undefined;

  const sort = typeof sp.sort === "string" ? sp.sort : undefined;

const brands = await getBrandsForCategory("board");

  const products = await getProducts({
    category: "board",
    q,
    brand,
    minPrice: min,
    maxPrice: max,
    sort: sort as any, // quick MVP typing
  });

return (
    <main style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, padding: 18 }}>
      <aside>
        <h1>Snowboards</h1>
       <Filters category="boards" brands={brands} />

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
