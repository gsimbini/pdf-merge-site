// pages/extract-text.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function ExtractTextPage() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function handleExtract() {
    if (!file) {
      setMessage('Please select a PDF first.');
      return;
    }

    if (typeof window === 'undefined') {
      setMessage('This feature only works in a browser.');
      return;
    }

    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) {
      setMessage(
        'PDF engine is still loading. Please wait a moment and try again.'
      );
      return;
    }

    try {
      setProcessing(true);
      setMessage('Extracting text from PDF… This may take a moment.');

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        const strings = content.items.map((item) => item.str);
        const pageText = strings.join(' ');

        fullText += `\n\n----- Page ${pageNum} -----\n\n`;
        fullText += pageText;
      }

      const trimmed = fullText.trim();
      setPreview(trimmed || '(No extractable text found in this PDF.)');

      // Create and download .txt file
      const blob = new Blob(
        [trimmed || 'No extractable text found in this PDF.'],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      const baseName = file.name.replace(/\.pdf$/i, '');
      a.href = url;
      a.download = `${baseName}-extracted-text.txt`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage(
        `Done! Extracted text from ${pdf.numPages} page(s). A .txt file has been downloaded, and a preview is shown below.`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        'Something went wrong while extracting text. Some scanned PDFs are just images and need OCR, which this tool does not do.'
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Extract Text from PDF - PDFFusion</title>
        <meta
          name="description"
          content="Extract plain text from a PDF file directly in your browser, and download it as a .txt file."
        />
        {/* PDF.js from CDN */}
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          integrity="sha512-tUEqXV2XNY0FTqLL0yxhiYzz0maDCpp1FDZVPBUl49SABLQUeak5ZrdlJVS8cpJbWilUoM1AXW+R9e32XbvA+Q=="
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
            <Link href="/extract-text">Extract text</Link>
            <Link href="/pdf-to-png">PDF to PNG</Link>
            <Link href="/pdf-to-jpg">PDF to JPG</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Extract Text from PDF</h2>
            <p>
              Pull out the plain text from your PDF directly in your browser.
              Works best on PDFs that contain real text (not scanned images).
            </p>

            <div className="hint" style={{ marginBottom: '0.75rem' }}>
              Note: If your PDF is a scanned document (only images), this tool
              won&apos;t see any text. For those, you need OCR (coming later
              with a server-side engine).
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
                document.getElementById('extract-text-input')?.click()
              }
            >
              <p>
                <strong>Drag &amp; drop</strong> your
