// components/AdBanner.js
import { useEffect, useRef } from "react";

export default function AdBanner({ slot }) {
  const adRef = useRef(null);
  const initializedRef = useRef(false); // prevent multiple push() calls

  useEffect(() => {
    // SSR / no DOM
    if (typeof window === "undefined") return;
    if (!adRef.current) return;
    if (initializedRef.current) return; // already initialized this ad

    const pushAd = () => {
      try {
        if (!adRef.current || initializedRef.current) return;

        const width = adRef.current.offsetWidth;
        // If width is 0, don't try yet
        if (!width || width === 0) {
          // Try once more after a short delay
          setTimeout(() => {
            try {
              if (
                adRef.current &&
                !initializedRef.current &&
                adRef.current.offsetWidth > 0
              ) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                initializedRef.current = true;
              }
            } catch (err) {
              console.error("AdSense retry error:", err);
            }
          }, 500);
          return;
        }

        // Normal case: width > 0 and not initialized yet
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initializedRef.current = true;
      } catch (err) {
        console.error("AdSense error:", err);
      }
    };

    pushAd();
  }, []);

  return (
    <div className="ad-container">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          width: "100%",
        }}
        data-ad-client="ca-pub-9212010274013202"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
