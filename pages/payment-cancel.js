// pages/payment-cancel.js
import Head from "next/head";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <>
      <Head>
        <title>Payment Cancelled - SimbaPDF</title>
        <meta name="description" content="Your payment was cancelled." />
      </Head>

      <div className="page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "500px", padding: "2rem" }}>
          <h1 style={{ color: "#f44336", fontSize: "3rem", marginBottom: "1rem" }}>Payment Cancelled</h1>
          
          <div style={{ fontSize: "1.3rem", marginBottom: "2rem" }}>
            <p>Your payment was not completed.</p>
            <p>No charges were made to your account.</p>
            <p>You can try again whenever you're ready.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            <Link href="/pricing" className="primary-btn" style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}>
              Try Again
            </Link>
            
            <Link href="/" className="primary-btn" style={{ padding: "1rem 2rem", fontSize: "1.2rem", background: "#757575" }}>
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .primary-btn {
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        .primary-btn:hover {
          background: #43a047;
        }
      `}</style>
    </>
  );
}