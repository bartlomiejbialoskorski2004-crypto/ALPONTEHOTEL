// Route Handler helpers for the App Router.
//
// The project has no API routes yet; this is a typed, reusable foundation so the
// first endpoint gets method validation, body validation, safe error handling
// (no stack-trace leakage), consistent JSON responses, and optional rate
// limiting / webhook-secret checks without re-deriving any of it.
//
// Example usage in app/api/contact/route.ts:
//   export const POST = createHandler({
//     methods: ["POST"],
//     rateLimit: true,
//     validate: (body): body is { email: string } =>
//       typeof body === "object" && body !== null && "email" in body,
//     handler: async ({ body }) => json({ ok: true }),
//   });

import { NextResponse } from "next/server";
import { defaultRateLimiter, clientIp, type RateLimiter } from "./rate-limit";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HandlerContext<TBody> = {
  request: Request;
  body: TBody;
};

type HandlerConfig<TBody> = {
  /** Allowed HTTP methods; anything else gets 405. */
  methods: HttpMethod[];
  /** Type guard validating the parsed JSON body. Omit for body-less requests. */
  validate?: (body: unknown) => body is TBody;
  /** Enable rate limiting (uses defaultRateLimiter unless `limiter` is given). */
  rateLimit?: boolean;
  limiter?: RateLimiter;
  /**
   * Require a matching secret in the `x-webhook-secret` header. Pass the env var
   * NAME (not the value), e.g. "SANITY_WEBHOOK_SECRET" — read server-side only.
   */
  webhookSecretEnv?: string;
  handler: (ctx: HandlerContext<TBody>) => Promise<Response> | Response;
};

/** Consistent JSON response helper. */
export function json(data: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

/** Consistent JSON error — never leaks internals. */
export function jsonError(status: number, message: string): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function createHandler<TBody = undefined>(
  config: HandlerConfig<TBody>,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    try {
      // 1. Method validation.
      if (!config.methods.includes(request.method as HttpMethod)) {
        return jsonError(405, "Method not allowed");
      }

      // 2. Webhook secret (constant-time-ish header check).
      if (config.webhookSecretEnv) {
        const expected = process.env[config.webhookSecretEnv];
        const provided = request.headers.get("x-webhook-secret");
        if (!expected || !provided || provided !== expected) {
          return jsonError(401, "Unauthorized");
        }
      }

      // 3. Rate limiting.
      if (config.rateLimit) {
        const limiter = config.limiter ?? defaultRateLimiter;
        const result = await limiter.limit(clientIp(request));
        if (!result.success) {
          return jsonError(429, "Too many requests");
        }
      }

      // 4. Body parsing + validation (only for methods that carry a body).
      let body = undefined as TBody;
      if (config.validate) {
        let parsed: unknown;
        try {
          parsed = await request.json();
        } catch {
          return jsonError(400, "Invalid JSON body");
        }
        if (!config.validate(parsed)) {
          return jsonError(400, "Invalid request body");
        }
        body = parsed;
      }

      // 5. Run the handler.
      return await config.handler({ request, body });
    } catch (error) {
      // 6. Safe error handling — log server-side, return an opaque message.
      // Never serialize the error/stack to the client.
      console.error("[api-handler] unhandled error:", error);
      return jsonError(500, "Internal server error");
    }
  };
}
