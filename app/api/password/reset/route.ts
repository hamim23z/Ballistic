import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';
import { createAdminClient } from '@/lib/supabase/admin';
import { clientIp, isSameOrigin, jsonError, readJson } from '@/lib/passwordRequest';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IDENTIFIER_LENGTH = 254;
const USERS_PER_PAGE = 1000;
const MAX_PAGES = 20;

// Usernames live in user_metadata (set at sign up), so finding the email for
// one means asking the auth admin API. This pages through every user, which is
// fine at launch scale; swap it for a lookup on a profiles table once one exists.
async function emailsForUsername(username: string): Promise<string[]> {
  const admin = createAdminClient();
  if (!admin) {
    console.warn('[password/reset] SUPABASE_SECRET_KEY is not set, so usernames cannot be looked up.');
    return [];
  }

  const wanted = username.toLowerCase();
  const emails: string[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: USERS_PER_PAGE });
    if (error) {
      console.error('[password/reset] listUsers failed', error.message);
      break;
    }

    for (const user of data.users) {
      const meta = user.user_metadata ?? {};
      const name = meta.display_name ?? meta.username;
      if (user.email && typeof name === 'string' && name.trim().toLowerCase() === wanted) {
        emails.push(user.email);
      }
    }

    if (data.users.length < USERS_PER_PAGE) break;
  }

  return emails;
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return jsonError('Request origin not allowed.', 403);

  const { ok: withinLimit } = rateLimit(`password-reset:${clientIp(req)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000, // 5 requests per 10 minutes per IP
  });
  if (!withinLimit) return jsonError('Too many requests. Try again in a few minutes.', 429);

  const body = await readJson(req);
  const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
  if (!identifier) return jsonError('Enter your email or username.', 400);
  if (identifier.length > MAX_IDENTIFIER_LENGTH) return jsonError('That is too long.', 400);

  const isEmail = identifier.includes('@');
  if (isEmail && !EMAIL_RE.test(identifier)) return jsonError('Enter a valid email address.', 400);

  const emails = isEmail ? [identifier.toLowerCase()] : await emailsForUsername(identifier);

  // The link in the email comes back to /update-password with a one-time
  // token_hash, where the new password is set. See the README for the
  // Supabase "Reset password" email template this relies on.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  for (const email of emails.slice(0, 5)) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.nextUrl.origin}/update-password`,
    });
    if (error) console.error('[password/reset] resetPasswordForEmail failed', error.message);
  }

  // Same answer whether or not an account exists, so this can't be used to
  // find out who has signed up.
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  return jsonError('Method not allowed.', 405);
}
