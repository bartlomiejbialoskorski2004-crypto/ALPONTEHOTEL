// The 9 non-flagship room detail panels, in homepage / RoomNav order. Each
// entry drives a <RoomPanel>: photos come from `public/<folder>`, text from
// `rooms.items.<ns>.{name,desc}`, chips from `amenities` (keys -> shared
// `rooms.amenities.*` labels + icons). Add a room = one row here + its folder
// + i18n + a roomPanels.ts entry.

export type RoomDetail = {
  id: string;
  folder: string;
  categoryKey: "apartments" | "superior" | "budgetPlus" | "budget";
  ns: string;
  amenities: string[];
};

export const ROOM_DETAILS: RoomDetail[] = [
  {
    id: "big-family",
    folder: "Big family apartment",
    categoryKey: "apartments",
    ns: "bigFamily",
    amenities: ["bath", "kitchen", "tv", "wifi", "terrace", "kingBed"],
  },
  {
    id: "triple-dependance",
    folder: "Triple dependance apartment",
    categoryKey: "apartments",
    ns: "tripleDependance",
    amenities: ["bath", "kitchen", "tv", "wifi", "terrace", "kingBed"],
  },
  {
    id: "double-superior",
    folder: "Double superior room",
    categoryKey: "superior",
    ns: "doubleSuperior",
    amenities: ["bath", "tv", "wifi", "balcony", "view", "kettle"],
  },
  {
    id: "triple-superior",
    folder: "Triple superior room",
    categoryKey: "superior",
    ns: "tripleSuperior",
    amenities: ["bath", "tv", "wifi", "balcony", "view", "kettle"],
  },
  {
    id: "double-panorama-budget-plus",
    folder: "Double panorama budget plus room",
    categoryKey: "budgetPlus",
    ns: "doublePanoramaBudgetPlus",
    amenities: ["bath", "tv", "wifi", "view", "kettle"],
  },
  {
    id: "family-budget-plus-terrace",
    folder: "Family budget plus room with tarrace",
    categoryKey: "budgetPlus",
    ns: "familyBudgetPlusTerrace",
    amenities: ["bath", "tv", "wifi", "terrace", "kettle"],
  },
  {
    id: "single-budget",
    folder: "Single budget room",
    categoryKey: "budget",
    ns: "singleBudget",
    amenities: ["bath", "tv", "wifi", "kettle"],
  },
  {
    id: "double-budget",
    folder: "Double budget room",
    categoryKey: "budget",
    ns: "doubleBudget",
    amenities: ["bath", "tv", "wifi", "kettle"],
  },
  {
    id: "twin-budget",
    folder: "Twin budget room",
    categoryKey: "budget",
    ns: "twinBudget",
    amenities: ["bath", "tv", "wifi", "kettle"],
  },
];
