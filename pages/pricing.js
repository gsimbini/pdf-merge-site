// pages/pricing.js
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import AdBanner from "../components/AdBanner";

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"

  async function goPayFast(plan) {
    try {
      const res = await fetch("/api/payfast/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }), // "monthly" or "yearly"
      });

      const payload = await res.json();

      if (!res.ok) {
        alert(payload?.error || "Could not start PayFast checkout.");
        return;
      }

      const { payfastUrl, data } = payload;

      // PayFast expects a POST form submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payfastUrl;

      Object.keys(data).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(data[key]);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert("Network error starting PayFast checkout.");
    }
  }

  const plans = useMemo(() => {
    const proMonthly = 49; // ZAR
    const proYearly = 490; // ZAR

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
        cta: { label: "Use Free Tools", onClick: () => (window.location.href = "/") },
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
        cta: {
          label: billing === "monthly" ? "Go Pro – Monthly (PayFast)" : "Go Pro – Yearly (PayFast)",
          onClick: () => goPayFast(billing === "monthly" ? "monthly" : "yearly"),
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

            {/* Optional: Homepage/marketing ad slot */}
            <AdBanner slot="9740145252" />

            {/* Billing Toggle */}
            <div className="pricing-toggle" style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className={billing === "monthly" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setBilling("monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={billing === "yearly" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setBilling("yearly")}
              >
                Yearly (save)
              </button>
            </div>

            {/* Cards */}
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

                  {/* CTA */}
                  <button className="primary-btn" type="button" onClick={p.cta.onClick}>
                    {p.cta.label}
                  </button>

                  {p.name === "Pro" && (
                    <p className="hint" style={{ marginTop: "0.75rem" }}>
                      After payment, we’ll activate Pro for your account/device.
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
