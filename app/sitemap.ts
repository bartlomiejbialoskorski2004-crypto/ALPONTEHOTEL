import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => {
    const path = locale === routing.defaultLocale ? "" : `/${locale}`;
    return {
      url: `${siteUrl}${path || "/"}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: locale === routing.defaultLocale ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            `${siteUrl}${l === routing.defaultLocale ? "" : `/${l}`}`,
          ]),
        ),
      },
    };
  });
}
