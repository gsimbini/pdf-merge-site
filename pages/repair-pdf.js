'use client';  // ← ADD THIS AT THE VERY TOP

// pages/repair-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



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
        <title>Repair PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Try to repair a corrupted or problematic PDF by opening and re-saving it in your browser using SimbaPDF."
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
            <Link href="/repair-pdf">Repair PDF</Link>
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Repair PDF</h2>
            <p>
              Try to repair a problematic PDF by opening it with a tolerant PDF
              engine and re-saving it as a fresh file. This can fix some
              structural issues, errors when opening, and certain &quot;damaged
              file&quot; warnings.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

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
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setMessage(`Selected: ${f.name}`);
    } else if (f) {
      setMessage('Please upload a valid PDF file.');
    }
  }}
  onClick={() => document.getElementById('repair-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="repair-file-input"
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
    onClick={() => document.getElementById('repair-file-input')?.click()}
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
