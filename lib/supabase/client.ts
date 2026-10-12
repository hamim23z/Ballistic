'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from './env';

let browserClient: SupabaseClient | null = null;

// One client per tab; createBrowserClient keeps the session in cookies so the
// server (proxy.ts, route handlers) sees the same signed-in user.
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return browserClient;
}
