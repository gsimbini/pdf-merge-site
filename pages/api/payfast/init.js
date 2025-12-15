// pages/api/payfast/init.js
import crypto from "crypto";

function pfEncode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}

function generateSignature(data, passphrase = "") {
  const sorted = Object.keys(data)
    .filter((k) => data[k] !== undefined && data[k] !== null && data[k] !== "")
    .sort()
    .map((key) => `${key}=${pfEncode(data[key])}`)
    .join("&");

  const stringToSign = passphrase ? `${sorted}&passphrase=${pfEncode(passphrase)}` : sorted;

  return crypto.createHash("md5").update(stringToSign).digest("hex");
}

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { plan, email } = req.body || {}; // plan: "monthly" | "yearly" , optional email

  if (!plan || (plan !== "monthly" && plan !== "yearly")) {
    return res.status(400).json({ error: "Invalid plan. Use 'monthly' or 'yearly'." });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return res.status(500).json({ error: "Missing NEXT_PUBLIC_SITE_URL" });

  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  if (!merchant_id || !merchant_key) {
    return res.status(500).json({ error: "Missing PAYFAST merchant credentials" });
  }

  const amount =
    plan === "yearly" ? process.env.PAYFAST_YEARLY_AMOUNT : process.env.PAYFAST_MONTHLY_AMOUNT;

  if (!amount) return res.status(500).json({ error: "Missing PayFast amount env vars" });

  // Choose PayFast endpoint:
  // - Use sandbox while testing
  // - Switch to live when ready
  const useSandbox = process.env.PAYFAST_SANDBOX === "true";
  const payfastUrl = useSandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  const today = new Date();
  const billing_date = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const data = {
    merchant_id,
    merchant_key,

    return_url: `${siteUrl}/payment-success`,
    cancel_url: `${siteUrl}/payment-cancel`,
    notify_url: `${siteUrl}/api/payfast/itn`,

    // Buyer info (optional — helps conversions, but don't hardcode fake data)
    email_address: email || "",

    m_payment_id: `simbapdf-${plan}-${Date.now()}`,

    amount: Number(amount).toFixed(2), // PayFast expects "0.00"
    item_name: `SimbaPDF Pro (${plan})`,

    // Subscription fields
    subscription_type: "1", // 1 = subscription
    billing_date,
    recurring_amount: Number(amount).toFixed(2),
    frequency: plan === "yearly" ? "6" : "3", // 3=monthly, 6=yearly
    cycles: "0", // 0 = indefinite
  };

  data.signature = generateSignature(data, passphrase || "");

  return res.status(200).json({ payfastUrl, data });
}
