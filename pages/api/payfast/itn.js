// pages/api/payfast/itn.js
import crypto from 'crypto';

// IMPORTANT: Replace this with your REAL Pro activation logic
// (e.g. database update, subscription expiry extension, user flag)
async function activatePro(email, plan, token) {
  if (!email || !plan || !token) {
    console.warn('Missing activation data in ITN:', { email, plan, token });
    return;
  }

  console.log(`PRO ACTIVATION: ${email} for ${plan} plan (token: ${token})`);

  // TODO: Real implementation
  // Example with Prisma/Supabase:
  // await prisma.user.update({
  //   where: { email },
  //   data: { isPro: true, proPlan: plan, subscriptionToken: token, updatedAt: new Date() }
  // });

  // Or send confirmation email, update cache, etc.
}

const PAYFAST = {
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  sandbox: process.env.PAYFAST_SANDBOX === 'true',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Acknowledge immediately (critical to prevent PayFast retries)
  res.status(200).end();

  const data = req.body;

  // Optional minimal logging (do NOT log full body in production)
  // console.log('ITN received from:', req.headers['x-forwarded-for'] || 'unknown');

  // Step 1: Verify signature
  const pfParamString = Object.entries(data)
    .filter(([key]) => key !== 'signature')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value).trim())}`)
    .join('&');

  const stringToSign = pfParamString + (PAYFAST.passphrase ? `&passphrase=${encodeURIComponent(PAYFAST.passphrase)}` : '');
  const calculatedSignature = crypto.createHash('md5').update(stringToSign).digest('hex');

  if (data.signature !== calculatedSignature) {
    console.error('Invalid ITN signature');
    return;
  }

  // Step 2: Only process COMPLETE payments
  if (data.payment_status !== 'COMPLETE') {
    console.log('ITN ignored - not COMPLETE:', data.payment_status);
    return;
  }

  // Step 3: Optional server-side validation (skip in sandbox if unstable)
  if (!PAYFAST.sandbox) {
    try {
      const pfHost = 'www.payfast.co.za';
      const validateUrl = `https://${pfHost}/eng/query/validate`;
      const validateResponse = await fetch(validateUrl, {
        method: 'POST',
        body: new URLSearchParams(data),
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      const validationResult = await validateResponse.text();

      if (validationResult !== 'VALID') {
        console.error('ITN validation failed:', validationResult);
        return;
      }
    } catch (err) {
      console.error('ITN validation request failed:', err.message);
      // Optionally continue or return — PayFast still considers it valid if signature ok
    }
  }

  // Step 4: Activate Pro
  const email = String(data.custom_str1 || '').trim();
  const plan = String(data.custom_str2 || '').trim();
  const token = String(data.token || '').trim();

  await activatePro(email, plan, token);

  console.log(`ITN processed successfully for ${email || 'unknown'}`);
}