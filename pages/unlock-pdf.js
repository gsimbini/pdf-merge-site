// pages/unlock-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../components/AdBanner';


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
        <title>Unlock PDF - PDFFusion</title>
        <meta
          name="description"
          content="Try to remove simple restrictions from PDFs you already have access to. Does not crack passwords or strong encryption."
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
            <Link href="/unlock-pdf">Unlock PDF</Link>
            <Link href="/protect-pdf">Protect PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Unlock PDF (basic)</h2>
            <p>
              This tool re-saves your PDF to try and remove simple restrictions (like
              printing limits) from files you already have access to. It does
              <strong> not</strong> crack passwords or break strong encryption.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Only use this on documents you own or are allowed to modify.
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
                document.getElementById('unlock-file-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
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

            <div className="ad-slot">
              <strong><AdBanner /></strong> Place a banner or AdSense block here.
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
