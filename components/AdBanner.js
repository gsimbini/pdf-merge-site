// components/AdBanner.js
import { useEffect, useState } from "react";
import Script from "next/script";
import useProStatus from "./useProStatus";

export default function AdBanner({ slot }) {
  const [mounted, setMounted] = useState(false);
  const { isPro } = useProStatus();

  const client = "ca-pub-9212010274013202";

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Hooks must be before any conditional returns
  useEffect(() => {
    if (!mounted) return;
    if (isPro) return;
    if (!slot) return;
    if (typeof window === "undefined") return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore
    }
  }, [mounted, isPro, slot]);

  // ✅ Now safe to return conditionally
  if (!mounted || isPro || !slot) return null;

  return (
    <div style={{ width: "100%", margin: "1rem 0", minHeight: "90px" }}>
      <Script
        id="adsbygoogle-loader"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />

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
