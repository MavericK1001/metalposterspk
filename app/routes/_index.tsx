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
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          background: "#0A0A0C",
        }}
      >
        {/* Noise / grain texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Radial copper glow — top left */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "70vw",
            height: "70vw",
            background:
              "radial-gradient(circle, rgba(184,115,51,0.18) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Radial glow — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            background:
              "radial-gradient(circle, rgba(227,115,94,0.10) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Diagonal copper accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "55%",
            width: 1,
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent, rgba(184,115,51,0.35) 30%, rgba(184,115,51,0.35) 70%, transparent)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            alignItems: "center",
            maxWidth: 1400,
            margin: "0 auto",
            width: "100%",
            padding: "80px 64px",
          }}
          className="hero-inner"
        >
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {/* Eyebrow pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid rgba(184,115,51,0.4)",
                  background: "rgba(184,115,51,0.08)",
                  padding: "6px 14px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: "#D4924A",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#D4924A",
                    display: "inline-block",
                  }}
                />
                Premium Aluminium Prints · Pakistan
              </span>
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(48px, 6vw, 86px)",
                color: "#FFFFFF",
                lineHeight: 0.9,
                letterSpacing: -2,
                margin: 0,
              }}
            >
              Your Walls.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #D4924A 0%, #B87333 40%, #E3735E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Redefined.
              </span>
            </h1>

            {/* Sub copy */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 17,
                lineHeight: 1.7,
                color: "rgba(217,217,217,0.7)",
                maxWidth: 480,
                margin: 0,
              }}
            >
              HD dye-sublimation on{" "}
              <strong style={{ color: "#D9D9D9", fontWeight: 500 }}>
                brushed aluminium
              </strong>
              . Magnetic mounting — no nails, no damage. Starting from{" "}
              <strong style={{ color: "#D4924A", fontWeight: 700 }}>
                ₨ 849
              </strong>
              .
            </p>

            {/* CTA row */}
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/collections/all"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "linear-gradient(135deg, #D4924A, #B87333)",
                  color: "white",
                  padding: "16px 36px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 8px 32px rgba(184,115,51,0.35)",
                }}
              >
                Shop All Posters
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/pages/custom-poster"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "transparent",
                  color: "rgba(217,217,217,0.8)",
                  padding: "16px 28px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                Custom Order
              </Link>
            </div>

            {/* Social proof row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                paddingTop: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#D4924A", fontSize: 14 }}>★★★★★</span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "rgba(217,217,217,0.5)",
                  }}
                >
                  4.9 · 1,200+ orders
                </span>
              </div>
              <div
                style={{
                  width: 1,
                  height: 16,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: "rgba(217,217,217,0.4)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Free delivery in Lahore
              </span>
            </div>
          </div>

          {/* RIGHT — floating poster stack */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: 520,
            }}
            className="hero-poster-stack"
          >
            {/* Back card */}
            <div
              style={{
                position: "absolute",
                width: 220,
                height: 280,
                background: "linear-gradient(135deg, #2a1a0a, #1a1a1a)",
                border: "1px solid rgba(184,115,51,0.2)",
                transform: "rotate(-8deg) translate(-60px, 30px)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)",
                }}
              />
            </div>

            {/* Mid card */}
            <div
              style={{
                position: "absolute",
                width: 240,
                height: 300,
                background: "linear-gradient(135deg, #0d1a2a, #1a1a1a)",
                border: "1px solid rgba(94,168,240,0.2)",
                transform: "rotate(4deg) translate(50px, -20px)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
                }}
              />
            </div>

            {/* Front card — main poster mock */}
            <div
              style={{
                position: "relative",
                width: 260,
                height: 340,
                background: "linear-gradient(160deg, #1a1a1a 0%, #0D0D14 100%)",
                border: "1px solid rgba(184,115,51,0.4)",
                boxShadow:
                  "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
                zIndex: 2,
              }}
              className="poster-shine"
            >
              {/* Metallic brushed lines */}
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${(i / 18) * 100}%`,
                    height: 1,
                    background: "rgba(255,255,255,0.025)",
                  }}
                />
              ))}

              {/* Poster content mockup */}
              <div
                style={{
                  position: "absolute",
                  inset: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    color: "rgba(184,115,51,0.6)",
                  }}
                >
                  Metal Poster
                </div>
                <div
                  style={{
                    width: 80,
                    height: 1,
                    background:
                      "linear-gradient(to right, transparent, rgba(184,115,51,0.4), transparent)",
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: -1,
                    color: "rgba(255,255,255,0.9)",
                    textAlign: "center",
                    lineHeight: 1,
                  }}
                >
                  YOUR
                  <br />
                  <span style={{ color: "#D4924A" }}>ART</span>
                </div>
                <div
                  style={{
                    width: 80,
                    height: 1,
                    background:
                      "linear-gradient(to right, transparent, rgba(184,115,51,0.4), transparent)",
                  }}
                />
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 9,
                    letterSpacing: 2,
                    color: "rgba(217,217,217,0.3)",
                    textTransform: "uppercase",
                  }}
                >
                  Brushed Aluminium
                </div>
              </div>
            </div>

            {/* Floating stat badge — top right */}
            <div
              style={{
                position: "absolute",
                top: 40,
                right: 20,
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(184,115,51,0.3)",
                backdropFilter: "blur(12px)",
                padding: "12px 18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#D4924A",
                  lineHeight: 1,
                }}
              >
                1mm
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 9,
                  letterSpacing: 1.5,
                  color: "rgba(217,217,217,0.4)",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                Aluminium
              </div>
            </div>

            {/* Floating stat badge — bottom left */}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: 30,
                background: "rgba(20,20,20,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                padding: "12px 18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1,
                }}
              >
                3–5
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 9,
                  letterSpacing: 1.5,
                  color: "rgba(217,217,217,0.4)",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                Day Delivery
              </div>
            </div>

            {/* Magnetic badge */}
            <div
              style={{
                position: "absolute",
                top: 160,
                right: 0,
                background: "rgba(184,115,51,0.12)",
                border: "1px solid rgba(184,115,51,0.3)",
                padding: "8px 14px",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>🧲</span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: "#D4924A",
                  textTransform: "uppercase",
                }}
              >
                Magnetic Mount
              </span>
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(184,115,51,0.4) 30%, rgba(184,115,51,0.4) 70%, transparent)",
          }}
        />
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
