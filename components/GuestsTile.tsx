"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { ROOM_PANELS } from "./roomPanels";
import { getRoomDocked, subscribeRoomDocked } from "./roomDockStore";

// Small capacity tile (people icon + max guests) at the top of a room panel.
// Once it scrolls up under the RoomNav bar it lifts away "into" the bar, where
// the same figure appears as a chip; scrolling back brings it out again.
// The outer span stays static so RoomNav can measure it (`data-guests`).
export default function GuestsTile({
  panelId,
  className = "",
}: {
  panelId: string;
  className?: string;
}) {
  const t = useTranslations("rooms");
  const reduceMotion = useReducedMotion();
  const index = ROOM_PANELS.findIndex((p) => p.id === panelId);
  const count = ROOM_PANELS[index]?.maxGuests;
  const [dockedIndex, setDockedIndex] = useState(-1);

  useEffect(() => {
    setDockedIndex(getRoomDocked());
    return subscribeRoomDocked(setDockedIndex);
  }, []);

  if (!count) return null;
  const docked = index <= dockedIndex;
  const label = t("maxGuests", { count });

  return (
    <span data-guests={panelId} className={`inline-flex ${className}`}>
      <motion.span
        initial={false}
        animate={docked ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        title={label}
        aria-label={label}
        role="img"
        className="inline-flex items-center gap-1.5 border border-ink/15 bg-paper/70 px-2 py-1 text-[11px] tabular-nums leading-none text-ink/70"
      >
        <Users aria-hidden size={12} strokeWidth={1.5} />
        {count}
      </motion.span>
    </span>
  );
}
