// components/AdBanner.js
import { useEffect, useRef } from "react";
import useProStatus from "./useProStatus";

export default function AdBanner({ slot }) {
  const { isPro } = useProStatus();
  const pushedRef = useRef(false);

  // No slot → nothing
  if (!slot) {
    return null;
  }

  // While pro status is still loading (null = initial state), show a placeholder
  // to keep layout consistent and prevent hydration mismatch
  if (isPro === null) {
    return (
      <div style={{ width: "100%", margin: "1rem 0", minHeight: "90px" }} />
    );
  }

  // Pro user → completely hide ads
  if (isPro) {
    return null;
  }

  // Free user → load and show the ad (only on client)
  useEffect(() => {
    if (pushedRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (e) {
      console.warn("AdSense push ignored:", e);
    }
  }, []);

  const client = "ca-pub-9212010274013202";

  return (
    <div style={{ width: "100%", margin: "1rem 0", minHeight: "90px", textAlign: "center" }}>
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