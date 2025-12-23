// pages/api/payfast/itn.js
import crypto from "crypto";
import https from "https";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function parseFormEncoded(body) {
  const params = new URLSearchParams(body);
  const obj = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  return obj;
}

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

function postToPayFastValidate(body, sandbox) {
  const host = sandbox ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  const path = "/eng/query/validate";

  return new Promise((resolve, reject) => {
    const r = https.request(
      {
        method: "POST",
        host,
        path,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let out = "";
        res.on("data", (c) => (out += c));
        res.on("end", () => resolve(out));
      }
    );
    r.on("error", reject);
    r.write(body);
    r.end();
  });
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const rawBody = await readRawBody(req);
    const data = parseFormEncoded(rawBody);

    const sandbox = process.env.PAYFAST_SANDBOX === "true";
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    // 1) Local signature verification
    const expectedSig = generateSignature(data, passphrase);
    if ((data.signature || "") !== expectedSig) {
      console.error("PayFast ITN: signature mismatch");
      return res.status(400).send("INVALID SIGNATURE");
    }

    // 2) Server validation with PayFast
    const validateResp = await postToPayFastValidate(rawBody, sandbox);
    if (!validateResp || !validateResp.includes("VALID")) {
      console.error("PayFast ITN: server validation failed:", validateResp);
      return res.status(400).send("INVALID ITN");
    }

    const paymentStatus = String(data.payment_status || "").toUpperCase();
    const email = (data.custom_str1 || data.email_address || "").toLowerCase().trim();
    const plan = (data.custom_str2 || "").toLowerCase();

    // Always log validated ITNs
    console.log("PayFast ITN VALID:", {
      payment_status: paymentStatus,
      email,
      plan,
      pf_payment_id: data.pf_payment_id,
      m_payment_id: data.m_payment_id,
      amount_gross: data.amount_gross,
      item_name: data.item_name,
    });

    // 3) Activate ONLY when COMPLETE
    if (paymentStatus === "COMPLETE") {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        console.error("PayFast ITN: COMPLETE but missing/invalid email");
        return res.status(200).send("OK"); // acknowledge but don't activate
      }

      const supabase = getSupabase();

      const row = {
        email,
        status: "active",
        plan: plan === "yearly" ? "yearly" : "monthly",
        pf_payment_id: data.pf_payment_id || null,
        m_payment_id: data.m_payment_id || null,
        amount_gross: data.amount_gross || null,
        item_name: data.item_name || null,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("pro_subscriptions")
        .upsert(row, { onConflict: "email" });

      if (error) {
        console.error("Supabase upsert error:", error);
        // still return OK so PayFast doesn't retry forever
      }
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("PayFast ITN error:", err);
    return res.status(500).send("SERVER ERROR");
  }
}
