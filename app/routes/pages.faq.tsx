import { useState } from "react";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "FAQ — MetalPosters" }];

const FAQ_SECTIONS = [
  {
    title: "Metal Posters",
    items: [
      {
        q: "What are your metal posters made of?",
        a: "Our metal posters are made from premium-grade aluminium with HD dye-sublimation printing. The result is a vibrant, durable print that won't fade, warp, or scratch easily. Each poster has a sleek brushed metal finish that adds depth and a modern look to any space.",
      },
      {
        q: "How do I install metal posters?",
        a: "Each metal poster comes with a magnetic mounting system that makes installation effortless — no nails, no holes, no damage to your walls. Simply attach the magnetic strips to your wall and place the poster. It's that easy! You can swap artwork anytime you like.",
      },
      {
        q: "Do metal posters fade over time?",
        a: "No! Our HD dye-sublimation printing process infuses the ink directly into the metal surface, making it extremely resistant to fading, even in direct sunlight. Your metal poster will look as vibrant years from now as the day you received it.",
      },
      {
        q: "Are metal posters waterproof?",
        a: "Yes, our metal posters are water-resistant and can withstand moisture. They're suitable for bathrooms, kitchens, and other humid environments. However, we recommend avoiding prolonged direct water exposure.",
      },
      {
        q: "Will the colors look exactly like the pictures?",
        a: "We strive for the highest color accuracy possible. Due to variations in monitor settings and calibrations, the exact colors you see on screen may differ slightly from the physical product. However, our HD printing technology ensures rich, true-to-life colors on every poster.",
      },
      {
        q: "Can I request custom designs?",
        a: "Absolutely! We offer custom metal posters where you can upload your own design, photo, or artwork. Visit our Custom Metal Poster collection to get started. Our team will work with you to ensure the final product looks perfect.",
      },
      {
        q: "What sizes are available?",
        a: "We offer a range of sizes to fit any space: Small (20×25cm), Medium (30×40cm), Large (40×60cm), XL (60×80cm), and XXL (80×120cm). Multi-panel and panoramic options are also available for larger wall spaces.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "All our products are made to order. Processing takes 1–2 business days. Standard shipping within Pakistan is 3–5 business days. International shipping is estimated at 7–10 business days depending on the destination. You'll receive tracking details via email once your order ships.",
      },
      {
        q: "Do you accept Cash on Delivery (COD)?",
        a: "Yes, we accept Cash on Delivery for orders within Pakistan. COD is available for all standard orders. For international orders, we accept online payment methods only.",
      },
      {
        q: "Is it possible to make a return or swap of the product?",
        a: "We accept returns and exchanges only for damaged or defective items. Returns must be initiated within 7 days of receiving the product. Please contact us at support@metalposters.pk with your order number and photos of the issue. Due to the custom-made nature of our products, we cannot accept returns for items that are not damaged or defective.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={heading}>Frequently Asked Questions</h1>
      <p style={subtitle}>
        Everything you need to know about our metal posters
      </p>

      {FAQ_SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>{section.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {section.items.map((item) => (
              <AccordionItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid #333",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--white)",
            textAlign: "left",
          }}
        >
          {question}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            color: "var(--copper)",
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "0 20px 18px",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            lineHeight: 1.8,
            color: "var(--steel)",
          }}
        >
          {answer}
        </div>
      )}
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
  fontSize: 14,
  color: "var(--muted)",
  marginBottom: 40,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: 1,
  color: "var(--copper)",
  marginBottom: 16,
};
