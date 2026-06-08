"use client";

import { motion } from "motion/react";

type Props = {
  open: boolean;
  onClick: () => void;
  label: string;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
// Two bars centred on the box middle (top:50% + marginTop), leaving motion's
// transform free to animate y/rotate without fighting a Tailwind translate.
const bar =
  "absolute left-0 block h-[1.5px] w-6 rounded-full bg-current";
const barStyle = { top: "50%", marginTop: "-0.75px" } as const;

// Single morphing menu button: two parallel lines that smoothly rotate and
// converge into an X when `open`, and back. Colour follows `currentColor`.
export default function MenuToggle({ open, onClick, label, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className={`inline-flex h-10 w-10 items-center justify-center ${className}`}
    >
      <span className="relative block h-4 w-6">
        <motion.span
          className={bar}
          style={barStyle}
          initial={false}
          animate={{ y: open ? 0 : -4, rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <motion.span
          className={bar}
          style={barStyle}
          initial={false}
          animate={{ y: open ? 0 : 4, rotate: open ? -45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </span>
    </button>
  );
}
