// components/AdBanner.js
import { useEffect, useRef } from "react";
// import useProStatus from "./useProStatus";   // ← COMMENTED OUT temporarily

export default function AdBanner({ slot }) {
  // TEMPORARY: Force free user mode (ads always show)
  // Remove or comment out the real hook above and use this:
  const isPro = false;   // ← FORCES ads to show for testing

  const pushedRef = useRef(false);

  // No slot → nothing
  if (!slot) {
    return null;
  }

  // TEMPORARY: Skip the loading placeholder check
  // We no longer wait for isPro === null

  // TEMPORARY: Skip Pro user hide
  // if (isPro) return null;   // ← COMMENTED OUT so ads show even if Pro

  // Load the ad on client (only once)
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
    <div style={{ width: "100%", margin: "1.5rem 0", minHeight: "250px", textAlign: "center" }}>
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