// pages/event-invitation-poster.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import ProBadge from "../components/ProBadge";

export default function EventInvitationPoster() {
  const [formData, setFormData] = useState({
    eventType: 'wedding',
    title: 'Wedding Invitation',
    subtitle: 'We’re getting married!',
    hostNames: 'Emma & James',
    date: 'Saturday, 15 March 2025',
    time: '4:00 PM – 10:00 PM',
    location: 'The Rose Garden Venue, Cape Town',
    message: 'Join us for an evening of love, laughter, and celebration.\nRSVP by 1 March 2025',
    accentColor: '#d32f2f', // default red/pink for wedding
  });

  const [selectedTemplate, setSelectedTemplate] = useState('elegant');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <>
      <Head>
        <title>Create Invitation Cards & Event Posters – SimbaPDF</title>
        <meta
          name="description"
          content="Design beautiful wedding invitations, party invites, and event posters in your browser. Customize text, colors, download as PDF – no sign up needed."
        />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Free & private online PDF tools</p>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="nav desktop-nav">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>
            <Link href="/account">Account</Link>
          </nav>

          {/* Hamburger button – visible only on mobile */}
          <button
            className="hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-menu" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                ×
              </button>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
            </div>
          </div>
        )}

        <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
          <ProBadge />
        </div>

        <main className="main">
          <section style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <h1>Create Invitations & Posters</h1>
            <p style={{ maxWidth: '700px', margin: '1rem auto', color: '#555' }}>
              Design elegant wedding invitations, birthday cards, party flyers or event posters entirely in your browser.
              Customize and download as PDF – no uploads, no account needed.
            </p>
          </section>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
          }}>
            {/* Editor */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              <h2>Customize</h2>

              <div style={{ display: 'grid', gap: '1.2rem', gridTemplateColumns: '1fr 1fr', maxWidth: '800px' }}>
                <div>
                  <label>Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.7rem' }}
                  >
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="baby-shower">Baby Shower</option>
                    <option value="party">General Party</option>
                    <option value="event">Other Event / Poster</option>
                  </select>
                </div>

                <div>
                  <label>Template Style</label>
                  <select
                    value={selectedTemplate}
                    onChange={e => setSelectedTemplate(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem' }}
                  >
                    <option value="elegant">Elegant Minimal</option>
                    <option value="floral">Floral Romantic</option>
                    <option value="modern">Modern Bold</option>
                    <option value="classic">Classic Formal</option>
                  </select>
                </div>

                <div>
                  <label>Main Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.7rem' }}
                  />
                </div>

                <div>
                  <label>Subtitle / Tagline</label>
                  <input
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.7rem' }}
                  />
                </div>

                <div>
                  <label>Host / Names</label>
                  <input
                    name="hostNames"
                    value={formData.hostNames}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.7rem' }}
                  />
                </div>

                <div>
                  <label>Date</label>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="e.g. Saturday, 15 March 2025"
                    style={{ width: '100%', padding: '0.7rem' }}
                  />
                </div>

                <div>
                  <label>Time</label>
                  <input
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="e.g. 4:00 PM – 10:00 PM"
                    style={{ width: '100%', padding: '0.7rem' }}
                  />
                </div>

                <div>
                  <label>Location / Venue</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.7rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Message / Details</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    style={{ width: '100%', padding: '0.7rem' }}
                  />
                </div>

                <div>
                  <label>Accent Color</label>
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    style={{ width: '100%', height: '50px', padding: 0, border: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Preview + Download */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              <h2 style={{ textAlign: 'center' }}>Preview</h2>

              <div id="invitation-preview" style={{
                width: '100%',
                maxWidth: '800px',
                margin: '2rem auto',
                minHeight: '500px',
                background: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <InvitationTemplate template={selectedTemplate} data={formData} />
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  onClick={downloadPDF}
                  style={{
                    padding: '0.9rem 2.5rem',
                    fontSize: '1.1rem',
                    background: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Download as PDF
                </button>
                <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.95rem' }}>
                  Use "Save as PDF" in your browser print dialog
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SimbaPDF. All rights reserved.</p>
        </footer>
      </div>

      <style jsx global>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-circle {
          width: 48px;
          height: 48px;
          background: #0070f3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .nav a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          margin-left: 1.5rem;
        }

        .nav a:hover {
          color: #0070f3;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .hamburger span {
          width: 100%;
          height: 3px;
          background: #333;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-menu {
          width: 280px;
          height: 100%;
          background: white;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .mobile-menu a {
          font-size: 1.2rem;
          text-decoration: none;
          color: #333;
          padding: 0.8rem 0;
          border-bottom: 1px solid #eee;
        }

        .close-btn {
          align-self: flex-end;
          background: none;
          border: none;
          font-size: 2.5rem;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .desktop-nav { display: none; }
        }

        @media print {
          body > *:not(#invitation-preview) { display: none !important; }
          #invitation-preview {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </>
  );
}

// ────────────────────────────────────────────────
// Templates
// ────────────────────────────────────────────────

function InvitationTemplate({ template, data }) {
  const commonStyles = {
    padding: '3rem 2rem',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
    background: 'linear-gradient(to bottom, #fff, #f9f9f9)',
  };

  if (template === 'elegant') {
    return (
      <div style={{
        ...commonStyles,
        background: `linear-gradient(to bottom, ${data.accentColor}22, transparent)`,
      }}>
        <h1 style={{ fontSize: '3.2rem', margin: '0 0 0.5rem', color: data.accentColor }}>
          {data.title}
        </h1>
        <p style={{ fontSize: '1.5rem', margin: '0 0 2rem', color: '#444' }}>
          {data.subtitle}
        </p>
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
          {data.hostNames}
        </div>
        <div style={{ fontSize: '1.4rem', lineHeight: '1.7', marginBottom: '2rem' }}>
          {data.date}<br />
          {data.time}<br />
          {data.location}
        </div>
        <p style={{ fontSize: '1.2rem', maxWidth: '500px', whiteSpace: 'pre-wrap' }}>
          {data.message}
        </p>
      </div>
    );
  }

  if (template === 'floral') {
    return (
      <div style={{
        ...commonStyles,
        background: `url('https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover no-repeat`,
        color: 'white',
        textShadow: '0 1px 4px rgba(0,0,0,0.7)',
      }}>
        <div style={{ background: 'rgba(0,0,0,0.35)', padding: '3rem', borderRadius: '16px' }}>
          <h1 style={{ fontSize: '3.5rem', margin: 0, color: data.accentColor }}>
            {data.title}
          </h1>
          <p style={{ fontSize: '1.6rem', margin: '0.5rem 0 2rem' }}>{data.subtitle}</p>
          <div style={{ fontSize: '2.2rem', margin: '2rem 0' }}>{data.hostNames}</div>
          <div style={{ fontSize: '1.5rem', lineHeight: '1.8' }}>
            {data.date} • {data.time}<br />
            {data.location}
          </div>
          <p style={{ fontSize: '1.3rem', marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
            {data.message}
          </p>
        </div>
      </div>
    );
  }

  if (template === 'modern') {
    return (
      <div style={{
        ...commonStyles,
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <h1 style={{ fontSize: '3.8rem', margin: 0, color: data.accentColor }}>
          {data.title.toUpperCase()}
        </h1>
        <p style={{ fontSize: '1.8rem', margin: '1rem 0 3rem', opacity: 0.9 }}>
          {data.subtitle}
        </p>
        <div style={{ fontSize: '2.4rem', marginBottom: '2rem' }}>
          {data.hostNames}
        </div>
        <div style={{ fontSize: '1.6rem', lineHeight: '1.8', marginBottom: '2rem' }}>
          {data.date} — {data.time}<br />
          {data.location}
        </div>
        <p style={{ fontSize: '1.3rem', maxWidth: '600px', whiteSpace: 'pre-wrap' }}>
          {data.message}
        </p>
      </div>
    );
  }

  // Classic fallback
  return (
    <div style={{
      ...commonStyles,
      border: `8px double ${data.accentColor}`,
      background: '#fffaf0',
    }}>
      <h1 style={{ fontSize: '3.6rem', color: data.accentColor, margin: 0 }}>
        {data.title}
      </h1>
      <p style={{ fontSize: '1.8rem', margin: '1rem 0 2.5rem' }}>{data.subtitle}</p>
      <div style={{ fontSize: '2.6rem', fontFamily: 'Georgia', margin: '2rem 0' }}>
        {data.hostNames}
      </div>
      <div style={{ fontSize: '1.7rem', lineHeight: '1.7' }}>
        {data.date}<br />
        {data.time}<br />
        {data.location}
      </div>
      <p style={{ fontSize: '1.4rem', marginTop: '2.5rem', whiteSpace: 'pre-wrap' }}>
        {data.message}
      </p>
    </div>
  );
}