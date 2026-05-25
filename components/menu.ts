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
    href: "#top",
    mega: {
      group: "rooms",
      items: ["apartments", "superior", "budgetPlus", "budget"],
    },
  },
  { key: "info", href: "#top" },
  {
    key: "attractions",
    href: "#top",
    mega: {
      group: "attractions",
      items: ["lake", "sanSalvatore", "monteBre", "oldTown"],
    },
  },
  { key: "gallery", href: "#top" },
  { key: "contact", href: "#contact" },
];

export const MEGA_HREF = "#contact";
