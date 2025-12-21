// pages/rotate-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function RotatePdfPage() {
  const [file, setFile] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState('');
  const [rotationMode, setRotationMode] = useState('90cw'); // 90cw | 90ccw | 180

  function getRotationDelta() {
    switch (rotationMode) {
      case '90cw':
        return 90;
      case '90ccw':
        return -90;
      case '180':
        return 180;
      default:
        return 90;
    }
  }

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
      const delta = getRotationDelta();

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle || 0;
        page.setRotation(degrees(currentRotation + delta));
      });

      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const suffix =
        rotationMode === '90cw'
          ? 'rotated-90cw-'
          : rotationMode === '90ccw'
          ? 'rotated-90ccw-'
          : 'rotated-180-';
      a.download = `${suffix}${file.name}`;
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
        <title>Rotate PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Rotate pages in your PDF document by 90° or 180°."
        />
      </Head>
      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
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

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Rotate PDF</h2>
            <p>
              Choose how you want to rotate your PDF, then download the updated
              file.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="option-row">
              <label htmlFor="rotation-mode">
                <strong>Rotation:</strong>
              </label>
              <select
                id="rotation-mode"
                value={rotationMode}
                onChange={(e) => setRotationMode(e.target.value)}
              >
                <option value="90cw">90° clockwise</option>
                <option value="90ccw">90° counter-clockwise</option>
                <option value="180">180° (upside down)</option>
              </select>
            </div>

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

            <AdBanner slot="8164173850" />
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
