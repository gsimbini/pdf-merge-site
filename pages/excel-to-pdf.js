// pages/excel-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import AdBanner from '../components/AdBanner';


export default function ExcelToPdfPage() {
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

  async function handleConvert() {
    if (!file) {
      setMessage('Please select an Excel (.xlsx) or CSV file first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const XLSX = window.XLSX;
    const jspdf = window.jspdf;

    if (!XLSX) {
      setMessage('Excel engine is still loading. Please wait and try again.');
      return;
    }
    if (!jspdf) {
      setMessage('PDF engine is still loading. Please wait and try again.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Reading spreadsheet and building PDF…');

      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Read workbook
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to 2D array (rows)
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!rows || rows.length === 0) {
        setMessage('No data found in the first sheet.');
        setPreview([]);
        setProcessing(false);
        return;
      }

      // Preview first 15 rows
      setPreview(rows.slice(0, 15));

      const { jsPDF } = jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = 14;

      let y = margin;
      const header = `Sheet: ${sheetName}`;
      doc.setFontSize(12);
      doc.text(header, margin, y);
      y += lineHeight * 1.5;

      doc.setFontSize(9);

      rows.forEach((row) => {
        const line = row
          .map((cell) =>
            cell == null ? '' : String(cell).replace(/\s+/g, ' ').trim()
          )
          .join(' | ');

        if (!line) return;

        const wrapped = doc.splitTextToSize(line, maxWidth);

        wrapped.forEach((wLine) => {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(wLine, margin, y);
          y += lineHeight;
        });
      });

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');

      const baseName =
        file.name.replace(/\.(xlsx|xls|csv)$/i, '') || 'spreadsheet';
      a.href = url;
      a.download = `${baseName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        'Done! Created a simple text-based PDF from your spreadsheet. Open it to review the content.'
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          'Something went wrong while converting this spreadsheet to PDF.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Excel to PDF (text table) - PDFFusion</title>
        <meta
          name="description"
          content="Convert an Excel (.xlsx) or CSV file to a simple text-based PDF directly in your browser."
        />
        {/* SheetJS (XLSX) */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        {/* jsPDF */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js"
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
            <Link href="/excel-to-pdf">Excel to PDF</Link>
            <Link href="/pdf-to-excel">PDF to Excel</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Excel to PDF (text table)</h2>
            <p>
              Convert an Excel (.xlsx) or CSV file into a simple text-based PDF.
              Each row becomes a line, with cells separated by &quot; | &quot;.
              Great for quick sharing or printing.
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              This basic browser-only converter does not keep advanced styling or
              merged cells. It focuses on the data itself.
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
                document.getElementById('excel-to-pdf-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your Excel (.xlsx) or CSV file
                here, or click to choose.
              </p>
              <input
                id="excel-to-pdf-input"
                type="file"
                accept=".xlsx,.xls,.csv"
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
                ? 'Converting Excel to PDF…'
                : 'Convert to PDF and download'}
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
                <strong>Preview (first rows):</strong>
                <table
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.8rem',
                  }}
                >
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            style={{
                              border: '1px solid #e5e7eb',
                              padding: '4px',
                              verticalAlign: 'top',
                            }}
                          >
                            {cell != null ? String(cell) : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="ad-slot" style={{ marginTop: '1rem' }}>
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
