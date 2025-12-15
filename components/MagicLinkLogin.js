// components/MagicLinkLogin.js
import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient";

export default function MagicLinkLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Avoid SSR issues
    setReady(true);
  }, []);

  async function sendLink() {
    setError("");

    if (typeof window === "undefined") return;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError(
        "Login is temporarily unavailable (Supabase is not configured on this deployment)."
      );
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setSent(true);
      localStorage.setItem("simbapdf_email", email.toLowerCase());
    }
  }

  if (!ready) return null;

  if (sent) {
    return (
      <div className="upload-box">
        <strong>Check your email 📧</strong>
        <p className="hint">
          We sent you a magic login link. Click it to finish signing in.
        </p>
      </div>
    );
  }

  return (
    <div className="upload-box">
      <strong>Sign in to SimbaPDF</strong>
      <p className="hint">Enter your email to receive a secure magic login link.</p>

      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />

      {error && (
        <p className="hint" style={{ color: "#ff6b6b", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      <button
        className="primary-btn"
        onClick={sendLink}
        style={{ marginTop: "0.75rem" }}
        type="button"
      >
        Send Magic Link
      </button>
    </div>
  );
}
