import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// Landing route for the link in Supabase's confirmation email.
// Handles both the PKCE `code` link and the `token_hash` link template.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const nextParam = searchParams.get('next') ?? '/play';
  // Only allow same-site relative redirects.
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/play';

  const supabase = await createSupabaseServerClient();

  let error: unknown = null;
  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  } else {
    error = new Error('Missing code');
  }

  const target = new URL(next, origin);
  if (error) target.searchParams.set('auth_error', 'confirm');
  return NextResponse.redirect(target);
}
