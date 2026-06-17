"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { getLenis } from "./lenisStore";
import { getHeaderHidden, subscribeHeaderHidden } from "./headerStore";
import { ROOM_PANELS } from "./roomPanels";
import FlipOnChange from "./FlipOnChange";

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
  // Follow the main header: when it slides away on scroll-down, this bar rides
  // up by the header height so it docks at the top instead of floating below a
  // gap; it drops back under the header when the header returns.
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerH, setHeaderH] = useState(96);

  useEffect(() => {
    setHeaderHidden(getHeaderHidden());
    return subscribeHeaderHidden(setHeaderHidden);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setHeaderH(mq.matches ? 96 : 80);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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

  // Position within the active room's category (e.g. 1/3 Apartments), not the
  // global 1/10. ROOM_PANELS is grouped contiguously by category.
  const catRooms = ROOM_PANELS.filter(
    (p) => p.categoryKey === active.categoryKey,
  );
  const posInCat = Math.max(
    0,
    catRooms.findIndex((p) => p.id === active.id),
  );

  return (
    // Outer wrapper owns the header-follow lift (in px). The inner nav keeps its
    // own panel show/hide animation (in %) — separating units avoids a px/%
    // clash on the same axis of one element.
    <motion.div
      initial={false}
      animate={{ y: headerHidden ? -headerH : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-30"
    >
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
      className="relative mt-20 border-b border-mist bg-paper/90 backdrop-blur lg:mt-24"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 lg:px-10">
        <button
          type="button"
          onClick={() => scrollToTarget(active.id)}
          className="flex min-w-0 flex-col items-start text-left"
        >
          <FlipOnChange
            value={t(`mega.rooms.${active.categoryKey}.title`)}
            className="text-[10px] font-medium uppercase tracking-[0.25em] text-forest"
          />
          <FlipOnChange
            value={t(active.nameKey)}
            className="font-serif text-sm leading-tight text-ink sm:text-base"
          />
        </button>

        <div className="flex shrink-0 items-center gap-3">
          {catRooms.length > 1 && (
            <div className="flex items-center gap-2">
              {catRooms.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToTarget(p.id)}
                  aria-label={t(p.nameKey)}
                  aria-current={i === posInCat}
                  className="group flex h-4 items-center"
                >
                  <span
                    className={`block h-[2px] transition-all duration-300 ${
                      i === posInCat
                        ? "w-6 bg-forest"
                        : "w-3 bg-ink/30 group-hover:bg-ink/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
          <span className="flex items-center text-[11px] tabular-nums tracking-[0.15em] text-ink/45">
            <FlipOnChange value={String(posInCat + 1).padStart(2, "0")} />/
            {String(catRooms.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.nav>
    </motion.div>
  );
}
