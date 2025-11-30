// pages/pdf-to-excel.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function PdfToExcelPage() {
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

  // Group PDF.js text items into "lines" based on y-position
  function groupItemsIntoLines(items) {
    const lineMap = {};

    items.forEach((item) => {
      const y = item.transform?.[5] || 0;
      // Quantise y so that close values get grouped
      const key = Math.round(y / 5) * 5;
      if (!lineMap[key]) {
        lineMap[key] = [];
      }
      lineMap[key].push(item.str);
    });

    const keys = Object.keys(lineMap)
      .map((k) => Number(k))
      .sort((a, b) => b - a); // top to bottom

    const lines = keys.map((k) => lineMap[k].join(' ').trim());
    return lines.filter((line) => line.length > 0);
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
    const XLSX = window.XLSX;

    if (!pdfjsLib) {
      setMessage('PDF engine is still loading. Please wait and try again.');
      return;
    }
    if (!XLSX) {
      setMessage('Excel engine is still loading. Please wait and try again.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Reading PDF and extracting text into rows…');

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const rows = []; // { Page, Line }

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const lines = groupItemsIntoLines(content.items);

        lines.forEach((lineText) => {
          rows.push({
            Page: pageNum,
            Line: lineText,
          });
        });
      }

      if (rows.length === 0) {
        setMessage(
          'No text lines were found. This PDF might be scanned images or empty.'
        );
        setPreview([]);
        setProcessing(false);
        return;
      }

      // Preview first ~20 rows
      setPreview(rows.slice(0, 20));

      // Build workbook
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'PDF Text');

      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
      });

      const blob = new Blob([wbout], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const baseName = file.name.replace(/\.pdf$/i, '') || 'pdf-data';
      a.href = url;
      a.download = `${baseName}-text.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Exported text from ${pdf.numPages} page(s) into an Excel file with ${rows.length} row(s).`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while converting this PDF to Excel.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PDF to Excel (Text to rows) - PDFFusion</title>
        <meta
          name="description"
          content="Convert a PDF into an Excel file by extracting text lines per page into rows. Browser-only, no uploads."
        />
        {/* PDF.js */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          integrity="sha512-tUEqXV2XNY0FTqLL0yxhiYzz0maDCpp1FDZVPBUl49SABLQUeak5ZrdlJVS8cpJbWilUoM1AXW+R9e32XbvA+Q=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        {/* SheetJS (XLSX) */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
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
            <Link href="/pdf-to-word">PDF to Word</Link>
            <Link href="/pdf-to-excel">PDF to Excel</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>PDF to Excel (text lines → rows)</h2>
            <p>
              Extract text from your PDF and place it into an Excel file, with
              one row per text line and a column for the page number. This is a
              simple text-based converter, not a full table detector.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Works best on PDFs that contain real text. Scanned PDFs (images)
              need OCR, which this browser-only version does not include.
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
                document.getElementById('pdf-to-excel-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your PDF here, or click to
                choose.
              </p>
              <input
                id="pdf-to-excel-input"
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
                ? 'Converting PDF to Excel…'
                : 'Convert to Excel and download'}
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
                <strong>Preview (first lines):</strong>
                <table
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.8rem',
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: '1px solid #cbd5f5',
                          padding: '4px',
                          textAlign: 'left',
                          width: '60px',
                        }}
                      >
                        Page
                      </th>
                      <th
                        style={{
                          borderBottom: '1px solid #cbd5f5',
                          padding: '4px',
                          textAlign: 'left',
                        }}
                      >
                        Line
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            borderBottom: '1px solid #e5e7eb',
                            padding: '4px',
                            verticalAlign: 'top',
                          }}
                        >
                          {row.Page}
                        </td>
                        <td
                          style={{
                            borderBottom: '1px solid #e5e7eb',
                            padding: '4px',
                            verticalAlign: 'top',
                          }}
                        >
                          {row.Line}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="ad-slot" style={{ marginTop: '1rem' }}>
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
