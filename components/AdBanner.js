// components/AdBanner.js
import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import useProStatus from "./useProStatus";

export default function AdBanner({ slot }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("simbapdf_email") : "";
    if (saved) setEmail(saved);
  }, []);

  const { isPro } = useProStatus(email);

  // If Pro is active → hide ads completely
  if (isPro) return null;

  const client = "ca-pub-9212010274013202";
  const key = useMemo(() => `${slot}-${email || "anon"}`, [slot, email]);

  return (
    <div style={{ width: "100%", margin: "1rem 0" }}>
      <Script
        id="adsbygoogle-init"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />

      <ins
        key={key}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      <Script id={`adsbygoogle-push-${slot}-${key}`} strategy="afterInteractive">
        {`
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            // ignore duplicate push errors
          }
        `}
      </Script>
    </div>
  );
}
