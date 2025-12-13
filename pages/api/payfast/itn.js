// pages/api/payfast/itn.js
import crypto from "crypto";
import https from "https";

// IMPORTANT: PayFast ITN needs raw body for signature checks
export const config = {
  api: {
    bodyParser: false,
  },
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
    const req = https.request(
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
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// Optional: check if request IP is from PayFast
// Note: On Vercel you often get the real client IP via x-forwarded-for.
function getRequestIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) return xf.split(",")[0].trim();
  if (Array.isArray(xf) && xf.length > 0) return xf[0];
  return req.socket?.remoteAddress || "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const rawBody = await readRawBody(req);
    const data = parseFormEncoded(rawBody);

    // 1) Signature verification (local)
    const expected = generateSignature(data, process.env.PAYFAST_PASSPHRASE || "");
    const received = data.signature || "";

    if (expected !== received) {
      console.error("PayFast ITN: signature mismatch", { expected, received });
      return res.status(400).send("INVALID SIGNATURE");
    }

    // 2) Optional: Server validation with PayFast
    // PayFast recommends posting the exact received body back to /eng/query/validate.
    const sandbox = process.env.PAYFAST_SANDBOX === "true";
    const validateResp = await postToPayFastValidate(rawBody, sandbox);

    if (typeof validateResp !== "string" || !validateResp.includes("VALID")) {
      console.error("PayFast ITN: server validation failed:", validateResp);
      return res.status(400).send("INVALID ITN");
    }

    // 3) Optional: basic status checks (don’t “activate pro” unless COMPLETE)
    // Common statuses: COMPLETE, FAILED, PENDING
    const paymentStatus = (data.payment_status || "").toUpperCase();

    // Helpful logs (safe)
    console.log("PayFast ITN OK:", {
      ip: getRequestIp(req),
      m_payment_id: data.m_payment_id,
      pf_payment_id: data.pf_payment_id,
      payment_status: paymentStatus,
      amount_gross: data.amount_gross,
      item_name: data.item_name,
      email_address: data.email_address,
    });

    // TODO next: activate Pro only when paymentStatus === "COMPLETE"
    // and optionally verify amount/item_name against what you expect.

    return res.status(200).send("OK");
  } catch (err) {
    console.error("PayFast ITN error:", err);
    return res.status(500).send("SERVER ERROR");
  }
}
