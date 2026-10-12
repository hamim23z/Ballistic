// Both values are public (they ship to the browser). Supabase now calls the
// key the "publishable" key; older projects call it the "anon" key. Either works.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
