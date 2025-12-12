// pages/pricing.js
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import AdBanner from "../components/AdBanner";

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"

  const plans = useMemo(() => {
    const proMonthly = 49; // ZAR
    const proYearly = 490; // ZAR (2 months free-ish)

    return [
      {
        name: "Free",
        price: 0,
        period: billing,
        tagline: "Perfect for occasional use",
        features: [
          "All basic PDF tools",
          "Works in your browser",
          "No signup required",
          "Ads supported",
        ],
        cta: { label: "Use Free Tools", href: "/" },
        highlight: false,
      },
      {
        name: "Pro",
        price: billing === "monthly" ? proMonthly : proYearly,
        period: billing,
        tagline: "For daily work and faster flow",
        features: [
          "Remove ads",
          "Priority processing (where applicable)",
          "Bigger file limits (coming soon)",
          "Early access to new tools",
          "Priority support",
        ],
        // For now: “works” by opening email. You can replace with Stripe/PayFast later.
        cta: {
          label: billing === "monthly" ? "Go Pro (Monthly)" : "Go Pro (Yearly)",
          href:
            "mailto:support@simbapdf.com?subject=SimbaPDF%20Pro%20Subscription&body=Hi%20SimbaPDF%20team,%0A%0AI%20want%20to%20subscribe%20to%20SimbaPDF%20Pro%20(" +
            (billing === "monthly" ? "Monthly" : "Yearly") +
            ").%0A%0APlease%20send%20me%20payment%20instructions%20and%20activation%20steps.%0A%0AThanks!",
        },
        highlight: true,
      },
    ];
  }, [billing]);

  return (
    <>
      <Head>
        <title>Pricing - SimbaPDF</title>
        <meta
          name="description"
          content="SimbaPDF pricing: Free tools supported by ads, and Pro to remove ads and unlock premium benefits."
        />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SP</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Fast • Free • Secure PDF tools</p>
            </div>
          </div>

          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/split-pdf">Split PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Pricing</h2>
            <p>
              SimbaPDF is free to use. Ads help pay for servers and development.
              If you want a cleaner experience, go Pro.
            </p>

            {/* Optional: Homepage/marketing ad slot or footer slot */}
            <AdBanner slot="9740145252" />

            <div className="pricing-toggle" style={{ marginTop: "1rem" }}>
              <button
                className={billing === "monthly" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setBilling("monthly")}
                type="button"
              >
                Monthly
              </button>
              <button
                className={billing === "yearly" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setBilling("yearly")}
                type="button"
              >
                Yearly (save)
              </button>
            </div>

            <div className="pricing-grid" style={{ marginTop: "1rem" }}>
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={p.highlight ? "pricing-card highlight" : "pricing-card"}
                >
                  <div>
                    <h3 style={{ marginBottom: "0.25rem" }}>{p.name}</h3>
                    <p className="hint" style={{ marginTop: 0 }}>
                      {p.tagline}
                    </p>

                    <div className="price">
                      <span className="amount">
                        {p.price === 0 ? "R0" : `R${p.price}`}
                      </span>
                      <span className="period">
                        {p.price === 0
                          ? "/ forever"
                          : billing === "monthly"
                          ? "/ month"
                          : "/ year"}
                      </span>
                    </div>

                    <ul className="feature-list">
                      {p.features.map((f) => (
                        <li key={f}>✓ {f}</li>
                      ))}
                    </ul>
                  </div>

                  <a className="primary-btn" href={p.cta.href}>
                    {p.cta.label}
                  </a>

                  {p.name === "Pro" && (
                    <p className="hint" style={{ marginTop: "0.75rem" }}>
                      After payment, we’ll activate Pro for your account/device.
                      (Payments integration can be added next.)
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="upload-box" style={{ marginTop: "1.25rem" }}>
              <strong>FAQ</strong>
              <div style={{ marginTop: "0.5rem" }}>
                <p className="hint" style={{ margin: "0.25rem 0" }}>
                  <b>Does Pro remove ads?</b> Yes — that’s the main benefit.
                </p>
                <p className="hint" style={{ margin: "0.25rem 0" }}>
                  <b>Can I cancel?</b> Yes. If you subscribe monthly, you can stop anytime.
                </p>
                <p className="hint" style={{ margin: "0.25rem 0" }}>
                  <b>Do you store my PDFs?</b> Most tools run in-browser; if a tool
                  ever uses server-side processing, we’ll make it clear.
                </p>
              </div>
            </div>

            {/* Footer ad (optional) */}
            <AdBanner slot="8164173850" />
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
