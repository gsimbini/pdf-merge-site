// pages/api/pro/status.js
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const emailRaw = (req.query.email || "").toString().trim().toLowerCase();

    if (!emailRaw || !/^\S+@\S+\.\S+$/.test(emailRaw)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("pro_subscriptions")
      .select("email,status,plan,updated_at,payment_status")
      .eq("email", emailRaw)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Database error" });
    }

    const isPro = !!data && data.status === "active" && (data.payment_status || "").toUpperCase() === "COMPLETE";

    return res.status(200).json({
      email: emailRaw,
      isPro,
      status: data?.status || "none",
      plan: data?.plan || null,
      updated_at: data?.updated_at || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
