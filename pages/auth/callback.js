// pages/auth/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSupabase } from "../../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      router.replace("/pricing");
      return;
    }

    let done = false;

    const finish = async () => {
      try {
        // 1) Try immediately
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        if (session?.user?.email) {
          localStorage.setItem("simbapdf_email", session.user.email.toLowerCase());
          done = true;
          router.replace("/account");
          return;
        }

        // 2) If session not ready yet, wait for auth event (more reliable in prod)
        const { data: sub } = supabase.auth.onAuthStateChange((event, session2) => {
          if (done) return;

          if (event === "SIGNED_IN" && session2?.user?.email) {
            localStorage.setItem("simbapdf_email", session2.user.email.toLowerCase());
            done = true;
            router.replace("/account");
          }

          if (event === "SIGNED_OUT") {
            done = true;
            router.replace("/login");
          }
        });

        // 3) Safety timeout: don’t get stuck forever
        setTimeout(() => {
          if (done) return;
          done = true;
          router.replace("/login");
        }, 8000);

        // cleanup
        return () => sub?.subscription?.unsubscribe?.();
      } catch (e) {
        console.error("Callback error:", e);
        router.replace("/login");
      }
    };

    const cleanupPromise = finish();

    return () => {
      done = true;
      // if finish returned a cleanup function, call it
      if (typeof cleanupPromise === "function") cleanupPromise();
    };
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
