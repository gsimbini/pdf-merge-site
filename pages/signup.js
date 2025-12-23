'use client';

// pages/signup.js
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient";
import ProBadge from "../components/ProBadge";
import AdBanner from "../components/AdBanner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill email from localStorage if available (e.g., from previous visit)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("simbapdf_email") || "";
    if (saved) setEmail(saved);
  }, []);

  // Google Sign-Up
  async function signUpWithGoogle() {
    setError("");
    setBusy(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError("Sign-up service is temporarily unavailable.");
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
      setError(e?.message || "Google sign-up failed. Please try again.");
      setBusy(false);
    }
  }

  // Email Magic Link Sign-Up (creates account if new)
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
        setError("Sign-up service is temporarily unavailable.");
        setBusy(false);
        return;
      }

      // signUp creates a new user if email doesn't exist
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // If user already exists, Supabase returns an error — treat as "check email"
        if (error.message.includes("already registered")) {
          setSent(true);
          setMessage("Account already exists — check your email for a magic link to sign in.");
        } else {
          throw error;
        }
      } else {
        setSent(true);
        localStorage.setItem("simbapdf_email", email.trim().toLowerCase());
      }
    } catch (e) {
      setError(e?.message || "Failed to send sign-up link. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Create Account - SimbaPDF</title>
        <meta name="description" content="Create a free SimbaPDF account with Google or email. Unlock Pro features and sync across devices." />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Create Account</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/login">Login</Link>
              <Link href="/account">Account</Link>
            </nav>
            <ProBadge />
          </div>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Create Your Free Account</h2>
            <p className="hint">
              Sign up to remove ads, unlock Pro tools, and sync your experience across devices.
            </p>

            <AdBanner slot="2169503342" />

            {/* Google Sign-Up */}
            <div className="upload-box" style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <strong>Sign up with Google</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                Fast, secure, and one-click — perfect for getting started.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={signUpWithGoogle}
                disabled={busy}
                style={{ marginTop: "0.75rem", padding: "0.75rem 2rem" }}
              >
                {busy ? "Please wait…" : "Sign up with Google"}
              </button>
            </div>

            {/* Divider */}
            <div style={{ textAlign: "center", margin: "2rem 0", color: "#666" }}>
              <span style={{ background: "#fff", padding: "0 1rem" }}>or</span>
              <hr style={{ margin: "0.5rem 0", border: "none", borderTop: "1px solid #ddd" }} />
            </div>

            {/* Email Sign-Up */}
            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Sign up with Email</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                No password needed — we’ll send you a secure magic link.
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
                  ✅ Magic link sent! Check your inbox (and spam folder). If you already have an account, you can sign in with the same link.
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

            <p style={{ marginTop: "2rem", textAlign: "center" }}>
              Already have an account? <Link href="/login" style={{ color: "#0070f3" }}>Sign in here</Link>
            </p>

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