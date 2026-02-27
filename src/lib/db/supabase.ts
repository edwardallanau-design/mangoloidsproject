/**
 * Supabase server-side client (service role)
 * Used only in server components and API routes — never exposed to the browser.
 * Lazily initialized to avoid build-time failures when env vars are placeholders.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    );
  }

  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
