'use client';  // ← ADD THIS AT THE VERY TOP

// pages/word-to-pdf.js
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import AdBanner from "../components/AdBanner";
import ProBadge from "../components/ProBadge";

export default function WordToPdfPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  function onPick(f) {
    if (!f) return;
    const ok =
      f.name.toLowerCase().endsWith(".docx") ||
      f.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!ok) {
      setFile(null);
      setMessage("Please select a .docx Word document.");
      return;
    }

    setFile(f);
    setMessage(`Selected: ${f.name} (${formatBytes(f.size)})`);
  }

  function downloadOriginal() {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Head>
        <title>Word to PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Convert Word (DOCX) to PDF. (Server-side conversion coming soon.)"
        />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Fast • Free • Secure PDF tools</p>
            </div>
          </div>

          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
          
          </nav>
        </header>

        <div style={{ margin: "0.75rem 0 0 0.25rem" }}>
          <ProBadge />
        </div>

        <main className="main">
          <section className="tool-section">
            <h2>Word to PDF</h2>
            <p>
              Upload a <b>.docx</b> file. Full Word→PDF conversion is best done
              with a server-side engine (coming soon). For now, this page
              validates the file and prepares the workflow.
            </p>

            <AdBanner slot="2169503342" />

            <div
  className="upload-box dropzone"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith('.docx')) {
      setFile(f);
      setMessage(`Selected: ${f.name}`);
    } else if (f) {
      setMessage('Please upload a valid .docx file.');
    }
  }}
  onClick={() => document.getElementById('word-to-pdf-file-input')?.click()}
>
  <p>
    <strong>Drag & drop</strong> your PowerPoint file here
    <br />
    <span style={{ fontSize: '0.9em', color: '#666' }}>or click to browse</span>
  </p>

  <input
    id="word-to-pdf-file-input"
    type="file"
    accept=".docx"
    style={{ display: 'none' }}
    onChange={(e) => {
      const f = e.target.files?.[0];
      if (f) setFile(f);
    }}
  />
</div>

<div style={{ marginTop: '1.5rem' }}>
  <button
    type="button"
    className="secondary-btn"
    onClick={() => document.getElementById('word-to-pdf-file-input')?.click()}
    style={{
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#f0f0f0',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      cursor: 'pointer',
    }}
  >
    📊 Choose PowerPoint File
  </button>
</div>

{file && (
  <div style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#333' }}>
    <strong>Selected:</strong> {file.name} ({formatBytes(file.size)})
  </div>
)}

              {message && (
                <p className="hint" style={{ marginTop: "0.75rem" }}>
                  {message}
                </p>
              )}
          

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="primary-btn" type="button" onClick={downloadOriginal} disabled={!file}>
                Download selected file
              </button>

              <Link className="secondary-btn" href="/pricing">
                Go Pro (remove ads)
              </Link>
            </div>

            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Next upgrade (recommended)</strong>
              <p className="hint" style={{ marginTop: "0.5rem" }}>
                To make Word→PDF truly functional, we can add a server route that
                converts DOCX using a conversion engine (e.g. LibreOffice) and
                returns a real PDF download.
              </p>
            </div>

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
