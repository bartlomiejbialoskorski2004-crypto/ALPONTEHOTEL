import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Content-Security-Policy directives, scoped to what the site actually loads:
// - Google Maps embed (iframe) in Contact.tsx -> frame-src google
// - Sanity CDN (cdn.sanity.io) + YouTube thumbnails (i.ytimg.com) -> img-src
// - Sanity API (when CMS is connected) -> connect-src
// next/font self-hosts the fonts under /_next, so font-src stays 'self'.
//
// TODO(security): script-src/style-src currently allow 'unsafe-inline' because
// Next.js App Router injects inline bootstrap/hydration scripts (and Tailwind/
// Motion emit inline style attributes) on statically prerendered pages. Migrate
// to a nonce-based CSP (per-request nonce set in middleware + 'strict-dynamic')
// and drop 'unsafe-inline' once ready; then switch the header below from
// Content-Security-Policy-Report-Only to Content-Security-Policy to enforce.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
  "font-src 'self'",
  "frame-src https://maps.google.com https://www.google.com",
  "connect-src 'self' https://cdn.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
];

const securityHeaders = [
  // Force HTTPS for two years, including subdomains; eligible for preload.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Report-Only first: observe violations without blocking. Promote to
  // "Content-Security-Policy" after a nonce-based migration (see TODO above).
  {
    key: "Content-Security-Policy-Report-Only",
    value: cspDirectives.join("; "),
  },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
