// pages/unlock-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function UnlockPdfPage() {
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

  async function handleUnlock() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Trying to open and re-save your PDF…');

      const arrayBuffer = await file.arrayBuffer();

      let pdfDoc;
      try {
        // ignoreEncryption lets us open some PDFs that are "restricted" but not strongly encrypted
        pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });
      } catch (err) {
        console.error('Load error:', err);
        setMessage(
          'This PDF is strongly encrypted or password-protected. This tool cannot crack or bypass passwords.'
        );
        setProcessing(false);
        return;
      }

      // Re-save as a fresh PDF – this can remove some simple restrictions
      const newBytes = await pdfDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `unlocked-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        'Done! If your PDF only had simple restrictions, the new copy may be more flexible. If it was fully password-encrypted, this will not remove the lock.'
      );
    } catch (err) {
      console.error(err);
      setMessage(
        'Something went wrong while processing this PDF. It may be using a protection method that this browser-based tool cannot handle.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Unlock PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Try to remove simple restrictions from PDFs you already have access to. Does not crack passwords or strong encryption."
        />
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
            <Link href="/unlock-pdf">Unlock PDF</Link>
            <Link href="/protect-pdf">Protect PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Unlock PDF (basic)</h2>
            <p>
              This tool re-saves your PDF to try and remove simple restrictions (like
              printing limits) from files you already have access to. It does
              <strong> not</strong> crack passwords or break strong encryption.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Only use this on documents you own or are allowed to modify.
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
  onClick={() => document.getElementById('unlock-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="unlock-file-input"
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
    onClick={() => document.getElementById('unlock-file-input')?.click()}
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
              onClick={handleUnlock}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Unlock and download'}
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
