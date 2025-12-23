// pages/organize-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function OrganizePdfPage() {
  const [file, setFile] = useState(null);
  const [orderSpec, setOrderSpec] = useState('1-3');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  // Parse something like "3,1,2,5-7" into page indexes [2,0,1,4,5,6] (0-based)
  function parseOrderSpec(spec, totalPages) {
    const parts = spec
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const indexes = [];

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
              indexes.push(i - 1); // 0-based
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
          indexes.push(num - 1); // 0-based
        }
      }
    }

    return indexes;
  }

  async function handleOrganize() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading PDF…');

      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const totalPages = originalPdf.getPageCount();
      const indexes = parseOrderSpec(orderSpec, totalPages);

      if (indexes.length === 0) {
        setMessage(
          `No valid pages selected. Your PDF has ${totalPages} page(s). Example: "3,1,2" or "1-3,5-6".`
        );
        setProcessing(false);
        return;
      }

      setMessage(
        `Reordering to ${indexes.length} page(s) from ${totalPages}…`
      );

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(originalPdf, indexes);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const safeSpec = orderSpec.replace(/[^0-9, -]/g, '').replace(/\s+/g, '');
      a.download = `organized-${safeSpec || 'pages'}-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        'Done! Check your downloads for the reorganised PDF.'
      );
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while organizing the PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Organize PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Reorder, remove or duplicate pages in your PDF by choosing the exact page order."
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
            <Link href="/organize-pdf">Organize PDF</Link>
            <Link href="/split-pdf">Split PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Organize PDF</h2>
            <p>
              Change the order of pages in your PDF, remove pages or duplicate them
              by choosing the desired page order.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="option-row">
              <label htmlFor="order-spec">
                <strong>Page order:</strong>
              </label>
              <input
                id="order-spec"
                type="text"
                value={orderSpec}
                onChange={(e) => setOrderSpec(e.target.value)}
                placeholder='e.g. 3,1,2,5-7'
                className="text-input"
              />
            </div>
            <p className="hint">
              Use page numbers starting from 1. Examples: <code>3,1,2</code> (reorder
              first three pages), <code>1-3,5-7</code>, or <code>2,2,4</code> (duplicate page 2).
              Pages not listed will be removed.
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
  onClick={() => document.getElementById('organize-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="organize-file-input"
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
    onClick={() => document.getElementById('organize-file-input')?.click()}
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
              onClick={handleOrganize}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Reorder and download'}
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
