// pages/pdf-to-png.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function PdfToPngPage() {
  const [file, setFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
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

    const pageNum = parseInt(pageNumber, 10);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      setMessage('Page number must be a whole number starting from 1.');
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
      setMessage('Rendering PDF page to PNG…');

      // Set worker source for PDF.js (must match the CDN version)
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      if (pageNum > pdf.numPages) {
        setMessage(
          `This PDF only has ${pdf.numPages} page(s). Please choose a page between 1 and ${pdf.numPages}.`
        );
        setProcessing(false);
        return;
      }

      const page = await pdf.getPage(pageNum);

      // Viewport scale controls the resolution (2 = good quality)
      const scale = 2;
      const viewport = page.getViewport({ scale });

      // Create an offscreen canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderTask = page.render({
        canvasContext: context,
        viewport,
      });

      await renderTask.promise;

      // Convert canvas to PNG blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setMessage('Failed to create PNG image from this page.');
            setProcessing(false);
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;

          const baseName = file.name.replace(/\.pdf$/i, '');
          a.download = `${baseName}-page-${pageNum}.png`;

          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);

          setMessage(
            `Done! Exported page ${pageNum} to PNG. Check your downloads.`
          );
          setProcessing(false);
        },
        'image/png',
        1.0
      );
    } catch (err) {
      console.error(err);
      setMessage(
        'Something went wrong while converting this page. Some PDFs use features that are hard to render in the browser.'
      );
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PDF to PNG (Single Page) - PDFFusion</title>
        <meta
          name="description"
          content="Export a single page from a PDF as a PNG image directly in your browser."
        />
        {/* PDF.js from CDN */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          integrity="sha512-tUEqXV2XNY0FTqLL0yxhiYzz0maDCpp1FDZVPBUl49SABLQUeak5ZrdlJVS8cpJbWilUoM1AXW+R9e32XbvA+Q=="
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
            <Link href="/pdf-to-png">PDF to PNG</Link>
            <Link href="/jpg-to-pdf">JPG to PDF</Link>
            <Link href="/png-to-pdf">PNG to PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>PDF to PNG (Single Page)</h2>
            <p>
              Export a single page from your PDF as a PNG image. Choose the page
              number, and this tool will render that page into a high-quality PNG.
            </p>

            <div className="option-row">
              <label htmlFor="page-number">
                <strong>Page number:</strong>
              </label>
              <input
                id="page-number"
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                className="text-input"
                style={{ maxWidth: '90px' }}
              />
            </div>
            <p className="hint">
              Page numbers start at 1. If your PDF has 5 pages, you can choose any
              page from 1 to 5.
            </p>

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
                document.getElementById('pdf-to-png-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="pdf-to-png-input"
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
              {processing ? 'Processing…' : 'Convert page to PNG and download'}
            </button>

            {message && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                {message}
              </p>
            )}

            <div className="ad-slot">
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
