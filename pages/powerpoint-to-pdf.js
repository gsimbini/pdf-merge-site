'use client';

// pages/powerpoint-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from '../components/ProBadge';

export default function PowerPointToPdfPage() {
  const [files, setFiles] = useState([]); // Array of image files (slides)
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  // Format file size
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  // Handle selected or dropped files
  function handleFiles(selectedList) {
    if (!selectedList || selectedList.length === 0) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const valid = Array.from(selectedList).filter((f) => allowed.includes(f.type));

    if (valid.length === 0) {
      setMessage(
        'No valid slide images found. Please select JPG, PNG or WEBP files (export your PowerPoint slides as images first).'
      );
      setFiles([]);
      return;
    }

    setFiles(valid);
    const totalSize = valid.reduce((sum, f) => sum + f.size, 0);
    setMessage(
      `Selected ${valid.length} slide image(s) — total ${formatBytes(totalSize)}. They will be used in this order.`
    );
  }

  async function handleConvert() {
    if (files.length === 0) {
      setMessage('Please select slide images first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const PDFLib = window.PDFLib;
    if (!PDFLib) {
      setMessage('PDF engine is still loading. Please wait a moment and try again.');
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

        const { width, height } = img.scale(1); // Get original dimensions

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
        files[0]?.name.replace(/\.[^/.]+$/, '') || 'powerpoint-slides';
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
        `Done! Created a PDF with ${files.length} slide page(s). Download should start now.`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while converting the slide images to PDF. Try with fewer or smaller images.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PowerPoint to PDF (slide images) - SimbaPDF</title>
        <meta
          name="description"
          content="Export your PowerPoint slides as images and convert them to a clean PDF — all in your browser."
        />
        {/* PDFLib CDN — needed for client-side PDF creation */}
        <script
          src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"
          crossOrigin="anonymous"
        ></script>
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

        <div style={{ marginTop: '0.75rem' }}>
          <ProBadge />
        </div>

        {/* Main */}
        <main className="main">
          <section className="tool-section">
            <h2>PowerPoint to PDF (slide images)</h2>
            <p>
              Export your PowerPoint slides as images (JPG/PNG/WEBP), upload them in order, and get a clean PDF with one slide per page.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              <strong>How to use:</strong>
              <ol style={{ marginTop: '0.4rem', paddingLeft: '1.2rem' }}>
                <li>In PowerPoint → File → Export → Change File Type → PNG or JPG.</li>
                <li>Save all slides (they will be numbered automatically).</li>
                <li>Drag or select those images here in the correct order.</li>
                <li>Click convert and download your PDF.</li>
              </ol>
            </div>

            {/* Top ad */}
            <AdBanner slot="2169503342" />

            {/* Upload box — now accepts multiple images */}
            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById('ppt-images-input')?.click()}
            >
              <p>
                <strong>Drag & drop</strong> your slide images here (multiple allowed)
                <br />
                <span style={{ fontSize: '0.9em', color: '#666' }}>
                  or click to browse (JPG, PNG, WEBP)
                </span>
              </p>

              <input
                id="ppt-images-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => document.getElementById('ppt-images-input')?.click()}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#f0f0f0',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                🖼️ Choose Slide Images
              </button>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#333' }}>
                <strong>Selected:</strong> {files.length} slide image(s)
              </div>
            )}

            <button
              className="primary-btn"
              onClick={handleConvert}
              disabled={files.length === 0 || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Converting slides to PDF…' : 'Convert to PDF and download'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>{message}</p>
            )}

            {/* Bottom ad */}
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