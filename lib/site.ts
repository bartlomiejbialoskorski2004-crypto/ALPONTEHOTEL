// Single source of truth for the production origin and all SEO-derived URLs.
// Importing `siteUrl` from here (instead of re-deriving the env expression)
// keeps the canonical/hreflang/sitemap/robots/JSON-LD logic consistent.

import { routing } from "@/i18n/routing";
import {
  PHONE,
  EMAIL,
  INSTAGRAM,
  BOOKING,
  MAPS_LINK,
} from "@/components/contact-info";
import { RATINGS } from "@/components/reviewsData";

// Production origin. Fallback is the real domain (not localhost) so a missing
// env var in production degrades to a correct host rather than poisoning every
// canonical/sitemap URL with localhost. Local dev overrides via .env.local.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.al-ponte.ch";

// Absolute URL for a locale + path. Default locale has no prefix
// (localePrefix: "as-needed"); the bare default-locale home returns `${siteUrl}/`.
export function localeUrl(locale: string, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const url = `${siteUrl}${prefix}${path}`;
  return path === "" && prefix === "" ? `${siteUrl}/` : url;
}

// hreflang map for `alternates.languages` and sitemap alternates.
export function buildLanguages(path = ""): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((l) => [l, localeUrl(l, path)]),
  );
}

// Open Graph requires `language_TERRITORY`. The hotel sits in Italian-speaking
// Switzerland, so the three national languages get the _CH territory.
const OG_LOCALES: Record<string, string> = {
  it: "it_CH",
  de: "de_CH",
  fr: "fr_CH",
  en: "en_GB",
  pl: "pl_PL",
};

export function ogLocale(locale: string): string {
  return OG_LOCALES[locale] ?? "it_CH";
}

export function ogAlternateLocales(locale: string): string[] {
  return routing.locales
    .filter((l) => l !== locale)
    .map((l) => ogLocale(l));
}

// Canonical NAP + business facts for schema.org. Phone/email/socials are
// re-used from contact-info.ts so they never diverge from the rendered footer.
export const HOTEL = {
  name: "Al Ponte",
  legalName: "Al Ponte Albergo SAGL",
  streetAddress: "Via Cantonale 61",
  postalCode: "6936",
  addressLocality: "Cademario",
  addressRegion: "Ticino",
  addressCountry: "CH",
  telephone: PHONE,
  email: EMAIL,
  priceRange: "$$",
  currenciesAccepted: "CHF",
  checkinTime: "15:30",
  checkoutTime: "10:00",
  petsAllowed: true,
  smokingAllowed: false,
  sameAs: [INSTAGRAM, BOOKING, RATINGS.tripadvisor.url, MAPS_LINK],
  // Guest-facing amenities surfaced as schema amenityFeature.
  amenities: [
    "Indoor swimming pool",
    "Free parking nearby",
    "Breakfast",
    "Free Wi-Fi",
    "Smart TV",
    "Pet friendly",
    "Free Ticino Ticket public transport",
  ],
  // aggregateRating source: Tripadvisor (clean 5-point scale + honest count).
  rating: {
    value: RATINGS.tripadvisor.score,
    scale: RATINGS.tripadvisor.scale,
    count: RATINGS.tripadvisor.count,
  },
} as const;
