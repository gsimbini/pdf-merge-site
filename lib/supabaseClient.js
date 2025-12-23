// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

/**
 * Returns the Supabase client instance.
 * Creates it only once on the client-side.
 * Returns null on server-side or if env vars are missing.
 */
export function getSupabase() {
  // Server-side (SSR or static build) → no Supabase
  if (typeof window === "undefined") {
    return null;
  }

  // Return cached instance if already created
  if (supabase) {
    return supabase;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.warn("Supabase client not initialized: missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");

  // Warn if env vars are missing (common in local dev without .env.local)
  if (!url || !anonKey) {
    console.warn(
      "Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file."
    );
    return null;
  }

  // Create and cache the client
  supabase = createClient(url, anonKey);
  return supabase;
}

// Optional: Export the instance directly for convenience in some places
// (but keep using getSupabase() in useProStatus for safety)
export default getSupabase;