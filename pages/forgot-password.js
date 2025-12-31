// pages/forgot-password.js
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getSupabase } from "../lib/supabaseClient"; // adjust path if needed

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabase();

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`, // ← important!
        // You can also add: captchaToken if using Turnstile/hCaptcha
      });

      if (error) throw error;

      setMessage(
        "Password reset email sent! Check your inbox (and spam folder)."
      );
      setEmail(""); // optional: clear field
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        err.message?.includes("rate limit")
          ? "Too many requests — please wait a few minutes."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - SimbaPDF</title>
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SP</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Reset Password</p>
            </div>
          </div>

          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/login">Back to Login</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section" style={{ maxWidth: "420px", margin: "0 auto" }}>
            <h2>Reset your password</h2>
            <p className="hint" style={{ marginBottom: "1.5rem" }}>
              Enter your email address and we’ll send you a link to reset your password.
            </p>

            <form onSubmit={handleReset}>
              <div className="upload-box" style={{ marginBottom: "1.25rem" }}>
                <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>
                  <strong>Email</strong>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>

              {message && (
                <p style={{ color: "#2e7d32", margin: "1rem 0", fontWeight: 500 }}>
                  {message}
                </p>
              )}

              {error && (
                <p style={{ color: "#d32f2f", margin: "1rem 0" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="primary-btn"
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  fontSize: "1.1rem",
                  marginTop: "0.5rem",
                  opacity: loading || !email.trim() ? 0.7 : 1,
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Link href="/login" style={{ color: "#1976d2" }}>
                Back to login
              </Link>
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