"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Wraps the round sauna price badge so it "levitates": a slow idle bob plus a
// gentle parallax drift (and slight tilt) tied to the page scroll. Position it
// with `className` (e.g. absolute -bottom-6 right-6). Static with reduced motion.
export default function FloatingBadge({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { y, rotate }}
      className={`z-10 ${className}`}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
