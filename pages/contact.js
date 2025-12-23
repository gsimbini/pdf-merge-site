// pages/contact.js
import Head from 'next/head';
import Link from 'next/link';
import ProBadge from "../components/ProBadge";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us - SimbaPDF</title>
        <meta
          name="description"
          content="Get in touch with the SimbaPDF team. We're here to help with questions, feedback, or support."
        />
      </Head>

      <div className="page">
        {/* Header */}
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Free &amp; private online PDF tools</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>
            <Link href="/account">Account</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
          <ProBadge />
        </div>

        <main className="main">
          <section className="tool-section">
            <h2>Contact Us</h2>
            <p>
              We'd love to hear from you! Whether you have a question, feedback, a feature request, or just want to say hello, feel free to get in touch.
            </p>

            <div className="upload-box" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem' }}>Email Us</h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                <a href="mailto:hello@simbapdf.com" style={{ color: '#0070f3', textDecoration: 'none' }}>
                  hello@simbapdf.com
                </a>
              </p>
              <p className="hint">
                We usually reply within 24–48 hours (Monday–Friday).
              </p>
            </div>

            <h3 style={{ marginTop: '2rem' }}>Common Topics</h3>
            <ul style={{ lineHeight: '1.8', maxWidth: '700px', margin: '1rem auto' }}>
              <li>Feature requests or suggestions</li>
              <li>Bug reports or issues with a tool</li>
              <li>Pro subscription questions</li>
              <li>Partnership or business inquiries</li>
              <li>General feedback — we love hearing what you think!</li>
            </ul>

            <p style={{ marginTop: '2rem', textAlign: 'center' }}>
              Thank you for using SimbaPDF — your support helps us keep improving!
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