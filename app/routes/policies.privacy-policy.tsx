import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Privacy Policy — MetalPosters" },
];

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={heading}>Privacy Policy</h1>
      <p style={updated}>Last updated: February 11, 2026</p>

      <div style={bodyStyle}>
        <p>
          This Privacy Policy describes how Metal Posters (the "Site", "we",
          "us", or "our") collects, uses, and discloses your personal
          information when you visit, use our services, or make a purchase from
          our website (the "Site") or otherwise communicate with us regarding
          the Site (collectively, the "Services").
        </p>
        <p>
          Please read this Privacy Policy carefully. By using and accessing any
          of the Services, you agree to the collection, use, and disclosure of
          your information as described in this Privacy Policy.
        </p>
      </div>

      <Section title="Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time, including to
          reflect changes to our practices or for other operational, legal, or
          regulatory reasons. We will post the revised Privacy Policy on the
          Site, update the "Last updated" date and take any other steps required
          by applicable law.
        </p>
      </Section>

      <Section title="How We Collect and Use Your Personal Information">
        <p>
          To provide the Services, we collect personal information about you
          from a variety of sources. The information that we collect and use
          varies depending on how you interact with us. In addition to the
          specific uses set out below, we may use information we collect about
          you to communicate with you, provide or improve the Services, comply
          with any applicable legal obligations, enforce any applicable terms of
          service, and to protect or defend the Services, our rights, and the
          rights of our users or others.
        </p>
      </Section>

      <Section title="What Personal Information We Collect">
        <p>
          The types of personal information we obtain about you depends on how
          you interact with our Site and use our Services. When we use the term
          "personal information", we are referring to information that
          identifies, relates to, describes or can be associated with you.
        </p>
      </Section>

      <Section title="Information We Collect Directly from You">
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Contact details including your name, address, phone number, and
            email.
          </li>
          <li>
            Order information including your name, billing address, shipping
            address, payment confirmation, email address, and phone number.
          </li>
          <li>
            Account information including your username, password, security
            questions and other information used for account security purposes.
          </li>
          <li>
            Customer support information including the information you choose to
            include in communications with us.
          </li>
        </ul>
      </Section>

      <Section title="Information We Collect about Your Usage">
        <p>
          We may also automatically collect certain information about your
          interaction with the Services ("Usage Data"). To do this, we may use
          cookies, pixels and similar technologies. Usage Data may include
          information about how you access and use our Site and your account,
          including device information, browser information, information about
          your network connection, your IP address and other information
          regarding your interaction with the Services.
        </p>
      </Section>

      <Section title="Information We Obtain from Third Parties">
        <p>
          We may obtain information about you from third parties, including from
          vendors and service providers who may collect information on our
          behalf, such as:
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Companies who support our Site and Services, such as Shopify.</li>
          <li>
            Our payment processors, who collect payment information to process
            your payment in order to fulfill your orders.
          </li>
          <li>
            When you visit our Site, open or click on emails we send you, or
            interact with our Services, we or third parties we work with may
            automatically collect certain information using online tracking
            technologies.
          </li>
        </ul>
      </Section>

      <Section title="How We Use Your Personal Information">
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>Providing Products and Services.</strong> We use your
            personal information to provide you with the Services, process
            payments, fulfill orders, send notifications related to your
            account, create and maintain your account, and facilitate shipping,
            returns and exchanges.
          </li>
          <li>
            <strong>Marketing and Advertising.</strong> We may use your personal
            information for marketing and promotional purposes, such as to send
            marketing communications and to show you advertisements for products
            or services.
          </li>
          <li>
            <strong>Security and Fraud Prevention.</strong> We use your personal
            information to detect, investigate or take action regarding possible
            fraudulent, illegal or malicious activity.
          </li>
          <li>
            <strong>Communicating with You.</strong> We use your personal
            information to provide you with customer support and improve our
            Services.
          </li>
        </ul>
      </Section>

      <Section title="Cookies">
        <p>
          Like many websites, we use Cookies on our Site. We use Cookies to
          power and improve our Site and our Services (including to remember
          your actions and preferences), to run analytics and better understand
          user interaction with the Services. We may also permit third parties
          and service providers to use Cookies on our Site to better tailor the
          services, products and advertising on our Site and other websites.
        </p>
        <p>
          Most browsers automatically accept Cookies by default, but you can
          choose to set your browser to remove or reject Cookies through your
          browser controls.
        </p>
      </Section>

      <Section title="How We Disclose Personal Information">
        <p>
          In certain circumstances, we may disclose your personal information to
          third parties for contract fulfillment purposes, legitimate purposes
          and other reasons subject to this Privacy Policy. Such circumstances
          may include:
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            With vendors or other third parties who perform services on our
            behalf (e.g., IT management, payment processing, data analytics,
            customer support, cloud storage, fulfillment and shipping).
          </li>
          <li>
            With business and marketing partners to provide services and
            advertise to you.
          </li>
          <li>
            When you direct, request us or otherwise consent to our disclosure
            of certain information to third parties.
          </li>
          <li>With our affiliates or otherwise within our corporate group.</li>
          <li>
            In connection with a business transaction such as a merger or
            bankruptcy, to comply with any applicable legal obligations, to
            enforce any applicable terms of service, and to protect or defend
            the Services.
          </li>
        </ul>
      </Section>

      <Section title="Third Party Websites and Links">
        <p>
          Our Site may provide links to websites or other online platforms
          operated by third parties. If you follow links to sites not affiliated
          or controlled by us, you should review their privacy and security
          policies and other terms and conditions. We do not guarantee and are
          not responsible for the privacy or security of such sites.
        </p>
      </Section>

      <Section title="Children's Data">
        <p>
          The Services are not intended to be used by children, and we do not
          knowingly collect any personal information about children. If you are
          the parent or guardian of a child who has provided us with their
          personal information, you may contact us to request that it be
          deleted.
        </p>
      </Section>

      <Section title="Security and Retention of Your Information">
        <p>
          Please be aware that no security measures are perfect or impenetrable,
          and we cannot guarantee "perfect security." How long we retain your
          personal information depends on different factors, such as whether we
          need the information to maintain your account, to provide the
          Services, comply with legal obligations, resolve disputes or enforce
          other applicable contracts and policies.
        </p>
      </Section>

      <Section title="Your Rights">
        <p>
          Depending on where you live, you may have some or all of the following
          rights in relation to your personal information:
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>Right to Access / Know:</strong> You may have a right to
            request access to personal information that we hold about you.
          </li>
          <li>
            <strong>Right to Delete:</strong> You may have a right to request
            that we delete personal information we maintain about you.
          </li>
          <li>
            <strong>Right to Correct:</strong> You may have a right to request
            that we correct inaccurate personal information we maintain about
            you.
          </li>
          <li>
            <strong>Right of Portability:</strong> You may have a right to
            receive a copy of the personal information we hold about you.
          </li>
          <li>
            <strong>Withdrawal of Consent:</strong> Where we rely on consent to
            process your personal information, you may have the right to
            withdraw this consent.
          </li>
          <li>
            <strong>Managing Communication Preferences:</strong> We may send you
            promotional emails, and you may opt out of receiving these at any
            time by using the unsubscribe option displayed in our emails to you.
          </li>
        </ul>
      </Section>

      <Section title="International Users">
        <p>
          Please note that we may transfer, store and process your personal
          information outside the country you live in. Your personal information
          is also processed by staff and third party service providers and
          partners in these countries.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Should you have any questions about our privacy practices or this
          Privacy Policy, or if you would like to exercise any of the rights
          available to you, please email us at{" "}
          <a
            href="mailto:support@metalposters.pk"
            style={{ color: "var(--copper)" }}
          >
            support@metalposters.pk
          </a>
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={sectionTitle}>{title}</h2>
      <div style={bodyStyle}>{children}</div>
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

const updated: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  color: "var(--muted)",
  marginBottom: 32,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 1,
  color: "var(--copper)",
  marginBottom: 12,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  lineHeight: 1.8,
  color: "var(--steel)",
};
