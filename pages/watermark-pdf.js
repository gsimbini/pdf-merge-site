// pages/watermark-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function WatermarkPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [position, setPosition] = useState('center'); // center | top | bottom
  const [style, setStyle] = useState('diagonal'); // diagonal | normal

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleWatermark() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    const text = watermarkText.trim();
    if (!text) {
      setMessage('Watermark text cannot be empty.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Adding watermark to PDF…');

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      pages.forEach((page) => {
        const { width, height } = page.getSize();

        let fontSize;
        let opacity;
        let rotate;
        let x;
        let y;

        if (style === 'diagonal') {
          // Big, faint diagonal watermark across the page
          fontSize = Math.min(width, height) / 5; // scale with page
          opacity = 0.15;
          rotate = degrees(-45);
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const textHeight = fontSize;
          x = (width - textWidth) / 2;
          y = (height - textHeight) / 2;
        } else {
          // Normal smaller footer/header watermark
          fontSize = 12;
          opacity = 0.4;
          rotate = degrees(0);
          const textWidth = font.widthOfTextAtSize(text, fontSize);

          if (position === 'top') {
            x = (width - textWidth) / 2;
            y = height - 30;
          } else if (position === 'bottom') {
            x = (width - textWidth) / 2;
            y = 20;
          } else {
            // center
            x = (width - textWidth) / 2;
            y = height / 2;
          }
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.8, 0.1, 0.1), // light red
          opacity,
          rotate,
        });
      });

      const newBytes = await pdfDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage('Done! Check your downloads for the watermarked PDF.');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while adding the watermark.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Watermark PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Add a text watermark like CONFIDENTIAL or DRAFT to all pages in your PDF."
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
            <Link href="/watermark-pdf">Watermark PDF</Link>
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Watermark PDF</h2>
            <p>
              Add a text watermark like &quot;CONFIDENTIAL&quot; or
              &quot;DRAFT&quot; to every page in your PDF.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="option-row">
              <label htmlFor="wm-text">
                <strong>Watermark text:</strong>
              </label>
              <input
                id="wm-text"
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="text-input"
                placeholder='e.g. CONFIDENTIAL'
              />
            </div>

            <div className="option-row">
              <label>
                <strong>Style:</strong>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="style"
                    value="diagonal"
                    checked={style === 'diagonal'}
                    onChange={() => setStyle('diagonal')}
                    style={{ marginRight: '0.4rem' }}
                  />
                  Big diagonal (faint)
                </label>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="style"
                    value="normal"
                    checked={style === 'normal'}
                    onChange={() => setStyle('normal')}
                    style={{ marginRight: '0.4rem' }}
                  />
                  Normal text
                </label>
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
                    value="center"
                    checked={position === 'center'}
                    onChange={() => setPosition('center')}
                    style={{ marginRight: '0.4rem' }}
                    disabled={style === 'diagonal'}
                  />
                  Center
                </label>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="position"
                    value="top"
                    checked={position === 'top'}
                    onChange={() => setPosition('top')}
                    style={{ marginRight: '0.4rem' }}
                    disabled={style === 'diagonal'}
                  />
                  Top
                </label>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="position"
                    value="bottom"
                    checked={position === 'bottom'}
                    onChange={() => setPosition('bottom')}
                    style={{ marginRight: '0.4rem' }}
                    disabled={style === 'diagonal'}
                  />
                  Bottom
                </label>
              </div>
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
                document
                  .getElementById('watermark-file-input')
                  ?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="watermark-file-input"
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
              onClick={handleWatermark}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Add watermark and download'}
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
