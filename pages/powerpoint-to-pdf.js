'use client';  // ← ADD THIS AT THE VERY TOP

// pages/powerpoint-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";


export default function PowerPointToPdfPage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  function handleFiles(selectedList) {
    if (!selectedList || !selectedList.length) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const valid = Array.from(selectedList).filter((f) => {
      if (!allowed.includes(f.type)) return false;
      return true;
    });

    if (!valid.length) {
      setMessage(
        'Please select slide images (JPG, PNG or WEBP). Export your PowerPoint slides as images first.'
      );
      return;
    }

    setFiles(valid);
    const totalSize = valid.reduce((sum, f) => sum + f.size, 0);
    setMessage(
      `Selected ${valid.length} slide image(s), total ${formatBytes(
        totalSize
      )}. They will be used in this order.`
    );
  }

  async function handleConvert() {
    if (!files.length) {
      setMessage('Please select slide images first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const PDFLib = window.PDFLib;
    if (!PDFLib) {
      setMessage(
        'PDF engine is still loading. Please wait a moment and try again.'
      );
      return;
    }

    const { PDFDocument } = PDFLib;

    try {
      setProcessing(true);
      setMessage('Building your slide PDF…');

      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();

        let img;
        if (file.type === 'image/png' || file.type === 'image/webp') {
          img = await pdfDoc.embedPng(bytes);
        } else {
          img = await pdfDoc.embedJpg(bytes);
        }

        // Get image size and make the page match it
        const { width, height } = img.size();

        const page = pdfDoc.addPage([width, height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();

      const baseName =
        files[0]?.name.replace(/\.[^.]+$/, '') || 'powerpoint-slides';
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-slides.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Created a PDF with ${files.length} slide page(s). It should be downloading now.`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while converting the slide images to a PDF.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PowerPoint to PDF (images) - SimbaPDF</title>
        <meta
          name="description"
          content="Turn exported PowerPoint slide images into a PDF, directly in your browser."
        />
      
      </Head>

      <div className="page">
        {/* Header */}
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
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        {/* Main */}
        <main className="main">
          <section className="tool-section">
            <h2>PowerPoint to PDF (slide images)</h2>
            <p>
              Export your PowerPoint slides as images (JPG/PNG), upload them in
              order, and get a clean PDF where each slide becomes a full-page
              image. Everything happens in your browser for better privacy.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              <strong>How to use:</strong>
              <ol style={{ marginTop: '0.4rem', paddingLeft: '1.2rem' }}>
                <li>
                  In PowerPoint, use <em>File &gt; Export &gt; Change File
                  Type</em> or <em>Save As</em> and choose <strong>PNG</strong>{' '}
                  or <strong>JPG</strong>.
                </li>
                <li>Export all slides — they will be numbered (Slide1, 2, 3…).</li>
                <li>Drag those images here in the correct order.</li>
                <li>Click convert, and download your PDF.</li>
              </ol>
            </div>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div
  className="upload-box dropzone"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith('.pptx')) {
      setFile(f);
      setMessage(`Selected: ${f.name}`);
    } else if (f) {
      setMessage('Please upload a valid .pptx file.');
    }
  }}
  onClick={() => document.getElementById('ppt-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PowerPoint file here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="ppt-file-input"
    type="file"
    accept=".pptx"
    style={{ display: 'none' }}
    onChange={(e) => {
      const f = e.target.files?.[0];
      if (f) setFile(f);
    }}
  />
</div>

<div style={{ marginTop: '1.5rem' }}>
  <button
    type="button"
    className="secondary-btn"
    onClick={() => document.getElementById('ppt-file-input')?.click()}
    style={{
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#f0f0f0',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    📊 Choose PowerPoint File
  </button>
</div>

{file && (
  <div style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#333' }}>
    <strong>Selected:</strong> {file.name} ({formatBytes(file.size)})
  </div>
)}

            <button
              className="primary-btn"
              onClick={handleConvert}
              disabled={!files.length || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing
                ? 'Converting slides to PDF…'
                : 'Convert slides to PDF and download'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

           <AdBanner slot="8164173850" />
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
