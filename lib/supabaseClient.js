// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Use a module-level variable to store the singleton instance
let supabaseInstance = null;

export function getSupabase() {
  // If we already have an instance, return it (singleton pattern)
  if (supabaseInstance !== null) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Safety check: make sure env vars are set
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key missing in environment variables');
    throw new Error('Supabase configuration is incomplete');
  }

  // Create the client and cache it
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);

  return supabaseInstance;
}

// Optional: direct export for convenience (use getSupabase() in most cases)
export const supabase = getSupabase();