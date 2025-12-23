'use client';  // ← ADD THIS AT THE VERY TOP

// pages/pdf-to-powerpoint.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function PdfToPowerPointPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState([]);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  // Basic helper: split long text into shorter lines (~80 chars)
  function splitIntoLines(text, maxLen = 80) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = '';

    for (const word of words) {
      if (!word) continue;
      if ((current + ' ' + word).trim().length > maxLen) {
        if (current.trim()) lines.push(current.trim());
        current = word;
      } else {
        current = (current + ' ' + word).trim();
      }
    }
    if (current.trim()) lines.push(current.trim());
    return lines;
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
    const PptxGenJS = window.PptxGenJS;

    if (!pdfjsLib) {
      setMessage(
        'PDF engine is still loading. Please wait a moment and try again.'
      );
      return;
    }
    if (!PptxGenJS) {
      setMessage(
        'PowerPoint engine is still loading. Please wait a moment and try again.'
      );
      return;
    }

    try {
      setProcessing(true);
      setMessage('Reading PDF and building PowerPoint slides…');

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const totalPages = pdf.numPages;
      const pptx = new PptxGenJS();

      const pagePreviews = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const fullText = content.items.map((it) => it.str).join(' ');
        const cleaned = fullText.replace(/\s+/g, ' ').trim();

        const lines = splitIntoLines(
          cleaned || `(No text extracted on page ${pageNum})`,
          80
        );

        if (pageNum <= 3) {
          pagePreviews.push({
            page: pageNum,
            lines: lines.slice(0, 5),
          });
        }

        const slide = pptx.addSlide();
        slide.addText(`Page ${pageNum}`, {
          x: 0.5,
          y: 0.5,
          fontSize: 20,
          bold: true,
        });

        slide.addText(lines, {
          x: 0.5,
          y: 1.0,
          w: 9.0,
          h: 4.5,
          fontSize: 16,
          color: '363636',
          bullet: true,
        });
      }

      setPreview(pagePreviews);

      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      await pptx.writeFile({
        fileName: `${baseName}-from-pdf.pptx`,
      });

      setMessage(
        `Done! Created a PowerPoint with ${totalPages} slide(s). Each page became one slide.`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while converting this PDF to PowerPoint.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PDF to PowerPoint (text slides) - SimbaPDF</title>
        <meta
          name="description"
          content="Convert a PDF into a simple PowerPoint file where each page becomes a text slide, directly in your browser."
        />
        {/* PDF.js */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          integrity="sha512-tUEqXV2XNY0FTqLL0yxhiYzz0maDCpp1FDZVPBUl49SABLQUeak5ZrdlJVS8cpJbWilUoM1AXW+R9e32XbvA+Q=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        {/* PptxGenJS for PPTX creation */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/PptxGenJS/3.10.0/pptxgen.bundle.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
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

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        {/* Main */}
        <main className="main">
          <section className="tool-section">
            <h2>PDF to PowerPoint (text slides)</h2>
            <p>
              Convert each page of your PDF into a simple slide in a PowerPoint
              (.pptx) file. This browser-only version focuses on text, not exact
              layout or images.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Works best with PDFs that contain selectable text. Scanned PDFs
              (images) should be processed with OCR first using the &quot;OCR
              to PDF&quot; tool, then converted here.
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
  onClick={() => document.getElementById('pdf-to-powerpoint-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="pdf-to-powerpoint-file-input"
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
    onClick={() => document.getElementById('pdf-to-powerpoint-file-input')?.click()}
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
                ? 'Converting PDF to PowerPoint…'
                : 'Convert to PowerPoint and download'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

            {preview.length > 0 && (
              <div
                className="upload-box"
                style={{
                  marginTop: '1rem',
                  maxHeight: '240px',
                  overflow: 'auto',
                }}
              >
                <strong>Preview (first pages → slides):</strong>
                <ul
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    lineHeight: '1.3rem',
                  }}
                >
                  {preview.map((p) => (
                    <li key={p.page} style={{ marginBottom: '0.5rem' }}>
                      <strong>Page {p.page}:</strong>
                      <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                        {p.lines.map((ln, idx) => (
                          <li key={idx}>{ln}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
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
