// pages/account.js
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSupabase } from "../lib/supabaseClient";
import useProStatus from "../components/useProStatus";
import LogoutButton from "../components/LogoutButton";
import ProBadge from "../components/ProBadge";

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const { isPro, loading: proLoading } = useProStatus();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    let subscription;

    const init = async () => {
      try {
        setLoading(true);
        setAuthError(null);

        // 1) Read session once
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data?.session;
        const userEmail = session?.user?.email?.toLowerCase() || "";
        setEmail(userEmail);

        if (userEmail) localStorage.setItem("simbapdf_email", userEmail);
        else localStorage.removeItem("simbapdf_email");

        // 2) Listen for changes
        const { data: subData } = supabase.auth.onAuthStateChange((event, session2) => {
          const newEmail = session2?.user?.email?.toLowerCase() || "";
          setEmail(newEmail);

          if (newEmail) localStorage.setItem("simbapdf_email", newEmail);
          else localStorage.removeItem("simbapdf_email");

          // ✅ ONLY redirect when user explicitly signs out
          if (event === "SIGNED_OUT") {
            router.replace("/login");
          }
        });

        subscription = subData?.subscription;
      } catch (err) {
        console.error("Auth error:", err);
        setAuthError("Failed to load account. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="page">
        <div style={{ padding: "6rem 1rem", textAlign: "center" }}>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="page">
        <div style={{ padding: "6rem 1rem", textAlign: "center" }}>
          <h2 style={{ color: "#f44336" }}>Error</h2>
          <p>{authError}</p>
          <Link href="/login" className="primary-btn" style={{ marginTop: "1.5rem" }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <>
        <Head>
          <title>Account - SimbaPDF</title>
        </Head>
        <div className="page">
          <header className="header">
            <div className="brand">
              <span className="logo-circle">SPDF</span>
              <div>
                <h1>SimbaPDF</h1>
                <p className="tagline">Account</p>
              </div>
            </div>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/login">Login</Link>
            </nav>
          </header>

          <main className="main">
            <section className="tool-section">
              <h2>You’re not signed in</h2>
              <p className="hint" style={{ margin: "1rem 0 1.5rem" }}>
                Sign in to view and manage your SimbaPDF account, subscription, and settings.
              </p>
              <Link className="primary-btn" href="/login">
                Sign In
              </Link>
            </section>
          </main>

          <footer className="footer">
            <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
          </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Account - SimbaPDF</title>
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SP</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Your Account</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/account" style={{ fontWeight: "bold" }}>
                Account
              </Link>
            </nav>
            <ProBadge />
          </div>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>My Account</h2>
            <p className="hint" style={{ marginBottom: "2rem" }}>
              Manage your profile, subscription and preferences.
            </p>

            <div className="upload-box" style={{ marginBottom: "1.5rem" }}>
              <strong>Email</strong>
              <p className="hint" style={{ marginTop: "0.5rem", fontSize: "1.1rem" }}>
                {email}
              </p>
            </div>

            <div className="upload-box" style={{ marginBottom: "1.5rem" }}>
              <strong>Subscription Status</strong>
              <p
                className="hint"
                style={{
                  marginTop: "0.5rem",
                  fontSize: "1.1rem",
                  color: proLoading ? "#666" : isPro ? "#2e7d32" : "#e65100",
                  fontWeight: "500",
                }}
              >
                {proLoading ? "Checking..." : isPro ? "Pro Plan Active ✓" : "Free Plan (with ads)"}
              </p>

              {!isPro && !proLoading && (
                <Link className="primary-btn" href="/pricing" style={{ marginTop: "1rem", display: "inline-block" }}>
                  Upgrade to Pro
                </Link>
              )}

              {isPro && !proLoading && (
                <Link
                  href="/pricing"
                  style={{
                    marginTop: "1rem",
                    display: "inline-block",
                    color: "#1976d2",
                    textDecoration: "underline",
                  }}
                >
                  Manage Plan
                </Link>
              )}
            </div>

            <div style={{ marginTop: "2rem" }}>
              <LogoutButton />
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
