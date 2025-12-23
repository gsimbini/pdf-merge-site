'use client';  // ← ADD THIS AT THE VERY TOP

// pages/crop-pdf.js

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function CropPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  // margins in millimetres
  const [topMm, setTopMm] = useState(10);
  const [bottomMm, setBottomMm] = useState(10);
  const [leftMm, setLeftMm] = useState(10);
  const [rightMm, setRightMm] = useState(10);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  function mmToPoints(mm) {
    // 1 inch = 25.4 mm, 1 inch = 72 points → 72 / 25.4
    return (mm * 72) / 25.4;
  }

  async function handleCrop() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    const t = Number(topMm);
    const b = Number(bottomMm);
    const l = Number(leftMm);
    const r = Number(rightMm);

    if ([t, b, l, r].some((v) => isNaN(v) || v < 0)) {
      setMessage('Margins must be zero or positive numbers.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading PDF and applying crop…');

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();

        const top = mmToPoints(t);
        const bottom = mmToPoints(b);
        const left = mmToPoints(l);
        const right = mmToPoints(r);

        let newWidth = width - left - right;
        let newHeight = height - top - bottom;

        // Ensure we don't go negative or zero
        if (newWidth < 10) newWidth = 10;
        if (newHeight < 10) newHeight = 10;

        const x = left;
        const y = bottom;

        // Crop box defines the visible area
        if (page.setCropBox) {
          page.setCropBox(x, y, newWidth, newHeight);
        }

        // Also adjust media box so page size changes to the cropped area
        if (page.setMediaBox) {
          page.setMediaBox(x, y, newWidth, newHeight);
        }
      });

      const newBytes = await pdfDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `cropped-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        'Done! Check your downloads for the cropped PDF.'
      );
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while cropping the PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Crop PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Crop margins from all pages in your PDF."
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
            <Link href="/crop-pdf">Crop PDF</Link>
            <Link href="/organize-pdf">Organize PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Crop PDF</h2>
            <p>
              Remove margins from all pages in your PDF by specifying how much
              to crop from each side (in millimetres).
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="option-row">
              <label>
                <strong>Margins (mm):</strong>
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto auto auto',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem' }}>Top</div>
                  <input
                    type="number"
                    min="0"
                    value={topMm}
                    onChange={(e) => setTopMm(e.target.value)}
                    className="text-input"
                    style={{ maxWidth: '80px' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem' }}>Bottom</div>
                  <input
                    type="number"
                    min="0"
                    value={bottomMm}
                    onChange={(e) => setBottomMm(e.target.value)}
                    className="text-input"
                    style={{ maxWidth: '80px' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem' }}>Left</div>
                  <input
                    type="number"
                    min="0"
                    value={leftMm}
                    onChange={(e) => setLeftMm(e.target.value)}
                    className="text-input"
                    style={{ maxWidth: '80px' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem' }}>Right</div>
                  <input
                    type="number"
                    min="0"
                    value={rightMm}
                    onChange={(e) => setRightMm(e.target.value)}
                    className="text-input"
                    style={{ maxWidth: '80px' }}
                  />
                </div>
              </div>
            </div>
            <p className="hint">
              Tip: Start with small values like 5–15 mm, check the result, then
              adjust if needed.
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
      setStats(null);
    } else if (f) {
      setMessage('Please upload a valid PDF file.');
    }
  }}
  onClick={() => document.getElementById('crop-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="crop-file-input"
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

<div style={{ marginTop: '1.5rem' }}>
  <button
    type="button"
    className="secondary-btn"
    onClick={() => document.getElementById('crop-file-input')?.click()}
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
              onClick={handleCrop}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Crop and download'}
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
