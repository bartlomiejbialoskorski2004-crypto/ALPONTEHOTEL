import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Only the live production deployment should be indexable. Vercel sets
// VERCEL_ENV to "production" | "preview" | "development"; everything that is
// not production (preview/staging builds, local) gets a noindex header so it
// never leaks into search results. Production indexability is untouched.
const isProduction = process.env.VERCEL_ENV === "production";

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  if (!isProduction) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Exclude API, studio, Next internals, the opengraph-image metadata route,
  // and any file with an extension (sitemap.xml, robots.txt, icon.png, …) from
  // locale routing — otherwise next-intl rewrites them and they 404.
  matcher: ["/((?!api|studio|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
