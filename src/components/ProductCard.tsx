import Link from "next/link";
import { ProductRow } from "@/lib/db";

export function ProductCard({
  product,
  showCategory,
}: {
  product: ProductRow;
  showCategory?: boolean;
}) {
  const originalPriceCents = product.price_cents ?? null;
  const salePriceCents = product.sale_price_cents ?? null;

  const formattedOriginalPrice =
    originalPriceCents != null
      ? `$${(originalPriceCents / 100).toFixed(2)}`
      : "—";

  const formattedSalePrice =
    salePriceCents != null
      ? `$${(salePriceCents / 100).toFixed(2)}`
      : formattedOriginalPrice;

  const percentOff =
    salePriceCents != null &&
    originalPriceCents != null &&
    originalPriceCents > 0
      ? Math.max(
          0,
          Math.round(
            ((originalPriceCents - salePriceCents) / originalPriceCents) * 100,
          ),
        )
      : null;

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
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {salePriceCents != null && originalPriceCents != null ? (
          <>
            <div
              style={{
                textDecoration: "line-through",
                color: "#888",
                fontWeight: 600,
              }}
            >
              {formattedOriginalPrice}
            </div>
            <div style={{ fontWeight: 700 }}>{formattedSalePrice}</div>
            {percentOff != null && (
              <div style={{ color: "#d32f2f", fontWeight: 700, fontSize: 20 }}>
                {percentOff}% off
              </div>
            )}
          </>
        ) : (
          <div style={{ fontWeight: 700 }}>{formattedOriginalPrice}</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "grid", gap: 6 }}>
        <Link
          href={`/gear/p/${product.id}`}
          style={{
            display: "inline-block",
            textAlign: "center",
            padding: "8px 10px",
            borderRadius: 4,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Details
        </Link>
        <a
          href={buyHref}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 10px",
            borderRadius: 4,
            border: "1px solid #ddd",
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View Deal {product.merchant_name && `(${product.merchant_name})`}
        </a>
      </div>
    </div>
  );
}
