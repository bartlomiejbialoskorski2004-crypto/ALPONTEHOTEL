"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getLenis } from "./lenisStore";
import FlipText from "./FlipText";

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

// Shared table of contents: a sticky scroll-spy sidebar that slides in from
// the left on desktop, and a sticky top chip bar on mobile (stays in flow so
// it never covers content). Labels arrive already-localised.
export default function PageToc({ sections, tocTitle }: Props) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
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

  // Reveal the desktop sidebar once the page hero has scrolled mostly away,
  // so it slides in from the left after the hero (identical timing on every
  // page that shares this TOC) and slides back out when you return to it.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector("main section");
      const heroBottom = hero
        ? hero.getBoundingClientRect().bottom
        : window.innerHeight;
      setVisible(heroBottom <= window.innerHeight * 0.35);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the mobile list is open; Escape closes it.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    scrollToTarget(`#${id}`);
  };

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );
  const activeSection = sections[activeIndex] ?? sections[0];
  const prev = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const next =
    activeIndex < sections.length - 1 ? sections[activeIndex + 1] : null;

  const goto = (id: string) => {
    setActiveId(id);
    scrollToTarget(`#${id}`);
  };

  return (
    <>
      {/* Desktop: sticky scroll-spy sidebar that slides in from the left
          once its column reaches the viewport. */}
      <motion.nav
        aria-label={tocTitle}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: visible ? 1 : 0, x: 0, y: "-50%" }
            : { opacity: visible ? 1 : 0, x: visible ? 0 : -80, y: "-50%" }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-1/2 hidden lg:block"
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
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
      </motion.nav>

      {/* Mobile: bottom dock with current section + prev/next; tap the title
          to open the full list above it. Never covers the reading area. */}
      <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden" aria-label={tocTitle}>
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
                className="fixed inset-0 -z-10 bg-ink/30"
                aria-hidden
              />
              <motion.ul
                key="list"
                initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-full max-h-[60vh] overflow-y-auto border-t border-mist bg-paper"
              >
                {sections.map((s) => {
                  const active = activeId === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(false);
                          requestAnimationFrame(() => goto(s.id));
                        }}
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
                        <span className={`flex-1 text-base ${active ? "font-medium" : ""}`}>
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

        <div className="flex items-stretch border-t border-mist bg-paper/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={() => prev && goto(prev.id)}
            disabled={!prev}
            aria-label="Previous section"
            className="flex w-14 items-center justify-center text-ink/60 transition-colors hover:text-forest disabled:opacity-25"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex flex-1 items-center justify-center gap-2 border-x border-mist py-3.5"
          >
            <span className="text-[11px] font-medium tabular-nums tracking-[0.2em] text-forest">
              {activeSection?.num}
            </span>
            <span className="max-w-[55vw] truncate text-sm font-medium text-ink">
              {activeSection?.label}
            </span>
            <motion.svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-ink/40"
            >
              <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </button>

          <button
            type="button"
            onClick={() => next && goto(next.id)}
            disabled={!next}
            aria-label="Next section"
            className="flex w-14 items-center justify-center text-ink/60 transition-colors hover:text-forest disabled:opacity-25"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
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
      className="group mt-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-ink/50 transition-colors hover:text-forest"
    >
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:-translate-y-1"
      >
        ↑
      </span>
      <FlipText>{label}</FlipText>
    </a>
  );
}
