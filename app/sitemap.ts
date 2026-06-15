import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localeUrl, buildLanguages } from "@/lib/site";

// Indexable routes, each expanded across every locale below.
const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/attractions", priority: 0.8, changeFrequency: "monthly" },
  { path: "/informations", priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    routing.locales.map((locale) => {
      const isDefault = locale === routing.defaultLocale;
      return {
        url: localeUrl(locale, route.path),
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: isDefault ? route.priority : route.priority * 0.8,
        alternates: { languages: buildLanguages(route.path) },
      };
    }),
  );
}
