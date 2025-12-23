// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Essential: Load AdSense script globally once */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9212010274013202"
          crossOrigin="anonymous"
        ></script>
        {/* Optional: Helps Google associate the account */}
        <meta name="google-adsense-account" content="ca-pub-9212010274013202" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}