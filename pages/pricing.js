// pages/pricing.js
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import ProBadge from "../components/ProBadge";
import MagicLinkLogin from "../components/MagicLinkLogin";

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [emailError, setEmailError] = useState(""); // new state for inline error

  // Load last email used
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("simbapdf_email") || "";
    if (saved) setEmail(saved);
  }, []);

  // Persist email
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (email) localStorage.setItem("simbapdf_email", email.trim().toLowerCase());
  }, [email]);

  async function goPayFast(plan) {
    // Clear previous error
    setEmailError("");

    // Validate email only when clicking the button
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email for Pro activation.");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/payfast/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });

      const payload = await res.json().catch(() => ({}));

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
    const monthlyPrice = 49;
    const yearlyPrice = 490;
    const annualEquivalent = Math.round(yearlyPrice / 12);
    const savingsPercent = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

    return [
      {
        name: "Free",
        price: 0,
        period: "Forever",
        tagline: "Perfect for occasional use",
        features: [
          "All core PDF tools – merge, split, compress, and more",
          "100% browser-based – no downloads or installs",
          "No signup or login required",
          "Supported by non-intrusive ads",
          "Standard file size & processing speed",
        ],
        cta: "Start Using Free Tools",
        href: "/",
        highlight: false,
        popular: false,
      },
      {
        name: "Pro",
        price: billing === "monthly" ? monthlyPrice : yearlyPrice,
        period: billing === "monthly" ? "per month" : `per year (R${annualEquivalent}/mo)`,
        tagline:
          billing === "monthly"
            ? "Full power with flexible billing"
            : `Best value – Save ${savingsPercent}%`,
        features: [
          "Remove all ads – clean, distraction-free experience",
          "Priority & faster processing speeds",
          "Higher file size limits (coming soon)",
          "Unlimited tasks & larger uploads",
          "Early access to new tools & features",
          "Priority email support",
          "Works seamlessly on mobile & desktop browsers",
        ],
        cta: "Upgrade to Pro",
        highlight: true,
        popular: billing === "yearly",
      },
    ];
  }, [billing]);

  const selectedPlan = billing;

  return (
    <>
      <Head>
        <title>Pricing - SimbaPDF</title>
        <meta
          name="description"
          content="SimbaPDF pricing: Powerful free PDF tools with ads, or upgrade to Pro for ad-free, faster, unlimited experience."
        />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Fast • Free • Secure PDF tools</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/account">Account</Link>
              <Link href="/login">Login</Link>
            </nav>

            <ProBadge />
          </div>
        </header>

        <main className="main">
          <section className="tool-section">
            {/* Billing toggle */}
            <div
              className="pricing-toggle"
              style={{
                display: "inline-flex",
                background: "rgba(6, 163, 13, 0.71)",
                borderRadius: "50px",
                padding: "0.35rem",
                margin: "2rem auto",
                display: "block",
                width: "fit-content",
              }}
            >
              <button
                className={`toggle-btn ${billing === "monthly" ? "active" : ""}`}
                onClick={() => setBilling("monthly")}
                disabled={busy}
                aria-pressed={billing === "monthly"}
              >
                Monthly
              </button>
              <button
                className={`toggle-btn ${billing === "yearly" ? "active" : ""}`}
                onClick={() => setBilling("yearly")}
                disabled={busy}
                aria-pressed={billing === "yearly"}
              >
                Yearly{" "}
                <span
                  style={{
                    background: "#4caf50",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "10px",
                    marginLeft: "0.4rem",
                  }}
                >
                  Save {Math.round(((49 * 12 - 490) / (49 * 12)) * 100)}%
                </span>
              </button>
            </div>

            {/* Pricing grid */}
            <div
              className="pricing-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`pricing-card ${plan.highlight ? "highlight" : ""} ${plan.popular ? "popular" : ""}`}
                  style={{
                    position: "relative",
                    background: plan.highlight ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                    border: plan.highlight ? "2px solid #4caf50" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    boxShadow: plan.popular ? "0 10px 30px rgba(76,175,80,0.2)" : "none",
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#4caf50",
                        color: "white",
                        padding: "0.35rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  <h3 style={{ margin: "0 0 0.5rem" }}>{plan.name}</h3>
                  <p className="tagline" style={{ margin: "0 0 1.5rem", opacity: 0.8 }}>
                    {plan.tagline}
                  </p>

                  <div className="price" style={{ marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "3rem", fontWeight: "bold" }}>
                      {plan.price === 0 ? "R0" : `R${plan.price}`}
                    </span>
                    <span style={{ fontSize: "1.1rem", opacity: 0.8 }}>
                      {" "}{plan.period}
                    </span>
                  </div>

                  <ul className="feature-list" style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", textAlign: "left" }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ margin: "0.85rem 0", fontSize: "1.05rem" }}>
                        ✓ {f}
                      </li>
                    ))}
                  </ul>

                  {plan.name === "Free" ? (
                    <Link href={plan.href} className="primary-btn" style={{ display: "block", padding: "1rem", fontSize: "1.1rem" }}>
                      {plan.cta}
                    </Link>
                  ) : (
                    <button
                      className="primary-btn"
                      style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}
                      onClick={() => goPayFast(selectedPlan)}
                      disabled={busy}
                      aria-busy={busy}
                    >
                      {busy ? "Processing..." : plan.cta}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Final CTA + EMAIL INPUT + button */}
            <div style={{ margin: "4rem auto 2rem", textAlign: "center", maxWidth: "500px", position: "relative" }}>
              <h3>Ready to go Pro?</h3>
              <p className="hint" style={{ marginBottom: "1rem" }}>
                Enter your email below to receive Pro activation and receipts via PayFast.
              </p>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                  setEmailError(""); // clear error when typing
                }}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  borderRadius: "12px",
                  border: emailError ? "1px solid #ff6b6b" : "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.08)",
                  color: "black",
                  fontSize: "1.1rem",
                }}
                disabled={busy}
                aria-label="Activation email"
                aria-invalid={!!emailError}
              />

              {emailError && (
                <p style={{ color: "#ff6b6b", fontSize: "0.95rem", marginBottom: "1rem", textAlign: "left", maxWidth: "400px" }}>
                  {emailError}
                </p>
              )}

              <button
                className="primary-btn large"
                style={{ width: "100%", maxWidth: "400px", padding: "1.2rem", fontSize: "1.2rem" }}
                onClick={() => goPayFast(selectedPlan)}
                disabled={busy}
                aria-busy={busy}
              >
                {busy ? "Starting secure checkout…" : `Go Pro – ${billing === "monthly" ? "Monthly" : "Yearly"} (PayFast)`}
              </button>

              <p className="hint" style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
                Secure payment • Pro activated automatically after PayFast confirmation (ITN COMPLETE)
              </p>

              {busy && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    zIndex: 10,
                  }}
                >
                  <div style={{ color: "white", fontSize: "1.2rem" }}>Processing...</div>
                </div>
              )}
            </div>

            
            {/* FAQ */}
            <div className="upload-box" style={{ margin: "3rem auto", maxWidth: "700px" }}>
              <strong>Frequently Asked Questions</strong>
              <div style={{ marginTop: "1rem" }}>
                <p><b>Does Pro remove ads?</b> Yes — completely ad-free experience.</p>
                <p><b>What do I get with Pro?</b> Faster processing, higher limits (coming), priority support, early features, and no ads.</p>
                <p><b>When is Pro activated?</b> Automatically after PayFast confirms payment (ITN COMPLETE).</p>
                <p><b>Is payment secure?</b> Yes — processed securely via PayFast, South Africa's leading payment gateway.</p>
              </div>
            </div>

            </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>

      <style jsx>{`
        .pricing-toggle button {
          padding: 0.6rem 1.5rem;
          border: none;
          background: transparent;
          color: white;
          cursor: pointer;
          border-radius: 50px;
          font-weight: 500;
        }
        .pricing-toggle button.active {
          background: white;
          color: black;
        }
        .primary-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 0.9rem 1.8rem;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .primary-btn:hover {
          background: #43a047;
        }
        .primary-btn.large {
          font-size: 1.2rem;
        }
        .pricing-card.popular {
          transform: scale(1.05);
          z-index: 1;
        }
      `}</style>
    </>
  );
}