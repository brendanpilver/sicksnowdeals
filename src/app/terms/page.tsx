import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Sick Snow Deals",
  description: "Terms and conditions for using Sick Snow Deals.",
};

const sectionStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: "12px 0",
  borderBottom: "1px solid #e5e5e5",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px", display: "grid", gap: 16 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0 }}>Terms of Use</h1>
        <p style={{ margin: 0, color: "#444" }}>
          Please read these terms before using Sick Snow Deals. By using the site, you agree to them.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Use of the Site</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
          <li>Use the site only for personal, lawful purposes.</li>
          <li>Do not misuse, disrupt, or attempt to gain unauthorized access to our services.</li>
          <li>Content and prices may change; availability is not guaranteed.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Affiliate Disclosure</h2>
        <p style={{ margin: 0 }}>
          Some links are affiliate links. If you buy through them, we may earn a commission at no extra cost to you.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Independence</h2>
        <p style={{ margin: 0 }}>
          Sick Snow Deals is independent from the merchants and affiliate networks we list, including Amazon Associates,
          Impact, and AvantLink. Listings do not mean endorsement, and participation in these programs does not affect
          your price.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Account & Submissions</h2>
        <p style={{ margin: 0 }}>
          If you submit information (e.g., quiz answers or feedback), you grant us permission to use it to operate and
          improve the service. You are responsible for the accuracy of what you provide.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Disclaimer</h2>
        <p style={{ margin: 0 }}>
          The site is provided “as is” without warranties of any kind. We do not guarantee accuracy, availability, or
          that deals will remain valid. You are responsible for verifying details with the merchant.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Pricing & Availability</h2>
        <p style={{ margin: 0 }}>
          Prices, discounts, and availability can change at any time. Information shown on our site may be delayed or
          inaccurate; the merchant’s site is the source of truth.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Orders, Fulfillment, and Returns</h2>
        <p style={{ margin: 0 }}>
          Orders are placed with merchants, not with Sick Snow Deals. Merchants are responsible for fulfillment,
          shipping, warranties, and returns. Please review the merchant’s terms before purchasing.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Limitation of Liability</h2>
        <p style={{ margin: 0 }}>
          To the fullest extent permitted by law, Sick Snow Deals and its contributors will not be liable for any
          indirect, incidental, or consequential damages arising from your use of the site.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Changes</h2>
        <p style={{ margin: 0 }}>
          We may update these terms. If changes are material, we will update the date below or provide notice on the
          site. Continued use after changes means you accept the updated terms.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Contact</h2>
        <p style={{ margin: 0 }}>
          Questions about these terms? Email us at <a href="mailto:support@sicksnowdeals.com">support@sicksnowdeals.com</a>.
        </p>
      </section>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/">← Back to home</Link>
        <Link href="/privacy">View Privacy Policy</Link>
      </div>
    </main>
  );
}
