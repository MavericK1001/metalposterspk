import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Contact Us — MetalPosters" },
];

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={heading}>Contact Us</h1>
      <p style={subtitle}>We're Here to Help!</p>

      <div style={body}>
        <p>
          Got a question or need assistance? Whether it's choosing the perfect
          artwork, tracking your order, or anything you need to ask — our team
          is ready to help. Reach out, and we'll make sure you get the support
          you deserve, fast and hassle-free!
        </p>

        {/* Contact methods */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 32,
          }}
        >
          <ContactCard
            title="Email"
            value="support@metalposters.pk"
            href="mailto:support@metalposters.pk"
          />
          <ContactCard
            title="WhatsApp"
            value="0330-9995508"
            href="https://wa.me/+923309995508?text=Hi!%20I%27m%20interested%20in%20your%20metal%20posters.%20Can%20you%20please%20share%20more%20details%3F"
          />
        </div>

        {/* Contact form */}
        <div style={{ marginTop: 48 }}>
          <h2 style={sectionTitle}>Send Us a Message</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const subject = encodeURIComponent(
                "Contact Form: " + (fd.get("name") || ""),
              );
              const bodyText = encodeURIComponent(
                `Name: ${fd.get("name")}\nPhone: ${fd.get("phone")}\nInquiry: ${fd.get("inquiry")}\n\n${fd.get("message")}`,
              );
              window.location.href = `mailto:support@metalposters.pk?subject=${subject}&body=${bodyText}`;
            }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              <input
                name="name"
                type="text"
                placeholder="Your Name *"
                required
                style={inputStyle}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Contact Number *"
                required
                style={inputStyle}
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email Address *"
              required
              style={inputStyle}
            />
            <select name="inquiry" style={inputStyle} required>
              <option value="">Select Your Inquiry Type *</option>
              <option value="order">Order Related</option>
              <option value="product">Product Information</option>
              <option value="custom">Custom Design</option>
              <option value="shipping">Shipping & Delivery</option>
              <option value="return">Returns & Refunds</option>
              <option value="other">Other</option>
            </select>
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <button type="submit" className="btn-copper" style={submitStyle}>
              SEND MESSAGE →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: "var(--card)",
        border: "1px solid #333",
        padding: 24,
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: "var(--copper)",
        }}
      >
        {value}
      </div>
    </a>
  );
}

const heading: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: 1,
  color: "var(--white)",
  marginBottom: 8,
};

const subtitle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 16,
  color: "var(--copper)",
  marginBottom: 32,
  letterSpacing: 2,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: 1,
  color: "var(--white)",
  marginBottom: 20,
};

const body: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  lineHeight: 1.8,
  color: "var(--steel)",
};

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #444",
  padding: "14px 16px",
  fontFamily: "'Inter', sans-serif",
  fontSize: 13,
  color: "var(--steel)",
  outline: "none",
  borderRadius: 0,
};

const submitStyle: React.CSSProperties = {
  padding: "16px 32px",
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  letterSpacing: 2,
  textTransform: "uppercase",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  alignSelf: "flex-start",
};
