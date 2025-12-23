'use client';

// pages/login.js
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient";
import ProBadge from "../components/ProBadge";
import AdBanner from "../components/AdBanner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill email from localStorage if available
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("simbapdf_email") || "";
    if (saved) setEmail(saved);
  }, []);

  // Google Sign-In
  async function signInWithGoogle() {
    setError("");
    setBusy(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError("Login service is temporarily unavailable.");
        setBusy(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      // Redirect happens automatically
    } catch (e) {
      setError(e?.message || "Google sign-in failed. Please try again.");
      setBusy(false);
    }
  }

  // Magic Link Sign-In
  async function sendMagicLink() {
    setError("");
    setSent(false);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setBusy(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError("Login service is temporarily unavailable.");
        setBusy(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setSent(true);
      localStorage.setItem("simbapdf_email", email.trim().toLowerCase());
    } catch (e) {
      setError(e?.message || "Failed to send magic link. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login - SimbaPDF</title>
        <meta name="description" content="Login to SimbaPDF using Google or email magic link." />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
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
            <h2>Sign in to SimbaPDF</h2>
            <p className="hint">
              Unlock Pro features across devices, manage your subscription, and remove ads.
            </p>

            <AdBanner slot="2169503342" />

            {/* Google Sign-In */}
            <div className="upload-box" style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <strong>Continue with Google</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                Fast and secure — use your Google account to sign in.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={signInWithGoogle}
                disabled={busy}
                style={{ marginTop: "0.75rem", padding: "0.75rem 2rem" }}
              >
                {busy ? "Please wait…" : "Sign in with Google"}
              </button>
            </div>

            {/* Divider */}
            <div style={{ textAlign: "center", margin: "2rem 0", color: "#666" }}>
              <span style={{ background: "#fff", padding: "0 1rem" }}>or</span>
              <hr style={{ margin: "0.5rem 0", border: "none", borderTop: "1px solid #ddd" }} />
            </div>

            {/* Email Magic Link */}
            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Sign in with Email</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                We'll send you a secure magic link — no password needed.
              </p>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-input"
                style={{ width: "100%", marginTop: "0.75rem" }}
                disabled={busy}
              />

              <button
                type="button"
                className="primary-btn"
                onClick={sendMagicLink}
                disabled={busy || !email}
                style={{ marginTop: "0.75rem", width: "100%" }}
              >
                {busy ? "Sending…" : "Send Magic Link"}
              </button>

              {sent && (
                <p className="hint" style={{ marginTop: "0.75rem", color: "#28a745" }}>
                  ✅ Magic link sent! Check your inbox (and spam folder).
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="upload-box" style={{ marginTop: "1.5rem", background: "#fff0f0" }}>
                <strong style={{ color: "#d63031" }}>Error</strong>
                <p className="hint" style={{ marginTop: "0.35rem", color: "#d63031" }}>
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