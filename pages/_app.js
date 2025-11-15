import '../styles/globals.css';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Global AdSense script - replace ca-pub-XXXXXXXXXXXX with your ID */}
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9212010274013202"
        crossOrigin="anonymous"
      />
      <Component {...pageProps} />
    </>
  );
}

