// pages/pdf-to-powerpoint.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';


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
        <title>PDF to PowerPoint (text slides) - PDFFusion</title>
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
            <span className="logo-circle">PF</span>
            <div>
              <h1>PDFFusion</h1>
              <p className="tagline">Free &amp; private online PDF tools</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/pdf-to-powerpoint">PDF to PowerPoint</Link>
            <Link href="/pdf-to-word">PDF to Word</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

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
                document.getElementById('pdf-to-powerpoint-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="pdf-to-powerpoint-input"
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

            <div className="ad-slot">
                          <strong><AdBanner /></strong> Place a banner or AdSense block here.
                        </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} PDFFusion. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
