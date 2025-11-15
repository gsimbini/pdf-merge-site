import Head from 'next/head';
import Link from 'next/link';

export default function CompressPdfPage() {
  return (
    <>
      <Head>
        <title>Compress PDF - PDFFusion</title>
        <meta
          name="description"
          content="Compress PDF files to reduce their size. Placeholder page for future implementation."
        />
      </Head>
      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">PF</span>
            <div>
              <h1>PDFFusion</h1>
              <p className="tagline">Compress PDF (coming soon)</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/split-pdf">Split PDF</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Compress PDF (Coming Soon)</h2>
            <p>
              This page is a placeholder for your future PDF compression tool.
              You can integrate a compression library or external API when
              you&apos;re ready.
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
