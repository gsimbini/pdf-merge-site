// pages/account.js
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSupabase } from "../lib/supabaseClient";
import useProStatus from "../components/useProStatus";
import LogoutButton from "../components/LogoutButton";
import ProBadge from "../components/ProBadge";
import AdBanner from "../components/AdBanner";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);

  const { isPro, loading: proLoading } = useProStatus();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }

    // Initial session
    supabase.auth.getSession().then(({ data }) => {
      const e = data?.session?.user?.email?.toLowerCase() || "";
      setEmail(e);
      if (e) localStorage.setItem("simbapdf_email", e);
      setReady(true);
    });

    // Auth state listener
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const e = session?.user?.email?.toLowerCase() || "";
        setEmail(e);

        if (e) {
          localStorage.setItem("simbapdf_email", e);
        } else {
          localStorage.removeItem("simbapdf_email");
        }
      }
    );

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  if (!ready) return null;

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
              <p className="hint">
                Please log in to view your account and subscription status.
              </p>

              <Link className="primary-btn" href="/login">
                Go to Login
              </Link>
            </section>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Account - SimbaPDF</title>
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

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/account">Account</Link>
            </nav>
            <ProBadge />
          </div>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Account</h2>

            <div className="upload-box">
              <strong>Email</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                {email}
              </p>
            </div>

            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Subscription</strong>
              <p className="hint" style={{ marginTop: "0.35rem" }}>
                {proLoading
                  ? "Checking status…"
                  : isPro
                  ? "✅ Pro Active"
                  : "Free plan (ads enabled)"}
              </p>

              {!isPro && (
                <Link className="primary-btn" href="/pricing" style={{ marginTop: "0.75rem" }}>
                  Upgrade to Pro
                </Link>
              )}
            </div>

            <div style={{ marginTop: "1rem" }}>
              <LogoutButton />
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
