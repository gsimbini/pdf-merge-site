'use client';

// pages/html-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
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
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false); // ← Add this
  const previewRef = useRef(null);

  // Only run after mount (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  const handleFileSelect = (f) => {
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => {
        setHtmlInput(e.target.result);
        setMessage(`Loaded: ${f.name}`);
      };
      reader.onerror = () => setMessage('Error reading file.');
      reader.readAsText(f);
    }
  };

  async function handleConvert() {
    // ... (your existing handleConvert function unchanged)
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

    if (!html2canvas || !jspdf) {
      setMessage('Engines are still loading. Please wait a moment.');
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

      const canvas = await html2canvas(previewEl, {
        scale: 2,
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

      setMessage('Done! Your PDF is downloading.');
    } catch (err) {
      console.error(err);
      setMessage('Error converting HTML to PDF. Try simpler content.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>HTML to PDF - SimbaPDF</title>
        <meta name="description" content="Convert simple HTML to PDF in your browser." />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" crossOrigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js" crossOrigin="anonymous"></script>
      </Head>

      <div className="page">
        {/* ... header unchanged ... */}

        <main className="main">
          <section className="tool-section">
            <h2>HTML to PDF</h2>
            <p>Paste simple HTML, see a live preview, and convert to PDF.</p>

            <AdBanner slot="2169503342" />

            <div className="option-row" style={{ flexDirection: 'column' }}>
              <label htmlFor="html-input"><strong>HTML input:</strong></label>
              <textarea
                id="html-input"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className="text-input"
                style={{ minHeight: '160px', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.5rem' }}
              />
            </div>

            {/* Live preview */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ccc', background: '#fff' }}>
              <strong>Preview:</strong>
              <div
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: htmlInput }}
                style={{ minHeight: '200px', marginTop: '0.5rem' }}
              />
            </div>

            {/* Upload box — only render after mount */}
            {mounted && (
              <>
                <div
                  className="upload-box dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f && (f.name.endsWith('.html') || f.name.endsWith('.htm'))) {
                      handleFileSelect(f);
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
                      if (f) handleFileSelect(f);
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
              </>
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
              <p className="hint" style={{ marginTop: '0.75rem' }}>{message}</p>
            )}

            <AdBanner slot="8164173850" />
          </section>
        </main>

        {/* footer */}
      </div>
    </>
  );
}