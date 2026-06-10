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
// through the viewport: stems draw in (pathLength), offshoot branches start
// once the main stem passes their junction, and heart-shaped leaves sprout
// from the stem only after the tip has passed their node — stem first, like
// a living plant. Purely ornamental: aria-hidden, pointer-events-none; the
// caller positions it absolutely, sets a responsive width, and picks the
// layer (back = drop before the section's relative content, front = add
// z-10). Right-side vines are mirrored copies.

type Variant = "tall" | "sprig" | "arch" | "column";
type Weight = "thin" | "regular" | "thick";

type PathSpec = {
  d: string;
  // Fraction of the global growth at which this path starts/finishes drawing.
  from: number;
  span: number;
  // Stroke multiplier (branches thinner than the main stem).
  width: number;
  leaves: number;
};

const STEMS: Record<Variant, { viewBox: string; paths: PathSpec[] }> = {
  // Long meandering S with one offshoot — grows from the edge near the top.
  tall: {
    viewBox: "0 0 220 660",
    paths: [
      {
        d: "M-12 28 C66 44 116 112 102 198 C90 272 30 318 46 404 C62 492 132 538 120 634",
        from: 0,
        span: 1,
        width: 1,
        leaves: 9,
      },
      {
        d: "M46 404 C92 418 124 404 152 434 C170 454 176 474 170 494",
        from: 0.62,
        span: 0.3,
        width: 0.7,
        leaves: 3,
      },
    ],
  },
  // Short branch arcing from the edge into the section, then bowing down.
  sprig: {
    viewBox: "0 0 220 240",
    paths: [
      {
        d: "M-12 36 C56 28 122 60 150 122 C170 168 160 204 138 228",
        from: 0,
        span: 1,
        width: 1,
        leaves: 6,
      },
    ],
  },
  // Winding horizontal runner with a small drooping offshoot.
  arch: {
    viewBox: "0 0 560 180",
    paths: [
      {
        d: "M-12 64 C70 28 150 96 240 70 C330 44 410 110 470 88 C510 74 536 80 552 92",
        from: 0,
        span: 1,
        width: 1,
        leaves: 9,
      },
      {
        d: "M240 70 C258 108 250 136 272 160",
        from: 0.42,
        span: 0.25,
        width: 0.7,
        leaves: 3,
      },
    ],
  },
  // Long sinuous vertical for full-height section edges, two offshoots.
  column: {
    viewBox: "0 0 180 920",
    paths: [
      {
        d: "M64 -12 C112 70 28 160 68 260 C108 360 36 450 76 550 C116 650 40 740 82 840 C98 878 94 902 88 924",
        from: 0,
        span: 1,
        width: 1,
        leaves: 13,
      },
      {
        d: "M68 260 C108 270 138 300 150 340",
        from: 0.3,
        span: 0.2,
        width: 0.7,
        leaves: 3,
      },
      {
        d: "M76 550 C118 556 144 590 152 628",
        from: 0.62,
        span: 0.2,
        width: 0.7,
        leaves: 3,
      },
    ],
  },
};

const WEIGHTS: Record<Weight, number> = {
  thin: 2,
  regular: 3,
  thick: 4.5,
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
  // Sprout only after the stem tip passes the node: window starts AT t.
  const opacity = useTransform(progress, [leaf.t, leaf.t + 0.05], [0, 1]);
  const scale = useTransform(progress, [leaf.t, leaf.t + 0.07], [0, 1]);
  const rotate = useTransform(progress, [leaf.t, leaf.t + 0.07], [-24, 0]);
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
                rotate,
                transformBox: "fill-box",
                transformOrigin: "50% 100%",
              }
            : undefined
        }
      />
    </g>
  );
}

function VineStem({
  spec,
  progress,
  strokeBase,
  animate,
  pathRef,
}: {
  spec: PathSpec;
  progress: MotionValue<number>;
  strokeBase: number;
  animate: boolean;
  pathRef: (el: SVGPathElement | null) => void;
}) {
  // Branches draw across their own slice of the global growth.
  const pathLength = useTransform(
    progress,
    [spec.from, Math.min(1, spec.from + spec.span)],
    [0, 1],
  );
  return (
    <motion.path
      ref={pathRef}
      d={spec.d}
      className="stroke-forest"
      strokeWidth={strokeBase * spec.width}
      strokeLinecap="round"
      fill="none"
      style={animate ? { pathLength } : undefined}
    />
  );
}

type Props = {
  variant?: Variant;
  side?: "left" | "right";
  weight?: Weight;
  className?: string;
};

export default function Vine({
  variant = "tall",
  side = "left",
  weight = "regular",
  className = "",
}: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pathEls = useRef<(SVGPathElement | null)[]>([]);
  const [leaves, setLeaves] = useState<LeafSpec[] | null>(null);

  const { viewBox, paths } = STEMS[variant];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.5"],
  });

  // Leaves are placed on the real stem geometry after mount, so they always
  // sit exactly on the curve with the right tangent, whatever the path. The
  // reveal time of each leaf is mapped into the global growth so branch
  // leaves wait for their branch.
  useEffect(() => {
    const specs: LeafSpec[] = [];
    paths.forEach((spec, pi) => {
      const p = pathEls.current[pi];
      if (!p) return;
      const total = p.getTotalLength();
      const start = 0.12;
      const end = 0.96;
      for (let i = 0; i < spec.leaves; i += 1) {
        const tLocal =
          spec.leaves === 1
            ? 0.5
            : start + (i / (spec.leaves - 1)) * (end - start);
        const pt = p.getPointAtLength(tLocal * total);
        const ahead = p.getPointAtLength(Math.min(total, tLocal * total + 2));
        const ang =
          (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
        const seed = pi * 7 + i;
        const flank = seed % 2 === 0 ? -64 : 64;
        const jitter = ((seed * 47) % 19) - 9;
        const scale =
          (0.85 + (((seed * 31) % 10) / 10) * 0.35) * (spec.width < 1 ? 0.85 : 1);
        specs.push({
          t: spec.from + tLocal * spec.span,
          soft: seed % 3 === 1,
          transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${(
            ang + 90 + flank + jitter
          ).toFixed(1)}) scale(${scale.toFixed(2)})`,
        });
      }
    });
    setLeaves(specs);
    // STEMS is static per variant; paths identity changes only with variant.
  }, [paths]);

  const animate = !reduceMotion;
  const strokeBase = WEIGHTS[weight];

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none ${className}`}>
      <svg
        viewBox={viewBox}
        fill="none"
        className={`h-auto w-full ${side === "right" ? "-scale-x-100" : ""}`}
      >
        {paths.map((spec, pi) => (
          <VineStem
            key={pi}
            spec={spec}
            progress={scrollYProgress}
            strokeBase={strokeBase}
            animate={animate}
            pathRef={(el) => {
              pathEls.current[pi] = el;
            }}
          />
        ))}
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
