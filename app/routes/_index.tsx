import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Ticker } from "~/components/Ticker";
import { ProductCard } from "~/components/ProductCard";
import { CategoryTabs } from "~/components/CategoryTabs";
import {
  HOMEPAGE_PRODUCTS_QUERY,
  HOMEPAGE_FALLBACK_QUERY,
} from "~/graphql/ProductQuery";
import { createContext } from "~/lib/hydrogen.server";

export const meta: MetaFunction = () => [
  { title: "MetalPosters — Premium Metal Prints" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { storefront } = createContext(request);
  let products: any[] = [];

  try {
    const { collection } = await storefront.query(HOMEPAGE_PRODUCTS_QUERY, {
      variables: { count: 8 },
    });
    products = collection?.products?.nodes ?? [];
  } catch {
    // fallback to "all"
  }

  if (products.length === 0) {
    try {
      const { collection } = await storefront.query(HOMEPAGE_FALLBACK_QUERY, {
        variables: { count: 8 },
      });
      products = collection?.products?.nodes ?? [];
    } catch {
      // no products available
    }
  }

  return { products };
}

// ── Hero Tile Data ──
const TILES = [
  {
    step: "01",
    label: "MUSIC",
    bg: "#0D0D14",
    textColor: "#B87333",
    text: "DARK\nSIDE",
    badge: "HOT",
  },
  {
    step: "02",
    label: "MOVIES",
    bg: "#14080A",
    textColor: "#E3735E",
    text: "PULP",
    badge: null,
  },
  {
    step: "03",
    label: "SPORTS",
    bg: "#08101A",
    textColor: "#5EA8F0",
    text: "BULLS\n96",
    badge: null,
  },
  {
    step: "04",
    label: "CUSTOM",
    bg: "#0A0A0A",
    textColor: "#7A7A7A",
    text: "UPLOAD\nYOUR\nDESIGN",
    badge: "NEW",
    dashed: true,
    useMono: true,
  },
];

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
          display: "grid",
          gridTemplateColumns: "1fr 420px",
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
            borderRight: "3px solid var(--copper)",
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
            <strong style={{ color: "var(--copper)" }}>₨ 5,000</strong>.{" "}
            <span style={{ textDecoration: "line-through", color: "var(--muted)" }}>
              ₨ 12,000 framed prints
            </span>{" "}
            — magnetic mounting, no holes, no hassle.
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
              to="/collections/all"
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

        {/* Right column — 2×2 tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: 3,
            background: "#0A0A0A",
          }}
        >
          {[TILES.slice(0, 2), TILES.slice(2, 4)].map((row, ri) => (
            <div
              key={ri}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
              }}
            >
              {row.map((tile) => (
                <div
                  key={tile.step}
                  style={{
                    background: "#141414",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    position: "relative",
                    padding: 20,
                    transition: "background 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#1C1C1C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#141414")
                  }
                >
                  {/* Step */}
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      letterSpacing: 2,
                      color: "#444",
                    }}
                  >
                    {tile.step}
                  </span>

                  {/* Mini poster preview */}
                  <div
                    style={{
                      width: 56,
                      height: 70,
                      background: tile.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      border: tile.dashed ? "1px dashed #444" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: tile.useMono
                          ? "'Inter', sans-serif"
                          : "'Montserrat', sans-serif",
                        fontSize: tile.useMono ? 8 : 13,
                        fontWeight: 700,
                        color: tile.textColor,
                        textAlign: "center",
                        lineHeight: 1.1,
                        whiteSpace: "pre-line",
                        letterSpacing: tile.useMono ? 1 : 0,
                      }}
                    >
                      {tile.text}
                    </span>
                    {/* Shine overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 9,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#555",
                      fontWeight: 600,
                    }}
                  >
                    {tile.label}
                  </span>

                  {/* Badge */}
                  {tile.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "var(--copper)",
                        color: "white",
                        fontSize: 8,
                        fontWeight: 700,
                        padding: "2px 5px",
                        letterSpacing: 1,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {tile.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
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
              {String(products.length).padStart(2, "0")} products
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
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
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
                background: priceChip === chip.label ? "var(--copper)" : "transparent",
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

        {/* Product grid */}
        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {filtered.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
        <div className="social-proof-left" style={{ background: "var(--copper)", padding: "36px 44px" }}>
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
              borderRight:
                i < SIZES.length - 1 ? "1px solid #444" : "none",
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
