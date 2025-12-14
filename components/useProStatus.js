// components/useProStatus.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useProStatus() {
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        // SSR/build guard
        if (typeof window === "undefined") return;

        setLoading(true);
        setError("");

        // ✅ MUST be inside async function
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        const userEmail = sessionData?.session?.user?.email?.toLowerCase() || "";

        // If not signed in, user is not Pro (prevents email spoofing)
        if (!userEmail) {
          if (!cancelled) setIsPro(false);
          return;
        }

        // Keep email in localStorage for UI convenience
        localStorage.setItem("simbapdf_email", userEmail);

        // Query your server (Supabase service role key stays server-side)
        const res = await fetch(`/api/pro/status?email=${encodeURIComponent(userEmail)}`);
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json?.error || "Failed to check Pro status");
        }

        if (!cancelled) setIsPro(Boolean(json?.isPro));
      } catch (e) {
        if (!cancelled) {
          setIsPro(false);
          setError(e?.message || "Error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, isPro, error };
}
