// pages/compress-pdf.js

'use client';  // ← ADD THIS AT THE VERY TOP

import Head from 'next/head';
import AdBanner from '../components/AdBanner';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ProBadge from "../components/ProBadge";


export default function CompressPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleCompress() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading and optimizing PDF…');
      setStats(null);

      const originalSize = file.size;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      const newSize = compressedBytes.length;
      const diff = originalSize - newSize;
      const percent =
        originalSize > 0 ? (diff / originalSize) * 100 : 0;

      setStats({
        originalSize,
        newSize,
        percent,
      });

      const blob = new Blob([compressedBytes], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (diff > 0) {
        setMessage(
          `Done! Saved about ${percent.toFixed(
            1
          )}% (${formatBytes(diff)}). Check your downloads for the compressed PDF.`
        );
      } else if (diff < 0) {
        setMessage(
          `Done! The new file is slightly larger (this can happen with some PDFs). Check your downloads for the optimized PDF.`
        );
      } else {
        setMessage(
          'Done! Size is about the same. Some PDFs are already highly optimized.'
        );
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while compressing the PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Compress PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Compress PDF files online and reduce their size for easier sharing."
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
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/split-pdf">Split PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Compress PDF</h2>
            <p>
              Reduce the size of your PDF so it&apos;s easier to email, upload
              and share. This tool performs safe, in-browser optimization.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
            <AdBanner slot="2169503342" />

            <div className="upload-container" style={{ textAlign: 'center', margin: '2rem 0' }}>
  {/* Drag & Drop Zone */}
  <div
    className="upload-box dropzone"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f && f.type === 'application/pdf') {
        setFile(f);
        setMessage(`Selected: ${f.name}`);
        setStats(null);
      } else if (f) {
        setMessage('Please upload a valid PDF file.');
      }
    }}
    onClick={() => document.getElementById('compress-file-input')?.click()}
  >
    <p>
      <strong>Drag & drop</strong> your PDF here
      <br />
      <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
    </p>

    {/* Hidden file input */}
    <input
      id="compress-file-input"
      type="file"
      accept="application/pdf"
      style={{ display: 'none' }}
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) {
          setFile(f);
          setMessage(`Selected: ${f.name}`);
          setStats(null);
        }
      }}
    />
  </div>

  {/* Optional: Extra visible "Upload" button below the box */}
  <div style={{ marginTop: '1.5rem' }}>
    <button
      type="button"
      className="secondary-btn"
      onClick={() => document.getElementById('compress-file-input')?.click()}
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

  {/* Show selected file */}
  {file && (
    <div style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#333' }}>
      <strong>Selected:</strong> {file.name} ({formatBytes(file.size)})
    </div>
  )}
</div>

{/* Compress Button */}
<button
  className="primary-btn"
  onClick={handleCompress}
  disabled={!file || processing}
  style={{ marginTop: '1.5rem', padding: '1rem 2rem', fontSize: '1.1rem' }}
>
  {processing ? 'Compressing…' : 'Compress and Download PDF'}
</button>

            {stats && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                Original size: <strong>{formatBytes(stats.originalSize)}</strong>
                {' · '}
                New size:{' '}
                <strong>{formatBytes(stats.newSize)}</strong>
                {stats.percent > 0
                  ? ` · Saved ~${stats.percent.toFixed(1)}%`
                  : stats.percent < 0
                  ? ` · New file is slightly larger`
                  : ` · No change in size`}
              </p>
            )}

            {message && (
              <p className="hint" style={{ marginTop: '0.5rem' }}>
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
