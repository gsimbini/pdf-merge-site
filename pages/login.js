// pages/login.js
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient";
import ProBadge from "../components/ProBadge";
import AdBanner from "../components/AdBanner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("simbapdf_email") || "";
    if (saved) setEmail(saved);
  }, []);

  async function signInWithGoogle() {
    setError("");
    setBusy(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError("Login is temporarily unavailable (Supabase not configured).");
        setBusy(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) setError(error.message);
    } catch (e) {
      setError(e?.message || "Google sign-in failed.");
      setBusy(false);
    }
  }

  async function sendMagicLink() {
    setError("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setBusy(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError("Login is temporarily unavailable (Supabase not configured).");
        setBusy(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
        localStorage.setItem("simbapdf_email", email.trim().toLowerCase());
      }
    } catch (e) {
      setError(e?.message || "Failed to send magic link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login - SimbaPDF</title>
        <meta name="description" content="Login to SimbaPDF using email or Google." />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SP</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Login</p>
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
            <h2>Sign in</h2>
            <p className="hint">
              Sign in to manage your subscription and unlock Pro benefits across devices.
            </p>

            <AdBanner slot="2169503342" />

            {/* Google signup/login */}
            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Continue with Google</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                Use your Gmail / Google account to sign in.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={signInWithGoogle}
                disabled={busy}
                style={{ marginTop: "0.75rem" }}
              >
                {busy ? "Please wait…" : "Continue with Google"}
              </button>
            </div>

            {/* Email magic link */}
            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Or sign in with email</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                We’ll send you a secure magic link.
              </p>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", marginTop: "0.75rem" }}
              />

              <button
                type="button"
                className="primary-btn"
                onClick={sendMagicLink}
                disabled={busy}
                style={{ marginTop: "0.75rem" }}
              >
                {busy ? "Sending…" : "Send Magic Link"}
              </button>

              {sent && (
                <p className="hint" style={{ marginTop: "0.75rem" }}>
                  ✅ Link sent — check your inbox (and spam folder).
                </p>
              )}
            </div>

            {error && (
              <div className="upload-box" style={{ marginTop: "1rem" }}>
                <strong style={{ color: "#ff6b6b" }}>Login error</strong>
                <p className="hint" style={{ marginTop: "0.35rem" }}>
                  {error}
                </p>
              </div>
            )}

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
