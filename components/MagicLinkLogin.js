// components/MagicLinkLogin.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MagicLinkLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function sendLink() {
    setError("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
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
      localStorage.setItem("simbapdf_email", email.toLowerCase());
    }
  }

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
      <p className="hint">
        Enter your email to receive a secure magic login link.
      </p>

      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />

      {error && <p className="hint" style={{ color: "#ff6b6b" }}>{error}</p>}

      <button className="primary-btn" onClick={sendLink} style={{ marginTop: "0.75rem" }}>
        Send Magic Link
      </button>
    </div>
  );
}
