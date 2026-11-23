// Group-offer subpages (conferences, workshops, celebrations, school trips,
// company events). Single source for routes, hero photos and the order used
// by the Informations megamenu, the Informations page, the sitemap and the
// "other offers" links. Copy lives in messages/*.json under "groups".

export const GROUP_KEYS = [
  "conferences",
  "workshops",
  "celebrations",
  "schoolTrips",
  "companyEvents",
] as const;

export type GroupKey = (typeof GROUP_KEYS)[number];

export const GROUP_PAGES: Record<GroupKey, { href: string; image: string }> = {
  conferences: { href: "/conferences", image: "/gallery/4.jpg" },
  workshops: { href: "/workshops", image: "/gallery/6.jpg" },
  celebrations: { href: "/celebrations", image: "/gallery/2.jpg" },
  schoolTrips: { href: "/school-trips", image: "/mega/sansalvatore.jpg" },
  companyEvents: { href: "/company-events", image: "/hero1.jpg" },
};

// Venue capacities (people).
export const GROUP_VENUES = {
  conference: 90,
  seminar: 28,
  restaurant: 70,
} as const;

// Shared hotel figures for groups (locale-independent).
export const GROUP_MAX_GUESTS = 63;

export const GROUP_CAPACITY = [
  { key: "guests", value: GROUP_MAX_GUESTS },
  { key: "beds", value: 52 },
  { key: "rooms", value: 23 },
] as const;

export const GROUP_ROOM_TYPES = [
  { key: "twin", count: 17 },
  { key: "triple", count: 4 },
  { key: "single", count: 1 },
  { key: "five", count: 1 },
] as const;

// Group meal prices in CHF per person. Group pricing only - the general
// breakfast price on /informations is separate.
export const GROUP_MEALS = [
  { key: "breakfast", price: 15 },
  { key: "lunch", price: 20 },
  { key: "dinner", price: 15 },
] as const;

export const GROUP_HALF_BOARD = { key: "halfBoard", price: 22 } as const;
