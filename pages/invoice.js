'use client';

// pages/invoice.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdBanner from '../components/AdBanner';
import ProBadge from "../components/ProBadge";
import jsPDF from 'jspdf';

export default function InvoicePage() {
  // Template options
  const templates = [
    { name: 'Blank Invoice', data: { clientName: '', clientEmail: '', clientAddress: '', items: [{ description: '', quantity: 1, price: 0 }] } },
    { name: 'Simple Freelance Invoice', data: { clientName: 'Client Company', clientEmail: 'client@company.com', clientAddress: '123 Client Street, Cape Town', items: [{ description: 'Web Development Services', quantity: 1, price: 5000 }, { description: 'Logo Design', quantity: 1, price: 1500 }] } },
    { name: 'Product Sale Invoice', data: { clientName: 'John Doe', clientEmail: 'john@example.com', clientAddress: '456 Home Road, Johannesburg', items: [{ description: 'Product Package x10', quantity: 10, price: 250 }] } },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [type, setType] = useState('invoice');
  const [companyName, setCompanyName] = useState('SimbaPDF');
  const [companyAddress, setCompanyAddress] = useState('Online Service - South Africa');
  const [vatNumber, setVatNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-XXXXXX'); // Placeholder
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(15);
  const [notes, setNotes] = useState('');
  const [extraText, setExtraText] = useState('Payment due within 7 days. Thank you for your business!');
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInvoiceNumber('INV-' + Date.now().toString().slice(-6));
  }, []);

  // Load selected template
  useEffect(() => {
    setClientName(selectedTemplate.data.clientName || '');
    setClientEmail(selectedTemplate.data.clientEmail || '');
    setClientAddress(selectedTemplate.data.clientAddress || '');
    setItems(selectedTemplate.data.items || [{ description: '', quantity: 1, price: 0 }]);
  }, [selectedTemplate]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) || 0 : value;
    setItems(newItems);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const generatePDF = () => {
    setBusy(true);
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(type === 'invoice' ? 'INVOICE' : 'STATEMENT', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`#${invoiceNumber}`, 105, 30, { align: 'center' });
    doc.text(`Date: ${date}`, 105, 38, { align: 'center' });

    doc.setFontSize(14);
    doc.text(companyName, 20, 50);
    doc.setFontSize(10);
    doc.text(companyAddress, 20, 58);
    doc.text(`VAT: ${vatNumber || 'Not registered'}`, 20, 64);

    doc.text('Bill To:', 20, 80);
    doc.text(clientName || 'Client Name', 20, 88);
    doc.text(clientEmail || 'client@email.com', 20, 94);
    doc.text(clientAddress || 'Client Address', 20, 100);

    doc.setFontSize(12);
    doc.text('Description', 20, 120);
    doc.text('Qty', 100, 120);
    doc.text('Unit Price', 130, 120);
    doc.text('Total', 170, 120);

    let y = 130;
    items.forEach(item => {
      if (item.description) {
        doc.text(item.description, 20, y);
        doc.text(item.quantity.toString(), 100, y);
        doc.text(`R${item.price.toFixed(2)}`, 130, y);
        doc.text(`R${(item.quantity * item.price).toFixed(2)}`, 170, y);
        y += 10;
      }
    });

    y += 10;
    doc.text('Subtotal:', 130, y);
    doc.text(`R${subtotal.toFixed(2)}`, 170, y);
    y += 8;
    doc.text(`VAT (${taxRate}%)`, 130, y);
    doc.text(`R${tax.toFixed(2)}`, 170, y);
    y += 8;
    doc.setFontSize(14);
    doc.text('Total:', 130, y);
    doc.text(`R${total.toFixed(2)}`, 170, y);

    if (extraText || notes) {
      y += 20;
      doc.setFontSize(12);
      doc.text('Additional Information / Payment Terms:', 20, y);
      doc.text(extraText || '', 20, y + 8, { maxWidth: 170 });
      y += 20;
      doc.text(notes, 20, y, { maxWidth: 170 });
    }

    doc.save(`${type === 'invoice' ? 'Invoice' : 'Statement'}_${invoiceNumber}.pdf`);
    setBusy(false);
  };

  return (
    <>
      <Head>
        <title>Invoice & Statement Generator - SimbaPDF</title>
        <meta name="description" content="Create professional invoices and statements online for free." />
      </Head>

      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">SPDF</span>
            <div>
              <h1>SimbaPDF</h1>
              <p className="tagline">Invoice & Statement Generator</p>
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
          <section className="tool-section">
            <h2>Create Invoice or Statement</h2>
            <p className="hint">
              Fill in the details below. Generate and download as PDF instantly.
            </p>

            <AdBanner slot="2169503342" />

            {/* Template selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Choose a template:</label>
              <select
                value={selectedTemplate.name}
                onChange={(e) => {
                  const selected = templates.find(t => t.name === e.target.value);
                  setSelectedTemplate(selected);
                }}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              >
                {templates.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Type selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label>
                <input type="radio" value="invoice" checked={type === 'invoice'} onChange={() => setType('invoice')} /> Invoice
              </label>
              <label style={{ marginLeft: '1.5rem' }}>
                <input type="radio" value="statement" checked={type === 'statement'} onChange={() => setType('statement')} /> Statement
              </label>
            </div>

            {/* Company Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Your Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="text-input" style={{ width: '100%', marginBottom: '0.75rem' }} />

              <label>Company Address</label>
              <textarea value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} className="text-input" style={{ width: '100%', minHeight: '60px', marginBottom: '0.75rem' }} />

              <label>VAT Number (optional)</label>
              <input type="text" value={vatNumber} onChange={e => setVatNumber(e.target.value)} className="text-input" style={{ width: '100%' }} />
            </div>

            {/* Client Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Client Name</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="text-input" style={{ width: '100%', marginBottom: '0.75rem' }} placeholder="John Doe" />

              <label>Client Email</label>
              <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="text-input" style={{ width: '100%', marginBottom: '0.75rem' }} placeholder="client@example.com" />

              <label>Client Address</label>
              <textarea value={clientAddress} onChange={e => setClientAddress(e.target.value)} className="text-input" style={{ width: '100%', minHeight: '60px' }} placeholder="123 Client Street, Cape Town" />
            </div>

            {/* Invoice/Statement Number & Date */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label>Number</label>
                <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="text-input" style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="text-input" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Items */}
            <h3>Items / Services</h3>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 3 }}>
                  <label>Description</label>
                  <input type="text" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className="text-input" placeholder="Service / Product name" />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Qty</label>
                  <input type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} className="text-input" min="1" />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Price (R)</label>
                  <input type="number" value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} className="text-input" min="0" step="0.01" />
                </div>
                <button type="button" onClick={() => removeItem(index)} style={{ background: '#ff6b6b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={addItem} className="secondary-btn" style={{ marginTop: '0.5rem' }}>
              + Add Item
            </button>

            {/* Tax & Extra Text */}
            <div style={{ margin: '1.5rem 0' }}>
              <label>VAT/Tax Rate (%)</label>
              <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="text-input" style={{ width: '100px' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label>Extra Information / Payment Terms</label>
              <textarea value={extraText} onChange={e => setExtraText(e.target.value)} className="text-input" style={{ width: '100%', minHeight: '80px' }} placeholder="Payment due within 7 days. Bank details: ..." />
            </div>

            <div>
              <label>Additional Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-input" style={{ width: '100%', minHeight: '60px' }} placeholder="Any other notes..." />
            </div>

            {/* Totals */}
            <div style={{ margin: '2rem 0', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>VAT ({taxRate}%):</span>
                <span>R{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total:</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Generate Button */}
            {mounted ? (
              <button
                className="primary-btn"
                onClick={generatePDF}
                disabled={busy || !clientName.trim() || items.every(i => !i.description.trim())}
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '2rem' }}
              >
                Generate & Download {type === 'invoice' ? 'Invoice' : 'Statement'}
              </button>
            ) : (
              <button className="primary-btn" disabled style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '2rem' }}>
                Loading...
              </button>
            )}

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