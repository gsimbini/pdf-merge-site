'use client';  // ← ADD THIS AT THE VERY TOP

// pages/excel-to-pdf.js

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import AdBanner from "../components/AdBanner";
import ProBadge from "../components/ProBadge";

export default function ExcelToPdfPage() {
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

    const name = (f.name || "").toLowerCase();
    const ok =
      name.endsWith(".xlsx") ||
      name.endsWith(".xls") ||
      f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      f.type === "application/vnd.ms-excel";

    if (!ok) {
      setFile(null);
      setMessage("Please select an Excel file (.xlsx or .xls).");
      return;
    }

    setFile(f);
    setMessage(`Selected: ${f.name} (${formatBytes(f.size)})`);
  }

  function downloadSelected() {
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
        <title>Excel to PDF - SimbaPDF</title>
        <meta
          name="description"
          content="Convert Excel (XLSX/XLS) to PDF. Conversion engine upgrade coming soon."
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
            <Link href="/account">Account</Link>
          </nav>
        </header>

        <div style={{ margin: "0.75rem 0 0 0.25rem" }}>
          <ProBadge />
        </div>

        <main className="main">
          <section className="tool-section">
            <h2>Excel to PDF</h2>
            <p>
              Upload your <b>.xlsx</b> or <b>.xls</b> file. Full Excel→PDF conversion
              is best handled with a server-side conversion engine (coming soon).
            </p>

            <AdBanner slot="2169503342" />

            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) onPick(f);
              }}
              onClick={() => document.getElementById("excel-input")?.click()}
              style={{ cursor: "pointer" }}
            >
              <input
                id="excel-input"
                type="file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                style={{ display: "none" }}
                onChange={(e) => onPick(e.target.files?.[0])}
              />

              <p style={{ margin: 0 }}>
                <strong>Drag &amp; drop</strong> your Excel file here, or{" "}
                <u>click to choose</u>.
              </p>

              {message && (
                <p className="hint" style={{ marginTop: "0.75rem" }}>
                  {message}
                </p>
              )}
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="primary-btn" type="button" onClick={downloadSelected} disabled={!file}>
                Download selected file
              </button>

              <Link className="secondary-btn" href="/pricing">
                Go Pro (remove ads)
              </Link>
            </div>

            <div className="upload-box" style={{ marginTop: "1rem" }}>
              <strong>Next upgrade</strong>
              <p className="hint" style={{ marginTop: "0.5rem" }}>
                We can make this fully functional by adding a server conversion route
                (Excel → PDF) and returning a real PDF download.
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
