// pages/_app.js
import Script from "next/script";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        id="adsbygoogle-loader"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9212010274013202"
        crossOrigin="anonymous"
      />
      <Component {...pageProps} />
    </>
  );
}
