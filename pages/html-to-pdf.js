// pages/html-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function HtmlToPdfPage() {
  const [htmlInput, setHtmlInput] = useState(
    `<h1 style="text-align:center;">Hello from SimbaPDF</h1>
<p>This is a simple example of <strong>HTML to PDF</strong>.</p>
<ul>
  <li>You can use headings, paragraphs and lists.</li>
  <li>Basic inline styles are supported in this preview.</li>
</ul>`
  );
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const previewRef = useRef(null);

  async function handleConvert() {
    if (!htmlInput.trim()) {
      setMessage('Please enter some HTML to convert.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const html2canvas = window.html2canvas;
    const jspdf = window.jspdf;

    if (!html2canvas) {
      setMessage('HTML engine is still loading. Please wait a moment and try again.');
      return;
    }
    if (!jspdf) {
      setMessage('PDF engine is still loading. Please wait a moment and try again.');
      return;
    }

    const previewEl = previewRef.current;
    if (!previewEl) {
      setMessage('Preview area not found.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Rendering HTML and building PDF…');

      // Use html2canvas to render the preview box as an image
      const canvas = await html2canvas(previewEl, {
        scale: 2, // higher = sharper but bigger
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');

      const { jsPDF } = jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const renderWidth = imgWidth * ratio;
      const renderHeight = imgHeight * ratio;

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);

      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'html-to-pdf.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage('Done! Your HTML has been converted to a PDF. Check your downloads.');
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while converting HTML to PDF. Very large or complex content can cause issues in the browser.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>HTML to PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Convert simple HTML content into a PDF directly in your browser using SimbaPDF."
        />
        {/* html2canvas for rendering HTML to canvas */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        {/* jsPDF for creating the PDF */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js"
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
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/html-to-pdf">HTML to PDF</Link>
            <Link href="/pdf-to-word">PDF to Word</Link>
            <Link href="/word-to-pdf">Word to PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>HTML to PDF</h2>
            <p>
              Paste simple HTML below, see a live preview, and convert it into a PDF.
              Great for basic documents, letters, and simple formatted content.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Note: This basic version captures the preview as an image inside a
              PDF. Very long content will be scaled to fit a single page. For
              multi-page, fully responsive layout you&apos;d need a server-side
              HTML-to-PDF engine.
            </div>

            <div className="option-row" style={{ flexDirection: 'column' }}>
              <label htmlFor="html-input">
                <strong>HTML input:</strong>
              </label>
              <textarea
                id="html-input"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className="text-input"
                style={{
                  minHeight: '160px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem',
                }}
                placeholder="<h1>Your title</h1><p>Your content here...</p>"
              />
            </div>

            <div
  className="upload-box dropzone"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && (f.name.endsWith('.html') || f.name.endsWith('.htm'))) {
      setFile(f);
      setMessage(`Selected: ${f.name}`);
    } else if (f) {
      setMessage('Please upload a valid HTML file.');
    }
  }}
  onClick={() => document.getElementById('html-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your HTML file here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="html-file-input"
    type="file"
    accept=".html,.htm"
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
    onClick={() => document.getElementById('html-file-input')?.click()}
    style={{
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#f0f0f0',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    🌐 Choose HTML File
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
              disabled={processing || !htmlInput.trim()}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Converting…' : 'Convert HTML to PDF and download'}
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
