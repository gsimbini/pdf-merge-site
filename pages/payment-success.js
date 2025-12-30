// pages/payment-success.js
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const router = useRouter();

  // Optional: You could read query params from PayFast if needed
  // e.g. const { payment_id, item_name } = router.query;

  useEffect(() => {
    // Optional: Clear any temporary state or show a toast
    // Example: if you have a global notification system
  }, []);

  return (
    <>
      <Head>
        <title>Payment Successful - SimbaPDF</title>
        <meta name="description" content="Your Pro subscription is now active!" />
      </Head>

      <div className="page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "500px", padding: "2rem" }}>
          <h1 style={{ color: "#4caf50", fontSize: "3rem", marginBottom: "1rem" }}>Success!</h1>
          
          <div style={{ fontSize: "1.3rem", marginBottom: "2rem" }}>
            <p>Your payment was successful.</p>
            <p><strong>SimbaPDF Pro is now active</strong> for your account.</p>
            <p>You'll receive a confirmation email shortly from PayFast.</p>
            <p>Thank you for upgrading!</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            <Link href="/" className="primary-btn" style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}>
              Go to Homepage
            </Link>
            
            <Link href="/account" className="primary-btn" style={{ padding: "1rem 2rem", fontSize: "1.2rem", background: "#2196f3" }}>
              View Your Account
            </Link>
          </div>

          <p style={{ marginTop: "2rem", color: "#888", fontSize: "0.95rem" }}>
            If you don't see Pro features immediately, wait a few minutes for server sync or refresh the page.
          </p>
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