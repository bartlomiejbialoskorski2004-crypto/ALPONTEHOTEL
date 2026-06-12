"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Locale-aware href for homepage section anchors (#rooms, #gallery,
// #contact, #top, …). On the homepage it returns the plain hash (in-page
// jump); on sub-pages it returns the locale's homepage with the hash, e.g.
// "/#contact" (it) or "/en/#contact", so the link both navigates home and
// lands on the right section in the same language.
export function useAnchor() {
  const pathname = usePathname(); // locale-stripped, e.g. "/attractions"
  const locale = useLocale();
  const isHome = pathname === "/";
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return (hash: string) => (isHome ? hash : `${prefix}/${hash}`);
}
