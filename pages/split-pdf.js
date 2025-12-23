// pages/split-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function SplitPdfPage() {
  const [file, setFile] = useState(null);
  const [pagesSpec, setPagesSpec] = useState('1-3');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  function parsePagesSpec(spec, totalPages) {
    // spec examples: "1-3", "1-3,5,7-9"
    const parts = spec
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const indexes = new Set();

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((p) => p.trim());
        const start = Number(startStr);
        const end = Number(endStr);
        if (
          Number.isInteger(start) &&
          Number.isInteger(end) &&
          start >= 1 &&
          end >= start
        ) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) {
              indexes.add(i - 1); // 0-based
            }
          }
        }
      } else {
        const num = Number(part);
        if (
          Number.isInteger(num) &&
          num >= 1 &&
          num <= totalPages
        ) {
          indexes.add(num - 1); // 0-based
        }
      }
    }

    return Array.from(indexes).sort((a, b) => a - b);
  }

  async function handleSplit() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading PDF…');

      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const totalPages = originalPdf.getPageCount();

      const selectedIndexes = parsePagesSpec(pagesSpec, totalPages);

      if (selectedIndexes.length === 0) {
        setMessage(
          `No valid pages selected. Your PDF has ${totalPages} page(s). Example: "1-3,5".`
        );
        setProcessing(false);
        return;
      }

      setMessage(
        `Extracting ${selectedIndexes.length} page(s) out of ${totalPages}…`
      );

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, selectedIndexes);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const safeSpec = pagesSpec.replace(/[^0-9, -]/g, '').replace(/\s+/g, '');
      a.download = `split-${safeSpec || 'pages'}-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage('Done! Check your downloads for the split PDF.');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while splitting the PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Split PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Split a PDF and extract selected pages into a new document."
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
            <h2>Split PDF / Extract Pages</h2>
            <p>
              Choose which pages you want to keep and download a new PDF with
              only those pages.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="option-row">
              <label htmlFor="pages-spec">
                <strong>Pages to extract:</strong>
              </label>
              <input
                id="pages-spec"
                type="text"
                value={pagesSpec}
                onChange={(e) => setPagesSpec(e.target.value)}
                placeholder='e.g. 1-3,5,7-9'
                className="text-input"
              />
            </div>
            <p className="hint">
              Use page numbers starting from 1. Examples: <code>1-3</code>,{' '}
              <code>2,5,8</code>, or <code>1-3,5,7-9</code>.
            </p>

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
  onClick={() => document.getElementById('split-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="split-file-input"
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
    onClick={() => document.getElementById('split-file-input')?.click()}
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
              onClick={handleSplit}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Split and Download'}
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
