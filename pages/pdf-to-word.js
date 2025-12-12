// pages/pdf-to-word.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function PdfToWordPage() {
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
    if (!pdfjsLib) {
      setMessage(
        'PDF engine is still loading. Please wait a moment and try again.'
      );
      return;
    }

    try {
      setProcessing(true);
      setMessage('Reading your PDF and creating a Word-compatible file…');

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

      const trimmed = fullText.trim() || 'No extractable text found in this PDF.';

      // Build a simple RTF (Word-compatible) document
      // Escape backslashes and braces for RTF
      const escaped = trimmed
        .replace(/\\/g, '\\\\')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}');

      const rtfContent = `{\\rtf1\\ansi\\deff0\n${escaped}\n}`;

      const blob = new Blob([rtfContent], {
        type: 'application/rtf;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      a.href = url;
      a.download = `${baseName}-from-pdf.rtf`; // opens in Word
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Extracted text from ${pdf.numPages} page(s) and created a Word-compatible (.rtf) file.`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        'Something went wrong while converting. Scanned PDFs that are just images need OCR.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PDF to Word (Text) - SimbaPDF</title>
        <meta
          name="description"
          content="Convert a PDF into a simple Word-compatible text document using your browser."
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
            <span className="logo-circle">SP</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Fast • Free • Secure PDF tools</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/extract-text">Extract text</Link>
            <Link href="/pdf-to-word">PDF to Word</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>PDF to Word (text-only)</h2>
            <p>
              Convert your PDF into a simple Word-compatible document (.rtf) with
              plain text. This works best on PDFs that contain real text, not
              just scanned images.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Note: This tool focuses on text only. Layout, images, and complex
              formatting will not be preserved.
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
                document.getElementById('pdf-to-word-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="pdf-to-word-input"
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
              onClick={handleConvert}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing
                ? 'Converting to Word…'
                : 'Convert to Word-compatible file (.rtf)'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
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
