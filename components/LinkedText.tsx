"use client";

import { Fragment } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

// Turns key words in a plain translated string into quiet links to where they
// are explained: the Ticino Ticket and parking to the Informations page, the
// pool, sauna and breakfast to "At the hotel". Each word is linked once per
// string (its first mention). No underline - the link only dims on hover, so
// the copy reads as plain text. Use only for visible body copy - never inside
// another link, a button, alt/aria text or metadata.

export type Keyword = "ticket" | "pool" | "sauna" | "parking" | "breakfast";

const HREF: Record<Keyword, string> = {
  ticket: "/informations#transport",
  pool: "/hotel-attractions#pool",
  sauna: "/hotel-attractions#sauna",
  parking: "/informations#parking",
  breakfast: "/hotel-attractions#breakfast",
};

// Inflected forms per locale (matched case-insensitively, whole words only).
const PATTERNS: Record<string, Record<Keyword, string>> = {
  pl: {
    ticket: "Ticino Ticket",
    pool: "basen(?:ie|u|em|y)?|jacuzzi",
    sauna: "saun(?:a|y|ie|ą|ę)",
    parking: "parking(?:u|iem)?",
    breakfast: "śniadani(?:e|a|em|u)",
  },
  it: {
    ticket: "Ticino Ticket",
    pool: "piscin[ae]|idromassaggio",
    sauna: "saun[ae]",
    parking: "parcheggi[oi]",
    breakfast: "colazion[ei]",
  },
  en: {
    ticket: "Ticino Ticket",
    pool: "pool|jacuzzi",
    sauna: "saunas?",
    parking: "parking|car park",
    breakfast: "breakfast",
  },
  fr: {
    ticket: "Ticino Ticket",
    pool: "piscine|jacuzzi",
    sauna: "saunas?",
    parking: "parking",
    breakfast: "petit-déjeuner",
  },
  de: {
    ticket: "Ticino Ticket",
    pool: "Hallenbad|Whirlpool|Pool",
    sauna: "Sauna",
    parking: "Parkplatz|Parkhaus|Parking",
    breakfast: "Frühstück",
  },
};

const KEYS = Object.keys(HREF) as Keyword[];
const cache = new Map<string, RegExp>();

function patternFor(locale: string): RegExp {
  const hit = cache.get(locale);
  if (hit) return hit;
  const words = PATTERNS[locale] ?? PATTERNS.en;
  const body = KEYS.map((k) => `(?<${k}>${words[k]})`).join("|");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${body})(?![\\p{L}\\p{N}])`, "giu");
  cache.set(locale, re);
  return re;
}

export default function LinkedText({
  text,
  skip = [],
  hrefs = {},
  onNavigate,
  className = "",
}: {
  text: string;
  skip?: Keyword[];
  hrefs?: Partial<Record<Keyword, string>>;
  onNavigate?: () => void;
  className?: string;
}) {
  const locale = useLocale();
  const re = patternFor(locale);
  const used = new Set<Keyword>(skip);
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const m of text.matchAll(re)) {
    const key = KEYS.find((k) => m.groups?.[k] !== undefined);
    if (!key || used.has(key) || m.index === undefined) continue;
    used.add(key);
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link
        key={`${key}-${m.index}`}
        href={hrefs[key] ?? HREF[key]}
        onClick={onNavigate}
        className={`transition-opacity duration-300 hover:opacity-60 ${className}`}
      >
        {m[0]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (parts.length === 0) return <>{text}</>;
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}
