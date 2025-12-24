import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Sick Snow Deals",
  description: "How Sick Snow Deals collects, uses, and protects your information.",
};

const sectionStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: "12px 0",
  borderBottom: "1px solid #e5e5e5",
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px", display: "grid", gap: 16 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0 }}>Privacy Policy</h1>
        <p style={{ margin: 0, color: "#444" }}>
          We respect your privacy. This page explains what data we collect, how we use it, and your choices.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Information We Collect</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
          <li>Usage data like pages visited, clicks on deals, and basic device info (browser, OS).</li>
          <li>Cookie data to remember your session and preferences.</li>
          <li>Optional info you provide directly (e.g., quiz answers or feedback).</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>How We Use Information</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
          <li>To operate and improve the site and personalize deal recommendations.</li>
          <li>To measure performance of affiliate links and detect abuse or fraud.</li>
          <li>To communicate updates or respond when you reach out.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Sharing</h2>
        <p style={{ margin: 0 }}>
          We share data with service providers that help us run the site (e.g., hosting, analytics). We may share
          aggregated, non-identifying stats with partners. We do not sell personal information.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Cookies</h2>
        <p style={{ margin: 0 }}>
          We use cookies to keep you logged in, remember preferences, and understand site usage. You can manage cookies
          in your browser settings, but some features may not work without them.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Partners & Tracking</h2>
        <p style={{ margin: 0 }}>
          We work with Amazon Associates, Impact, and AvantLink to track outbound clicks and attribute commissions. Links
          may redirect through tracking URLs and set or read cookies to confirm a purchase. We also log click events in
          Supabase to detect abuse, improve recommendations, and measure performance. We do not sell personal data.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Data Retention</h2>
        <p style={{ margin: 0 }}>
          We keep data only as long as needed for the purposes above or as required by law. We delete or anonymize data
          when it is no longer necessary.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Your Choices</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
          <li>Opt out of marketing emails by using unsubscribe links.</li>
          <li>Limit cookies in your browser settings.</li>
          <li>Contact us to access, correct, or delete your information where applicable.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Contact</h2>
        <p style={{ margin: 0 }}>
          Questions or requests? Email us at <a href="mailto:privacy@sicksnowdeals.com">privacy@sicksnowdeals.com</a>.
        </p>
      </section>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/">← Back to home</Link>
        <Link href="/terms">View Terms of Use</Link>
      </div>
    </main>
  );
}
