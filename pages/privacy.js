// pages/privacy.js
import Head from 'next/head';
import Link from 'next/link';
import ProBadge from "../components/ProBadge";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - SimbaPDF</title>
        <meta name="description" content="SimbaPDF Privacy Policy - how we handle your data." />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Privacy Policy</p>
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
            <h2>Privacy Policy</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Last updated: December 28, 2025
            </p>

            <p>
              At SimbaPDF, your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect your information when you use our website and PDF tools.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              SimbaPDF processes all files directly in your browser using JavaScript. We do not upload, store, or access your PDF files or personal documents.
            </p>
            <ul>
              <li><strong>No file storage</strong>: Your PDFs never leave your device.</li>
              <li><strong>Usage data</strong>: We may collect anonymous analytics (pages visited, tools used) to improve the service.</li>
              <li><strong>Account data</strong>: If you create an account (via Google or email), we store your email and subscription status securely via Supabase.</li>
              <li><strong>Cookies</strong>: We use minimal cookies for functionality (e.g., dark mode preference) and analytics.</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>
              We use data only to:
            </p>
            <ul>
              <li>Provide and improve our PDF tools</li>
              <li>Manage Pro subscriptions and remove ads for paid users</li>
              <li>Send occasional updates or support messages (if you opt in)</li>
            </ul>

            <h3>3. Third Parties</h3>
            <p>
              We use trusted third-party services:
            </p>
            <ul>
              <li>Supabase (authentication & user data)</li>
              <li>Google Analytics (anonymous usage stats)</li>
              <li>AdSense (ads on free plan)</li>
              <li>PayFast/Peach Payments (subscription payments)</li>
            </ul>
            <p>
              These providers have their own privacy policies and do not receive your PDF content.
            </p>

            <h3>4. Data Security</h3>
            <p>
              We use industry-standard security measures to protect account data. However, no system is 100% secure — we cannot guarantee absolute security.
            </p>

            <h3>5. Your Rights</h3>
            <p>
              You may request deletion of your account data by contacting us. We do not sell your personal information.
            </p>

            <h3>6. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy. Changes will be posted here with an updated date.
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