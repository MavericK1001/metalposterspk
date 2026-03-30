import { useState } from "react";
import { Link, useFetcher } from "react-router";
import { Image } from "@shopify/hydrogen";
import { PosterPreview } from "./PosterPreview";
import { formatMoney } from "~/lib/utils";

interface ProductCardProduct {
  id: string;
  title: string;
  handle: string;
  productType?: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  featuredImage?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  variants: { nodes: { id: string }[] };
}

const BADGE_TAGS: Record<string, { label: string; bg: string }> = {
  hot: { label: "HOT", bg: "var(--red)" },
  new: { label: "NEW", bg: "var(--ink)" },
  sale: { label: "SALE", bg: "var(--red)" },
  custom: { label: "CUSTOM", bg: "var(--ink)" },
};

const SIZES = ["S", "M", "L", "XL"];

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const fetcher = useFetcher();
  const [added, setAdded] = useState(false);

  const badge = product.tags
    .map((t) => t.toLowerCase())
    .find((t) => t in BADGE_TAGS);

  const hasCompare =
    product.compareAtPriceRange?.minVariantPrice &&
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
      parseFloat(product.priceRange.minVariantPrice.amount);

  const subLabel =
    product.productType ||
    product.tags.find(
      (t) => !["hot", "new", "sale", "custom"].includes(t.toLowerCase()),
    ) ||
    "";

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const variantId = product.variants.nodes[0]?.id;
    if (!variantId) return;

    fetcher.submit(
      { intent: "add-to-cart", variantId, quantity: "1" },
      { method: "post", action: "/cart" },
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      to={`/products/${product.handle}`}
      className="product-card"
      style={{
        background: "var(--cream)",
        border: "1px solid var(--mid)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Image */}
      <div
        style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden" }}
      >
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            sizes="(max-width:768px) 100vw, 25vw"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <PosterPreview title={product.title} />
        )}

        {/* Badge */}
        {badge && BADGE_TAGS[badge] && (
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              padding: "4px 10px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              background: BADGE_TAGS[badge].bg,
              color: "var(--white)",
            }}
          >
            {BADGE_TAGS[badge].label}
          </span>
        )}

        {/* Quick Add */}
        <button
          type="button"
          className="quick-add"
          onClick={handleQuickAdd}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--ink)",
            color: "white",
            border: "none",
            padding: 11,
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {added ? "ADDED ✓" : "QUICK ADD +"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: 17,
            letterSpacing: 0.5,
            color: "var(--ink)",
            marginBottom: 2,
          }}
        >
          {product.title}
        </div>

        {subLabel && (
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            {subLabel}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: 20,
              }}
            >
              {formatMoney(product.priceRange.minVariantPrice)}
            </span>
            {hasCompare && (
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: "var(--muted)",
                  textDecoration: "line-through",
                }}
              >
                {formatMoney(product.compareAtPriceRange!.minVariantPrice)}
              </span>
            )}
          </div>

          {/* Size dots */}
          <div style={{ display: "flex", gap: 3 }}>
            {SIZES.map((s) => (
              <span
                key={s}
                style={{
                  width: 18,
                  height: 18,
                  border: "1px solid var(--mid)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 7,
                  fontWeight: 700,
                  color: "var(--muted)",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
