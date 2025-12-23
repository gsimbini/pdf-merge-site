// pages/auth/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSupabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function finish() {
      const supabase = getSupabase();
      if (!supabase) {
        router.replace("/pricing");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const userEmail = data?.session?.user?.email?.toLowerCase() || "";

      if (userEmail) localStorage.setItem("simbapdf_email", userEmail);

      router.replace("/account");
    }

    finish();
  }, [router]);

  return (
    <div className="page">
      <div className="upload-box">
        <strong>Signing you in…</strong>
        <p className="hint">Please wait.</p>
      </div>
    </div>
  );
}
