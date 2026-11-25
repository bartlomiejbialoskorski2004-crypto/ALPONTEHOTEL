"use client";

import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { ROOM_PANELS } from "./roomPanels";
import StickyUnderHeader from "./groups/StickyUnderHeader";

// Max-guests tile of one room panel. It sits in an overlay that mirrors the
// panel grid, at the same X as the empty slot in the RoomNav bar, and is
// `sticky`: it scrolls up with the room, stops in the bar's slot (vertically
// centred in the h-14 row, 14px below the header - or the top once the header
// hides) and leaves with the end of its section. No horizontal jump, ever.
// Render it as the first child of the (relative) room <section>.
export default function GuestsTile({ panelId }: { panelId: string }) {
  const t = useTranslations("rooms");
  const count = ROOM_PANELS.find((p) => p.id === panelId)?.maxGuests;
  if (!count) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[35] px-6 lg:px-10">
      <div className="mx-auto h-full max-w-7xl lg:grid lg:grid-cols-2 lg:gap-10">
        <div className="flex h-full flex-col items-end pr-4 lg:pr-3">
          {/* In-flow offset: the top-right of the mobile card / desktop panel. */}
          <div aria-hidden className="h-[90px] shrink-0 lg:h-[124px]" />
          <StickyUnderHeader className="pt-3.5">
            <span
              role="img"
              aria-label={t("maxGuests", { count })}
              className="inline-flex h-7 w-12 items-center justify-center gap-1.5 border border-ink/15 bg-paper text-[11px] tabular-nums leading-none text-ink/70"
            >
              <Users aria-hidden size={12} strokeWidth={1.5} />
              {count}
            </span>
          </StickyUnderHeader>
        </div>
      </div>
    </div>
  );
}
