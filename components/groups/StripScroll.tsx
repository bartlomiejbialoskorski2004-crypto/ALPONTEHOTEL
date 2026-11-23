"use client";

import { useEffect, useRef } from "react";

// Horizontal scroll strip that brings its active item ([aria-current=page])
// into view on mount. Uses scrollLeft only, so the page itself never jumps.
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
    if (!strip || !active) return;
    const item = active.closest("li") ?? active;
    const overflow = item.offsetLeft + item.offsetWidth - strip.clientWidth;
    if (overflow > 0) strip.scrollLeft = overflow + 24;
  }, []);

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
