// pages/terms.js
import Head from 'next/head';
import Link from 'next/link';
import ProBadge from "../components/ProBadge";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service - SimbaPDF</title>
        <meta name="description" content="SimbaPDF Terms of Service - read our rules for using the site." />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Terms of Service</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>
            <Link href="/account">Account</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
          <ProBadge />
        </div>

        <main className="main">
          <section className="tool-section">
            <h2>Terms of Service</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Last updated: December 28, 2025
            </p>

            <p>
              Welcome to SimbaPDF! These Terms of Service ("Terms") govern your use of our website, tools, and services (collectively, the "Service"). By accessing or using SimbaPDF, you agree to be bound by these Terms.
            </p>

            <h3>1. Use of the Service</h3>
            <p>
              SimbaPDF provides free online PDF tools that run directly in your browser. You may use the Service for lawful purposes only. You agree not to:
            </p>
            <ul>
              <li>Use the Service to process illegal, harmful, or copyrighted content without permission</li>
              <li>Attempt to reverse-engineer, decompile, or interfere with the Service</li>
              <li>Upload viruses, malware, or harmful code</li>
              <li>Abuse the Service (excessive automated use, spam, etc.)</li>
            </ul>

            <h3>2. User Content</h3>
            <p>
              All files you upload remain on your device — we do not store or access them. You are solely responsible for the content you process.
            </p>

            <h3>3. Pro Subscription</h3>
            <p>
              Pro features (ad removal, higher limits, etc.) require a paid subscription. Payments are processed securely via third-party providers. Subscriptions are recurring and auto-renew unless cancelled.
            </p>

            <h3>4. Intellectual Property</h3>
            <p>
              SimbaPDF and its tools are owned by us. You may not copy, reproduce, or distribute the Service without permission.
            </p>

            <h3>5. Limitation of Liability</h3>
            <p>
              The Service is provided "as is". We are not liable for any loss of data, business interruption, or indirect damages arising from your use of the Service.
            </p>

            <h3>6. Termination</h3>
            <p>
              We may suspend or terminate your access if you violate these Terms.
            </p>

            <h3>7. Changes to Terms</h3>
            <p>
              We may update these Terms at any time. Continued use after changes constitutes acceptance.
            </p>

            <h3>8. Governing Law</h3>
            <p>
              These Terms are governed by the laws of South Africa.
            </p>

            <p style={{ marginTop: '2rem' }}>
              Questions? Contact us at <a href="mailto:givensimbini@gmail.com">Contact Us</a>.
            </p>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}