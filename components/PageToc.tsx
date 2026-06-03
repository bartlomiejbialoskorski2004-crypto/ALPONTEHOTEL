"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { getLenis } from "./lenisStore";

export type TocSection = { id: string; num: string; label: string };

const HEADER_OFFSET = 96;

// Momentum-correct scroll via the live Lenis instance, with a native
// smooth-scroll fallback for reduced-motion users (Lenis not running).
function scrollToTarget(target: string) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: -HEADER_OFFSET });
    return;
  }
  if (target === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(target);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type Props = {
  sections: TocSection[];
  tocTitle: string;
};

// Shared table of contents: a sticky scroll-spy sidebar on desktop and a
// floating pill that opens a bottom-sheet index on mobile. Labels are
// passed in already-localised so this stays presentation-only.
export default function PageToc({ sections, tocTitle }: Props) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [pillVisible, setPillVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Scroll-spy: flip the active entry as a section crosses the upper third
  // of the viewport.
  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Reveal the floating pill once the reader scrolls past the hero band.
  useEffect(() => {
    const onScroll = () => {
      setPillVisible(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the sheet is open; Escape dismisses.
  useEffect(() => {
    if (!sheetOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const activeSection =
    sections.find((s) => s.id === activeId) ?? sections[0];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    scrollToTarget(`#${id}`);
  };

  const handleSheetNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    setSheetOpen(false);
    requestAnimationFrame(() => scrollToTarget(`#${id}`));
  };

  const onSheetDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) setSheetOpen(false);
  };

  return (
    <>
      {/* Desktop: sticky side index with scroll-spy. */}
      <nav aria-label={tocTitle} className="sticky top-28 hidden lg:block">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-ink/40">
          {tocTitle}
        </p>
        <ul className="space-y-1">
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleClick(e, s.id)}
                  aria-current={active ? "true" : undefined}
                  className={`group flex items-baseline gap-3 border-l-2 py-1.5 pl-4 transition-colors ${
                    active
                      ? "border-l-forest text-forest"
                      : "border-l-transparent text-ink/45 hover:text-ink"
                  }`}
                >
                  <span className="text-[10px] font-medium tabular-nums tracking-[0.2em]">
                    {s.num}
                  </span>
                  <span
                    className={`text-sm leading-snug ${active ? "font-medium" : ""}`}
                  >
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: floating pill that reveals a bottom-sheet index. */}
      <div className="lg:hidden">
        <AnimatePresence>
          {pillVisible && !sheetOpen && activeSection && (
            <motion.button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label={tocTitle}
              aria-expanded={sheetOpen}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex max-w-[80vw] -translate-x-1/2 items-center gap-3 rounded-full bg-forest py-3 pl-4 pr-5 text-paper shadow-[0_8px_30px_rgba(10,10,10,0.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 4h12M2 8h12M2 12h8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[11px] font-medium tabular-nums tracking-[0.2em] text-paper/60">
                {activeSection.num}
              </span>
              <span className="truncate text-sm font-medium">
                {activeSection.label}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sheetOpen && (
            <>
              <motion.div
                key="backdrop"
                onClick={() => setSheetOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
                aria-hidden
              />
              <motion.div
                key="sheet"
                role="dialog"
                aria-modal="true"
                aria-label={tocTitle}
                initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
                transition={
                  reduceMotion
                    ? { duration: 0.2 }
                    : { type: "spring", stiffness: 320, damping: 34 }
                }
                drag={reduceMotion ? false : "y"}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={onSheetDragEnd}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-paper pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_40px_rgba(10,10,10,0.2)]"
              >
                <div className="flex justify-center pb-2 pt-3">
                  <span className="h-1 w-10 rounded-full bg-ink/15" aria-hidden />
                </div>
                <p className="px-6 pb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
                  {tocTitle}
                </p>
                <ul className="divide-y divide-mist">
                  {sections.map((s) => {
                    const active = activeId === s.id;
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={(e) => handleSheetNav(e, s.id)}
                          aria-current={active ? "true" : undefined}
                          className={`flex items-center gap-4 border-l-2 py-4 pl-5 pr-6 transition-colors ${
                            active
                              ? "border-l-forest text-forest"
                              : "border-l-transparent text-ink/80"
                          }`}
                        >
                          <span className="text-[11px] font-medium tabular-nums tracking-[0.2em] text-forest">
                            {s.num}
                          </span>
                          <span
                            className={`flex-1 text-base ${active ? "font-medium" : ""}`}
                          >
                            {s.label}
                          </span>
                          <span aria-hidden className="text-ink/25">
                            →
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// "Back to top" affordance reusing the same momentum scroll.
export function BackToTop({ label }: { label: string }) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget("#top");
      }}
      className="mt-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-ink/50 transition-colors hover:text-forest"
    >
      <span aria-hidden>↑</span>
      {label}
    </a>
  );
}
