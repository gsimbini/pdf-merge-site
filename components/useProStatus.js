// components/useProStatus.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";


export default function useProStatus(email) {
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [error, setError] = useState("");

  const session = await supabase.auth.getSession();
if (!session?.data?.session?.user?.email) {
  setIsPro(false);
  return;
}


  useEffect(() => {
    let cancelled = false;

    async function run() {
      const e = (email || "").trim().toLowerCase();
      if (!e || !/^\S+@\S+\.\S+$/.test(e)) {
        setIsPro(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/pro/status?email=${encodeURIComponent(e)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to check Pro status");

        if (!cancelled) {
          setIsPro(!!data?.isPro);
        }
      } catch (err) {
        if (!cancelled) {
          setIsPro(false);
          setError(err.message || "Error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [email]);

  return { loading, isPro, error };
}
