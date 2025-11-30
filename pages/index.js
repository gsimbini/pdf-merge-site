// pages/index.js
import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>PDFFusion – Free Online PDF Tools</title>
        <meta
          name="description"
          content="PDFFusion offers free, private, in-browser PDF tools: merge, split, compress, convert images, watermark, sign, organize, crop, extract text, and more."
        />
      </Head>

      <div className="page">
        {/* Header */}
        <header className="header">
          <div className="brand">
            <span className="logo-circle">PF</span>
            <div>
              <h1>PDFFusion</h1>
              <p className="tagline">Free &amp; private online PDF tools</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/jpg-to-pdf">JPG to PDF</Link>
            <Link href="/png-to-pdf">PNG to PDF</Link>
          </nav>
        </header>

        {/* Hero section */}
        <main className="main">
          <section className="hero">
            <h2>Work with your PDFs directly in your browser</h2>
            <p>
              No uploads to a server. All tools run in your browser for better
              privacy. Merge, split, compress, convert and secure your PDFs with
              one simple interface.
            </p>
          </section>

          {/* Tools grid */}
          <section className="tool-section">
            <h3>Popular PDF tools</h3>
            <div className="tool-grid">
              {/* Merge / Split / Compress */}
              <Link href="/merge-pdf" className="tool-card">
                <h4>Merge PDF</h4>
                <p>Combine multiple PDFs into a single document.</p>
              </Link>

              <Link href="/split-pdf" className="tool-card">
                <h4>Split PDF</h4>
                <p>Extract specific pages or ranges into a new PDF.</p>
              </Link>

              <Link href="/compress-pdf" className="tool-card">
                <h4>Compress PDF</h4>
                <p>Reduce the file size of your PDF.</p>
              </Link>

              {/* Rotate / Organize / Crop */}
              <Link href="/rotate-pdf" className="tool-card">
                <h4>Rotate PDF</h4>
                <p>Rotate pages or fix upside-down scans.</p>
              </Link>

              <Link href="/organize-pdf" className="tool-card">
                <h4>Organize PDF</h4>
                <p>Reorder, remove or duplicate pages by choosing an order.</p>
              </Link>

              <Link href="/crop-pdf" className="tool-card">
                <h4>Crop PDF</h4>
                <p>Trim margins and crop all pages at once.</p>
              </Link>

              {/* Page numbers / Watermark / Sign */}
              <Link href="/page-numbers" className="tool-card">
                <h4>Add page numbers</h4>
                <p>Add page numbers to all pages or a single page.</p>
              </Link>

              <Link href="/watermark-pdf" className="tool-card">
                <h4>Watermark PDF</h4>
                <p>Add CONFIDENTIAL or DRAFT watermarks to every page.</p>
              </Link>

              <Link href="/sign-pdf" className="tool-card">
                <h4>Sign PDF</h4>
                <p>Add a typed signature and date to a chosen page.</p>
              </Link>

              {/* Image ↔ PDF tools */}
              <Link href="/jpg-to-pdf" className="tool-card">
                <h4>JPG to PDF</h4>
                <p>Turn one or more JPG images into a single PDF.</p>
              </Link>

              <Link href="/png-to-pdf" className="tool-card">
                <h4>PNG to PDF</h4>
                <p>Convert PNG images into a multi-page PDF.</p>
              </Link>

              <Link href="/pdf-to-png" className="tool-card">
                <h4>PDF to PNG</h4>
                <p>Export a single PDF page as a PNG image.</p>
              </Link>

              <Link href="/pdf-to-excel" className="tool-card">
                <h4>PDF to Excel (text)</h4>
                <p>Extract PDF text into Excel with one row per line and page number.</p>
              </Link>

              <Link href="/ocr-to-pdf" className="tool-card">
  <h4>OCR to PDF</h4>
  <p>Run OCR on a scanned PDF and create a text-only searchable PDF.</p>
</Link>


              <Link href="/pdf-to-word" className="tool-card">
                <h4>PDF to Word (text)</h4>
                <p>Extract the text from a PDF and download it as a simple Word document.</p>
              </Link>


              <Link href="/pdf-to-jpg" className="tool-card">
                <h4>PDF to JPG</h4>
                <p>Export a single PDF page as a JPG image.</p>
              </Link>

              {/* Security / text tools */}
              <Link href="/protect-pdf" className="tool-card">
                <h4>Protect PDF</h4>
                <p>Add visible protection labels and watermark (soft protection).</p>
              </Link>

              <Link href="/unlock-pdf" className="tool-card">
                <h4>Unlock PDF</h4>
                <p>
                  Re-save PDFs you already have access to. Does not crack passwords.
                </p>
              </Link>

              <Link href="/extract-text" className="tool-card">
                <h4>Extract text from PDF</h4>
                <p>
                  Pull out plain text from your PDF and download it as a .txt file.
                </p>
              </Link>
            </div>
          </section>

          {/* Monetization hint */}
          <section className="tool-section">
            <h3>How PDFFusion works</h3>
            <p className="hint">
              Most tools run entirely in your browser using JavaScript, so your
              PDFs don&apos;t leave your device. This is great for privacy and
              lets you later monetise with ads or premium features without
              storing user files.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} PDFFusion. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
