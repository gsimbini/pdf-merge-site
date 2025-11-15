import Head from 'next/head';
import Link from 'next/link';

export default function SplitPdfPage() {
  return (
    <>
      <Head>
        <title>Split PDF - PDFFusion</title>
        <meta
          name="description"
          content="Split a PDF file into multiple documents. Placeholder page for future implementation."
        />
      </Head>
      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">PF</span>
            <div>
              <h1>PDFFusion</h1>
              <p className="tagline">Split PDF (coming soon)</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/compress-pdf">Compress PDF</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Split PDF (Coming Soon)</h2>
            <p>
              This page is a placeholder for your future PDF splitting tool.
              You can integrate a PDF processing library or API once you are
              ready to expand your feature set.
            </p>
            <div className="ad-slot">
              <strong>Ad slot:</strong> Place a banner or AdSense block here.
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} PDFFusion. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
