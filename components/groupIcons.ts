import {
  Backpack,
  Gem,
  NotebookPen,
  PartyPopper,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import type { GroupKey } from "./groupPages";

// One quiet line icon per group offer - shown next to the hovered / current
// offer in the offer switcher and in the Events megamenu.
export const GROUP_ICONS: Record<GroupKey, LucideIcon> = {
  conferences: Presentation,
  workshops: NotebookPen,
  celebrations: Gem,
  schoolTrips: Backpack,
  companyEvents: PartyPopper,
};
