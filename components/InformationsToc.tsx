"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { getLenis } from "./lenisStore";

// Section ids must match the <section id=…> blocks in Informations.tsx.
const SECTIONS = [
  { id: "hours", num: "01", key: "hours" },
  { id: "safety", num: "02", key: "safety" },
  { id: "pool", num: "03", key: "pool" },
  { id: "parking", num: "04", key: "parking" },
  { id: "tax", num: "05", key: "tax" },
  { id: "services", num: "06", key: "services" },
  { id: "tv", num: "07", key: "tv" },
  { id: "transport", num: "08", key: "transport" },
  { id: "requests", num: "09", key: "requests" },
] as const;

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

export default function InformationsToc() {
  const t = useTranslations("info");
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  // Scroll-spy: flip the active entry as a section crosses the upper third
  // of the viewport.
  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
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
  }, []);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    scrollToTarget(`#${id}`);
  };

  return (
    <>
      {/* Mobile: tappable index card under the hero. */}
      <nav
        aria-label={t("toc.title")}
        className="border border-mist bg-paper lg:hidden"
      >
        <p className="border-b border-mist px-5 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
          {t("toc.title")}
        </p>
        <ul className="divide-y divide-mist">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                className="flex items-center gap-4 px-5 py-4 text-ink/80 transition-colors hover:text-forest"
              >
                <span className="text-[11px] font-medium tabular-nums tracking-[0.2em] text-forest">
                  {s.num}
                </span>
                <span className="flex-1 text-sm">{t(`nav.${s.key}`)}</span>
                <span aria-hidden className="text-ink/30">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop: sticky side index with scroll-spy. */}
      <nav
        aria-label={t("toc.title")}
        className="sticky top-28 hidden lg:block"
      >
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-ink/40">
          {t("toc.title")}
        </p>
        <ul className="space-y-1">
          {SECTIONS.map((s) => {
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
                    {t(`nav.${s.key}`)}
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

// Small "back to top" affordance reusing the same momentum scroll.
export function BackToTop() {
  const t = useTranslations("info");
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
      {t("backToTop")}
    </a>
  );
}
