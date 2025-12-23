'use client';  // ← ADD THIS AT THE VERY TOP

// pages/pdf-to-images.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function PdfToImagesPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  // Helper to wrap canvas.toBlob in a Promise
  function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.92) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
          } else {
            resolve(blob);
          }
        },
        type,
        quality
      );
    });
  }

  async function handleConvert() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const pdfjsLib = window.pdfjsLib;
    const JSZip = window.JSZip;

    if (!pdfjsLib) {
      setMessage('PDF engine is still loading. Please wait and try again.');
      return;
    }
    if (!JSZip) {
      setMessage('ZIP engine is still loading. Please wait and try again.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading PDF…');

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const totalPages = pdf.numPages;
      const zip = new JSZip();

      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgress(`Rendering page ${pageNum} of ${totalPages}…`);

        const page = await pdf.getPage(pageNum);

        const scale = 2; // Change for higher/lower resolution
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        await renderTask.promise;

        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
        const arrayBufferImage = await blob.arrayBuffer();

        const filename = `${baseName}-page-${pageNum}.jpg`;
        zip.file(filename, arrayBufferImage);
      }

      setProgress('Building ZIP file…');

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-pages.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Exported ${totalPages} page(s) as JPG images inside a ZIP file.`
      );
      setProgress('');
    } catch (err) {
      console.error(err);
      setMessage(
        'Something went wrong while converting pages. Very large or complex PDFs can sometimes cause issues in the browser.'
      );
      setProgress('');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PDF to Images (All Pages to ZIP) - SimbaPDF</title>
        <meta
          name="description"
          content="Convert every page of your PDF into JPG images and download them all together as a ZIP file."
        />
        {/* PDF.js from CDN */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          integrity="sha512-tUEqXV2XNY0FTqLL0yxhiYzz0maDCpp1FDZVPBUl49SABLQUeak5ZrdlJVS8cpJbWilUoM1AXW+R9e32XbvA+Q=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        {/* JSZip from CDN */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
          integrity="sha512-SZC4+Qo3EFR7LEuM04vPLxax3MEYsI9AQ2iJTWPT0oys6WDY5wrIacwBrSrU2AHuC2cHJ4Ruqp3T5p8U4HH1pg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
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
            <h2>PDF to Images (All pages → ZIP)</h2>
            <p>
              Convert every page in your PDF into a separate JPG image and
              download them together as a ZIP file. All in your browser – no
              files uploaded to a server.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Tip: For very large PDFs with many pages, this might take a bit
              longer and use more memory in your browser.
            </div>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

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
  onClick={() => document.getElementById('pdf-to-images-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="pdf-to-images-file-input"
    type="file"
    accept="application/pdf"
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
    onClick={() => document.getElementById('pdf-to-images-file-input')?.click()}
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
              onClick={handleConvert}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing
                ? 'Converting all pages…'
                : 'Convert all pages to images (ZIP)'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

            {progress && (
              <p className="hint" style={{ marginTop: '0.25rem' }}>
                {progress}
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
