"use client";

import { useEffect, useRef } from "react";

// Horizontal scroll strip that centres its active item ([aria-current=page])
// on mount. Uses scrollLeft only, so the page itself never jumps.
export default function StripScroll({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const strip = ref.current;
    const active = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) return;
    const item = active.closest("li") ?? active;
    const target = item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2;
    strip.scrollLeft = Math.max(0, Math.min(target, strip.scrollWidth - strip.clientWidth));
  }, []);

  return (
    <ul ref={ref} className={`relative ${className ?? ""}`}>
      {children}
    </ul>
  );
}
