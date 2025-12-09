// pages/png-to-pdf.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../components/AdBanner';


export default function PngToPdfPage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  function handleFilesSelected(fileList) {
    const arr = Array.from(fileList || []);
    const pngOnly = arr.filter((f) => f.type === 'image/png');
    setFiles(pngOnly);
    if (pngOnly.length) {
      const totalSize = pngOnly.reduce((sum, f) => sum + f.size, 0);
      setMessage(
        `Selected ${pngOnly.length} PNG image(s), total size ${formatBytes(
          totalSize
        )}.`
      );
    } else {
      setMessage('No PNG files selected. Please choose PNG images.');
    }
  }

  async function handleConvert() {
    if (!files.length) {
      setMessage('Please select at least one PNG image.');
      return;
    }

    try {
      setProcessing(true);
      setMessage('Building PDF from PNG images…');

      const pdfDoc = await PDFDocument.create();

      // A4-ish page size (portrait)
      const pageWidth = 595;
      const pageHeight = 842;

      for (const file of files) {
        if (file.type !== 'image/png') {
          continue;
        }

        const arrayBuffer = await file.arrayBuffer();
        const image = await pdfDoc.embedPng(arrayBuffer);

        const imgWidth = image.width;
        const imgHeight = image.height;

        const widthScale = pageWidth / imgWidth;
        const heightScale = pageHeight / imgHeight;
        const scale = Math.min(widthScale, heightScale);

        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download =
        files.length === 1
          ? `${files[0].name.replace(/\.png$/i, '')}.pdf`
          : `png-images-to-pdf.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Converted ${files.length} PNG image(s) to PDF. Check your downloads.`
      );
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while converting PNG to PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>PNG to PDF - PDFFusion</title>
        <meta
          name="description"
          content="Convert one or multiple PNG images to a single multi-page PDF document."
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
            <Link href="/png-to-pdf">PNG to PDF</Link>
            <Link href="/jpg-to-pdf">JPG to PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>PNG to PDF</h2>
            <p>
              Turn one or more PNG images into a single PDF. Each PNG becomes its
              own page, centered and scaled to fit.
            </p>

            <div
              className="upload-box dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const fileList = e.dataTransfer.files;
                handleFilesSelected(fileList);
              }}
              onClick={() =>
                document.getElementById('png-to-pdf-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> PNG images here, or click to
                choose.
              </p>
              <input
                id="png-to-pdf-input"
                type="file"
                accept="image/png"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              {files.length > 0 && (
                <ul className="file-list">
                  {files.map((f, idx) => (
                    <li key={idx}>
                      {f.name} ({formatBytes(f.size)})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="primary-btn"
              onClick={handleConvert}
              disabled={!files.length || processing}
              style={{ marginTop: '1rem' }}
            >
              {processing ? 'Processing…' : 'Convert to PDF and download'}
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
