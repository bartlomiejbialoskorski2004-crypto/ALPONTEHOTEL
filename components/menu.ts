// Shared navigation structure, used by Header (desktop megamenu) and
// MobileMenu. Labels live in messages/*.json under "nav" and "mega".
// All entries render on the left of the bar. Sub-item / link hrefs are
// placeholders (#top / #contact) until the matching sections exist.

import { GROUP_KEYS } from "./groupPages";

export type MegaGroup = "rooms" | "attractions" | "informations" | "events";
export type NavKey =
  | "rooms"
  | "contact"
  | "info"
  | "events"
  | "attractions"
  | "gallery";

export type NavEntry = {
  key: NavKey;
  href: string;
  mega?: { group: MegaGroup; items: string[] };
};

export const NAV: NavEntry[] = [
  {
    key: "rooms",
    href: "#rooms",
    mega: {
      group: "rooms",
      items: ["apartments", "superior", "budgetPlus", "budget"],
    },
  },
  {
    key: "info",
    href: "/informations",
    mega: {
      group: "informations",
      items: ["hours", "pool", "sauna", "parking", "services", "tax", "transport"],
    },
  },
  {
    // Group offers. No overview page of its own: the tab opens the first
    // offer; each offer page carries a switcher to the other four.
    key: "events",
    href: "/conferences",
    mega: { group: "events", items: [...GROUP_KEYS] },
  },
  {
    key: "attractions",
    href: "/attractions",
    mega: {
      group: "attractions",
      items: ["mountains", "cademario", "lugano", "nature", "villages", "adventure"],
    },
  },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "#contact" },
];

export const MEGA_HREF = "#contact";
