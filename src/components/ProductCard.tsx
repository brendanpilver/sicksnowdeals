import Link from "next/link";
import { ProductRow } from "@/lib/db";

export function ProductCard({
  product,
  showCategory,
}: {
  product: ProductRow;
  showCategory?: boolean;
}) {
  const price =
    product.sale_price_cents ?? product.price_cents ?? null;

  const formattedPrice =
    price != null ? `$${(price / 100).toFixed(2)}` : "—";

  const buyHref = `/api/out/${product.id}`;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 6,
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      {/* Category badge (only when viewing All) */}
      {showCategory && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          {product.category}
        </div>
      )}

      {/* Image */}
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.title}
          style={{
            width: "100%",
            height: 180,
            objectFit: "contain",
            background: "#fafafa",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 180,
            background: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: 14,
          }}
        >
          No image
        </div>
      )}

      {/* Title */}
      <div style={{ fontWeight: 600 }}>{product.title}</div>

      {/* Brand */}
      {product.brand && (
        <div style={{ fontSize: 14, color: "#555" }}>
          {product.brand}
        </div>
      )}

      {/* Price */}
      <div style={{ fontWeight: 700 }}>{formattedPrice}</div>

      {/* Actions */}
      <div style={{ display: "grid", gap: 6 }}>
        <Link
          href={`/gear/p/${product.id}`}
          style={{
            display: "inline-block",
            textAlign: "center",
            padding: "8px 10px",
            borderRadius: 4,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View details
        </Link>
        <a
          href={buyHref}
          style={{
            display: "inline-block",
            textAlign: "center",
            padding: "8px 10px",
            borderRadius: 4,
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View Deal
        </a>
      </div>
    </div>
  );
}
