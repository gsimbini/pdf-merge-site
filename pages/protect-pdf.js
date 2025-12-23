'use client';  // ← ADD THIS AT THE VERY TOP

// pages/protect-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function ProtectPdfPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const [ownerName, setOwnerName] = useState('');
  const [note, setNote] = useState('Confidential – internal use only');
  const [addDiagonalWatermark, setAddDiagonalWatermark] = useState(true);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleProtect() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Adding protection labels and watermark…');

      const arrayBuffer = await file.arrayBuffer();
      let pdfDoc;

      try {
        pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });
      } catch (err) {
        console.error('Load error:', err);
        setMessage(
          'This PDF appears to be strongly encrypted or password-protected. This browser-only tool cannot modify it.'
        );
        setProcessing(false);
        return;
      }

      // Set some basic metadata
      const safeOwner = ownerName.trim() || 'Protected by SimbaPDF';
      pdfDoc.setAuthor(safeOwner);
      pdfDoc.setTitle(`Protected PDF - ${file.name}`);
      pdfDoc.setSubject(note);

      const pages = pdfDoc.getPages();
      const bannerFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const wmFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      pages.forEach((page) => {
        const { width, height } = page.getSize();

        // 1) Top small "Protected" banner text
        const bannerText = `Protected – ${note}`;
        const bannerFontSize = 10;
        const bannerTextWidth = bannerFont.widthOfTextAtSize(
          bannerText,
          bannerFontSize
        );

        const bannerX = (width - bannerTextWidth) / 2;
        const bannerY = height - 20;

        page.drawText(bannerText, {
          x: bannerX,
          y: bannerY,
          size: bannerFontSize,
          font: bannerFont,
          color: rgb(0.8, 0.1, 0.1),
        });

        // 2) Owner label at bottom-left
        const ownerLabel = `Owner: ${safeOwner}`;
        const ownerFontSize = 9;
        page.drawText(ownerLabel, {
          x: 24,
          y: 24,
          size: ownerFontSize,
          font: bannerFont,
          color: rgb(0.3, 0.3, 0.3),
        });

        // 3) Optional big diagonal watermark
        if (addDiagonalWatermark) {
          const wmText = 'PROTECTED – DO NOT SHARE';
          const wmFontSize = Math.min(width, height) / 12;
          const textWidth = wmFont.widthOfTextAtSize(wmText, wmFontSize);

          const wmX = (width - textWidth) / 2;
          const wmY = height / 2;

          page.drawText(wmText, {
            x: wmX,
            y: wmY,
            size: wmFontSize,
            font: wmFont,
            color: rgb(0.8, 0.1, 0.1),
            opacity: 0.18,
            rotate: degrees(-35),
          });
        }
      });

      const newBytes = await pdfDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `protected-${file.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        'Done! This copy now has clear protection labels and metadata. Note: this is NOT password encryption.'
      );
    } catch (err) {
      console.error(err);
      setMessage(
        'Something went wrong while protecting the PDF. This file may use features this browser tool cannot handle.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Protect PDF (Soft protection) - SimbaPDF</title>
        <meta
          name="description"
          content="Add visible protection labels, ownership info and watermark to your PDF. Does not perform strong password encryption."
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
            <Link href="/protect-pdf">Protect PDF</Link>
            <Link href="/unlock-pdf">Unlock PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Protect PDF (Soft protection)</h2>
            <p>
              Add clear protection labels, ownership info and an optional
              watermark to your PDF. This makes it obvious that the document is
              confidential, but does <strong>not</strong> encrypt it with a
              password.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              For true password-based encryption, you&apos;ll need a server-side
              PDF library or desktop app. This browser-only tool focuses on
              visible &amp; metadata-based protection.
            </div>

            <div className="option-row">
              <label htmlFor="owner-name">
                <strong>Owner / organisation:</strong>
              </label>
              <input
                id="owner-name"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="text-input"
                placeholder="e.g. Makhanani Co."
              />
            </div>

            <div className="option-row">
              <label htmlFor="note">
                <strong>Protection note:</strong>
              </label>
              <input
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-input"
                placeholder="e.g. Confidential – internal use only"
              />
            </div>

            <div className="option-row">
              <label htmlFor="wm-toggle">
                <strong>Watermark:</strong>
              </label>
              <label style={{ fontSize: '0.9rem' }}>
                <input
                  id="wm-toggle"
                  type="checkbox"
                  checked={addDiagonalWatermark}
                  onChange={(e) => setAddDiagonalWatermark(e.target.checked)}
                  style={{ marginRight: '0.4rem' }}
                />
                Add big diagonal &quot;PROTECTED – DO NOT SHARE&quot; watermark
                on each page
              </label>
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
  onClick={() => document.getElementById('protect-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PDF here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="TOOL-file-input"
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
    onClick={() => document.getElementById('protect-file-input')?.click()}
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
              onClick={handleProtect}
              disabled={!file || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Protect and download'}
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
