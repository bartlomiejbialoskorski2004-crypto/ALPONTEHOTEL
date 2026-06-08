"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { getLenis } from "./lenisStore";
import { ROOM_PANELS } from "./roomPanels";

// Sits just below the fixed header (h-20 / lg:h-24).
const HEADER_OFFSET = 96;
// Extra room so a room's title clears both the header and this bar on click.
const SCROLL_OFFSET = 150;

function scrollToTarget(id: string) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(`#${id}`, { offset: -SCROLL_OFFSET });
    return;
  }
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Contextual sticky bar that appears only while the room panels are on
// screen, showing the current room's category, name, and position. Reads the
// ROOM_PANELS registry, so new room panels are picked up automatically.
export default function RoomNav() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const probe = HEADER_OFFSET + 80;
      let anyPresent = false;
      let firstTop = Infinity;
      let lastBottom = -Infinity;
      let active = 0;
      let best = Infinity;

      ROOM_PANELS.forEach((p, i) => {
        const el = document.getElementById(p.id);
        if (!el) return;
        anyPresent = true;
        const r = el.getBoundingClientRect();
        firstTop = Math.min(firstTop, r.top);
        lastBottom = Math.max(lastBottom, r.bottom);
        const d =
          r.top > probe ? r.top - probe : r.bottom < probe ? probe - r.bottom : 0;
        if (d < best) {
          best = d;
          active = i;
        }
      });

      if (!anyPresent) {
        setVisible(false);
        return;
      }
      setVisible(firstTop <= vh * 0.6 && lastBottom >= HEADER_OFFSET + 8);
      setActiveIndex(active);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const active = ROOM_PANELS[activeIndex] ?? ROOM_PANELS[0];
  if (!active) return null;

  return (
    <motion.nav
      aria-label={t("nav.rooms")}
      initial={false}
      animate={
        reduceMotion
          ? { opacity: visible ? 1 : 0 }
          : { y: visible ? 0 : "-110%", opacity: visible ? 1 : 0 }
      }
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed inset-x-0 top-20 z-30 border-b border-mist bg-paper/90 backdrop-blur lg:top-24"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 lg:px-10">
        <button
          type="button"
          onClick={() => scrollToTarget(active.id)}
          className="flex min-w-0 flex-col items-start text-left"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-forest">
            {t(`mega.rooms.${active.categoryKey}.title`)}
          </span>
          <span className="truncate font-serif text-sm leading-tight text-ink sm:text-base">
            {t(active.nameKey)}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-3">
          {ROOM_PANELS.length > 1 && (
            <div className="flex items-center gap-2">
              {ROOM_PANELS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToTarget(p.id)}
                  aria-label={t(p.nameKey)}
                  aria-current={i === activeIndex}
                  className="group flex h-4 items-center"
                >
                  <span
                    className={`block h-[2px] transition-all duration-300 ${
                      i === activeIndex
                        ? "w-6 bg-forest"
                        : "w-3 bg-ink/30 group-hover:bg-ink/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
          <span className="text-[11px] tabular-nums tracking-[0.15em] text-ink/45">
            {String(activeIndex + 1).padStart(2, "0")}/
            {String(ROOM_PANELS.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
