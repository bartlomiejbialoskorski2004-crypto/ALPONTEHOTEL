"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
// sticky top bar that drops down the full index on mobile. Labels are
// passed in already-localised so this stays presentation-only.
export default function PageToc({ sections, tocTitle }: Props) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);

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

  // Honour an incoming hash (e.g. megamenu deep-link /attractions#mountains)
  // by scrolling to it once the page has mounted.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections.some((s) => s.id === hash)) {
      setActiveId(hash);
      const t = setTimeout(() => scrollToTarget(`#${hash}`), 120);
      return () => clearTimeout(t);
    }
  }, [sections]);

  // Close the dropdown on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    scrollToTarget(`#${id}`);
  };

  const handleBarNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(`#${id}`));
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

      {/* Mobile: sticky top bar that drops down the full index. */}
      <div className="sticky top-20 z-30 -mx-6 mb-12 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={tocTitle}
          className="flex w-full items-center gap-3 border-y border-mist bg-paper/95 px-6 py-4 backdrop-blur"
        >
          <span className="text-[11px] font-medium tabular-nums tracking-[0.2em] text-forest">
            {activeSection?.num}
          </span>
          <span className="flex-1 truncate text-left text-sm font-medium text-ink">
            {activeSection?.label}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink/40">
            {tocTitle}
          </span>
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="backdrop"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 -z-10 bg-ink/20"
                aria-hidden
              />
              <motion.ul
                key="panel"
                initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-b border-mist bg-paper shadow-[0_12px_30px_rgba(10,10,10,0.12)]"
              >
                {sections.map((s) => {
                  const active = activeId === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => handleBarNav(e, s.id)}
                        aria-current={active ? "true" : undefined}
                        className={`flex items-center gap-4 border-l-2 px-6 py-3.5 transition-colors ${
                          active
                            ? "border-l-forest text-forest"
                            : "border-l-transparent text-ink/75"
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
                      </a>
                    </li>
                  );
                })}
              </motion.ul>
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
