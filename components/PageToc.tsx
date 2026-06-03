"use client";

import { useEffect, useState, type MouseEvent } from "react";
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
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

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

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    scrollToTarget(`#${id}`);
  };

  return (
    <>
      {/* Desktop: sticky side index with scroll-spy, vertically centered. */}
      <nav
        aria-label={tocTitle}
        className="sticky top-1/2 hidden -translate-y-1/2 lg:block"
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
      </nav>

      {/* Mobile: always-visible side rail pinned to the right edge. */}
      <nav
        aria-label={tocTitle}
        className="fixed right-0 top-1/2 z-30 -translate-y-1/2 lg:hidden"
      >
        <ul className="flex flex-col items-end gap-0.5 rounded-l-xl border border-r-0 border-mist bg-paper/85 py-3 pr-2 pl-3 backdrop-blur">
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <li key={s.id} className="w-full">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleClick(e, s.id)}
                  aria-current={active ? "true" : undefined}
                  aria-label={s.label}
                  className="flex items-center justify-end gap-2 py-1"
                >
                  {active && (
                    <span className="max-w-[42vw] truncate text-[11px] font-medium text-forest">
                      {s.label}
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-medium tabular-nums tracking-[0.15em] transition-colors ${
                      active ? "text-forest" : "text-ink/35"
                    }`}
                  >
                    {s.num}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
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
