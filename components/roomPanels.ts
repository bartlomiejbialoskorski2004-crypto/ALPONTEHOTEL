// Registry of detailed room panels on the home page, in scroll order. The
// sticky RoomNav bar reads this to show the current category + room and a
// position indicator. Add a new room by giving its section an `id` and
// appending one entry here — the bar picks it up automatically.
//
//  - `id`          matches the section's DOM id (the scroll-spy target)
//  - `categoryKey` resolves to `mega.rooms.<categoryKey>.title`
//  - `nameKey`     full message key for the room's display name
//
// Named roomPanels (not rooms) to avoid a case-only filename clash with
// Rooms.tsx on case-insensitive filesystems.

export type RoomPanel = {
  id: string;
  categoryKey: "apartments" | "superior" | "budgetPlus" | "budget";
  nameKey: string;
};

export const ROOM_PANELS: RoomPanel[] = [
  { id: "triple-deluxe", categoryKey: "apartments", nameKey: "triple.title" },
  { id: "big-family", categoryKey: "apartments", nameKey: "rooms.items.bigFamily.name" },
  { id: "triple-dependance", categoryKey: "apartments", nameKey: "rooms.items.tripleDependance.name" },
  { id: "double-superior", categoryKey: "superior", nameKey: "rooms.items.doubleSuperior.name" },
  { id: "triple-superior", categoryKey: "superior", nameKey: "rooms.items.tripleSuperior.name" },
  { id: "double-panorama-budget-plus", categoryKey: "budgetPlus", nameKey: "rooms.items.doublePanoramaBudgetPlus.name" },
  { id: "family-budget-plus-terrace", categoryKey: "budgetPlus", nameKey: "rooms.items.familyBudgetPlusTerrace.name" },
  { id: "single-budget", categoryKey: "budget", nameKey: "rooms.items.singleBudget.name" },
  { id: "double-budget", categoryKey: "budget", nameKey: "rooms.items.doubleBudget.name" },
  { id: "twin-budget", categoryKey: "budget", nameKey: "rooms.items.twinBudget.name" },
];
