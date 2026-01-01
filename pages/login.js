'use client';

// pages/login.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from "react";
import { getSupabase } from "../lib/supabaseClient";
import ProBadge from "../components/ProBadge";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
      // Redirect happens automatically via Supabase
    } catch (e) {
      setError(e?.message || "Google sign-in failed. Please try again.");
      setBusy(false);
    }
  }

  // Email + Password Login
  async function handleLogin() {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
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

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) throw error;

      // Success - redirect to account
      window.location.href = "/account";
    } catch (e) {
      setError(e?.message || "Login failed. Please check your email and password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login - SimbaPDF</title>
        <meta name="description" content="Sign in to SimbaPDF with Google or your email and password." />
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
          <section className="tool-section" style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Sign in to SimbaPDF</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Access your Pro account, remove ads, and unlock premium tools.
            </p>

            
            {/* Google Login Button */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={busy}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1.1rem',
                fontWeight: '500',
                backgroundColor: '#ffffffff',
                color: '#0c0000ff',
                border: 'none',
                borderRadius: '6px',
                cursor: busy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}
            >
              <img
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                alt="Google"
                style={{ height: '24px' }}
              />
              {busy ? "Signing in..." : "Sign in with Google"}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#888' }}>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
              <span style={{ padding: '0 1.5rem', fontSize: '0.9rem' }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
            </div>

            {/* Email & Password Form */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-input"
                  style={{ width: '100%', padding: '0.8rem' }}
                  disabled={busy}
                />
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-input"
                  style={{ width: '100%', padding: '0.8rem' }}
                  disabled={busy}
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <Link href="/forgot-password" style={{ color: '#0070f3', fontSize: '0.9rem', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={busy || !email.trim() || !password.trim()}
                className="primary-btn"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              >
                {busy ? "Signing in..." : "Sign in"}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p style={{ color: '#d32f2f', marginTop: '1rem', fontSize: '0.95rem' }}>
                {error}
              </p>
            )}

            {/* Create Account Link */}
            <p style={{ marginTop: '2rem', fontSize: '1rem', color: '#444' }}>
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: '#0070f3', fontWeight: '500' }}>
                Create an account
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