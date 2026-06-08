"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Flips a text value when it changes — the old value slides up and out while
// the new value rises from below, matching the navbar FlipText direction.
// Use for dynamic, value-changing text (scroll-spy labels, counters).
export default function FlipOnChange({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{value}</span>;

  return (
    <span
      className={`relative inline-flex overflow-hidden align-bottom ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="block whitespace-nowrap"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
