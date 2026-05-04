import { HttpError } from "@/lib/http-error";

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;

function key(prefix: string, id: string) {
  return `${prefix}:${id}`;
}

export function rateLimitOrThrow(
  prefix: string,
  id: string,
  options?: { max?: number; windowMs?: number }
) {
  const max = options?.max ?? MAX_PER_WINDOW;
  const windowMs = options?.windowMs ?? WINDOW_MS;
  const k = key(prefix, id);
  const now = Date.now();
  let e = buckets.get(k);
  if (!e || now > e.resetAt) {
    e = { count: 0, resetAt: now + windowMs };
    buckets.set(k, e);
  }
  e.count += 1;
  if (e.count > max) {
    throw new HttpError(429, "Too many requests");
  }
}

export function cleanupRateBuckets(maxEntries = 10_000) {
  if (buckets.size <= maxEntries) return;
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now > v.resetAt) buckets.delete(k);
  }
}
