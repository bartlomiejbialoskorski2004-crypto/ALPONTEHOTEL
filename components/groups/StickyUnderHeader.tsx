"use client";

import { useEffect, useState } from "react";
import { getHeaderHidden, subscribeHeaderHidden } from "../headerStore";

// Sticky wrapper that docks right under the fixed header (h-20 / lg:h-24)
// and rides up to the very top when the header slides away on scroll-down -
// the same behaviour as the room bar (RoomNav). `top` only matters once the
// element is stuck, so its in-flow position under the hero never moves.
export default function StickyUnderHeader({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerH, setHeaderH] = useState(80);

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

  return (
    <div
      style={{ top: headerHidden ? 0 : headerH }}
      className={`sticky z-30 transition-[top] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
