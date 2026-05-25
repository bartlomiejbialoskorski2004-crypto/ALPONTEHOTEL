// Shared navigation structure, used by Header (desktop megamenu) and
// MobileMenu. Labels live in messages/*.json under "nav" and "mega".
// Sub-item hrefs are placeholders (#contact / #top) until the matching
// sections exist — wire them up as the site grows.

export type MegaGroup = "hotel" | "experiences";
export type NavKey = "hotel" | "experiences" | "location" | "contact";

export type NavEntry = {
  key: NavKey;
  side: "left" | "right";
  href: string;
  mega?: { group: MegaGroup; items: string[] };
};

export const NAV: NavEntry[] = [
  {
    key: "hotel",
    side: "left",
    href: "#top",
    mega: { group: "hotel", items: ["rooms", "suites", "amenities", "gallery"] },
  },
  {
    key: "experiences",
    side: "left",
    href: "#contact",
    mega: {
      group: "experiences",
      items: ["lake", "dining", "wellness", "excursions"],
    },
  },
  { key: "location", side: "right", href: "#contact" },
  { key: "contact", side: "right", href: "#contact" },
];

export const MEGA_HREF = "#contact";
