"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
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

// Shared table of contents: a sticky scroll-spy sidebar that slides in from
// the left on desktop, and a sticky top chip bar on mobile (stays in flow so
// it never covers content). Labels arrive already-localised.
export default function PageToc({ sections, tocTitle }: Props) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

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

  // Keep the active chip centered in the mobile bar as the reader scrolls.
  useEffect(() => {
    const chip = chipRefs.current[activeId];
    chip?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeId, reduceMotion]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
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

      {/* Mobile: sticky top chip bar, in normal flow so it never covers
          content; the active chip auto-centers. */}
      <nav
        aria-label={tocTitle}
        className="sticky top-20 z-30 -mx-6 mb-10 border-y border-mist bg-paper/95 backdrop-blur lg:hidden"
      >
        <ul className="flex gap-2 overflow-x-auto px-6 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  ref={(el) => {
                    chipRefs.current[s.id] = el;
                  }}
                  href={`#${s.id}`}
                  onClick={(e) => handleClick(e, s.id)}
                  aria-current={active ? "true" : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-forest bg-forest text-paper"
                      : "border-mist text-ink/70"
                  }`}
                >
                  <span className="text-[10px] font-medium tabular-nums tracking-[0.15em] opacity-70">
                    {s.num}
                  </span>
                  {s.label}
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
