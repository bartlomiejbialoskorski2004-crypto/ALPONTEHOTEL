import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude API, studio, Next internals, the opengraph-image metadata route,
  // and any file with an extension (sitemap.xml, robots.txt, icon.png, …) from
  // locale routing — otherwise next-intl rewrites them and they 404.
  matcher: ["/((?!api|studio|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
