// Rate-limiting scaffold.
//
// The project currently has no API routes, so nothing calls this yet. It exists
// so the first Route Handler added can rate-limit with one line and without
// rethinking the shape. Default is a process-local in-memory limiter (fine for
// a single instance / local dev); swap in Upstash for serverless/multi-instance
// production — see the TODO below.

export type RateLimitResult = {
  success: boolean;
  /** Configured request ceiling for the window. */
  limit: number;
  /** Requests still allowed in the current window. */
  remaining: number;
  /** Unix ms timestamp when the current window resets. */
  reset: number;
};

export interface RateLimiter {
  /** `identifier` should be a stable key per client, e.g. the IP address. */
  limit(identifier: string): Promise<RateLimitResult>;
}

type Options = {
  /** Max requests allowed per window. */
  requests: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

// In-memory fixed-window limiter. NOTE: state is per-process, so on Vercel's
// serverless/edge runtime each instance counts independently — adequate for
// dev and low-traffic single-instance setups, NOT for distributed production.
export function inMemoryRateLimiter({
  requests,
  windowMs,
}: Options): RateLimiter {
  const hits = new Map<string, { count: number; reset: number }>();

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const entry = hits.get(identifier);

      if (!entry || entry.reset <= now) {
        const reset = now + windowMs;
        hits.set(identifier, { count: 1, reset });
        return { success: true, limit: requests, remaining: requests - 1, reset };
      }

      entry.count += 1;
      const remaining = Math.max(0, requests - entry.count);
      return {
        success: entry.count <= requests,
        limit: requests,
        remaining,
        reset: entry.reset,
      };
    },
  };
}

// TODO(rate-limit): for production on Vercel, back this with Upstash Redis so the
// window is shared across instances. Install `@upstash/ratelimit` + `@upstash/redis`,
// set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the environment
// (server-only — NO NEXT_PUBLIC_ prefix), then implement:
//
//   import { Ratelimit } from "@upstash/ratelimit";
//   import { Redis } from "@upstash/redis";
//   export function upstashRateLimiter(o: Options): RateLimiter {
//     const ratelimit = new Ratelimit({
//       redis: Redis.fromEnv(),
//       limiter: Ratelimit.fixedWindow(o.requests, `${o.windowMs} ms`),
//     });
//     return { limit: (id) => ratelimit.limit(id).then((r) => ({
//       success: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset,
//     })) };
//   }
//
// Then select the limiter by env: `const limiter = process.env.UPSTASH_REDIS_REST_URL
// ? upstashRateLimiter(opts) : inMemoryRateLimiter(opts);`

// Shared default for any future endpoint until Upstash is wired.
export const defaultRateLimiter: RateLimiter = inMemoryRateLimiter({
  requests: 10,
  windowMs: 10_000,
});

// Best-effort client IP from standard proxy headers (Vercel sets these).
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
