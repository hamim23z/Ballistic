// A minimal in-memory rate limiter, keyed by client IP.
//
// SECURITY NOTE: this only works because it lives in one process's memory.
// On Vercel/serverless or any multi-instance deployment, each instance gets
// its own counters, so this is NOT a real limit under horizontal scaling —
// swap this for Upstash Redis, Vercel KV, or similar before you rely on it
// in production. It's here so the endpoint isn't wide open with nothing.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Prevent unbounded memory growth from spoofed/varying IPs hitting the route.
const MAX_TRACKED_KEYS = 5000;

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      const firstKey = buckets.keys().next().value;
      if (firstKey) buckets.delete(firstKey);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count };
}
