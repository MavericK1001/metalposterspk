import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function openCart() {
    window.dispatchEvent(new CustomEvent("open-cart"));
  }

  return (
    <nav
      className="main-nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        width: "100%",
        height: 56,
        background: "var(--ink)",
        borderBottom: "3px solid var(--copper)",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Hamburger (mobile only) */}
      <button
        type="button"
        className="nav-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Logo */}
      <Link
        to="/"
        className="nav-logo-clip nav-logo"
        style={{
          background: "var(--copper)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
          paddingRight: 44,
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 3,
            color: "var(--white)",
            whiteSpace: "nowrap",
          }}
        >
          METAL/POSTERS
        </span>
      </Link>

      {/* Nav links */}
      <div className={`nav-links ${mobileOpen ? "nav-links-open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="nav-link"
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase" as const,
              color: isActive ? "var(--copper)" : "var(--steel)",
              textDecoration: "none",
              borderRight: "1px solid #222",
              background: "transparent",
              transition: "color 0.12s, background 0.12s",
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains("active")) {
                el.style.color = "var(--white)";
                el.style.background = "#2B2B2B";
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains("active")) {
                el.style.color = "var(--steel)";
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
      <div className="nav-search">
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
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: "var(--steel)",
              width: 160,
            }}
          />
        </Form>
      </div>

      {/* Cart button */}
      <button
        type="button"
        className="nav-cart-btn"
        onClick={openCart}
        style={{
          background: "var(--copper)",
          color: "white",
          border: "none",
          padding: "0 24px",
          height: "100%",
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 600,
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
