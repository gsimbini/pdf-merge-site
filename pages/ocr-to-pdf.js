// pages/ocr-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function OcrToPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState('');
  const [preview, setPreview] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleOcr() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const pdfjsLib = window.pdfjsLib;
    const Tesseract = window.Tesseract;
    const jspdf = window.jspdf;

    if (!pdfjsLib) {
      setMessage('PDF engine is still loading. Please wait and try again.');
      return;
    }
    if (!Tesseract) {
      setMessage('OCR engine is still loading. Please wait and try again.');
      return;
    }
    if (!jspdf) {
      setMessage('PDF generator is still loading. Please wait and try again.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading PDF and running OCR…');

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const totalPages = pdf.numPages;
      let fullText = '';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgress(`Rendering page ${pageNum} of ${totalPages}…`);

        const page = await pdf.getPage(pageNum);
        const scale = 2; // higher = better quality OCR but slower
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

        setProgress(`Running OCR on page ${pageNum} of ${totalPages}…`);

        const result = await Tesseract.recognize(canvas, 'eng', {
          logger: (m) => {
            if (m.status && m.progress != null) {
              const pct = Math.round(m.progress * 100);
              setProgress(
                `Page ${pageNum}/${totalPages}: ${m.status} (${pct}%)`
              );
            }
          },
        });

        const pageText = (result.data && result.data.text) || '';
        fullText += `\n\n----- Page ${pageNum} -----\n\n${pageText}`;
      }

      const trimmed = fullText.trim();
      const previewText =
        trimmed.length > 2000 ? trimmed.slice(0, 2000) + '…' : trimmed;
      setPreview(
        previewText || '(OCR completed, but no readable text was detected.)'
      );

      const { jsPDF } = jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = 14;

      const content =
        trimmed ||
        'OCR completed, but no readable text was detected in this file.';

      const lines = doc.splitTextToSize(content, maxWidth);
      let y = margin;

      lines.forEach((line, idx) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');

      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      a.href = url;
      a.download = `${baseName}-ocr.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! OCR ran on ${totalPages} page(s). A text-only searchable PDF has been downloaded.`
      );
      setProgress('');
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while running OCR on this PDF. Very large or complex documents can cause issues.'
      );
      setProgress('');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>OCR to PDF (Searchable) - PDFFusion</title>
        <meta
          name="description"
          content="Run OCR on a scanned PDF and create a text-only searchable PDF, directly in your browser."
        />
        {/* PDF.js */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          integrity="sha512-tUEqXV2XNY0FTqLL0yxhiYzz0maDCpp1FDZVPBUl49SABLQUeak5ZrdlJVS8cpJbWilUoM1AXW+R9e32XbvA+Q=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        {/* Tesseract.js for OCR */}
        <script
          src="https://unpkg.com/tesseract.js@v4.0.2/dist/tesseract.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        {/* jsPDF for PDF generation */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">PF</span>
            <div>
              <h1>PDFFusion</h1>
              <p className="tagline">Free &amp; private online PDF tools</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/ocr-to-pdf">OCR to PDF</Link>
            <Link href="/extract-text">Extract text</Link>
            <Link href="/pdf-to-word">PDF to Word</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>OCR to PDF (Searchable)</h2>
            <p>
              Turn a scanned or image-based PDF into a text-only searchable PDF.
              This runs entirely in your browser using OCR, so it can be slower on
              large files.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Limitations: This basic OCR only supports English by default, does
              not keep the visual layout, and may struggle with low-quality scans.
            </div>

            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setFile(f);
                  setMessage(`Selected: ${f.name} (${formatBytes(f.size)})`);
                }
              }}
              onClick={() =>
                document.getElementById('ocr-to-pdf-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your scanned PDF here, or click
                to choose.
              </p>
              <input
                id="ocr-to-pdf-input"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setMessage(
                      `Selected: ${f.name} (${formatBytes(f.size)})`
                    );
                  }
                }}
              />
              {file && (
                <ul className="file-list">
                  <li>{file.name}</li>
                </ul>
              )}
            </div>

            <button
              className="primary-btn"
              onClick={handleOcr}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Running OCR…' : 'Run OCR and download PDF'}
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

            {preview && (
              <div
                className="upload-box"
                style={{ marginTop: '1rem', maxHeight: '240px', overflow: 'auto' }}
              >
                <strong>Preview (first part of OCR text):</strong>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {preview}
                </pre>
              </div>
            )}

            <div className="ad-slot" style={{ marginTop: '1rem' }}>
              <strong>Ad slot:</strong> Place a banner or AdSense block here.
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} PDFFusion. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
