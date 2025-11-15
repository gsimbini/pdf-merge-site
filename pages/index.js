import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>PDFFusion - Free PDF Tools</title>
        <meta
          name="description"
          content="Merge, compress and split PDF files for free. No registration, no watermark, secure and fast."
        />
      </Head>
      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">PF</span>
            <div>
              <h1>PDFFusion</h1>
              <p className="tagline">Free & private online PDF tools</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/split-pdf">Split PDF</Link>
          </nav>
        </header>

        <main className="main">
          <section className="hero">
            <h2>Merge PDFs in seconds. Free forever.</h2>
            <p>
              Combine multiple PDF documents into one file. No account required.
              Files are processed in memory and never stored on the server.
            </p>
            <Link href="/merge-pdf" className="primary-btn">
              Go to Merge PDF
            </Link>

            <div className="hero-note">
              <strong>Monetisation placeholder:</strong> Add your AdSense script
              or banner component here.
            </div>
          </section>

          <section className="tools-grid">
            <h3>Popular tools</h3>
            <div className="grid">
              <Link href="/merge-pdf" className="tool-card">
                <h4>Merge PDF</h4>
                <p>Combine multiple PDFs into a single, clean document.</p>
              </Link>
              <Link href="/compress-pdf" className="tool-card">
                <h4>Compress PDF</h4>
                <p>Reduce file size for faster uploads and email attachments.</p>
              </Link>
              <Link href="/split-pdf" className="tool-card">
                <h4>Split PDF</h4>
                <p>Extract selected pages into a brand new PDF file.</p>
              </Link>
            </div>
          </section>

          <section className="trust">
            <h3>Why PDFFusion?</h3>
            <ul>
              <li>No registration, no watermark</li>
              <li>Files handled in-memory for privacy (no disk storage)</li>
              <li>Optimised for mobile & desktop</li>
              <li>Built for high-traffic monetisation with ads & upgrades</li>
            </ul>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} PDFFusion. All rights reserved.</p>
          <p className="footer-links">
            <a href="#">Privacy Policy</a> · <a href="#">Terms of Use</a>
          </p>
        </footer>
      </div>
    </>
  );
}
