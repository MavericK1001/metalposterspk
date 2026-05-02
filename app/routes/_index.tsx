import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Ticker } from "~/components/Ticker";
import { ProductCard } from "~/components/ProductCard";
import { CategoryTabs } from "~/components/CategoryTabs";
import {
  HOMEPAGE_PRODUCTS_QUERY,
  HOMEPAGE_FALLBACK_QUERY,
  ALL_PRODUCTS_QUERY,
} from "~/graphql/ProductQuery";
import { createContext } from "~/lib/hydrogen.server";

export const meta: MetaFunction = () => [
  { title: "MetalPosters — Premium Metal Prints" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { storefront } = createContext(request);
  let products: any[] = [];

  // Load from "all" collection first for category diversity
  try {
    const { collection } = await storefront.query(HOMEPAGE_FALLBACK_QUERY, {
      variables: { count: 48 },
    });
    products = collection?.products?.nodes ?? [];
  } catch {
    // no "all" collection
  }

  // Try bestsellers if "all" didn't work
  if (products.length === 0) {
    try {
      const { collection } = await storefront.query(HOMEPAGE_PRODUCTS_QUERY, {
        variables: { count: 48 },
      });
      products = collection?.products?.nodes ?? [];
    } catch {
      // fallback
    }
  }

  // Final fallback: query products directly
  if (products.length === 0) {
    try {
      const result = await storefront.query(ALL_PRODUCTS_QUERY, {
        variables: { first: 48, sortKey: "BEST_SELLING", reverse: false },
      });
      products = result?.products?.nodes ?? [];
    } catch {
      // no products available
    }
  }

  return { products };
}

// ── Size Guide Data ──
const SIZES = [
  { name: "Small", dims: "20×25cm", w: 26, h: 34 },
  { name: "Medium", dims: "30×40cm", w: 34, h: 44 },
  { name: "Large", dims: "40×60cm", w: 42, h: 54 },
  { name: "XL", dims: "60×80cm", w: 50, h: 66 },
  { name: "XXL", dims: "80×120cm", w: 60, h: 80 },
];

// ── Price Filter Chips ──
const PRICE_CHIPS = [
  { label: "All", min: 0, max: Infinity },
  { label: "₨ 5–6k", min: 5000, max: 6000 },
  { label: "₨ 6–8k", min: 6000, max: 8000 },
  { label: "₨ 8k+", min: 8000, max: Infinity },
];

export default function Homepage() {
  const { products } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("All");
  const [priceChip, setPriceChip] = useState("All");

  let filtered =
    activeTab === "All"
      ? products
      : products.filter(
          (p: any) =>
            p.productType?.toLowerCase().includes(activeTab.toLowerCase()) ||
            p.tags.some((t: string) =>
              t.toLowerCase().includes(activeTab.toLowerCase()),
            ),
        );

  // Apply price filter
  if (priceChip !== "All") {
    const chip = PRICE_CHIPS.find((c) => c.label === priceChip);
    if (chip) {
      filtered = filtered.filter((p: any) => {
        const amt = parseFloat(p.priceRange.minVariantPrice.amount);
        return amt >= chip.min && amt <= chip.max;
      });
    }
  }

  return (
    <>
      {/* ─── A. HERO ─── */}
      <section
        className="hero-grid"
        style={{
          minHeight: 400,
        }}
      >
        {/* Left column */}
        <div
          style={{
            background: "var(--bg)",
            padding: "52px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 24,
                height: 2,
                background: "var(--copper)",
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "var(--copper)",
                fontWeight: 600,
              }}
            >
              Premium Aluminium Prints
            </span>
          </div>

          {/* H1 */}
          <h1
            className="hero-h1"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 72,
              color: "white",
              lineHeight: 0.92,
              letterSpacing: -1,
            }}
          >
            Swap Art in
            <em
              style={{
                color: "var(--copper)",
                display: "block",
                fontStyle: "normal",
              }}
            >
              Seconds
            </em>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--muted)",
              maxWidth: 420,
            }}
          >
            Premium metal posters from{" "}
            <strong style={{ color: "var(--copper)" }}>₨ 5,000</strong> —
            magnetic mounting, no holes, no hassle.
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: "flex", gap: 12 }}>
            <Link
              to="/collections/all"
              className="btn-copper"
              style={{
                padding: "16px 32px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                letterSpacing: 1,
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 600,
                border: "none",
              }}
            >
              SHOP ALL →
            </Link>
            <Link
              to="/pages/how-its-made"
              style={{
                background: "transparent",
                color: "var(--steel)",
                padding: "16px 32px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                letterSpacing: 1,
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid var(--muted)",
                fontWeight: 500,
              }}
            >
              HOW IT&apos;S MADE
            </Link>
          </div>
        </div>
      </section>

      {/* ─── B. TICKER ─── */}
      <Ticker />

      {/* ─── C. BESTSELLERS ─── */}
      <section className="bestsellers-section" style={{ padding: "48px 32px" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 28,
            borderBottom: "2px solid var(--steel)",
            paddingBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 36,
                letterSpacing: -0.5,
                color: "var(--white)",
              }}
            >
              BESTSELLERS
            </h2>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              {String(filtered.length).padStart(2, "0")} products
            </span>
          </div>
          <Link
            to="/collections/all"
            style={{
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--copper)",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            VIEW ALL →
          </Link>
        </div>

        <CategoryTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Price filter chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {PRICE_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => setPriceChip(chip.label)}
              style={{
                padding: "7px 16px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                border: `1px solid ${priceChip === chip.label ? "var(--copper)" : "var(--muted)"}`,
                background:
                  priceChip === chip.label ? "var(--copper)" : "transparent",
                color: priceChip === chip.label ? "white" : "var(--steel)",
                cursor: "pointer",
                borderRadius: 0,
                letterSpacing: 0.5,
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Product grid — max 4 on homepage */}
        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {filtered.slice(0, 4).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length > 4 && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link
              to="/collections/all"
              style={{
                display: "inline-block",
                border: "1.5px solid var(--copper)",
                color: "var(--copper)",
                padding: "14px 40px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 2,
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              SEE ALL {filtered.length} PRODUCTS →
            </Link>
          </div>
        )}
      </section>

      {/* ─── D. SOCIAL PROOF BANNER ─── */}
      <section
        className="social-proof"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          background: "var(--card)",
          margin: "0 32px 48px",
          border: "3px solid var(--card)",
        }}
      >
        {/* Left */}
        <div
          className="social-proof-left"
          style={{ background: "var(--copper)", padding: "36px 44px" }}
        >
          <div
            className="social-proof-title"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 44,
              color: "white",
              lineHeight: 1,
            }}
          >
            TRUSTED BY
          </div>
          <div
            className="social-proof-number"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 52,
              color: "white",
              lineHeight: 1,
            }}
          >
            12,000+
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginTop: 10,
            }}
          >
            Customers worldwide · Real metal · Real quality
          </div>
        </div>

        {/* Right */}
        <div
          className="social-proof-right"
          style={{
            padding: "36px 44px",
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          {[
            { value: "4.9★", label: "AVG RATING" },
            { value: "48H", label: "PRINT TIME" },
            { value: "50+", label: "DESIGNS" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="social-proof-stat"
              style={{
                textAlign: "center",
                borderLeft: i > 0 ? "1px solid #444" : "none",
                paddingLeft: i > 0 ? 40 : 0,
              }}
            >
              <div
                className="social-proof-stat-value"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: 40,
                  color: "var(--copper)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  color: "var(--muted)",
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}

          <Link
            to="/collections/all"
            className="btn-copper"
            style={{
              padding: "14px 28px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            SHOP NOW →
          </Link>
        </div>
      </section>

      {/* ─── E. SIZE GUIDE STRIP ─── */}
      <section
        className="size-guide"
        style={{
          display: "flex",
          background: "var(--card)",
          borderTop: "1px solid #444",
          borderBottom: "1px solid #444",
        }}
      >
        {SIZES.map((size, i) => (
          <div
            key={size.name}
            className="size-guide-item"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "18px 24px",
              borderRight: i < SIZES.length - 1 ? "1px solid #444" : "none",
            }}
          >
            <div
              className="size-guide-swatch"
              style={{
                width: size.w,
                height: size.h,
                background: "var(--muted)",
                border: "1.5px solid #555",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--steel)",
                }}
              >
                {size.name}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                {size.dims}
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
