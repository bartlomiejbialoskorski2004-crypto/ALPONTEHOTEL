// Shared navigation structure, used by Header (desktop megamenu) and
// MobileMenu. Labels live in messages/*.json under "nav", "mega",
// "info.nav" and "attractions.nav".

export type MegaGroup = "rooms" | "attractions" | "info";
export type NavKey =
  | "rooms"
  | "contact"
  | "info"
  | "attractions"
  | "gallery";

// A mega item resolves to a title (via labelFor) and a destination href.
export type MegaItem = { key: string; href: string };

export type NavEntry = {
  key: NavKey;
  href: string;
  mega?: { group: MegaGroup; items: MegaItem[] };
};

export const NAV: NavEntry[] = [
  {
    key: "rooms",
    href: "#rooms",
    mega: {
      group: "rooms",
      items: [
        { key: "apartments", href: "#rooms" },
        { key: "superior", href: "#rooms" },
        { key: "budgetPlus", href: "#rooms" },
        { key: "budget", href: "#rooms" },
      ],
    },
  },
  {
    key: "info",
    href: "/informations",
    mega: {
      group: "info",
      items: [
        { key: "hours", href: "/informations#hours" },
        { key: "pool", href: "/informations#pool" },
        { key: "parking", href: "/informations#parking" },
        { key: "services", href: "/informations#services" },
        { key: "tax", href: "/informations#tax" },
        { key: "transport", href: "/informations#transport" },
      ],
    },
  },
  {
    key: "attractions",
    href: "/attractions",
    mega: {
      group: "attractions",
      items: [
        { key: "mountains", href: "/attractions#mountains" },
        { key: "lugano", href: "/attractions#lugano" },
        { key: "villages", href: "/attractions#villages" },
        { key: "cademario", href: "/attractions#cademario" },
      ],
    },
  },
  { key: "gallery", href: "#gallery" },
  { key: "contact", href: "#contact" },
];

export const MEGA_HREF = "#contact";
