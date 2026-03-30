import { Link } from "react-router";

const FOOTER_LINKS = [
  { label: "Shop All", to: "/collections/all" },
  { label: "Metal Posters", to: "/collections/metal-posters" },
  { label: "Anime", to: "/collections/anime-posters" },
  { label: "Cars", to: "/collections/car-posters" },
  { label: "Islamic", to: "/collections/islamic-posters" },
  { label: "Motivational", to: "/collections/motivational-metal-poster" },
  { label: "Sports", to: "/collections/sports-poster" },
  { label: "Custom", to: "/collections/custom-metal-poster" },
];

const SUPPORT_LINKS = [
  { label: "Shipping Policy", to: "/policies/shipping-policy" },
  { label: "Refund Policy", to: "/policies/refund-policy" },
  { label: "FAQ", to: "/pages/faq" },
  { label: "Contact Us", to: "/pages/contact" },
  { label: "About Us", to: "/pages/about" },
];

const POLICY_LINKS = [
  { label: "Terms of Service", to: "/policies/terms-of-service" },
  { label: "Privacy Policy", to: "/policies/privacy-policy" },
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
            {SUPPORT_LINKS.map((link) => (
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
          flexWrap: "wrap",
          gap: 12,
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
        <div style={{ display: "flex", gap: 16 }}>
          {POLICY_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                color: "#555",
                letterSpacing: 1,
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
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
