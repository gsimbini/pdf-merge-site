// pages/compress-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function CompressPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleCompress() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Loading and optimizing PDF…');
      setStats(null);

      const originalSize = file.size;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      const newSize = compressedBytes.length;
      const diff = originalSize - newSize;
      const percent =
        originalSize > 0 ? (diff / originalSize) * 100 : 0;

      setStats({
        originalSize,
        newSize,
        percent,
      });

      const blob = new Blob([compressedBytes], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (diff > 0) {
        setMessage(
          `Done! Saved about ${percent.toFixed(
            1
          )}% (${formatBytes(diff)}). Check your downloads for the compressed PDF.`
        );
      } else if (diff < 0) {
        setMessage(
          `Done! The new file is slightly larger (this can happen with some PDFs). Check your downloads for the optimized PDF.`
        );
      } else {
        setMessage(
          'Done! Size is about the same. Some PDFs are already highly optimized.'
        );
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while compressing the PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Compress PDF - PDFFusion</title>
        <meta
          name="description"
          content="Compress PDF files online and reduce their size for easier sharing."
        />
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
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/split-pdf">Split PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Compress PDF</h2>
            <p>
              Reduce the size of your PDF so it&apos;s easier to email, upload
              and share. This tool performs safe, in-browser optimization.
            </p>

            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setFile(f);
                  setMessage(`Selected: ${f.name}`);
                  setStats(null);
                }
              }}
              onClick={() =>
                document.getElementById('compress-file-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="compress-file-input"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    setMessage(`Selected: ${f.name}`);
                    setStats(null);
                  }
                }}
              />
              {file && (
                <ul className="file-list">
                  <li>
                    {file.name} ({formatBytes(file.size)})
                  </li>
                </ul>
              )}
            </div>

            <button
              className="primary-btn"
              onClick={handleCompress}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Compress and Download'}
            </button>

            {stats && (
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                Original size: <strong>{formatBytes(stats.originalSize)}</strong>
                {' · '}
                New size:{' '}
                <strong>{formatBytes(stats.newSize)}</strong>
                {stats.percent > 0
                  ? ` · Saved ~${stats.percent.toFixed(1)}%`
                  : stats.percent < 0
                  ? ` · New file is slightly larger`
                  : ` · No change in size`}
              </p>
            )}

            {message && (
              <p className="hint" style={{ marginTop: '0.5rem' }}>
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
