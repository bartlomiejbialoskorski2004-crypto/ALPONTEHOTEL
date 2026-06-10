"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

// Decorative vine that grows out of the page edge as its section scrolls
// through the viewport: the stem draws in (pathLength) and heart-shaped
// leaves unfurl one by one as the tip reaches them. Purely ornamental:
// aria-hidden, pointer-events-none; the caller positions it absolutely and
// sets a responsive width. Right-side vines are mirrored copies.

type Variant = "tall" | "sprig";

const STEMS: Record<Variant, { d: string; viewBox: string; leaves: number }> = {
  // Long meandering S — grows from the edge near the top, flows downward.
  tall: {
    d: "M-12 28 C66 44 116 112 102 198 C90 272 30 318 46 404 C62 492 132 538 120 634",
    viewBox: "0 0 220 660",
    leaves: 10,
  },
  // Short branch — arcs from the edge into the section, then bows down.
  sprig: {
    d: "M-12 36 C56 28 122 60 150 122 C170 168 160 204 138 228",
    viewBox: "0 0 220 240",
    leaves: 6,
  },
};

// Heart/teardrop leaf, attachment point at the origin, tip pointing up.
const LEAF_D =
  "M0 0 C-10 -5 -14 -15 -7.5 -20.5 C-3.5 -23.5 -0.5 -21.5 0 -18 C0.5 -21.5 3.5 -23.5 7.5 -20.5 C14 -15 10 -5 0 0 Z";

type LeafSpec = { t: number; transform: string; soft: boolean };

function VineLeaf({
  leaf,
  progress,
  animate,
}: {
  leaf: LeafSpec;
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const opacity = useTransform(progress, [leaf.t - 0.07, leaf.t], [0, 1]);
  const scale = useTransform(progress, [leaf.t - 0.07, leaf.t], [0.4, 1]);
  return (
    <g transform={leaf.transform}>
      <motion.path
        d={LEAF_D}
        className={leaf.soft ? "fill-forest-soft" : "fill-forest"}
        style={
          animate
            ? {
                opacity,
                scale,
                transformBox: "fill-box",
                transformOrigin: "50% 100%",
              }
            : undefined
        }
      />
    </g>
  );
}

type Props = {
  variant?: Variant;
  side?: "left" | "right";
  className?: string;
};

export default function Vine({
  variant = "tall",
  side = "left",
  className = "",
}: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const stemRef = useRef<SVGPathElement>(null);
  const [leaves, setLeaves] = useState<LeafSpec[] | null>(null);

  const { d, viewBox, leaves: count } = STEMS[variant];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.5"],
  });

  // Leaves are placed on the real stem geometry after mount, so they always
  // sit exactly on the curve with the right tangent, whatever the path.
  useEffect(() => {
    const p = stemRef.current;
    if (!p) return;
    const total = p.getTotalLength();
    const start = 0.08;
    const end = 0.97;
    const specs: LeafSpec[] = Array.from({ length: count }, (_, i) => {
      const t = start + (i / (count - 1)) * (end - start);
      const pt = p.getPointAtLength(t * total);
      const ahead = p.getPointAtLength(Math.min(total, t * total + 2));
      const ang =
        (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
      const flank = i % 2 === 0 ? -64 : 64;
      const jitter = ((i * 47) % 19) - 9;
      const scale = 0.85 + (((i * 31) % 10) / 10) * 0.35;
      return {
        t,
        soft: i % 3 === 1,
        transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${(
          ang + 90 + flank + jitter
        ).toFixed(1)}) scale(${scale.toFixed(2)})`,
      };
    });
    setLeaves(specs);
  }, [count]);

  const animate = !reduceMotion;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${className}`}
    >
      <svg
        viewBox={viewBox}
        fill="none"
        className={`h-auto w-full ${side === "right" ? "-scale-x-100" : ""}`}
      >
        <motion.path
          ref={stemRef}
          d={d}
          className="stroke-forest"
          strokeWidth={3}
          strokeLinecap="round"
          style={animate ? { pathLength: scrollYProgress } : undefined}
        />
        {leaves?.map((leaf, i) => (
          <VineLeaf
            key={i}
            leaf={leaf}
            progress={scrollYProgress}
            animate={animate}
          />
        ))}
      </svg>
    </div>
  );
}
