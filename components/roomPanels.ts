// Registry of detailed room panels on the home page, in scroll order. The
// sticky RoomNav bar reads this to show the current category + room and a
// position indicator. Add a new room by giving its section an `id` and
// appending one entry here - the bar picks it up automatically.
//
//  - `id`          matches the section's DOM id (the scroll-spy target)
//  - `categoryKey` resolves to `mega.rooms.<categoryKey>.title`
//  - `nameKey`     full message key for the room's display name
//  - `maxGuests`   most people the room sleeps (capacity tile + RoomNav chip)
//
// Named roomPanels (not rooms) to avoid a case-only filename clash with
// Rooms.tsx on case-insensitive filesystems.

export type RoomPanel = {
  id: string;
  categoryKey: "apartments" | "superior" | "budgetPlus" | "budget";
  nameKey: string;
  maxGuests: number;
};

export const ROOM_PANELS: RoomPanel[] = [
  { id: "triple-deluxe", categoryKey: "apartments", nameKey: "triple.title", maxGuests: 3 },
  { id: "big-family", categoryKey: "apartments", nameKey: "rooms.items.bigFamily.name", maxGuests: 6 },
  { id: "triple-dependance", categoryKey: "apartments", nameKey: "rooms.items.tripleDependance.name", maxGuests: 3 },
  { id: "double-superior", categoryKey: "superior", nameKey: "rooms.items.doubleSuperior.name", maxGuests: 2 },
  { id: "triple-superior", categoryKey: "superior", nameKey: "rooms.items.tripleSuperior.name", maxGuests: 3 },
  { id: "double-panorama-budget-plus", categoryKey: "budgetPlus", nameKey: "rooms.items.doublePanoramaBudgetPlus.name", maxGuests: 2 },
  { id: "family-budget-plus-terrace", categoryKey: "budgetPlus", nameKey: "rooms.items.familyBudgetPlusTerrace.name", maxGuests: 4 },
  { id: "single-budget", categoryKey: "budget", nameKey: "rooms.items.singleBudget.name", maxGuests: 1 },
  { id: "double-budget", categoryKey: "budget", nameKey: "rooms.items.doubleBudget.name", maxGuests: 2 },
  { id: "twin-budget", categoryKey: "budget", nameKey: "rooms.items.twinBudget.name", maxGuests: 2 },
];
