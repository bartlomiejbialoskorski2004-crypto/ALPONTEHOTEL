"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

// A small botanical flourish — one thin curved stem with a few heart leaves,
// in the reference sprig's style. Used sparingly as a premium accent: the
// `divider` lies horizontally under section headings, the `crescent` is a
// quiet corner ornament. Reveals once in view: the stem draws first, then
// each leaf unfurls from its attachment as the tip passes. Decorative only.

type Shape = "divider" | "crescent";

const SHAPES: Record<
  Shape,
  { viewBox: string; d: string; leaves: number; leafScale: number; stroke: number }
> = {
  divider: {
    viewBox: "0 0 120 28",
    d: "M4 18 C30 8 60 22 88 12 C100 8 110 10 116 14",
    leaves: 5,
    leafScale: 0.55,
    stroke: 1.6,
  },
  crescent: {
    viewBox: "0 0 90 200",
    d: "M62 6 C40 36 30 70 32 104 C34 140 46 168 70 192",
    leaves: 7,
    leafScale: 0.8,
    stroke: 2,
  },
};

// Heart leaf, attachment at the origin, tip pointing up.
const LEAF_D =
  "M0 0 C-10 -5 -14 -15 -7.5 -20.5 C-3.5 -23.5 -0.5 -21.5 0 -18 C0.5 -21.5 3.5 -23.5 7.5 -20.5 C14 -15 10 -5 0 0 Z";

type LeafSpec = { t: number; transform: string; soft: boolean };

const stemVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 1.2, ease: [0.45, 0, 0.2, 1] },
  },
};

const leafVariants: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -18 },
  visible: (t: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    // Follows the stem tip: the draw takes 1.2s, leaves sprout just behind it.
    transition: {
      delay: 0.1 + t * 1.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

type Props = {
  shape?: Shape;
  className?: string;
};

export default function Sprig({ shape = "divider", className = "" }: Props) {
  const reduceMotion = useReducedMotion();
  const stemRef = useRef<SVGPathElement>(null);
  const [leaves, setLeaves] = useState<LeafSpec[] | null>(null);

  const { viewBox, d, leaves: count, leafScale, stroke } = SHAPES[shape];

  // Leaves sit on the real curve (position + tangent), welded by a petiole.
  useEffect(() => {
    const p = stemRef.current;
    if (!p) return;
    const total = p.getTotalLength();
    const specs: LeafSpec[] = Array.from({ length: count }, (_, i) => {
      const t = 0.12 + (i / (count - 1)) * 0.82;
      const pt = p.getPointAtLength(t * total);
      const ahead = p.getPointAtLength(Math.min(total, t * total + 2));
      const ang = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
      const flank = i % 2 === 0 ? -62 : 62;
      const jitter = ((i * 47) % 17) - 8;
      const scale = leafScale * (0.85 + (((i * 31) % 10) / 10) * 0.3);
      return {
        t,
        soft: i % 3 === 1,
        transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${(
          ang + 90 + flank + jitter
        ).toFixed(1)}) scale(${scale.toFixed(2)})`,
      };
    });
    setLeaves(specs);
  }, [count, leafScale]);

  const animate = !reduceMotion;

  return (
    <motion.svg
      viewBox={viewBox}
      fill="none"
      aria-hidden
      initial={animate ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`pointer-events-none h-auto ${className}`}
    >
      <motion.path
        ref={stemRef}
        d={d}
        className="stroke-forest/80"
        strokeWidth={stroke}
        strokeLinecap="round"
        variants={animate ? stemVariants : undefined}
      />
      {leaves?.map((leaf, i) => (
        <g key={i} transform={leaf.transform}>
          <motion.g
            variants={animate ? leafVariants : undefined}
            custom={leaf.t}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          >
            {/* Petiole welds the leaf to the stem. */}
            <path
              d="M0 2 L0 -6"
              className="stroke-forest/80"
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <g transform="translate(0 -6)">
              <path
                d={LEAF_D}
                className={leaf.soft ? "fill-forest-soft" : "fill-forest"}
              />
            </g>
          </motion.g>
        </g>
      ))}
    </motion.svg>
  );
}
