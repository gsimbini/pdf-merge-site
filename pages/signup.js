'use client';

// pages/signup.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from "react";
import { getSupabase } from "../lib/supabaseClient";
import ProBadge from "../components/ProBadge";


export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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

  // Email + Password Sign-Up
  async function handleSignup() {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
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

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          data: { full_name: name.trim() }, // Store name in user metadata
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Success - redirect to account or show confirmation
      window.location.href = "/account";
    } catch (e) {
      setError(e?.message || "Sign-up failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Create Account - SimbaPDF</title>
        <meta name="description" content="Create a free SimbaPDF account with Google or email and password." />
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
          <section className="tool-section" style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Create Your Free Account</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Join SimbaPDF to unlock Pro features, remove ads, and save your work across devices.
            </p>

            

            {/* Google Sign-Up Button */}
            <button
              type="button"
              onClick={signUpWithGoogle}
              disabled={busy}
              style={{
                width: '100%',
                padding: '1rem',
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
              {busy ? "Creating account..." : "Sign up with Google"}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#888' }}>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
              <span style={{ padding: '0 1.5rem', fontSize: '0.9rem' }}>or sign up with email</span>
              <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
            </div>

            {/* Form */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-input"
                  style={{ width: '100%', padding: '0.8rem' }}
                  disabled={busy}
                />
              </div>

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

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Password</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-input"
                  style={{ width: '100%', padding: '0.8rem' }}
                  disabled={busy}
                />
              </div>

              <button
                type="button"
                onClick={handleSignup}
                disabled={busy || !name.trim() || !email.trim() || !password.trim()}
                className="primary-btn"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              >
                {busy ? "Creating account..." : "Sign up"}
              </button>

              <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#666' }}>
                By creating an account, you agree to SimbaPDF's{' '}
                <Link href="/terms" style={{ color: '#0070f3' }}>Terms of Service</Link> and{' '}
                <Link href="/privacy" style={{ color: '#0070f3' }}>Privacy Policy</Link>
              </p>

              {error && (
                <p style={{ color: '#d63031', marginTop: '1rem', fontSize: '0.95rem' }}>
                  {error}
                </p>
              )}
            </div>

            {/* Sign In Link */}
            <p style={{ marginTop: '2rem', fontSize: '1rem', color: '#444' }}>
              Already a member?{' '}
              <Link href="/login" style={{ color: '#0070f3', fontWeight: '500' }}>
                Sign in here
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