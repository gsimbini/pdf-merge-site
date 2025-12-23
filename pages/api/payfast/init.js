// pages/api/payfast/init.js
import crypto from "crypto";

function pfEncode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}

function generateSignature(data, passphrase = "") {
  const clean = { ...data };
  delete clean.signature;

  const sorted = Object.keys(clean)
    .filter((k) => clean[k] !== undefined && clean[k] !== null && clean[k] !== "")
    .sort()
    .map((key) => `${key}=${pfEncode(clean[key])}`)
    .join("&");

  const stringToSign = passphrase ? `${sorted}&passphrase=${pfEncode(passphrase)}` : sorted;
  return crypto.createHash("md5").update(stringToSign).digest("hex");
}

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { plan, email } = req.body || {};

  if (!plan || (plan !== "monthly" && plan !== "yearly")) {
    return res.status(400).json({ error: "Invalid plan. Use 'monthly' or 'yearly'." });
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required for Pro activation." });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return res.status(500).json({ error: "Missing NEXT_PUBLIC_SITE_URL" });

  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";
  const sandbox = process.env.PAYFAST_SANDBOX === "true";

  if (!merchant_id || !merchant_key) {
    return res.status(500).json({ error: "Missing PAYFAST merchant credentials" });
  }

  const amount =
    plan === "yearly"
      ? process.env.PAYFAST_YEARLY_AMOUNT
      : process.env.PAYFAST_MONTHLY_AMOUNT;

  if (!amount) return res.status(500).json({ error: "Missing PAYFAST amount env vars" });

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

    // Buyer email (PayFast may return it in ITN, but we also store it in custom_str1)
    email_address: email,

    // Custom fields (these come back in ITN)
    custom_str1: email,
    custom_str2: plan,

    m_payment_id,

    amount: Number(amount).toFixed(2),
    item_name: `SimbaPDF Pro (${plan})`,

    // Subscription setup
    subscription_type: "1", // 1 = subscription
    billing_date,
    recurring_amount: Number(amount).toFixed(2),
    frequency: plan === "yearly" ? "6" : "3", // 3=monthly, 6=yearly
    cycles: "0", // 0 = indefinite
  };

  data.signature = generateSignature(data, passphrase);

  return res.status(200).json({ payfastUrl, data });
}
