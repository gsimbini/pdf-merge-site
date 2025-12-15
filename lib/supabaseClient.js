// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

let supabase = null;

export function getSupabase() {
  // Only create on the client
  if (typeof window === "undefined") return null;

  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing, do NOT crash the app
  if (!url || !anon) {
    console.warn("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return null;
  }

  supabase = createClient(url, anon);
  return supabase;
}
