'use client';  // ← ADD THIS AT THE VERY TOP

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";



export default function MergePdfPage() {
    useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore errors in development
    }
  }, []);
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    setError('');
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  }

  async function handleMerge() {
    try {
      setError('');
      if (!files.length) {
        setError('Please select at least two PDF files.');
        return;
      }

      setIsMerging(true);

      // Read all files as base64 strings
      const base64Files = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result;
                // result is an ArrayBuffer
                const bytes = new Uint8Array(result);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);
                resolve({ name: file.name, data: base64 });
              };
              reader.onerror = reject;
              reader.readAsArrayBuffer(file);
            })
        )
      );

      const response = await fetch('/api/merge-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: base64Files })
      });

      if (!response.ok) {
        throw new Error('Failed to merge PDFs. Please try again.');
      }

      const json = await response.json();
      const { mergedBase64 } = json;

      // Convert base64 back to a Blob and trigger download
      const byteCharacters = atob(mergedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsMerging(false);
    }
  }

  return (
    <>
      <Head>
        <title>Merge PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Merge multiple PDF files into a single document for free. No registration required."
        />
      </Head>
      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Free PDF merge tool</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/compress-pdf">Compress PDF</Link>
            <Link href="/split-pdf">Split PDF</Link>
          </nav>
        </header>

<div style={{ marginTop: "0.75rem" }}>
  <ProBadge />
</div>


        <main className="main">
          <section className="tool-section">
            <h2>Merge PDF</h2>
            <p>
              Select two or more PDF files and combine them into a single
              document. Files are processed in-memory and are not stored on the
              server.
            </p>

            {/* 🔹 Inline tools ad (top/middle of page) */}
  <AdBanner slot="2169503342" />

            <div
  className="upload-box dropzone"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      setMessage(`Added ${newFiles.length} PDF(s)`);
    } else {
      setMessage('Please upload valid PDF files.');
    }
  }}
  onClick={() => document.getElementById('merge-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> PDFs here (multiple allowed)
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="merge-file-input"
    type="file"
    accept="application/pdf"
    multiple
    style={{ display: 'none' }}
    onChange={(e) => {
      const newFiles = Array.from(e.target.files || []);
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
        setMessage(`Added ${newFiles.length} PDF(s)`);
      }
    }}
  />
</div>

<div style={{ marginTop: '1.5rem' }}>
  <button
    type="button"
    className="secondary-btn"
    onClick={() => document.getElementById('merge-file-input')?.click()}
    style={{
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#f0f0f0',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    📄 Add PDF Files
  </button>
</div>

{files && files.length > 0 && (
  <div style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#333' }}>
    <strong>Selected:</strong> {files.length} PDF(s)
  </div>
)}

            <button
              className="primary-btn"
              onClick={handleMerge}
              disabled={isMerging}
            >
              {isMerging ? 'Merging…' : 'Merge PDFs'}
            </button>

            {error && <p className="error">{error}</p>}

            <div className="ad-slot">
            <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-9212010274013202"   // your publisher ID
            data-ad-slot="5251243129"              // ad unit ID from AdSense
            data-ad-format="auto"
            data-full-width-responsive="true"
            ></ins>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
            <h3>Need more power?</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Upgrade to <strong>SimbaPDF Pro</strong> to remove ads, process larger
              files and unlock compress, split and convert tools.
            </p>
            <Link href="/pricing" className="primary-btn">
              View Pro plans
            </Link>
          </div>


          </section>

          <section className="seo-text">
            <h3>Free online PDF merger</h3>
            <p>
              SimbaPDF is a free, browser-based PDF merger tool designed for
              students, businesses, HR departments, legal teams and anyone who
              works with documents. You don&apos;t need to install software or
              create an account. Simply upload your files, press merge, and
              download the combined PDF.
            </p>
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
