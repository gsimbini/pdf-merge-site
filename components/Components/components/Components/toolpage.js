// components/ToolPage.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useCallback } from 'react';

export default function ToolPage({
  title,
  slug,
  shortDescription,
  longDescription
}) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    if (selected.length > 0) {
      setMessage(
        `You selected ${selected.length} file(s). This tool UI is ready – processing logic will be added next.`
      );
    } else {
      setMessage('');
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles(dropped);
    if (dropped.length > 0) {
      setMessage(
        `You dropped ${dropped.length} file(s). This tool UI is ready – processing logic will be added next.`
      );
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <>
      <Head>
        <title>{title} - Simba PDF</title>
        <meta name="description" content={shortDescription} />
      </Head>
      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>Simba PDF</h1>
              <p className="tagline">Free & private online PDF tools</p>
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
            <h2>{title}</h2>
            <p>{shortDescription}</p>
            {longDescription && <p>{longDescription}</p>}

            <div
              className="upload-box dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <p>
                <strong>Drag &amp; drop</strong> your file(s) here, or click to
                browse.
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ marginTop: '0.75rem' }}
              />
              {files.length > 0 && (
                <ul className="file-list">
                  {files.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <button className="primary-btn" disabled>
              Processing coming soon
            </button>

            {message && <p className="hint" style={{ marginTop: '0.75rem' }}>{message}</p>}

            <div className="ad-slot">
              <strong><AdBanner /></strong> Place a banner or AdSense block here.
            </div>
          </section>

          <section className="seo-text">
            <h3>About this tool</h3>
            <p>
              This page is ready for full "{title}" functionality. You can
              integrate a PDF/Office processing library or external API to
              implement the actual conversion or editing logic, while keeping
              this UI and monetisation slots.
            </p>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Simba PDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
