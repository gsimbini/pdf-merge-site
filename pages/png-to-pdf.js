'use client';  // ← ADD THIS AT THE VERY TOP

// pages/png-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function PngToPdfPage() {
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

  function handleFilesSelected(fileList) {
    const arr = Array.from(fileList || []);
    const pngOnly = arr.filter((f) => f.type === 'image/png');
    setFiles(pngOnly);
    if (pngOnly.length) {
      const totalSize = pngOnly.reduce((sum, f) => sum + f.size, 0);
      setMessage(
        `Selected ${pngOnly.length} PNG image(s), total size ${formatBytes(
          totalSize
        )}.`
      );
    } else {
      setMessage('No PNG files selected. Please choose PNG images.');
    }
  }

  async function handleConvert() {
    if (!files.length) {
      setMessage('Please select at least one PNG image.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Building PDF from PNG images…');

      const pdfDoc = await PDFDocument.create();

      // A4-ish page size (portrait)
      const pageWidth = 595;
      const pageHeight = 842;

      for (const file of files) {
        if (file.type !== 'image/png') {
          continue;
        }

        const arrayBuffer = await file.arrayBuffer();
        const image = await pdfDoc.embedPng(arrayBuffer);

        const imgWidth = image.width;
        const imgHeight = image.height;

        const widthScale = pageWidth / imgWidth;
        const heightScale = pageHeight / imgHeight;
        const scale = Math.min(widthScale, heightScale);

        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download =
        files.length === 1
          ? `${files[0].name.replace(/\.png$/i, '')}.pdf`
          : `png-images-to-pdf.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Converted ${files.length} PNG image(s) to PDF. Check your downloads.`
      );
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while converting PNG to PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PNG to PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Convert one or multiple PNG images to a single multi-page PDF document."
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
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>PNG to PDF</h2>
            <p>
              Turn one or more PNG images into a single PDF. Each PNG becomes its
              own page, centered and scaled to fit.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div
  className="upload-box dropzone"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'image/png');
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      setMessage(`Added ${newFiles.length} PNG(s)`);
    } else {
      setMessage('Please upload valid PNG files.');
    }
  }}
  onClick={() => document.getElementById('png-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> PNG images here (multiple allowed)
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="png-file-input"
    type="file"
    accept="image/png"
    multiple
    style={{ display: 'none' }}
    onChange={(e) => {
      const newFiles = Array.from(e.target.files || []);
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
      }
    }}
  />
</div>

<div style={{ marginTop: '1.5rem' }}>
  <button
    type="button"
    className="secondary-btn"
    onClick={() => document.getElementById('png-file-input')?.click()}
    style={{
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#f0f0f0',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    🖼️ Choose PNG Files
  </button>
</div>

{files && files.length > 0 && (
  <div style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#333' }}>
    <strong>Selected:</strong> {files.length} PNG(s)
  </div>
)}

            <button
              className="primary-btn"
              onClick={handleConvert}
              disabled={!files.length || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Convert to PDF and download'}
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
