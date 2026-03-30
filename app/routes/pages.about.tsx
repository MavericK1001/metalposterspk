import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "About Us — MetalPosters" }];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={heading}>About Metal Posters</h1>
        <p style={subtitle}>Art That Transforms Spaces</p>
      </div>

      <div style={body}>
        <p style={{ fontSize: 16, color: "var(--copper)", fontWeight: 600 }}>
          At Metal Posters, we believe that walls should do more than just exist
          — they should express, inspire, and captivate. Our passion for
          creativity and craftsmanship drives us to create premium metal wall
          art that adds personality and depth to any space.
        </p>

        <h2 style={sectionTitle}>Our Story</h2>
        <h3 style={{ ...sectionTitle, fontSize: 14, color: "var(--steel)" }}>
          Born from Passion, Built for Expression
        </h3>
        <p>
          Metal Posters started with a simple idea — that Art should be
          Timeless, Durable, and Effortlessly Stylish. So we set out to redefine
          wall décor. By merging cutting-edge Printing Technology with
          High-Grade Metal, we've created a Sleek &amp; Long-Lasting alternative
          that brings art to life.
        </p>

        <h2 style={sectionTitle}>Our Mission</h2>
        <p>
          To turn blank walls into conversation starters with Modern, Durable
          Metal Art. No more fading prints, bulky frames, or wall damage. Just
          sleek, lasting expression.
        </p>

        <h2 style={sectionTitle}>What Makes Us Different?</h2>

        <div style={{ display: "grid", gap: 24, marginTop: 16 }}>
          <Feature
            title="Sustainable & Built to Last"
            description="Our durable metal prints are not just stunning but environmentally conscious, making your space beautiful without compromise."
          />
          <Feature
            title="Effortless Setup, Instant Impact"
            description="Forget the hassle of nails, frames, and adhesives. Our lightweight yet sturdy metal art is designed for quick and easy mounting, so you can transform your space within minutes."
          />
          <Feature
            title="Gifting & Personalization"
            description="Looking for a thoughtful gift or something truly unique? Our customized designs allow you to turn your favorite moments, quotes, or inspirations into breathtaking metal artwork."
          />
        </div>

        <h2 style={sectionTitle}>Join the Metal Posters Movement</h2>
        <p>
          Whether you're an art enthusiast, a trendsetter, or someone who simply
          loves a beautiful space, Metal Posters is here to help you express
          yourself through timeless metal art.
        </p>
        <p>
          We're not just about selling art — we're about empowering artists,
          designers, and creators to bring their unique visions to life and
          share them with the world.
        </p>
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid #333",
        padding: 24,
      }}
    >
      <h3
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--copper)",
          marginBottom: 8,
          letterSpacing: 1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          lineHeight: 1.8,
          color: "var(--steel)",
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
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
  letterSpacing: 2,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 1,
  color: "var(--copper)",
  marginBottom: 12,
  marginTop: 32,
};

const body: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  lineHeight: 1.8,
  color: "var(--steel)",
};
