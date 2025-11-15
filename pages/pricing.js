import Head from 'next/head';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing - PDFFusion Pro</title>
        <meta
          name="description"
          content="Upgrade to PDFFusion Pro for larger files, no ads and more powerful PDF tools."
        />
      </Head>
      <div className="page">
        <header className="header">
          <div className="brand">
            <span className="logo-circle">PF</span>
            <div>
              <h1>PDFFusion</h1>
              <p className="tagline">Pro tools for power users</p>
            </div>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main className="main">
          <section className="tool-section">
            <h2>Choose your plan</h2>
            <p>
              Start free and upgrade only if you need more power. Built for
              students, HR, legal, finance and everyday business use.
            </p>

            <div className="grid">
              <div className="tool-card">
                <h3>Free</h3>
                <p>For light, occasional use.</p>
                <ul>
                  <li>✔ Merge PDFs</li>
                  <li>✔ Basic file size (e.g. up to 10 MB/file)</li>
                  <li>✔ Ads supported</li>
                  <li>✔ No account needed</li>
                </ul>
                <p><strong>R0 / forever</strong></p>
                <Link href="/merge-pdf" className="primary-btn">
                  Continue free
                </Link>
              </div>

              <div className="tool-card">
                <h3>Pro Monthly</h3>
                <p>For heavy users and small teams.</p>
                <ul>
                  <li>✔ Larger files (e.g. up to 200 MB)</li>
                  <li>✔ Priority processing</li>
                  <li>✔ No ads</li>
                  <li>✔ Extra tools (compress, split, convert)</li>
                </ul>
                <p><strong>R59 / month</strong></p>
                <button className="primary-btn">
                  Upgrade (coming soon)
                </button>
              </div>

              <div className="tool-card">
                <h3>Lifetime Pro</h3>
                <p>Pay once, use forever.</p>
                <ul>
                  <li>✔ All Pro Monthly features</li>
                  <li>✔ Lifetime access</li>
                  <li>✔ Best long-term value</li>
                </ul>
                <p><strong>R249 once-off</strong></p>
                <button className="primary-btn">
                  Upgrade (coming soon)
                </button>
              </div>
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
