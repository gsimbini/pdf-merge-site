// pages/pricing.js
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import AdBanner from "../components/AdBanner";

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function goPayFast(plan) {
    try {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert("Please enter a valid email for Pro activation.");
        return;
      }

      setBusy(true);

      const res = await fetch("/api/payfast/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });

      const payload = await res.json();

      if (!res.ok) {
        alert(payload?.error || "Could not start PayFast checkout.");
        setBusy(false);
        return;
      }

      const { payfastUrl, data } = payload;

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
      setBusy(false);
    }
  }

  const plans = useMemo(() => {
    const proMonthly = 49;
    const proYearly = 490;

    return [
      {
        name: "Free",
        price: 0,
        tagline: "Perfect for occasional use",
        features: [
          "All basic PDF tools",
          "Works in your browser",
          "No signup required",
          "Ads supported",
        ],
        highlight: false,
      },
      {
        name: "Pro",
        price: billing === "monthly" ? proMonthly : proYearly,
        tagline: "For daily work and faster flow",
        features: [
          "Remove ads",
          "Priority processing (where applicable)",
          "Bigger file limits (coming soon)",
          "Early access to new tools",
          "Priority support",
        ],
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

            <AdBanner slot="9740145252" />

            {/* Email for activation */}
            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Pro activation email</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                Enter the email that will be activated after PayFast confirms payment (ITN COMPLETE).
              </p>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.03)",
                  color: "inherit",
                  marginTop: "0.75rem",
                }}
              />
            </div>

            {/* Billing toggle */}
            <div className="pricing-toggle" style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className={billing === "monthly" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setBilling("monthly")}
                disabled={busy}
              >
                Monthly
              </button>
              <button
                type="button"
                className={billing === "yearly" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setBilling("yearly")}
                disabled={busy}
              >
                Yearly (save)
              </button>
            </div>

            {/* Quick PayFast buttons */}
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                className="primary-btn"
                type="button"
                onClick={() => goPayFast("monthly")}
                disabled={busy}
              >
                {busy ? "Starting checkout…" : "Go Pro – Monthly (PayFast)"}
              </button>

              <button
                className="primary-btn"
                type="button"
                onClick={() => goPayFast("yearly")}
                disabled={busy}
              >
                {busy ? "Starting checkout…" : "Go Pro – Yearly (PayFast)"}
              </button>
            </div>

            {/* Pricing cards */}
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
                        {p.name === "Free" ? "R0" : billing === "monthly" ? "R49" : "R490"}
                      </span>
                      <span className="period">
                        {p.name === "Free"
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

                  {p.name === "Free" ? (
                    <Link className="primary-btn" href="/">
                      Use Free Tools
                    </Link>
                  ) : (
                    <button
                      className="primary-btn"
                      type="button"
                      onClick={() => goPayFast(billing === "monthly" ? "monthly" : "yearly")}
                      disabled={busy}
                    >
                      {billing === "monthly"
                        ? "Go Pro – Monthly (PayFast)"
                        : "Go Pro – Yearly (PayFast)"}
                    </button>
                  )}

                  {p.name === "Pro" && (
                    <p className="hint" style={{ marginTop: "0.75rem" }}>
                      Pro is activated only after PayFast ITN confirms <b>COMPLETE</b>.
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
                  <b>When is Pro activated?</b> Only after PayFast confirms payment via ITN (COMPLETE).
                </p>
              </div>
            </div>

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
