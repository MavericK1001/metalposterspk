import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Shipping Policy — MetalPosters" },
];

export default function ShippingPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={heading}>Shipping Policy</h1>

      <div style={body}>
        <p>
          At Metal Posters, we prioritize secure and efficient delivery of your
          high-quality wall-mounted metal posters. Below are the details of our
          shipping process:
        </p>

        <h2 style={sectionTitle}>Order Processing</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            All our products are made to order, and the processing time is 1–2
            business days.
          </li>
          <li>
            Once your order is shipped, you will receive a confirmation email
            with tracking details.
          </li>
        </ul>

        <h2 style={sectionTitle}>Shipping Methods &amp; Costs</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>All items are shipped through our delivery partners.</li>
          <li>We offer a flat rate shipping cost of PKR 249 for all orders.</li>
          <li>Enjoy Free Standard Shipping on all orders over PKR 5,000.</li>
        </ul>

        <h2 style={sectionTitle}>Delivery Times</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>Standard Shipping:</strong> Delivered within 3–5 business
            days (Within Pakistan).
          </li>
          <li>
            <strong>International Shipping:</strong> Estimated delivery within
            7–10 business days, depending on the destination.
          </li>
        </ul>

        <h2 style={sectionTitle}>Packaging &amp; Protection</h2>
        <p>
          Each order is carefully packed to ensure the safety of your metal
          poster. We use protective materials to prevent damage during transit.
        </p>

        <h2 style={sectionTitle}>International Shipping</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            We offer worldwide shipping! Please be aware that customs duties,
            taxes, or additional fees are the responsibility of the customer.
          </li>
          <li>Delivery times may vary depending on the destination.</li>
        </ul>

        <h2 style={sectionTitle}>Tracking Information</h2>
        <p>
          Once your order is dispatched, you will receive an email containing
          tracking details, allowing you to monitor the progress of your
          shipment.
        </p>
      </div>
    </div>
  );
}

const heading: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: 1,
  color: "var(--white)",
  marginBottom: 32,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 1,
  color: "var(--copper)",
  marginBottom: 12,
  marginTop: 28,
};

const body: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  lineHeight: 1.8,
  color: "var(--steel)",
};
