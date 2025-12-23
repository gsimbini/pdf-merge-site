// pages/page-numbers.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function PageNumbersPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [startingNumber, setStartingNumber] = useState(1);
  const [showOfTotal, setShowOfTotal] = useState(true);
  const [mode, setMode] = useState('all'); // 'all' | 'single'
  const [targetPage, setTargetPage] = useState(1);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleAddPageNumbers() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    const startNum = parseInt(startingNumber, 10);
    if (!Number.isInteger(startNum) || startNum < 1) {
      setMessage('Starting number must be a whole number (1, 2, 3…).');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading PDF and adding page numbers…');

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      let targetPageNum = 1;
      if (mode === 'single') {
        targetPageNum = parseInt(targetPage, 10);
        if (
          !Number.isInteger(targetPageNum) ||
          targetPageNum < 1 ||
          targetPageNum > totalPages
        ) {
          setMessage(
            `Target page must be between 1 and ${totalPages}.`
          );
          setProcessing(false);
          return;
        }
      }

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 10;
      const bottomMargin = 20;
      const rightMargin = 40;

      pages.forEach((page, index) => {
        const pageIndex1 = index + 1;

        // If we're in single-page mode, skip all other pages
        if (mode === 'single' && pageIndex1 !== targetPageNum) {
          return;
        }

        // What number to show on this page
        const pageNumber =
          mode === 'all' ? startNum + index : startNum;

        const label =
          showOfTotal && mode === 'all'
            ? `Page ${pageNumber} of ${startNum - 1 + totalPages}`
            : `Page ${pageNumber}`;

        const { width } = page.getSize();
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        const x = width - rightMargin - textWidth;
        const y = bottomMargin;

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: undefined, // default black
        });
      });

      const newBytes = await pdfDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Pure download version (no new tab)
      const a = document.createElement('a');
      a.href = url;
      a.download = `page-numbers-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (mode === 'all') {
        setMessage(
          `Done! Added page numbers to all pages starting from ${startNum}.`
        );
      } else {
        setMessage(
          `Done! Added page number ${startNum} only to page ${targetPageNum}.`
        );
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while adding page numbers.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Add Page Numbers to PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Add page numbers to your PDF document quickly and easily."
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
            <Link href="/page-numbers">Page numbers</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Add Page Numbers</h2>
            <p>
              Add page numbers to your PDF. You can number all pages or just a
              single page (for example, only page 1).
            </p>

          {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />
            <div className="option-row">
              <label htmlFor="starting-number">
                <strong>Number to add:</strong>
              </label>
              <input
                id="starting-number"
                type="number"
                min="1"
                value={startingNumber}
                onChange={(e) => setStartingNumber(e.target.value)}
                className="text-input"
                style={{ maxWidth: '100px' }}
              />
            </div>

            <div className="option-row">
              <label>
                <strong>Apply to:</strong>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="mode"
                    value="all"
                    checked={mode === 'all'}
                    onChange={() => setMode('all')}
                    style={{ marginRight: '0.4rem' }}
                  />
                  All pages
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
                  Only this page:
                </label>
                {mode === 'single' && (
                  <input
                    type="number"
                    min="1"
                    value={targetPage}
                    onChange={(e) => setTargetPage(e.target.value)}
                    className="text-input"
                    style={{ maxWidth: '90px' }}
                  />
                )}
              </div>
            </div>

            <div className="option-row">
              <label htmlFor="show-of-total">
                <strong>Format:</strong>
              </label>
              <div>
                <label style={{ fontSize: '0.9rem' }}>
                  <input
                    id="show-of-total"
                    type="checkbox"
                    checked={showOfTotal}
                    onChange={(e) => setShowOfTotal(e.target.checked)}
                    style={{ marginRight: '0.4rem' }}
                    disabled={mode === 'single'}
                  />
                  Show as &quot;Page X of Y&quot; (only for all pages)
                </label>
              </div>
            </div>

            <div
  className="upload-box dropzone"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setMessage(`Selected: ${f.name}`);
    } else if (f) {
      setMessage('Please upload a valid PDF file.');
    }
  }}
  onClick={() => document.getElementById('page-numbers-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="page-numbers-file-input"
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
</div>

<div style={{ marginTop: '1.5rem' }}>
  <button
    type="button"
    className="secondary-btn"
    onClick={() => document.getElementById('page-numbers-file-input')?.click()}
    style={{
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#f0f0f0',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    📄 Choose PDF File
  </button>
</div>

{file && (
  <div style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#333' }}>
    <strong>Selected:</strong> {file.name} ({formatBytes(file.size)})
  </div>
)}

            <button
              className="primary-btn"
              onClick={handleAddPageNumbers}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Add page numbers and download'}
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
