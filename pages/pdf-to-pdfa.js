// pages/pdf-to-pdfa.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';


export default function PdfToPdfaPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleConvert() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const PDFLib = window.PDFLib;

    if (!PDFLib) {
      setMessage(
        'PDF engine is still loading. Please wait a moment and try again.'
      );
      return;
    }

    try {
      setProcessing(true);
      setMessage('Opening PDF and building an archival-style copy…');
      setDetails('');

      const arrayBuffer = await file.arrayBuffer();

      // Load original document, be tolerant of simple encryption
      let original;
      try {
        original = await PDFLib.PDFDocument.load(arrayBuffer);
      } catch (err) {
        original = await PDFLib.PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });
      }

      const pageCount = original.getPageCount();
      if (pageCount === 0) {
        throw new Error('No pages found in this PDF.');
      }

      const pdfDoc = await PDFLib.PDFDocument.create();

      // Copy all pages into a brand new document
      const indices = Array.from({ length: pageCount }, (_, i) => i);
      const copiedPages = await pdfDoc.copyPages(original, indices);
      copiedPages.forEach((p) => pdfDoc.addPage(p));

      // Basic archival-style metadata
      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      const now = new Date();

      pdfDoc.setTitle(`${baseName} (archival copy)`);
      pdfDoc.setSubject('Basic PDF/A-style archival copy created by PDFFusion');
      pdfDoc.setAuthor('');
      pdfDoc.setCreator('PDFFusion (browser tools)');
      pdfDoc.setProducer('PDFFusion – Browser-based PDF tools');
      pdfDoc.setCreationDate(now);
      pdfDoc.setModificationDate(now);
      pdfDoc.setKeywords(['PDF', 'PDFFusion', 'archival', 'PDF/A-like']);
      pdfDoc.setLanguage('en-ZA');

      // NOTE: This does NOT guarantee formal ISO PDF/A compliance.
      // It just creates a clean, re-saved document with metadata.

      const bytes = await pdfDoc.save();

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-pdfa.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Created an archival-style copy with ${pageCount} page(s). Downloaded as "${baseName}-pdfa.pdf".`
      );
      setDetails(
        'Note: This is a basic, browser-only PDF/A-style copy. It often works well for archiving, but is not guaranteed to pass strict PDF/A validators.'
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while creating the archival-style copy for this PDF.'
      );
      setDetails(
        'Very heavily corrupted, password-protected, or unusual PDFs may not be fixable fully in the browser.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PDF to PDF/A (basic archive) - PDFFusion</title>
        <meta
          name="description"
          content="Create a simple archival-style PDF copy (PDF/A-like) directly in your browser with PDFFusion."
        />
        {/* pdf-lib from CDN */}
        <script
          src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
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
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/pdf-to-pdfa">PDF to PDF/A</Link>
            <Link href="/repair-pdf">Repair PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        {/* Main */}
        <main className="main">
          <section className="tool-section">
            <h2>PDF to PDF/A (basic archival copy)</h2>
            <p>
              Create a simple archival-style copy of your PDF by copying its
              pages into a clean document and adding basic metadata. This is a
              browser-only, PDF/A-like conversion, ideal for simple long-term
              storage.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Important: This tool does <strong>not</strong> guarantee full ISO
              PDF/A compliance. For legal or regulator-required PDF/A, you
              should still test the output with a dedicated PDF/A validator or
              use professional desktop software.
            </div>

            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setFile(f);
                  setMessage(`Selected: ${f.name} (${formatBytes(f.size)})`);
                  setDetails('');
                }
              }}
              onClick={() =>
                document.getElementById('pdf-to-pdfa-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="pdf-to-pdfa-input"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setMessage(
                      `Selected: ${f.name} (${formatBytes(f.size)})`
                    );
                    setDetails('');
                  }
                }}
              />
              {file && (
                <ul className="file-list">
                  <li>{file.name}</li>
                </ul>
              )}
            </div>

            <button
              className="primary-btn"
              onClick={handleConvert}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing
                ? 'Creating archival-style copy…'
                : 'Convert to PDF/A-style copy and download'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

            {details && (
              <p className="hint" style={{ marginTop: '0.25rem' }}>
                {details}
              </p>
            )}

                        <div className="ad-slot">
                          <strong><AdBanner /></strong> Place a banner or AdSense block here.
                        </div>
            
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
