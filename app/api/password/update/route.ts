import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { createClient } from '@/lib/supabase/server';
import { clientIp, isSameOrigin, jsonError, readJson } from '@/lib/passwordRequest';

export const runtime = 'nodejs';

const MIN_LENGTH = 8;
const MAX_LENGTH = 72;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return jsonError('Request origin not allowed.', 403);

  const { ok: withinLimit } = rateLimit(`password-update:${clientIp(req)}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!withinLimit) return jsonError('Too many requests. Try again in a few minutes.', 429);

  const body = await readJson(req);
  const tokenHash = typeof body?.tokenHash === 'string' ? body.tokenHash : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!tokenHash) return jsonError('This page needs the link from your email.', 400);
  if (password.length < MIN_LENGTH) return jsonError(`Use at least ${MIN_LENGTH} characters.`, 400);
  if (password.length > MAX_LENGTH) return jsonError(`Use at most ${MAX_LENGTH} characters.`, 400);

  const supabase = await createClient();

  // The emailed link is the proof of ownership. It is only spent here, when the
  // new password is submitted, so link scanners that open emails can't burn it.
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: 'recovery',
    token_hash: tokenHash,
  });
  if (verifyError) {
    return NextResponse.json(
      { ok: false, error: 'This link has expired or was already used. Request a new one.', expired: true },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    // The link is spent at this point, so don't leave a half-finished session.
    await supabase.auth.signOut();
    return NextResponse.json(
      { ok: false, error: `${updateError.message} Request a new link to try again.`, expired: true },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  return jsonError('Method not allowed.', 405);
}
