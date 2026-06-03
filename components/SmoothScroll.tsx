"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "./lenisStore";

// Global momentum-based smooth scroll. Skipped when the user prefers
// reduced motion; falls back to native scroll there. The live instance
// is published via lenisStore so anchor components can scroll with it.
export default function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Smooth-scroll every same-page anchor through Lenis (header-offset
    // aware). Cross-page links (/path#id) and links already handled by a
    // component (defaultPrevented, e.g. the TOC) are left alone.
    const HEADER_OFFSET = 96;
    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey)
        return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      // Wait a frame so any overlay that closes on click (e.g. the mobile
      // menu restoring body scroll) settles before Lenis moves.
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          lenis.scrollTo(el as HTMLElement, { offset: -HEADER_OFFSET }),
        ),
      );
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
