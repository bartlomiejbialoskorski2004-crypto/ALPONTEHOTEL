// Shared navigation structure, used by Header (desktop megamenu) and
// MobileMenu. Labels live in messages/*.json under "nav" and "mega".
// All entries render on the left of the bar. Sub-item / link hrefs are
// placeholders (#top / #contact) until the matching sections exist.

export type MegaGroup = "rooms" | "attractions";
export type NavKey =
  | "rooms"
  | "contact"
  | "info"
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
  { key: "info", href: "/informations" },
  { key: "attractions", href: "/attractions" },
  { key: "gallery", href: "#gallery" },
  { key: "contact", href: "#contact" },
];

export const MEGA_HREF = "#contact";
