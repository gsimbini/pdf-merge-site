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

      <section className="tools-grid">
  <h3>All tools</h3>
  <div className="grid">
    <Link href="/merge-pdf" className="tool-card"><h4>Merge PDF</h4><p>Combine PDFs into one.</p></Link>
    <Link href="/split-pdf" className="tool-card"><h4>Split PDF</h4><p>Split by pages.</p></Link>
    <Link href="/compress-pdf" className="tool-card"><h4>Compress PDF</h4><p>Reduce file size.</p></Link>
    <Link href="/pdf-to-word" className="tool-card"><h4>PDF to Word</h4><p>Convert to editable DOCX.</p></Link>
    <Link href="/word-to-pdf" className="tool-card"><h4>Word to PDF</h4><p>Save documents as PDF.</p></Link>
    <Link href="/jpg-to-pdf" className="tool-card"><h4>JPG to PDF</h4><p>Turn images into a PDF.</p></Link>
    <Link href="/pdf-to-excel" className="tool-card"><h4>PDF to Excel</h4><p>Extract tables to XLSX.</p></Link>
    <Link href="/excel-to-pdf" className="tool-card"><h4>Excel to PDF</h4><p>Share spreadsheets as PDFs.</p></Link>
    <Link href="/pdf-to-powerpoint" className="tool-card"><h4>PDF to PowerPoint</h4><p>Convert slides.</p></Link>
    <Link href="/powerpoint-to-pdf" className="tool-card"><h4>PowerPoint to PDF</h4><p>Share decks as PDFs.</p></Link>
    <Link href="/protect-pdf" className="tool-card"><h4>Protect PDF</h4><p>Add passwords.</p></Link>
    <Link href="/unlock-pdf" className="tool-card"><h4>Unlock PDF</h4><p>Remove passwords (with rights).</p></Link>
    <Link href="/sign-pdf" className="tool-card"><h4>Sign PDF</h4><p>Add digital signatures.</p></Link>
    <Link href="/edit-pdf" className="tool-card"><h4>Edit PDF</h4><p>Edit content and annotations.</p></Link>
    <Link href="/organize-pdf" className="tool-card"><h4>Organize PDF</h4><p>Reorder and manage pages.</p></Link>
    <Link href="/watermark-pdf" className="tool-card"><h4>Watermark PDF</h4><p>Stamp documents.</p></Link>
    <Link href="/crop-pdf" className="tool-card"><h4>Crop PDF</h4><p>Trim margins.</p></Link>
    <Link href="/page-numbers" className="tool-card"><h4>Page numbers</h4><p>Add page numbering.</p></Link>
    <Link href="/ocr-to-pdf" className="tool-card"><h4>OCR to PDF</h4><p>Make scans searchable.</p></Link>
    <Link href="/repair-pdf" className="tool-card"><h4>Repair PDF</h4><p>Fix broken files.</p></Link>
    <Link href="/html-to-pdf" className="tool-card"><h4>HTML to PDF</h4><p>Save pages as PDF.</p></Link>
    <Link href="/pdf-to-pdfa" className="tool-card"><h4>PDF to PDF/A</h4><p>Archive-friendly format.</p></Link>
    <Link href="/rotate-pdf" className="tool-card"><h4>Rotate PDF</h4><p>Rotate pages.</p></Link>
  </div>
</section>


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
          <Link href="/pricing">Pricing</Link>
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
