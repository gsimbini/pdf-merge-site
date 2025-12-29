// pages/api/payfast/itn.js
import crypto from 'crypto';

// Replace with your actual Pro activation function (e.g., update DB or localStorage)
async function activatePro(email, plan, token) {
  // Your logic here: e.g., save to database, extend subscription expiry
  console.log(`Activating Pro for ${email} on ${plan} plan with token ${token}`);
  // Example: await db.users.update({ email }, { pro: true, token });
}

const PAYFAST = {
  merchantId: process.env.PAYFAST_MERCHANT_ID,
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  sandbox: process.env.PAYFAST_SANDBOX === 'true',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Acknowledge immediately to stop PayFast retries
  res.status(200).end();

  const data = req.body;

  // Log the entire incoming ITN for debugging (remove in production for security)
  console.log('Incoming ITN:', data);

  // Step 1: Verify signature
  const pfParamString = Object.entries(data)
    .filter(([key]) => key !== 'signature')
    .map(([key, value]) => `${key}=${encodeURIComponent(value.toString().trim())}`)
    .join('&');
  const verificationString = pfParamString + `&passphrase=${encodeURIComponent(PAYFAST.passphrase.trim())}`;
  const calculatedSignature = crypto.createHash('md5').update(verificationString).digest('hex');

  if (data.signature !== calculatedSignature) {
    console.error('Invalid ITN signature');
    return;
  }

  // Step 2: Check if payment is COMPLETE
  if (data.payment_status !== 'COMPLETE') {
    console.error('ITN payment not COMPLETE:', data.payment_status);
    return;
  }

  // Step 3: Server-side validation with PayFast (optional but recommended)
  const pfHost = PAYFAST.sandbox ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
  const validateUrl = `https://${pfHost}/eng/query/validate`;
  const validateResponse = await fetch(validateUrl, {
    method: 'POST',
    body: new URLSearchParams(data),
  });
  const validationResult = await validateResponse.text();

  if (validationResult !== 'VALID') {
    console.error('Invalid ITN transaction');
    return;
  }

  // Step 4: Process the successful payment (activate Pro)
  const email = data.custom_str1;  // From your init data
  const plan = data.custom_str2;   // From your init data
  const token = data.token;        // Subscription token for recurring management
  await activatePro(email, plan, token);

  console.log(`ITN processed successfully for ${email}`);
}