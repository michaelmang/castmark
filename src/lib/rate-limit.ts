type Bucket = { count: number; resetAt: number };

// In-memory only — resets on cold start and isn't shared across serverless
// instances. That's a real limitation, but it's a deliberate tradeoff: it
// adds no new persisted data (the IP is never written to the database,
// keeping this compatible with the privacy policy), and needs no extra
// infra. It blunts basic bot hammering; it isn't DDoS protection — use
// Vercel's Firewall for that.
const buckets = new Map<string, Bucket>();

// Cap memory growth from an unbounded stream of distinct keys/IPs.
const MAX_BUCKETS = 50_000;

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

/** Best-effort client IP from platform proxy headers. Used only as a
 * transient rate-limit key — never persisted. */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
