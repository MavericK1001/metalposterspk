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
    textColor: "#F0C97A",
    text: "DARK\nSIDE",
    badge: "HOT",
  },
  {
    step: "02",
    label: "MOVIES",
    bg: "#14080A",
    textColor: "#D63B2F",
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
    textColor: "#444",
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

export default function Homepage() {
  const { products } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? products
      : products.filter(
          (p: any) =>
            p.productType?.toLowerCase().includes(activeTab.toLowerCase()) ||
            p.tags.some((t: string) =>
              t.toLowerCase().includes(activeTab.toLowerCase()),
            ),
        );

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
            background: "var(--ink)",
            padding: "52px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            borderRight: "3px solid var(--red)",
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
                background: "var(--red)",
              }}
            />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "var(--red)",
              }}
            >
              Premium Aluminium Prints
            </span>
          </div>

          {/* H1 */}
          <h1
            className="hero-h1"
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 86,
              color: "white",
              lineHeight: 0.88,
              letterSpacing: 2,
            }}
          >
            ART THAT
            <em
              style={{
                color: "var(--red)",
                display: "block",
                fontStyle: "normal",
              }}
            >
              ENDURES
            </em>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              lineHeight: 1.9,
              color: "var(--muted)",
              maxWidth: 340,
            }}
          >
            HD prints on brushed aluminium plate. No fading. No warping. No
            compromise. Ships worldwide in 3–5 days.
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: "flex", gap: 12 }}>
            <Link
              to="/collections/all"
              style={{
                background: "var(--red)",
                color: "white",
                padding: "16px 32px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 700,
                border: "none",
              }}
            >
              SHOP ALL →
            </Link>
            <Link
              to="/collections/all"
              style={{
                background: "transparent",
                color: "var(--muted)",
                padding: "16px 32px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                textDecoration: "none",
                border: "1px solid #333",
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
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      letterSpacing: 2,
                      color: "#333",
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
                      border: tile.dashed ? "1px dashed #333" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: tile.useMono
                          ? "'Space Mono', monospace"
                          : "Anton, sans-serif",
                        fontSize: tile.useMono ? 7 : 12,
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
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#555",
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
                        background: "var(--red)",
                        color: "white",
                        fontSize: 8,
                        fontWeight: 700,
                        padding: "2px 5px",
                        letterSpacing: 1,
                        fontFamily: "'Space Mono', monospace",
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
            borderBottom: "2px solid var(--ink)",
            paddingBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <h2
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: 42,
                letterSpacing: 1,
              }}
            >
              BESTSELLERS
            </h2>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              // {String(products.length).padStart(2, "0")} products
            </span>
          </div>
          <Link
            to="/collections/all"
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--red)",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            VIEW ALL →
          </Link>
        </div>

        <CategoryTabs activeTab={activeTab} onChange={setActiveTab} />

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
          background: "var(--ink)",
          margin: "0 32px 48px",
          border: "3px solid var(--ink)",
        }}
      >
        {/* Left */}
        <div style={{ background: "var(--red)", padding: "36px 44px" }}>
          <div
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 48,
              color: "white",
              lineHeight: 1,
            }}
          >
            TRUSTED BY
          </div>
          <div
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 56,
              color: "white",
              lineHeight: 1,
            }}
          >
            12,000+
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: 10,
            }}
          >
            Customers worldwide · Real metal · Real quality
          </div>
        </div>

        {/* Right */}
        <div
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
              }}
            >
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 48,
                    background: "#333",
                  }}
                />
              )}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: 44,
                    color: "var(--red)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    color: "var(--muted)",
                    letterSpacing: 2,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/collections/all"
            style={{
              background: "var(--red)",
              color: "white",
              padding: "14px 28px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 700,
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
          background: "var(--cream)",
          borderTop: "1px solid var(--mid)",
          borderBottom: "1px solid var(--mid)",
        }}
      >
        {SIZES.map((size, i) => (
          <div
            key={size.name}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "18px 24px",
              borderRight:
                i < SIZES.length - 1 ? "1px solid var(--mid)" : "none",
            }}
          >
            <div
              style={{
                width: size.w,
                height: size.h,
                background: "var(--mid)",
                border: "1.5px solid #B0AAA0",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                {size.name}
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
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
