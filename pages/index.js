// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  const q = search.trim().toLowerCase();

  useEffect(() => {
    fetch('https://zenquotes.io/api/random')
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          setQuote(data[0]);
        } else {
          setQuote({ q: "Keep going — every small step counts.", a: "SimbaPDF" });
        }
      })
      .catch(() => {
        setQuote({ q: "Success is built one PDF at a time.", a: "SimbaPDF" });
      })
      .finally(() => {
        setQuoteLoading(false);
      });
  }, []);

  const popularTools = [
    { href: '/merge-pdf', title: 'Merge PDF', description: 'Combine multiple PDFs into a single document.' },
    { href: '/pdf-to-pdfa', title: 'PDF to PDF/A (basic)', description: 'Create a simple archival-style copy of a PDF (browser-only, not strict validator-grade).' },
    { href: '/split-pdf', title: 'Split PDF', description: 'Extract selected pages or ranges into a new PDF.' },
    { href: '/pdf-to-powerpoint', title: 'PDF to PowerPoint (text slides)', description: 'Make a simple PowerPoint where each PDF page becomes a slide with text bullets.' },
    { href: '/powerpoint-to-pdf', title: 'PowerPoint to PDF (images)', description: 'Export slides as images (JPG/PNG) and turn them into a PDF, one slide per page.' },
    { href: '/compress-pdf', title: 'Compress PDF', description: 'Reduce file size while keeping readable quality.' },
    { href: '/rotate-pdf', title: 'Rotate PDF', description: 'Fix sideways or upside-down pages instantly.' },
  ];

  const editTools = [
    { href: '/organize-pdf', title: 'Organise PDF', description: 'Reorder, duplicate or remove pages by choosing an order.' },
    { href: '/crop-pdf', title: 'Crop PDF', description: 'Trim margins and crop all pages at once.' },
    { href: '/page-numbers', title: 'Add page numbers', description: 'Add page numbers to all or some pages.' },
    { href: '/watermark-pdf', title: 'Watermark PDF', description: 'Add CONFIDENTIAL, DRAFT or custom text watermarks.' },
    { href: '/sign-pdf', title: 'Sign PDF', description: 'Add a typed signature and date to your document.' },
    { href: '/repair-pdf', title: 'Repair PDF', description: 'Try to fix a damaged PDF by opening and re-saving it as a fresh file.' },
  ];

  const securityTools = [
    { href: '/protect-pdf', title: 'Protect PDF (soft)', description: 'Add visible protection labels, owner information and watermarks.' },
    { href: '/unlock-pdf', title: 'Unlock PDF', description: 'Re-save PDFs you already have access to. Does not crack passwords.' },
  ];

  const imageTools = [
    { href: '/jpg-to-pdf', title: 'JPG to PDF', description: 'Turn one or more JPG images into a single PDF.' },
    { href: '/png-to-pdf', title: 'PNG to PDF', description: 'Convert PNG images into a multi-page PDF.' },
    { href: '/pdf-to-png', title: 'PDF to PNG (page)', description: 'Export a single PDF page as a PNG image.' },
    { href: '/pdf-to-jpg', title: 'PDF to JPG (page)', description: 'Export a single PDF page as a JPG image.' },
    { href: '/pdf-to-images', title: 'PDF to images (ZIP)', description: 'Convert all pages to JPG images and download as a ZIP.' },
  ];

  const textOfficeTools = [
    { href: '/extract-text', title: 'Extract text from PDF', description: 'Pull out plain text and download it as a .txt file.' },
    { href: '/pdf-to-word', title: 'PDF to Word (text)', description: 'Convert PDF into a simple text-only Word document.' },
    { href: '/word-to-pdf', title: 'Word to PDF (text)', description: 'Turn a .docx or .txt file into a text-based PDF.' },
    { href: '/pdf-to-excel', title: 'PDF to Excel (text)', description: 'Export PDF text lines into Excel rows with page numbers.' },
    { href: '/excel-to-pdf', title: 'Excel to PDF (text)', description: 'Turn an Excel or CSV file into a text-based PDF.' },
    { href: '/ocr-to-pdf', title: 'OCR to PDF (searchable)', description: 'Run OCR on a scanned PDF and create a searchable PDF.' },
    { href: '/html-to-pdf', title: 'HTML to PDF', description: 'Paste simple HTML, preview it and download as a PDF.' },
  ];

  const filterTools = (tools) =>
    !q ? tools : tools.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));

  const filteredPopular = filterTools(popularTools);
  const filteredEdit = filterTools(editTools);
  const filteredSecurity = filterTools(securityTools);
  const filteredImages = filterTools(imageTools);
  const filteredTextOffice = filterTools(textOfficeTools);

  const anythingVisible =
    filteredPopular.length ||
    filteredEdit.length ||
    filteredSecurity.length ||
    filteredImages.length ||
    filteredTextOffice.length;

  const cardStyle = { position: 'relative', overflow: 'visible', minHeight: '130px' };
  const descStyle = { position: 'relative', zIndex: 2, marginTop: '0.4rem' };

  return (
    <>
      <Head>
        <meta name="google-adsense-account" content="ca-pub-9212010274013202"></meta>
        <title>SimbaPDF – Free Online PDF Tools</title>
        <meta
          name="description"
          content="SimbaPDF offers free, private, in-browser PDF tools: merge, split, compress, convert images, add text and more."
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
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>
            <Link href="/account">Account</Link>
          </nav>
        </header>

        <div style={{ marginTop: "0.75rem" }}>
          <ProBadge />
        </div>

        <main className="main">
          <section className="hero">
            <h2>All your PDF tools in one simple place</h2>
            <p>
              Work with your PDFs directly in your browser. No uploads to a
              server, better privacy, and completely free. Choose a tool below
              to get started.
            </p>

            <div
              className="option-row"
              style={{ marginTop: '1rem', maxWidth: '400px', marginInline: 'auto' }}
            >
              <label htmlFor="tool-search" style={{ width: '100%' }}>
                <strong>Search tools:</strong>
                <input
                  id="tool-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-input"
                  placeholder="Type e.g. merge, jpg, rotate, excel…"
                  style={{ marginTop: '0.4rem', width: '100%' }}
                />
              </label>
            </div>
          </section>

          {/* TradingView Ticker Bar - Fixed */}
          <section className="tool-section" style={{ padding: '0', margin: '2rem 0' }}>
            <div
              dangerouslySetInnerHTML={{
                __html: `
                  <!-- TradingView Ticker Tape Widget -->
                  <div class="tradingview-widget-container" style="height:70px;width:100%;">
                    <div class="tradingview-widget-container__widget" style="height:100%;"></div>
                    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js" async>
                    {
                      "symbols": [
                        {"proName": "FOREXCOM:SPXUSD", "title": "S&P 500"},
                        {"proName": "FOREXCOM:NSXUSD", "title": "Nasdaq"},
                        {"proName": "FOREXCOM:DJI", "title": "Dow Jones"},
                        {"proName": "FX:EURUSD", "title": "EUR/USD"},
                        {"proName": "FX:GBPUSD", "title": "GBP/USD"},
                        {"proName": "FX:USDZAR", "title": "USD/ZAR"},
                        {"proName": "BITSTAMP:BTCUSD", "title": "Bitcoin"},
                        {"proName": "BITSTAMP:ETHUSD", "title": "Ethereum"},
                        {"proName": "NASDAQ:AAPL", "title": "Apple"},
                        {"proName": "NASDAQ:TSLA", "title": "Tesla"},
                        {"proName": "NASDAQ:GOOGL", "title": "Google"}
                      ],
                      "colorTheme": "dark",
                      "isTransparent": false,
                      "showSymbolLogo": true,
                      "locale": "en"
                    }
                    </script>
                  </div>
                `
              }}
            />
          </section>

          {/* Daily Motivational Quote */}
          <section className="tool-section" style={{ background: '#f8f9fa', padding: '2.5rem 2rem', borderRadius: '16px', margin: '2rem 0', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', color: '#333' }}>
              Daily Inspiration
            </h3>
            {quoteLoading ? (
              <p style={{ fontStyle: 'italic', color: '#666' }}>Loading your daily motivation...</p>
            ) : quote ? (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ fontSize: '1.5rem', fontStyle: 'italic', lineHeight: '1.6', color: '#444', marginBottom: '1rem' }}>
                  "{quote.q}"
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0070f3' }}>
                  — {quote.a}
                </p>
              </div>
            ) : (
              <p style={{ fontStyle: 'italic', color: '#666' }}>Keep pushing forward — great things take time.</p>
            )}
          </section>

          <section className="tool-section">
            <AdBanner slot="9740145252" />
          </section>

          {!anythingVisible && (
            <section className="tool-section">
              <p className="hint">
                No tools match &quot;{search}&quot;. Try a different search
                (for example: merge, split, jpg, word, excel…).
              </p>
            </section>
          )}

          {filteredPopular.length > 0 && (
            <section className="tool-section">
              <h3>Most popular tools</h3>
              <div className="tool-grid">
                {filteredPopular.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="tool-card" style={cardStyle}>
                    <h4>{tool.title}</h4>
                    <p style={descStyle}>{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="tool-section">
            <AdBanner />
          </section>

          {filteredEdit.length > 0 && (
            <section className="tool-section">
              <h3>Edit &amp; organise pages</h3>
              <div className="tool-grid">
                {filteredEdit.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="tool-card" style={cardStyle}>
                    <h4>{tool.title}</h4>
                    <p style={descStyle}>{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {filteredSecurity.length > 0 && (
            <section className="tool-section">
              <h3>Security &amp; labels</h3>
              <div className="tool-grid">
                {filteredSecurity.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="tool-card" style={cardStyle}>
                    <h4>{tool.title}</h4>
                    <p style={descStyle}>{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {filteredImages.length > 0 && (
            <section className="tool-section">
              <h3>Images &amp; PDF</h3>
              <div className="tool-grid">
                {filteredImages.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="tool-card" style={cardStyle}>
                    <h4>{tool.title}</h4>
                    <p style={descStyle}>{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {filteredTextOffice.length > 0 && (
            <section className="tool-section">
              <h3>Text &amp; Office conversions</h3>
              <div className="tool-grid">
                {filteredTextOffice.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="tool-card" style={cardStyle}>
                    <h4>{tool.title}</h4>
                    <p style={descStyle}>{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="tool-section">
            <h3>How SimbaPDF works</h3>
            <p className="hint">
              Most tools run entirely in your browser using JavaScript, so your
              PDFs don&apos;t leave your device. That&apos;s great for privacy
              and makes it easy to add ads or premium features later without
              storing user files on a server.
            </p>
          </section>

          <AdBanner slot="8164173850" />
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}