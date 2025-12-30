// pages/api/payfast/init.js
import crypto from "crypto";

function pfEncode(value) {
  // PayFast-compatible URL encoding:
  // - spaces become '+'
  // - percent escapes in uppercase hex (e.g. %3A not %3a)
  return encodeURIComponent(String(value))
    .replace(/%20/g, "+")
    .replace(/%[0-9a-f]{2}/gi, (match) => match.toUpperCase());
}

function generateSignature(data, passphrase = "") {
  const clean = { ...data };
  delete clean.signature;

  // Sort keys alphabetically
  const keys = Object.keys(clean)
    .filter((key) => clean[key] !== undefined && clean[key] !== null && String(clean[key]).trim() !== "")
    .sort();

  // Build param string
  const paramString = keys
    .map((key) => `${key}=${pfEncode(String(clean[key]).trim())}`)
    .join("&");

  // Append passphrase if provided
  const stringToSign = passphrase
    ? `${paramString}&passphrase=${pfEncode(passphrase.trim())}`
    : paramString;

  // Generate MD5 hash
  return crypto.createHash("md5").update(stringToSign).digest("hex");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan, email } = req.body || {};

  if (!plan || (plan !== "monthly" && plan !== "yearly")) {
    return res.status(400).json({ error: "Invalid plan. Must be 'monthly' or 'yearly'." });
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required for Pro activation." });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (!siteUrl) {
    return res.status(500).json({
      error: "Missing NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_BASE_URL in environment variables",
    });
  }

  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";

  if (!merchant_id || !merchant_key) {
    return res.status(500).json({
      error: "Missing PayFast merchant credentials in environment variables",
    });
  }

  // Amount configuration
  const amountStr =
    plan === "yearly"
      ? process.env.PAYFAST_YEARLY_AMOUNT || "490"
      : process.env.PAYFAST_MONTHLY_AMOUNT || "49";

  const amountNum = Number(amountStr);
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return res.status(500).json({ error: "Invalid payment amount configuration" });
  }

  const amount = amountNum.toFixed(2);

  const sandbox = process.env.PAYFAST_SANDBOX === "true";
  const payfastUrl = sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  const billing_date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const m_payment_id = `simbapdf-${plan}-${Date.now()}`;

  const data = {
    merchant_id,
    merchant_key,

    return_url: `${siteUrl}/payment-success`,
    cancel_url: `${siteUrl}/payment-cancel`,
    notify_url: `${siteUrl}/api/payfast/itn`,

    // Buyer info
    email_address: email,

    // Custom fields returned in ITN
    custom_str1: email,       // email for activation
    custom_str2: plan,        // plan type

    m_payment_id,
    amount,
    item_name: `SimbaPDF Pro ${plan === "monthly" ? "Monthly" : "Yearly"} Subscription`,

    // Recurring subscription (fixed)
    subscription_type: "1",                    // 1 = fixed recurring subscription
    billing_date,                              // recurring start date
    recurring_amount: amount,                  // amount for each future cycle
    frequency: plan === "yearly" ? "6" : "3",  // 3 = monthly, 6 = annual
    cycles: "0",                               // 0 = indefinite / forever

    // Optional notifications (comment out if not needed)
    // subscription_notify_email: "true",
    // subscription_notify_buyer: "true",
  };

  // Generate signature
  data.signature = generateSignature(data, passphrase);

  return res.status(200).json({ payfastUrl, data });
}