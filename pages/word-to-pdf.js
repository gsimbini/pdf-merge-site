// pages/word-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';


export default function WordToPdfPage() {
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

  async function extractTextFromFile(selectedFile) {
    const name = selectedFile.name.toLowerCase();
    const ext = name.split('.').pop();

    if (ext === 'txt') {
      // Simple text file
      return await selectedFile.text();
    }

    if (ext === 'docx') {
      if (typeof window === 'undefined') {
        throw new Error('This feature only works in a browser.');
      }
      const mammoth = window.mammoth;
      if (!mammoth) {
        throw new Error('Word engine is still loading. Please wait and try again.');
      }

      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || '';
    }

    throw new Error('Only .docx and .txt files are supported in this basic version.');
  }

  async function handleConvert() {
    if (!file) {
      setMessage('Please select a Word (.docx) or .txt file first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const jspdf = window.jspdf;
    if (!jspdf) {
      setMessage('PDF engine is still loading. Please wait a moment and try again.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Reading document and generating PDF…');

      const text = (await extractTextFromFile(file)) || '';
      const trimmed = text.trim();
      const previewText =
        trimmed.length > 2000 ? trimmed.slice(0, 2000) + '…' : trimmed;

      setPreview(previewText || '(No text found in this document.)');

      const { jsPDF } = jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = 14;

      const content =
        trimmed || 'No text could be extracted from this file (might be empty or unsupported).';

      const lines = doc.splitTextToSize(content, maxWidth);
      let y = margin;

      lines.forEach((line) => {
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

      const baseName =
        file.name.replace(/\.(docx|doc|txt)$/i, '') || 'document';
      a.href = url;
      a.download = `${baseName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        'Done! Created a simple text-based PDF from your document. Open it to review the content.'
      );
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Something went wrong while converting this file.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Word to PDF (Text only) - PDFFusion</title>
        <meta
          name="description"
          content="Convert a Word (.docx) or text (.txt) file to a simple text-based PDF directly in your browser."
        />
        {/* Mammoth.js for DOCX parsing */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.11.0/mammoth.browser.min.js"
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
            <Link href="/pdf-to-word">PDF to Word</Link>
            <Link href="/word-to-pdf">Word to PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Word to PDF (text-only)</h2>
            <p>
              Convert a Word document (.docx) or text file (.txt) into a simple
              text-based PDF. Layout and images are not preserved in this basic
              browser-only version.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Tip: This is great for getting the text into PDF quickly. For
              perfect formatting and images, you&apos;ll need a desktop app or a
              future &quot;Pro&quot; server-side converter.
            </div>

            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setFile(f);
                  setMessage(
                    `Selected: ${f.name} (${formatBytes(f.size)})`
                  );
                }
              }}
              onClick={() =>
                document.getElementById('word-to-pdf-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your Word (.docx) or .txt file
                here, or click to choose.
              </p>
              <input
                id="word-to-pdf-input"
                type="file"
                accept=".docx,.txt"
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
                ? 'Converting document to PDF…'
                : 'Convert to PDF and download'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

            {preview && (
              <div
                className="upload-box"
                style={{ marginTop: '1rem', maxHeight: '240px', overflow: 'auto' }}
              >
                <strong>Preview (first part of extracted text):</strong>
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

            <AdBanner slot="8164173850" />
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} PDFFusion. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
 