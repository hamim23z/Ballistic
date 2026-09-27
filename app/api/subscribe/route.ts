import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const ALLOWED_ORIGINS = new Set([
  'https://playballistic.com',
  'http://localhost:3000',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { ok: false, error: message },
    { status, headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return jsonError('Request origin not allowed.', 403);
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { ok: withinLimit } = rateLimit(`subscribe:${ip}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000, // 5 requests per 10 minutes per IP
  });
  if (!withinLimit) {
    return jsonError('Too many requests. Try again later.', 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  if (typeof body !== 'object' || body === null) {
    return jsonError('Invalid request body.', 400);
  }

  const { email, company } = body as Record<string, unknown>;

  // Honeypot: a real visitor never fills this hidden field. A bot filling
  // out every field usually does. Pretend success so bots don't learn.
  if (typeof company === 'string' && company.trim().length > 0) {
    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (typeof email !== 'string' || email.length === 0) {
    return jsonError('Email is required.', 400);
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(trimmed)) {
    return jsonError('Enter a valid email address.', 400);
  }

  // --- TODO before real launch ---
  // Nothing is persisted yet. Wire this to a real subscriber store and/or
  // email provider (e.g. Resend, Postmark, a Postgres table via your ORM,
  // or an ESP like Mailchimp/Beehiiv) before depending on this list for
  // launch communications. Avoid logging the raw address in plaintext to
  // provider logs long-term — this is a placeholder for local development.
  console.info('[subscribe] new signup', {
    domain: trimmed.split('@')[1],
    at: new Date().toISOString(),
  });

  return NextResponse.json(
    { ok: true },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function GET() {
  return jsonError('Method not allowed.', 405);
}
