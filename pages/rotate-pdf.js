// pages/rotate-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function RotatePdfPage() {
  const [file, setFile] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleRotate() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    try {
      setDownloading(true);
      setMessage('Rotating pages…');

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Rotate every page by 90 degrees clockwise
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle || 0;
        page.setRotation(degrees(currentRotation + 90));
      });

      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `rotated-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage('Done! Check your downloads for the rotated PDF.');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while rotating the PDF.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Rotate PDF - PDFFusion</title>
        <meta
          name="description"
          content="Rotate pages in your PDF document by 90 degrees."
        />
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
            <Link href="/split-pdf">Split PDF</Link>
            <Link href="/rotate-pdf">Rotate PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Rotate PDF</h2>
            <p>Rotate all pages in your PDF by 90° clockwise.</p>

            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setFile(f);
                  setMessage(`Selected: ${f.name}`);
                }
              }}
              onClick={() =>
                document.getElementById('rotate-file-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="rotate-file-input"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setMessage(`Selected: ${f.name}`);
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
              onClick={handleRotate}
              disabled={!file || downloading}
              style={{ marginTop: '1rem' }}
            >
              {downloading ? 'Processing…' : 'Rotate and Download'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

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
