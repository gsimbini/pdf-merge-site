// pages/account.js
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("unknown"); // active | none | inactive | unknown
  const [plan, setPlan] = useState(null); // monthly | yearly | null
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      const userEmail = data?.session?.user?.email?.toLowerCase() || "";
      setEmail(userEmail);
      setSessionReady(true);

      // If not logged in, just stop here (page will show login prompt)
      if (!userEmail) return;

      await refresh(userEmail);
    }

    init();

    // Keep it in sync if user logs in/out
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const e = session?.user?.email?.toLowerCase() || "";
      setEmail(e);
      if (!e) {
        setStatus("none");
        setPlan(null);
        setUpdatedAt(null);
      } else {
        refresh(e);
      }
    });

    return () => sub?.subscription?.unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(userEmail) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/pro/status?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to load subscription status");

      setStatus(data?.isPro ? "active" : (data?.status || "none"));
      setPlan(data?.plan || null);
      setUpdatedAt(data?.updated_at || null);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("simbapdf_email");
    window.location.href = "/";
  }

  return (
    <>
      <Head>
        <title>Account - SimbaPDF</title>
        <meta name="description" content="Manage your SimbaPDF account and subscription." />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SP</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Account & Subscription</p>
            </div>
          </div>

          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/account">Account</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Manage Subscription</h2>

            {!sessionReady ? (
              <div className="upload-box">
                <strong>Loading…</strong>
                <p className="hint">Checking your session.</p>
              </div>
            ) : !email ? (
              <div className="upload-box">
                <strong>You’re not signed in</strong>
                <p className="hint">
                  Please sign in using a magic link on the Pricing page, then come back here.
                </p>
                <Link className="primary-btn" href="/pricing">
                  Go to Pricing / Sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="upload-box">
                  <strong>Signed in as</strong>
                  <p className="hint" style={{ marginTop: "0.35rem" }}>
                    {email}
                  </p>

                  <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button className="primary-btn" type="button" onClick={() => refresh(email)} disabled={loading}>
                      {loading ? "Refreshing…" : "Refresh status"}
                    </button>
                    <button className="secondary-btn" type="button" onClick={logout}>
                      Log out
                    </button>
                  </div>

                  {error && (
                    <p className="hint" style={{ marginTop: "0.75rem", color: "#ff6b6b" }}>
                      {error}
                    </p>
                  )}
                </div>

                <div className="upload-box" style={{ marginTop: "1rem" }}>
                  <strong>Subscription status</strong>

                  <div style={{ marginTop: "0.6rem" }}>
                    <p className="hint" style={{ margin: "0.25rem 0" }}>
                      <b>Status:</b>{" "}
                      {status === "active" ? "✅ Pro Active" : status === "inactive" ? "Inactive" : "Not Pro"}
                    </p>

                    <p className="hint" style={{ margin: "0.25rem 0" }}>
                      <b>Plan:</b> {plan ? plan : "—"}
                    </p>

                    <p className="hint" style={{ margin: "0.25rem 0" }}>
                      <b>Last updated:</b> {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
                    </p>
                  </div>

                  {status !== "active" && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <Link className="primary-btn" href="/pricing">
                        Upgrade to Pro
                      </Link>
                    </div>
                  )}
                </div>

                <div className="upload-box" style={{ marginTop: "1rem" }}>
                  <strong>Cancel / Manage billing</strong>
                  <p className="hint" style={{ marginTop: "0.5rem" }}>
                    PayFast subscriptions can be managed depending on how the subscription was created.
                    If you need cancellation help, email us from your Pro email address and we’ll assist.
                  </p>

                  <p className="hint" style={{ marginTop: "0.5rem" }}>
                    Email: <b>support@simbapdf.com</b> (subject: “Cancel Pro”)
                  </p>

                  <p className="hint" style={{ marginTop: "0.5rem" }}>
                    Tip: include your email and the words “SimbaPDF Pro” so we can locate your subscription quickly.
                  </p>
                </div>
              </>
            )}
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
