// components/AdBanner.js
import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import useProStatus from "./useProStatus";

export default function AdBanner({ slot }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("simbapdf_email") || "";
    if (saved) setEmail(saved);
  }, []);

  const { isPro } = useProStatus(email);

  // During SSR/build OR if Pro: render nothing
  if (!mounted || isPro) return null;

  const client = "ca-pub-9212010274013202";

  // Key makes sure each ad <ins> is unique per render
  const key = useMemo(() => `${slot}-${Date.now()}`, [slot]);

  return (
    <div style={{ width: "100%", margin: "1rem 0" }}>
      {/* Load Adsense script once */}
      <Script
        id="adsbygoogle-loader"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />

      {/* Ad slot */}
      <ins
        key={key}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* Push after interactive */}
      <Script id={`adsbygoogle-push-${slot}-${key}`} strategy="afterInteractive">
        {`
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {}
        `}
      </Script>
    </div>
  );
}
