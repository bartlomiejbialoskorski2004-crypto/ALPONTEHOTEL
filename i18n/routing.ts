import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en", "pl", "fr", "de"],
  defaultLocale: "it",
  localePrefix: "as-needed",
  // No browser-language redirect: the site always opens in Italian; other
  // languages only via the switcher (/en, /pl, …).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
