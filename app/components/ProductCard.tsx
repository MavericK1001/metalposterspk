import { useState, useEffect } from "react";
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
  images?: {
    nodes: { url: string; altText?: string; width?: number; height?: number }[];
  };
  variants: {
    nodes: {
      id: string;
      availableForSale?: boolean;
      quantityAvailable?: number | null;
    }[];
  };
}

const BADGE_TAGS: Record<string, { label: string; bg: string }> = {
  hot: { label: "HOT", bg: "var(--copper)" },
  new: { label: "NEW", bg: "var(--card)" },
  sale: { label: "SALE", bg: "var(--terracotta)" },
  custom: { label: "CUSTOM", bg: "var(--card)" },
};

const SIZES = ["S", "M", "L", "XL"];

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const fetcher = useFetcher();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  const variant = product.variants.nodes[0];
  const qty = variant?.quantityAvailable;
  const lowStock = qty !== null && qty !== undefined && qty > 0 && qty <= 10;

  // Get second image for hover flip
  const secondImage = product.images?.nodes?.[1];

  // Open cart drawer when quick-add completes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.cart) {
      window.dispatchEvent(
        new CustomEvent("open-cart", { detail: { cart: fetcher.data.cart } }),
      );
    }
  }, [fetcher.state, fetcher.data]);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const variantId = variant?.id;
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--card)",
        border: "1px solid #3a3a3a",
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
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              data={product.featuredImage}
              sizes="(max-width:768px) 100vw, 25vw"
              className="w-full h-full object-cover"
              loading="lazy"
              style={{
                transition: "opacity 0.3s",
                opacity: hovered && secondImage ? 0 : 1,
              }}
            />
            {secondImage && (
              <Image
                data={secondImage}
                sizes="(max-width:768px) 100vw, 25vw"
                className="w-full h-full object-cover"
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  transition: "opacity 0.3s",
                  opacity: hovered ? 1 : 0,
                }}
              />
            )}
          </div>
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
              fontFamily: "'Inter', sans-serif",
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

        {/* Low stock badge */}
        {lowStock && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: "4px 10px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1,
              background: "var(--terracotta)",
              color: "white",
            }}
          >
            Only {qty} left
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
            background: "var(--copper)",
            color: "white",
            border: "none",
            padding: 11,
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontWeight: 600,
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
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 0.3,
            color: "var(--white)",
            marginBottom: 2,
          }}
        >
          {product.title}
        </div>

        {subLabel && (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: 1,
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
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--copper)",
              }}
            >
              {formatMoney(product.priceRange.minVariantPrice)}
            </span>
            {hasCompare && (
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
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
                  border: "1px solid var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 7,
                  fontWeight: 600,
                  color: "var(--muted)",
                  fontFamily: "'Inter', sans-serif",
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
