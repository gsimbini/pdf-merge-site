// components/AdBanner.js
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
// import useProStatus from "./useProStatus";   // re-enable later

export default function AdBanner({ slot }) {
  const router = useRouter();

  // ✅ Show ads ONLY on homepage for now
  if (router.pathname !== "/") return null;

  // No slot → nothing
  if (!slot) return null;

  // TEMPORARY: Force free user mode (ads always show)
  const isPro = false; // replace with useProStatus later
  if (isPro) return null;

  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch (e) {
      console.warn("AdSense push ignored:", e);
    }
  }, []);

  const client = "ca-pub-9212010274013202";

  return (
    <div style={{ width: "100%", margin: "1.5rem 0", minHeight: 250, textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
