// components/SiteHeader.js
import Link from "next/link";
import ProBadge from "./ProBadge";

export default function SiteHeader({ tagline = "Fast • Free • Secure PDF tools" }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo-circle">SPDF</span>
        <div>
          <h1>SimbaPDF</h1>
          <p className="tagline">{tagline}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/login">Login</Link>
        </nav>

        <ProBadge />
      </div>
    </header>
  );
}
