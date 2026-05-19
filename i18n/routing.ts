import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en", "pl", "fr", "de"],
  defaultLocale: "it",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
