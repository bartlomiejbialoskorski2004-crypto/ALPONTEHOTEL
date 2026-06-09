// The 9 non-flagship room detail panels, in homepage / RoomNav order. Each
// entry drives a <RoomPanel>: photos come from `public/<folder>`, text from
// `rooms.items.<ns>.{name,desc}`, chips from `amenities` and feature tiles from
// `features` (keys -> shared `rooms.amenities.*` / `rooms.features.*` labels +
// icons). Add a room = one row here + its folder + i18n + a roomPanels.ts entry.

export type RoomDetail = {
  id: string;
  folder: string;
  categoryKey: "apartments" | "superior" | "budgetPlus" | "budget";
  ns: string;
  amenities: string[];
  features: string[];
};

export const ROOM_DETAILS: RoomDetail[] = [
  {
    id: "big-family",
    folder: "Big family apartment",
    categoryKey: "apartments",
    ns: "bigFamily",
    amenities: ["bath", "kitchen", "tv", "terrace", "wifi", "showerGel", "towels"],
    features: ["kingBed", "twoSingles", "sofaBed", "view", "terrace", "wifi"],
  },
  {
    id: "triple-dependance",
    folder: "Triple dependance apartment",
    categoryKey: "apartments",
    ns: "tripleDependance",
    amenities: [
      "bath", "kitchen", "wifi", "tv", "kettle", "desk",
      "clothesHangers", "hairdryer", "showerGel", "towels",
    ],
    features: ["kingBed", "singleBed", "view", "terrace", "space", "wifi"],
  },
  {
    id: "double-superior",
    folder: "Double superior room",
    categoryKey: "superior",
    ns: "doubleSuperior",
    amenities: [
      "bath", "hairdryer", "balcony", "wifi", "tv", "kettle",
      "desk", "clothesHangers", "showerGel", "towels",
    ],
    features: ["doubleBed", "view", "balcony", "wifi"],
  },
  {
    id: "triple-superior",
    folder: "Triple superior room",
    categoryKey: "superior",
    ns: "tripleSuperior",
    amenities: [
      "bath", "hairdryer", "balcony", "wifi", "tv", "kettle",
      "desk", "showerGel", "clothesHangers", "towels",
    ],
    features: ["kingBed", "singleBed", "balcony", "wifi"],
  },
  {
    id: "double-panorama-budget-plus",
    folder: "Double panorama budget plus room",
    categoryKey: "budgetPlus",
    ns: "doublePanoramaBudgetPlus",
    amenities: [
      "bath", "hairdryer", "wifi", "tv", "kettle", "desk",
      "clothesHangers", "showerGel", "towels",
    ],
    features: ["doubleBed", "view", "privateBath", "wifi"],
  },
  {
    id: "family-budget-plus-terrace",
    folder: "Family budget plus room with tarrace",
    categoryKey: "budgetPlus",
    ns: "familyBudgetPlusTerrace",
    amenities: [
      "bath", "hairdryer", "terrace", "wifi", "tv", "kettle",
      "desk", "showerGel", "clothesHangers", "towels",
    ],
    features: ["kingBed", "sofaBed", "terrace", "wifi"],
  },
  {
    id: "single-budget",
    folder: "Single budget room",
    categoryKey: "budget",
    ns: "singleBudget",
    amenities: [
      "bath", "hairdryer", "wifi", "kettle", "tv", "desk",
      "showerGel", "clothesHangers", "towels",
    ],
    features: ["singleBed", "privateBath", "wifi"],
  },
  {
    id: "double-budget",
    folder: "Double budget room",
    categoryKey: "budget",
    ns: "doubleBudget",
    amenities: [
      "bath", "wifi", "hairdryer", "tv", "kettle", "bedsideTables",
      "cups", "showerGel", "clothesHangers", "towels",
    ],
    features: ["doubleBed", "privateBath", "wifi"],
  },
  {
    id: "twin-budget",
    folder: "Twin budget room",
    categoryKey: "budget",
    ns: "twinBudget",
    amenities: [
      "bath", "wifi", "hairdryer", "tv", "kettle", "bedsideTables",
      "cups", "showerGel", "clothesHangers", "towels",
    ],
    features: ["twoSinglesTwin", "privateBath", "wifi"],
  },
];
