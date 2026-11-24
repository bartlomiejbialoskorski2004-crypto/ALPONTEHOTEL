"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { getLenis } from "./lenisStore";
import { getHeaderHidden, subscribeHeaderHidden } from "./headerStore";
import { setRoomDocked } from "./roomDockStore";
import { ROOM_PANELS } from "./roomPanels";
import FlipOnChange from "./FlipOnChange";

// Sits just below the fixed header (h-20 / lg:h-24).
const HEADER_OFFSET = 96;

// Jump so the room panel opens the screen. Shared with the room-category
// cards (Rooms.tsx). Scrolling down hides the header and docks this bar at the
// top, so the section's top edge goes to the viewport top - its own top
// padding (pt-24 / lg:pt-32) clears the bar. Scrolling up brings the header
// back, so leave room for it too. A numeric target on purpose: for element
// targets Lenis also subtracts the section's scroll-margin (sized for native
// header-only anchors), which pushed the room halfway down the screen.
export function scrollToRoom(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  let top = el.getBoundingClientRect().top + window.scrollY;
  if (top < window.scrollY) {
    top -= window.matchMedia("(min-width: 1024px)").matches ? 96 : 80;
  }
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(top);
    return;
  }
  window.scrollTo({ top, behavior: "smooth" });
}

// Contextual sticky bar that appears only while the room panels are on
// screen, showing the current room's category, name, and position. Reads the
// ROOM_PANELS registry, so new room panels are picked up automatically.
export default function RoomNav() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [docked, setDocked] = useState(-1);
  const navRef = useRef<HTMLElement>(null);
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
    let timer = 0;
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
        setRoomDocked(-1);
        return;
      }
      const isVisible = firstTop <= vh * 0.6 && lastBottom >= HEADER_OFFSET + 8;
      setVisible(isVisible);
      setActiveIndex(active);

      // Capacity tiles: the last one that has scrolled up under the bar is
      // "docked" (shown as the bar's chip). Measures the visible copy only.
      let dockedAt = -1;
      const nav = navRef.current;
      if (isVisible && nav) {
        const navBottom = nav.getBoundingClientRect().bottom;
        ROOM_PANELS.forEach((p, i) => {
          document
            .querySelectorAll<HTMLElement>(`[data-guests="${p.id}"]`)
            .forEach((el) => {
              if (el.getClientRects().length === 0) return;
              if (el.getBoundingClientRect().top < navBottom) dockedAt = i;
            });
        });
      }
      setRoomDocked(dockedAt);
      setDocked(dockedAt);
    };

    // The bar rides up/down with the header; re-measure once that settles.
    const unsubscribe = subscribeHeaderHidden(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(compute, 450);
    });

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      unsubscribe();
      window.clearTimeout(timer);
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const active = ROOM_PANELS[activeIndex] ?? ROOM_PANELS[0];
  if (!active) return null;
  const dockedPanel = docked >= 0 ? ROOM_PANELS[docked] : undefined;
  const guestsLabel = dockedPanel
    ? t("rooms.maxGuests", { count: dockedPanel.maxGuests })
    : "";

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
    // own panel show/hide animation (in %) - separating units avoids a px/%
    // clash on the same axis of one element.
    <motion.div
      initial={false}
      animate={{ y: headerHidden ? -headerH : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-30"
    >
    <motion.nav
      ref={navRef}
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
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => scrollToRoom(active.id)}
            className="flex min-w-0 flex-col items-start text-left"
          >
            <FlipOnChange
              value={t(`mega.rooms.${active.categoryKey}.title`)}
              className="text-[10px] font-medium uppercase tracking-[0.25em] text-forest"
            />
            <FlipOnChange
              value={t(active.nameKey)}
              className="max-w-full font-serif text-sm leading-tight text-ink sm:text-base"
            />
          </button>
          {/* Capacity tile docked from the room panel below. */}
          <AnimatePresence initial={false}>
            {dockedPanel && (
              <motion.span
                key="guests"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                title={guestsLabel}
                aria-label={guestsLabel}
                role="img"
                className="inline-flex shrink-0 items-center gap-1.5 border border-ink/15 bg-paper/70 px-2 py-1 text-[11px] tabular-nums leading-none text-ink/70"
              >
                <Users aria-hidden size={12} strokeWidth={1.5} />
                <FlipOnChange value={dockedPanel.maxGuests} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {catRooms.length > 1 && (
            <div className="flex items-center gap-2">
              {catRooms.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToRoom(p.id)}
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
