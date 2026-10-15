import { createClient } from '@supabase/supabase-js'

// Server-only client with the secret key. Never import this from a client
// component: the key bypasses row level security.
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!secretKey) return null

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
