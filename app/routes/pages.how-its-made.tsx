import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => [
  { title: "How It's Made — MetalPosters" },
  {
    name: "description",
    content:
      "Discover how MetalPosters creates premium HD metal prints — from design to dye-sublimation to your wall.",
  },
];

export default function HowItsMadePage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={heading}>How It&apos;s Made</h1>
        <p style={subtitle}>From Digital Design to Your Wall</p>
      </div>

      <div style={body}>
        <p style={{ fontSize: 16, color: "var(--copper)", fontWeight: 600 }}>
          Every Metal Poster is a precision-crafted piece of art. Here&apos;s
          the journey from pixel to metal — no shortcuts, no compromise.
        </p>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            marginTop: 40,
          }}
        >
          <Step
            number="01"
            title="Design & Preparation"
            description="Each artwork is curated or custom-designed at ultra-high resolution (300+ DPI). Colours are calibrated for metal surface rendering — blacks are deeper, highlights are sharper, and details are enhanced for the brushed aluminium finish."
          />

          <Step
            number="02"
            title="Dye-Sublimation Printing"
            description="We use HD dye-sublimation technology — the gold standard for metal printing. The image is first printed onto a special transfer paper with heat-reactive inks. Under extreme heat (around 400°F) and pressure, the inks turn to gas and permanently bond with the aluminium surface at a molecular level."
          />

          <Step
            number="03"
            title="Premium Aluminium Panel"
            description="We print on 1mm brushed aluminium sheets — lightweight yet rigid. The metallic surface gives every print a unique luminosity that paper or canvas simply can't match. The result: vivid colours with a subtle metallic sheen that shifts with light."
          />

          <Step
            number="04"
            title="Quality Inspection"
            description="Every poster goes through a hands-on quality check. We inspect for colour accuracy, surface defects, edge finish, and print sharpness. If it doesn't meet our standard, it doesn't ship."
          />

          <Step
            number="05"
            title="Magnetic Mounting Kit"
            description="Each poster ships with our custom magnetic mounting system. No nails, no holes, no damage to your walls. Simply apply the magnetic strips, place your poster, and you're done. Repositioning? Just lift and move — it's that easy."
          />

          <Step
            number="06"
            title="Secure Packaging & Shipping"
            description="Your poster is wrapped in protective foam, placed in a rigid mailer, and shipped in a reinforced box. We over-engineer our packaging because your art should arrive in the same condition it left our studio. Delivered to your door in 3–5 business days."
          />
        </div>

        {/* Why Metal section */}
        <h2 style={sectionTitle}>Why Metal?</h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          <Stat
            icon="💧"
            label="Water Resistant"
            detail="No warping, no water damage"
          />
          <Stat
            icon="☀️"
            label="UV Resistant"
            detail="Colours won't fade over time"
          />
          <Stat
            icon="🛡️"
            label="Scratch Resistant"
            detail="Durable aluminium surface"
          />
          <Stat
            icon="🪶"
            label="Lightweight"
            detail="Easy to mount and reposition"
          />
          <Stat
            icon="🎨"
            label="Vivid Colours"
            detail="Metallic sheen adds depth"
          />
          <Stat
            icon="♻️"
            label="Eco-Friendly"
            detail="Recyclable aluminium, no glass"
          />
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "32px 0" }}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 20,
            }}
          >
            Ready to see the difference?
          </p>
          <Link
            to="/collections/all"
            style={{
              display: "inline-block",
              background: "var(--copper)",
              color: "white",
              padding: "16px 40px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Shop All Posters →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: "var(--copper)",
          lineHeight: 1,
          minWidth: 60,
          opacity: 0.6,
        }}
      >
        {number}
      </div>
      <div>
        <h3
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--white)",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "var(--steel)",
            lineHeight: 1.8,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  detail,
}: {
  icon: string;
  label: string;
  detail: string;
}) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid #3a3a3a",
        padding: 20,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1,
          color: "var(--white)",
          marginBottom: 4,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        {detail}
      </div>
    </div>
  );
}

/* ── Styles ── */

const heading: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 42,
  fontWeight: 800,
  letterSpacing: 3,
  textTransform: "uppercase",
  color: "var(--white)",
  lineHeight: 1.1,
};

const subtitle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: "var(--copper)",
  letterSpacing: 2,
  marginTop: 12,
  textTransform: "uppercase",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--white)",
  marginTop: 40,
  marginBottom: 20,
};

const body: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: "var(--steel)",
  lineHeight: 1.8,
};
