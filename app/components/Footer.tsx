import { Link } from "react-router";

const FOOTER_LINKS = [
  { label: "Shop All", to: "/collections/all" },
  { label: "Music", to: "/collections/music" },
  { label: "Movies", to: "/collections/movies" },
  { label: "Sports", to: "/collections/sports" },
  { label: "Nature", to: "/collections/nature" },
  { label: "Custom", to: "/collections/custom" },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--ink)",
        borderTop: "3px solid var(--copper)",
        padding: "48px 32px 32px",
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 48,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <div>
          <h3
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--white)",
              letterSpacing: 3,
              marginBottom: 16,
            }}
          >
            METAL/POSTERS
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.8,
            }}
          >
            Premium aluminium prints crafted to last. HD dye-sublimation on
            brushed metal. No fading, no warping.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            COLLECTIONS
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "var(--steel)",
                  textDecoration: "none",
                  letterSpacing: 1,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h4
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            SUPPORT
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Shipping Info", "Returns", "FAQ", "Contact Us"].map((text) => (
              <span
                key={text}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "var(--steel)",
                  letterSpacing: 1,
                }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="footer-bottom"
        style={{
          borderTop: "1px solid #222",
          marginTop: 40,
          paddingTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          margin: "40px auto 0",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            color: "#555",
            letterSpacing: 1,
          }}
        >
          © {new Date().getFullYear()} METALPOSTERS. ALL RIGHTS RESERVED.
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            color: "#555",
            letterSpacing: 1,
          }}
        >
          POWERED BY SHOPIFY HYDROGEN
        </span>
      </div>
    </footer>
  );
}
