// pages/repair-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';


export default function RepairPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleRepair() {
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
      setMessage('PDF repair engine is still loading. Please wait and try again.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Trying to open and re-save your PDF…');

      const arrayBuffer = await file.arrayBuffer();

      let pdfDoc;

      try {
        // Try normal load first
        pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      } catch (e) {
        // If encrypted or slightly broken, try ignoring encryption
        pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });
      }

      // Optionally remove invalid / empty pages (very basic safety)
      const pageCount = pdfDoc.getPageCount();
      if (pageCount === 0) {
        throw new Error('No valid pages found in this PDF.');
      }

      const repairedBytes = await pdfDoc.save();

      const blob = new Blob([repairedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      a.href = url;
      a.download = `${baseName}-repaired.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! The PDF was opened and re-saved as a fresh file. Downloaded as "${baseName}-repaired.pdf".`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'This PDF is too damaged to repair in the browser. Some corrupted files can only be fixed with desktop tools.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Repair PDF - PDFFusion</title>
        <meta
          name="description"
          content="Try to repair a corrupted or problematic PDF by opening and re-saving it in your browser using PDFFusion."
        />
        {/* pdf-lib from CDN */}
        <script
          src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
      </Head>

      <div className="page">
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
            <Link href="/repair-pdf">Repair PDF</Link>
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Repair PDF</h2>
            <p>
              Try to repair a problematic PDF by opening it with a tolerant PDF
              engine and re-saving it as a fresh file. This can fix some
              structural issues, errors when opening, and certain &quot;damaged
              file&quot; warnings.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Note: This browser-based repair cannot fix every corruption. Very
              badly damaged files or partially downloaded PDFs may still fail.
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
                }
              }}
              onClick={() =>
                document.getElementById('repair-pdf-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="repair-pdf-input"
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
              onClick={handleRepair}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing
                ? 'Repairing PDF…'
                : 'Repair PDF and download new file'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

            <div className="ad-slot">
                          <strong><AdBanner /></strong> Place a banner or AdSense block here.
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
