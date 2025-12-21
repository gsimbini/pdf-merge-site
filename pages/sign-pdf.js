// pages/sign-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function SignPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const [signatureName, setSignatureName] = useState('');
  const [includeDate, setIncludeDate] = useState(true);
  const [mode, setMode] = useState('last'); // 'last' | 'single'
  const [targetPage, setTargetPage] = useState(1);
  const [position, setPosition] = useState('right'); // 'right' | 'left'

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  function getTodayString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async function handleSign() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    const sig = signatureName.trim();
    if (!sig) {
      setMessage('Please enter a signature name to place on the PDF.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading PDF and applying signature…');

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      let pageIndex = totalPages - 1; // default: last page

      if (mode === 'single') {
        const n = parseInt(targetPage, 10);
        if (
          !Number.isInteger(n) ||
          n < 1 ||
          n > totalPages
        ) {
          setMessage(
            `Target page must be a whole number between 1 and ${totalPages}.`
          );
          setProcessing(false);
          return;
        }
        pageIndex = n - 1; // 0-based
      }

      const page = pages[pageIndex];

      const font = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const fontSize = 14;
      const dateFontSize = 10;
      const marginX = 50;
      const marginY = 40;

      const { width } = page.getSize();
      const signatureLabel = sig;
      const dateLabel = includeDate ? `Date: ${getTodayString()}` : '';

      const sigWidth = font.widthOfTextAtSize(signatureLabel, fontSize);

      let x;
      if (position === 'right') {
        x = width - marginX - sigWidth;
      } else {
        // left
        x = marginX;
      }

      const y = marginY;

      // Draw signature
      page.drawText(signatureLabel, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });

      // Optional date just above the signature
      if (dateLabel) {
        const dateWidth = font.widthOfTextAtSize(dateLabel, dateFontSize);
        let dx;
        if (position === 'right') {
          dx = width - marginX - dateWidth;
        } else {
          dx = marginX;
        }

        page.drawText(dateLabel, {
          x: dx,
          y: y + fontSize + 4,
          size: dateFontSize,
          font,
          color: rgb(0.25, 0.25, 0.25),
        });
      }

      const newBytes = await pdfDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `signed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (mode === 'last') {
        setMessage(
          `Done! Applied signature to the last page (page ${totalPages}).`
        );
      } else {
        const n = parseInt(targetPage, 10);
        setMessage(
          `Done! Applied signature to page ${n}.`
        );
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while signing the PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sign PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Add a simple typed signature to a PDF on the last page or a specific page."
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
            <Link href="/sign-pdf">Sign PDF</Link>
            <Link href="/watermark-pdf">Watermark PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Sign PDF</h2>
            <p>
              Add a simple typed signature to your PDF. The signature will be
              placed near the bottom of the selected page.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="option-row">
              <label htmlFor="signature-name">
                <strong>Signature text:</strong>
              </label>
              <input
                id="signature-name"
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="text-input"
                placeholder='e.g. Mxolisi G. S. Simbini'
              />
            </div>

            <div className="option-row">
              <label>
                <strong>Apply to:</strong>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="mode"
                    value="last"
                    checked={mode === 'last'}
                    onChange={() => setMode('last')}
                    style={{ marginRight: '0.4rem' }}
                  />
                  Last page
                </label>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="mode"
                    value="single"
                    checked={mode === 'single'}
                    onChange={() => setMode('single')}
                    style={{ marginRight: '0.4rem' }}
                  />
                  Specific page:
                </label>
                {mode === 'single' && (
                  <input
                    type="number"
                    min="1"
                    value={targetPage}
                    onChange={(e) => setTargetPage(e.target.value)}
                    className="text-input"
                    style={{ maxWidth: '80px' }}
                  />
                )}
              </div>
            </div>

            <div className="option-row">
              <label>
                <strong>Position:</strong>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="position"
                    value="right"
                    checked={position === 'right'}
                    onChange={() => setPosition('right')}
                    style={{ marginRight: '0.4rem' }}
                  />
                  Bottom-right
                </label>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="position"
                    value="left"
                    checked={position === 'left'}
                    onChange={() => setPosition('left')}
                    style={{ marginRight: '0.4rem' }}
                  />
                  Bottom-left
                </label>
              </div>
            </div>

            <div className="option-row">
              <label htmlFor="include-date">
                <strong>Date:</strong>
              </label>
              <label style={{ fontSize: '0.9rem' }}>
                <input
                  id="include-date"
                  type="checkbox"
                  checked={includeDate}
                  onChange={(e) => setIncludeDate(e.target.checked)}
                  style={{ marginRight: '0.4rem' }}
                />
                Add today&apos;s date above the signature
              </label>
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
                document.getElementById('sign-file-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="sign-file-input"
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
              onClick={handleSign}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Sign and download'}
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
