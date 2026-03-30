import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Refund Policy — MetalPosters" },
];

export default function RefundPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={heading}>Refund Policy</h1>

      <div style={body}>
        <p>
          At Metal Posters, customer satisfaction is our priority. All our
          products — whether standard or customized — are crafted carefully and
          with high attention to detail. Additionally, a quality check is
          performed on every order before dispatch. Still, if you receive a
          damaged or defective item that might be due to in-transit handling,
          don't worry — we're here to help.
        </p>
        <p>Please review our policy below:</p>

        <h2 style={sectionTitle}>Returns</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            We accept returns only for damaged or defective items. To ensure
            eligibility, returns must be initiated within 7 days of receipt of
            the product.
          </li>
          <li>
            To start a return, please contact us at{" "}
            <a
              href="mailto:support@metalposters.pk"
              style={{ color: "var(--copper)" }}
            >
              support@metalposters.pk
            </a>
            , providing your order number and photos of the damaged or defective
            item. We reserve the right to refuse returns if these requirements
            are not met.
          </li>
        </ul>

        <h2 style={sectionTitle}>Refunds</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Once the returned item is received and inspected, a refund will be
            issued to the original payment method. Refund processing will occur
            within 5–7 business days. You will receive an email notification
            once the refund has been completed.
          </li>
          <li>
            Refunds for returns that meet the above criteria will only be issued
            for the cost of the product. Any shipping fees are non-refundable
            unless the return is due to a mistake on our part.
          </li>
        </ul>

        <h2 style={sectionTitle}>Exchange</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Exchanges are only permitted for damaged or defective items. Due to
            the custom nature of our metal posters, we are unable to process
            exchanges for items that are not defective or damaged.
          </li>
          <li>
            Customers requesting exchanges must follow the same procedure as
            returns by contacting us within the specified timeframe.
          </li>
        </ul>

        <h2 style={sectionTitle}>Non-Returnable Items</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Due to the custom-made nature of our products, items which are
            customized for a specific customer on their instructions — returns
            or exchanges are not accepted for items that are not damaged or
            defective.
          </li>
          <li>
            We encourage customers to carefully review their order before
            purchase to ensure satisfaction.
          </li>
        </ul>

        <h2 style={sectionTitle}>Condition for Return</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Returned items must be in their original, unused condition. Items
            that have been used, damaged, or show signs of wear will not be
            eligible for return or refund.
          </li>
          <li>
            For items that are damaged or defective, we will inspect the
            returned product to determine the extent of damage and eligibility
            for a refund or replacement.
          </li>
        </ul>

        <h2 style={sectionTitle}>Customer Responsibilities</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Customers are responsible for ensuring that the item is returned in
            the condition outlined above. We will not accept returns for
            products that do not meet our requirements.
          </li>
          <li>
            <strong>International Returns:</strong> Customers are responsible
            for any shipping costs associated with returning international
            items, except in cases of defective or damaged products.
          </li>
        </ul>

        <h2 style={sectionTitle}>Customer Satisfaction Guarantee</h2>
        <p>
          We are committed to ensuring you have a positive experience with us.
          If you have any questions or concerns, feel free to reach out to us at{" "}
          <a
            href="mailto:support@metalposters.pk"
            style={{ color: "var(--copper)" }}
          >
            support@metalposters.pk
          </a>{" "}
          — we're here to assist you!
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
