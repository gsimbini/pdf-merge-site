'use client';  // ← ADD THIS AT THE VERY TOP

// components/useProStatus.js
import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabaseClient";

export default function useProStatus() {
  // Start with null to indicate "unknown" during SSR
  const [isPro, setIsPro] = useState(null); // ← Changed from false to null
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        // This effect only runs on client anyway, but safe guard
        const supabase = getSupabase();
        if (!supabase) {
          if (!cancelled) {
            setIsPro(false);
            setLoading(false);
          }
          return;
        }

        const { data: sessionData, error: sessionErr } =
          await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        const userEmail = sessionData?.session?.user?.email?.toLowerCase() || "";
        if (!userEmail) {
          if (!cancelled) {
            setIsPro(false);
            setLoading(false);
          }
          return;
        }

        localStorage.setItem("simbapdf_email", userEmail);

        const res = await fetch(
          `/api/pro/status?email=${encodeURIComponent(userEmail)}`
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Failed to check Pro status");

        if (!cancelled) {
          setIsPro(Boolean(json?.isPro));
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setIsPro(false);
          setError(e?.message || "Error");
          setLoading(false);
        }
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  // Return isPro as boolean, but treat null as false for rendering safety
  return {
    loading,
    isPro: Boolean(isPro), // null → false, true → true, false → false
    error,
  };
}