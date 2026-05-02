import { useState } from "react";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Custom Metal Poster — MetalPosters" },
  {
    name: "description",
    content:
      "Create your own custom metal poster. Upload your design and get it printed on premium brushed aluminium.",
  },
];

const SIZES = [
  { label: "A5", dimensions: '8" × 5.5"', price: 849, compareAt: 999 },
  { label: "A4", dimensions: '8" × 11"', price: 1349, compareAt: 1499 },
  { label: "A3", dimensions: '15" × 11"', price: 2499, compareAt: 2999 },
  { label: "A2", dimensions: '23" × 15"', price: 4499, compareAt: 5499 },
  { label: "A1", dimensions: '31" × 23"', price: 8250, compareAt: 9999 },
];

const ORIENTATIONS = ["Portrait", "Landscape"] as const;

const STEPS = [
  {
    num: "01",
    title: "Pick Your Size & Orientation",
    desc: "Choose from A5 to A1 — portrait or landscape.",
  },
  {
    num: "02",
    title: "Send Us Your Design",
    desc: "Share your image via WhatsApp. High-res (300 DPI+) recommended for best results.",
  },
  {
    num: "03",
    title: "We Review & Confirm",
    desc: "Our team checks resolution, colour profile, and fit. We'll send a mockup for your approval.",
  },
  {
    num: "04",
    title: "Print & Ship",
    desc: "HD dye-sublimation on brushed aluminium. Delivered with magnetic mounting kit in 3–5 days.",
  },
];

export default function CustomPosterPage() {
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // default A4
  const [orientation, setOrientation] = useState<"Portrait" | "Landscape">(
    "Portrait",
  );

  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to order a Custom Metal Poster.\n\nSize: ${selectedSize.label} (${selectedSize.dimensions})\nOrientation: ${orientation}\nPrice: Rs ${selectedSize.price.toLocaleString()}\n\nI'll share my design here.`,
  );
  const whatsappLink = `https://wa.me/+923309995508?text=${whatsappMessage}`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={badge}>CUSTOM ORDER</span>
        <h1 style={heading}>Your Design. Our Metal.</h1>
        <p style={subtitle}>
          Upload any image — we&apos;ll print it on premium brushed aluminium
          with HD dye-sublimation.
        </p>
      </div>

      {/* How It Works */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={sectionTitle}>How It Works</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.num}
              style={{
                background: "var(--card)",
                border: "1px solid #3a3a3a",
                padding: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--copper)",
                  opacity: 0.5,
                  marginBottom: 8,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--white)",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Order Configurator ─── */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid #3a3a3a",
          padding: 32,
          marginBottom: 48,
        }}
      >
        <h2 style={{ ...sectionTitle, marginTop: 0 }}>Configure Your Poster</h2>

        {/* Size */}
        <label style={fieldLabel}>Size</label>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {SIZES.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setSelectedSize(s)}
              style={{
                border: `1.5px solid ${
                  selectedSize.label === s.label
                    ? "var(--copper)"
                    : "var(--muted)"
                }`,
                padding: "12px 18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background:
                  selectedSize.label === s.label ? "#2a1a0a" : "transparent",
                borderRadius: 0,
                color:
                  selectedSize.label === s.label
                    ? "var(--copper)"
                    : "var(--steel)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                minWidth: 80,
              }}
            >
              <span style={{ fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: 10, color: "var(--muted)" }}>
                {s.dimensions}
              </span>
            </button>
          ))}
        </div>

        {/* Orientation */}
        <label style={fieldLabel}>Orientation</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {ORIENTATIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrientation(o)}
              style={{
                border: `1.5px solid ${
                  orientation === o ? "var(--copper)" : "var(--muted)"
                }`,
                padding: "10px 24px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: orientation === o ? "#2a1a0a" : "transparent",
                borderRadius: 0,
                color: orientation === o ? "var(--copper)" : "var(--steel)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: o === "Portrait" ? 12 : 18,
                  height: o === "Portrait" ? 18 : 12,
                  border: `1.5px solid ${
                    orientation === o ? "var(--copper)" : "var(--muted)"
                  }`,
                }}
              />
              {o}
            </button>
          ))}
        </div>

        {/* Price summary */}
        <div
          style={{
            borderTop: "1px solid #3a3a3a",
            paddingTop: 20,
            marginBottom: 20,
            display: "flex",
            alignItems: "baseline",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--copper)",
            }}
          >
            Rs {selectedSize.price.toLocaleString()}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              textDecoration: "line-through",
              color: "var(--muted)",
            }}
          >
            Rs {selectedSize.compareAt.toLocaleString()}
          </span>
          <span
            style={{
              background: "var(--terracotta)",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 8px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Save{" "}
            {Math.round(
              ((selectedSize.compareAt - selectedSize.price) /
                selectedSize.compareAt) *
                100,
            )}
            %
          </span>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            width: "100%",
            background: "#25D366",
            color: "white",
            border: "none",
            padding: 18,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 1,
            textTransform: "uppercase",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Order on WhatsApp
        </a>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "var(--muted)",
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Send your design via WhatsApp. We&apos;ll confirm the mockup before
          printing.
        </p>
      </div>

      {/* What You Get */}
      <h2 style={sectionTitle}>What You Get</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 48,
        }}
      >
        {[
          {
            icon: "🖼️",
            label: "HD Dye-Sublimation",
            detail: "Vivid, permanent colours",
          },
          {
            icon: "🪶",
            label: "1mm Brushed Aluminium",
            detail: "Lightweight, premium finish",
          },
          {
            icon: "🧲",
            label: "Magnetic Mount Kit",
            detail: "No nails, no wall damage",
          },
          {
            icon: "📦",
            label: "Reinforced Packaging",
            detail: "Arrives in perfect condition",
          },
          {
            icon: "🎨",
            label: "Free Mockup Preview",
            detail: "See before we print",
          },
          { icon: "🚚", label: "3–5 Day Delivery", detail: "Across Pakistan" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "var(--card)",
              border: "1px solid #3a3a3a",
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: "var(--white)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              {item.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div
        style={{
          background: "#2a1a0a",
          border: "1px solid var(--copper)",
          padding: 24,
          marginBottom: 48,
        }}
      >
        <h3
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--copper)",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          💡 Tips for the Best Print
        </h3>
        <ul
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "var(--steel)",
            lineHeight: 2,
            paddingLeft: 20,
            margin: 0,
          }}
        >
          <li>Use images at least 300 DPI for sharp output</li>
          <li>JPEG or PNG — avoid heavily compressed images</li>
          <li>Dark backgrounds look stunning on aluminium</li>
          <li>We&apos;ll adjust sizing/cropping for you if needed</li>
          <li>Not sure about quality? Send it — we&apos;ll let you know</li>
        </ul>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "var(--muted)",
            marginBottom: 16,
          }}
        >
          Have questions? Check our{" "}
          <Link
            to="/pages/faq"
            style={{ color: "var(--copper)", textDecoration: "underline" }}
          >
            FAQ
          </Link>{" "}
          or{" "}
          <Link
            to="/pages/contact"
            style={{ color: "var(--copper)", textDecoration: "underline" }}
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

/* ── Styles ── */

const badge: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--copper)",
  border: "1px solid var(--copper)",
  padding: "6px 16px",
  marginBottom: 16,
};

const heading: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 42,
  fontWeight: 800,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--white)",
  lineHeight: 1.1,
};

const subtitle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: "var(--steel)",
  marginTop: 12,
  lineHeight: 1.8,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--white)",
  marginTop: 0,
  marginBottom: 20,
};

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  letterSpacing: 1.5,
  color: "var(--muted)",
  textTransform: "uppercase",
  fontWeight: 600,
  marginBottom: 10,
};
