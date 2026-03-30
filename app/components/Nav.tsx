import { Link, NavLink, Form } from "react-router";
import { useRootLoaderData } from "~/root";

const NAV_LINKS = [
  { label: "All", to: "/collections/all" },
  { label: "Music", to: "/collections/music" },
  { label: "Movies", to: "/collections/movies" },
  { label: "Sports", to: "/collections/sports" },
  { label: "Nature", to: "/collections/nature" },
  { label: "Custom", to: "/collections/custom" },
  { label: "Sale", to: "/collections/sale" },
];

export function Nav() {
  const data = useRootLoaderData();
  const cartCount = data?.cart?.totalQuantity ?? 0;

  function openCart() {
    window.dispatchEvent(new CustomEvent("open-cart"));
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        width: "100%",
        height: 56,
        background: "var(--ink)",
        borderBottom: "3px solid var(--red)",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="nav-logo-clip"
        style={{
          background: "var(--red)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
          paddingRight: 44,
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: 20,
            letterSpacing: 4,
            color: "var(--white)",
            whiteSpace: "nowrap",
          }}
        >
          METAL/POSTERS
        </span>
      </Link>

      {/* Nav links */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          marginLeft: 16,
        }}
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              color: isActive ? "var(--red)" : "var(--mid)",
              textDecoration: "none",
              borderRight: "1px solid #222",
              background: "transparent",
              transition: "color 0.12s, background 0.12s",
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains("active")) {
                el.style.color = "var(--white)";
                el.style.background = "#1A1A1A";
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains("active")) {
                el.style.color = "var(--mid)";
                el.style.background = "transparent";
              }
            }}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderLeft: "1px solid #333",
          borderRight: "1px solid #333",
          padding: "0 16px",
        }}
      >
        <Form
          action="/search"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            name="q"
            type="text"
            placeholder="// search..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "var(--mid)",
              width: 160,
            }}
          />
        </Form>
      </div>

      {/* Cart button */}
      <button
        type="button"
        onClick={openCart}
        style={{
          background: "var(--red)",
          color: "white",
          border: "none",
          padding: "0 24px",
          height: "100%",
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        CART
        {cartCount > 0 && (
          <span
            style={{
              background: "var(--ink)",
              borderRadius: 2,
              padding: "1px 5px",
              fontSize: 10,
            }}
          >
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
}
