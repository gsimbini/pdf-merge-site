// pages/auth/callback.js
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function finishLogin() {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session?.user?.email) {
        localStorage.setItem(
          "simbapdf_email",
          data.session.user.email.toLowerCase()
        );
      }

      router.replace("/");
    }

    finishLogin();
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
