'use client';  // ← ADD THIS AT THE VERY TOP

// pages/extract-text.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import ProBadge from "../components/ProBadge";


export default function ExtractTextPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleExtract() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) {
      setMessage(
        'PDF engine is still loading. Please wait a moment and try again.'
      );
      return;
    }

    try {
      setProcessing(true);
      setMessage('Extracting text from PDF… This may take a moment.');

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        const pageText = strings.join(' ');

        fullText += `\n\n----- Page ${pageNum} -----\n\n${pageText}`;
      }

      const trimmed = fullText.trim();
      setPreview(trimmed || '(No extractable text found in this PDF.)');

      // Download as .txt
      const blob = new Blob(
        [trimmed || 'No extractable text found in this PDF.'],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';

      a.href = url;
      a.download = `${baseName}-extracted-text.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Extracted text from ${pdf.numPages} page(s). A .txt file has been downloaded.`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        'Something went wrong while extracting text. Scanned PDFs that are just images need OCR.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Extract Text from PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Extract plain text from a PDF file directly in your browser, and download it as a .txt file."
        />
        {/* PDF.js from CDN */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          crossOrigin="anonymous"
        ></script>
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Fast • Free • Secure PDF tools</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/extract-text">Extract text</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Extract Text from PDF</h2>
            <p>
              Pull out the plain text from your PDF directly in your browser.
              Works best on PDFs that contain real text (not scanned images).
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Note: If your PDF is a scanned document (only images), this tool
              won&apos;t see any text. For those, you need OCR.
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
  onClick={() => document.getElementById('extract-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="extract-file-input"
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
    onClick={() => document.getElementById('extract-file-input')?.click()}
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
              onClick={handleExtract}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing
                ? 'Extracting text…'
                : 'Extract text and download .txt file'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

            {preview && (
              <div
                className="upload-box"
                style={{
                  marginTop: '1rem',
                  maxHeight: '260px',
                  overflow: 'auto',
                }}
              >
                <strong>Preview:</strong>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {preview}
                </pre>
              </div>
            )}
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
