"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

// One continuous decorative liana spanning the whole homepage. The main stem
// is generated from the real section layout (measured at runtime), meanders
// down the page edges with a few deliberate excursions (densest around the
// room categories, per the design sketch), and draws itself in sync with
// scroll so the growing tip tracks the viewport. Offshoot branches start
// drawing once the stem passes their junction, and every leaf sprouts only
// after the tip has passed its node — stem first, like a living plant.
//
// Layering: the overlay sits at z-[1] — above section backgrounds and
// unpositioned blocks (so it can cross cards/photo corners in front) but
// below anything marked `relative z-[2]` (headings and body text are
// protected that way in the sections). Purely ornamental: aria-hidden and
// pointer-events-none.

const SVGNS = "http://www.w3.org/2000/svg";

type P = { x: number; y: number };

type Stem = { d: string; from: number; span: number; width: number };
type Leaf = {
  t: number;
  transform: string;
  soft: boolean;
};

type Organism = {
  w: number;
  h: number;
  stems: Stem[];
  leaves: Leaf[];
  // Monotonic y → stem-length lookup for scroll sync.
  ys: number[];
  lens: number[];
  total: number;
};

// Heart/teardrop leaf, attachment point at the origin, tip pointing up.
const LEAF_D =
  "M0 0 C-10 -5 -14 -15 -7.5 -20.5 C-3.5 -23.5 -0.5 -21.5 0 -18 C0.5 -21.5 3.5 -23.5 7.5 -20.5 C14 -15 10 -5 0 0 Z";

// --- geometry helpers ---------------------------------------------------

// Catmull-Rom → cubic bézier segments; the curve passes through every point,
// so branch anchors placed on a waypoint sit exactly on the stem.
function bezierSegs(pts: P[]): string[] {
  const segs: string[] = [];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    segs.push(
      `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`,
    );
  }
  return segs;
}

const moveTo = (p: P) => `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

// Insert deterministic lateral wiggle points into long straight runs so the
// stem winds organically instead of gliding.
function densify(pts: P[]): P[] {
  const out: P[] = [pts[0]];
  let k = 0;
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    if (dist > 380) {
      const n = Math.floor(dist / 260);
      const ux = -(b.y - a.y) / dist;
      const uy = (b.x - a.x) / dist;
      for (let j = 1; j <= n; j += 1) {
        const f = j / (n + 1);
        const amp = (14 + ((k * 29) % 26)) * (k % 2 === 0 ? 1 : -1);
        out.push({
          x: a.x + (b.x - a.x) * f + ux * amp,
          y: a.y + (b.y - a.y) * f + uy * amp,
        });
        k += 1;
      }
    }
    out.push(b);
  }
  return out;
}

function leavesAlong(
  el: SVGPathElement,
  opts: { spacing: number; from: number; span: number; seed: number; skip?: number },
): Leaf[] {
  const total = el.getTotalLength();
  const skip = opts.skip ?? 50;
  const leaves: Leaf[] = [];
  let i = 0;
  for (let l = skip; l < total - 26; l += opts.spacing) {
    const pt = el.getPointAtLength(l);
    const ahead = el.getPointAtLength(Math.min(total, l + 2));
    const ang = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
    const seed = opts.seed * 13 + i;
    const flank = seed % 2 === 0 ? -64 : 64;
    const jitter = ((seed * 47) % 19) - 9;
    const scale = 0.7 + (((seed * 31) % 10) / 10) * 0.4;
    const t = opts.from + (l / total) * opts.span;
    const place = (fl: number, sc: number, dt: number): Leaf => ({
      t: t + dt,
      soft: seed % 3 === 1,
      transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${(
        ang + 90 + fl + jitter
      ).toFixed(1)}) scale(${sc.toFixed(2)})`,
    });
    leaves.push(place(flank, scale, 0));
    // Every third node carries an opposite pair leaf, like a real vine.
    if (i % 3 === 2) leaves.push(place(-flank, scale * 0.8, 0.004));
    i += 1;
  }
  return leaves;
}

function fracNearest(
  samplePts: P[],
  sampleLens: number[],
  total: number,
  p: P,
): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < samplePts.length; i += 1) {
    const d = Math.hypot(samplePts[i].x - p.x, samplePts[i].y - p.y);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return sampleLens[best] / total;
}

// --- organism generation -------------------------------------------------

function generate(main: HTMLElement): Organism | null {
  const ids = ["amenities", "rooms", "triple-deluxe", "gallery", "reviews", "contact"];
  const mainRect = main.getBoundingClientRect();
  const rects: Record<string, { t: number; b: number; h: number }> = {};
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    rects[id] = {
      t: r.top - mainRect.top,
      b: r.bottom - mainRect.top,
      h: r.height,
    };
  }

  const W = main.clientWidth;
  const H = main.scrollHeight;
  if (W < 200 || H < 1000) return null;
  const mobile = W < 640;
  const wScale = mobile ? 0.7 : 1;

  const am = rects.amenities;
  const rm = rects.rooms;
  const td = rects["triple-deluxe"];
  const ga = rects.gallery;
  const rv = rects.reviews;
  const ct = rects.contact;

  const px = (fx: number, y: number): P => ({ x: fx * W, y });

  // Named anchors that branches attach to (must be actual waypoints so they
  // sit exactly on the curve).
  const apexRooms = px(0.38, rm.t + 34);
  const aAmen = px(0.88, am.t + 0.35 * am.h);
  const aRoomsLeft = px(0.06, rm.t + 0.4 * rm.h);
  const aTriple = px(0.07, td.t + 0.3 * td.h);
  const aGallery = px(0.9, ga.t + 0.7 * ga.h);
  const aReviews = px(0.9, rv.t + 0.5 * rv.h);
  const aContact = px(0.25, ct.t + 0.35 * ct.h);

  const waypoints: P[] = [
    // Amenities — in from the right edge, down, swing left along the bottom.
    px(0.97, am.t + 26),
    aAmen,
    px(0.94, am.t + 0.65 * am.h),
    px(0.5, am.b - 44),
    px(0.12, am.b - 8),
    // Rooms — sketch arrangement: top-left excursion, then down the left edge.
    px(0.1, rm.t + 46),
    px(0.26, rm.t + 64),
    apexRooms,
    px(0.18, rm.t + 118),
    aRoomsLeft,
    px(0.1, rm.t + 0.62 * rm.h),
    px(0.04, rm.b - 40),
    // TripleDeluxe — left edge.
    aTriple,
    px(0.03, td.t + 0.6 * td.h),
    px(0.08, td.b - 40),
    // Room panels region — hug the left edge (densify adds the winding).
    px(0.03, td.b + 0.3 * (ga.t - td.b)),
    px(0.07, td.b + 0.6 * (ga.t - td.b)),
    px(0.04, ga.t - 70),
    // Cross to the right at the Gallery seam, then down its right side.
    px(0.5, ga.t + 28),
    px(0.93, ga.t + 96),
    px(0.96, ga.t + 0.4 * ga.h),
    aGallery,
    px(0.96, ga.b - 16),
    // Dark attractions band — stay at the extreme edge.
    px(0.985, ga.b + 0.5 * (rv.t - ga.b)),
    // Reviews — back in along the right.
    px(0.92, rv.t + 36),
    aReviews,
    px(0.7, rv.b - 24),
    // Contact — swing left and settle by the map.
    px(0.6, ct.t + 56),
    aContact,
    px(0.08, ct.t + 0.6 * ct.h),
    px(0.06, ct.b - 70),
  ];

  const pts = densify(waypoints);
  const segs = bezierSegs(pts);
  const fullD = `${moveTo(pts[0])} ${segs.join(" ")}`;

  // Branches: [anchor, ...points] — the rooms section gets the dense sketch
  // set; the rest of the page gets small offshoots. Anchors must lie on the
  // main stem (a waypoint) — or, with `parent`, on a previous branch, so the
  // start fraction is derived from the parent's own growth window.
  const branchDefs: {
    pts: P[];
    width: number;
    spacing: number;
    seed: number;
    parent?: number;
  }[] = [
    // Rooms: long branch arcing right across the top, descending the right
    // edge…
    {
      pts: [
        apexRooms,
        px(0.55, rm.t + 26),
        px(0.74, rm.t + 66),
        px(0.9, rm.t + 44),
        px(0.955, rm.t + 0.28 * rm.h),
        px(0.9, rm.t + 0.52 * rm.h),
        px(0.955, rm.t + 0.78 * rm.h),
        px(0.91, rm.b - 24),
      ],
      width: 3.4,
      spacing: 85,
      seed: 21,
    },
    // …with a sub-branch bowing toward the centre at heading level.
    {
      pts: [
        px(0.955, rm.t + 0.28 * rm.h),
        px(0.87, rm.t + 0.3 * rm.h),
        px(0.8, rm.t + 0.4 * rm.h),
      ],
      width: 2.2,
      spacing: 60,
      seed: 33,
      parent: 0,
    },
    // Rooms: thick diagonal from the left stem across the cards' top.
    {
      pts: [
        aRoomsLeft,
        px(0.17, rm.t + 0.5 * rm.h),
        px(0.28, rm.t + 0.57 * rm.h),
        px(0.4, rm.t + 0.68 * rm.h),
      ],
      width: 4.2,
      spacing: 75,
      seed: 8,
    },
    // Small offshoots along the rest of the page.
    {
      pts: [aAmen, px(0.78, am.t + 0.42 * am.h), px(0.72, am.t + 0.55 * am.h)],
      width: 2.4,
      spacing: 80,
      seed: 4,
    },
    {
      pts: [aTriple, px(0.16, td.t + 0.4 * td.h), px(0.22, td.t + 0.52 * td.h)],
      width: 2.4,
      spacing: 80,
      seed: 12,
    },
    {
      pts: [aGallery, px(0.8, ga.t + 0.78 * ga.h), px(0.74, ga.t + 0.9 * ga.h)],
      width: 2.4,
      spacing: 80,
      seed: 17,
    },
    {
      pts: [aReviews, px(0.8, rv.t + 0.6 * rv.h), px(0.72, rv.t + 0.72 * rv.h)],
      width: 2.2,
      spacing: 75,
      seed: 26,
    },
    {
      pts: [aContact, px(0.36, ct.t + 0.45 * ct.h), px(0.44, ct.t + 0.58 * ct.h)],
      width: 2.4,
      spacing: 80,
      seed: 31,
    },
  ];

  // Measure everything inside a temporary off-screen SVG.
  const svg = document.createElementNS(SVGNS, "svg");
  svg.style.position = "absolute";
  svg.style.width = "0";
  svg.style.height = "0";
  svg.style.overflow = "hidden";
  document.body.appendChild(svg);
  try {
    const makePath = (d: string) => {
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
      return p;
    };

    const fullEl = makePath(fullD);
    const total = fullEl.getTotalLength();

    // Samples: scroll-sync lookup (monotonic max-y) + junction location.
    const N = 400;
    const samplePts: P[] = [];
    const sampleLens: number[] = [];
    const ys: number[] = [];
    const lens: number[] = [];
    let maxY = -Infinity;
    for (let i = 0; i <= N; i += 1) {
      const l = (i / N) * total;
      const pt = fullEl.getPointAtLength(l);
      samplePts.push({ x: pt.x, y: pt.y });
      sampleLens.push(l);
      if (pt.y > maxY) {
        maxY = pt.y;
        ys.push(pt.y);
        lens.push(l);
      }
    }

    // Main stem in contiguous chunks of varying thickness; each chunk draws
    // over its own slice of the global progress, so the stroke stays one
    // continuous line. The width ramp is gentle (steps <= 0.4px) so the
    // taper never reads as separate joints.
    const widths = [5, 4.6, 4.2, 3.9, 3.6, 3.3, 3, 2.8, 2.6].map(
      (w) => w * wScale,
    );
    const nChunks = widths.length;
    const stems: Stem[] = [];
    const per = Math.ceil(segs.length / nChunks);
    let acc = 0;
    for (let c = 0; c < nChunks; c += 1) {
      const a = c * per;
      const b = Math.min(segs.length, (c + 1) * per);
      if (a >= b) break;
      const d = `${moveTo(pts[a])} ${segs.slice(a, b).join(" ")}`;
      const len = makePath(d).getTotalLength();
      stems.push({ d, from: acc / total, span: len / total, width: widths[c] });
      acc += len;
    }

    // Leaves on the main stem.
    const leaves: Leaf[] = leavesAlong(fullEl, {
      spacing: mobile ? 210 : 140,
      from: 0,
      span: 1,
      seed: 1,
      skip: 90,
    });

    // Branches + their leaves.
    const grown: { el: SVGPathElement; from: number; span: number }[] = [];
    for (const def of branchDefs) {
      const d = `${moveTo(def.pts[0])} ${bezierSegs(def.pts).join(" ")}`;
      const el = makePath(d);
      const len = el.getTotalLength();
      // Junction time: fraction of the global growth at which the anchor
      // point gets drawn — on the main stem, or within the parent branch's
      // own window for sub-branches (so a child never precedes its parent).
      let from: number;
      if (def.parent !== undefined && grown[def.parent]) {
        const par = grown[def.parent];
        const parLen = par.el.getTotalLength();
        let bestL = 0;
        let bestD = Infinity;
        for (let s = 0; s <= 120; s += 1) {
          const l = (s / 120) * parLen;
          const sp = par.el.getPointAtLength(l);
          const dd = Math.hypot(sp.x - def.pts[0].x, sp.y - def.pts[0].y);
          if (dd < bestD) {
            bestD = dd;
            bestL = l;
          }
        }
        from = par.from + (bestL / parLen) * par.span;
      } else {
        from = fracNearest(samplePts, sampleLens, total, def.pts[0]);
      }
      // Branches finish shortly after the tip passes their junction —
      // nothing in view should ever look half-grown.
      const span = Math.min(0.018, (len / total) * 0.45);
      grown.push({ el, from, span });
      stems.push({ d, from, span, width: def.width * wScale });
      leaves.push(
        ...leavesAlong(el, {
          spacing: mobile ? def.spacing * 1.4 : def.spacing,
          from,
          span,
          seed: def.seed,
        }),
      );
    }

    return { w: W, h: H, stems, leaves, ys, lens, total };
  } finally {
    document.body.removeChild(svg);
  }
}

// --- rendering -----------------------------------------------------------

function StemPath({
  stem,
  progress,
  animate,
}: {
  stem: Stem;
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const pathLength = useTransform(
    progress,
    [stem.from, Math.min(1, stem.from + stem.span)],
    [0, 1],
  );
  return (
    <motion.path
      d={stem.d}
      className="stroke-forest"
      strokeWidth={stem.width}
      strokeLinecap="round"
      fill="none"
      style={animate ? { pathLength } : undefined}
    />
  );
}

function LeafNode({
  leaf,
  progress,
  animate,
}: {
  leaf: Leaf;
  progress: MotionValue<number>;
  animate: boolean;
}) {
  // Sprouts only once the stem tip is already past the node (small delay),
  // completing quickly so foliage in view never looks half-grown.
  const opacity = useTransform(
    progress,
    [leaf.t + 0.004, leaf.t + 0.022],
    [0, 1],
  );
  const scale = useTransform(
    progress,
    [leaf.t + 0.004, leaf.t + 0.032],
    [0, 1],
  );
  const rotate = useTransform(
    progress,
    [leaf.t + 0.004, leaf.t + 0.032],
    [-22, 0],
  );
  return (
    <g transform={leaf.transform}>
      <motion.g
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
      >
        {/* Petiole: a short stalk starting inside the stem stroke, welding
            the leaf to the stem — one organism. */}
        <path
          d="M0 2 L0 -7"
          className="stroke-forest"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        <g transform="translate(0 -7)">
          <path
            d={LEAF_D}
            className={leaf.soft ? "fill-forest-soft" : "fill-forest"}
          />
        </g>
      </motion.g>
    </g>
  );
}

export default function VineOverlay() {
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [org, setOrg] = useState<Organism | null>(null);
  const orgRef = useRef<Organism | null>(null);
  orgRef.current = org;
  const mainTopRef = useRef(0);
  const vhRef = useRef(800);

  useEffect(() => {
    const main = hostRef.current?.parentElement;
    if (!main) return;

    let timer: number | undefined;
    const run = () => {
      vhRef.current = window.innerHeight;
      mainTopRef.current = main.getBoundingClientRect().top + window.scrollY;
      setOrg(generate(main));
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, 350);
    };

    run();
    const ro = new ResizeObserver(schedule);
    ro.observe(main);
    window.addEventListener("resize", schedule);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Global growth: the drawn tip tracks the viewport's bottom edge via the
  // monotonic y→length lookup (so horizontal excursions wait for the scroll
  // to reach them) — everything actually in view is already fully grown,
  // and the growing happens at the lower edge. A soft spring keeps the
  // motion organic on top of Lenis.
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, (v) => {
    const o = orgRef.current;
    if (!o) return 0;
    const targetY = v + vhRef.current * 0.95 - mainTopRef.current;
    const { ys, lens } = o;
    if (targetY <= ys[0]) return 0;
    let lo = 0;
    let hi = ys.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (ys[mid] <= targetY) lo = mid;
      else hi = mid - 1;
    }
    return Math.min(1, lens[lo] / o.total);
  });
  const progress = useSpring(raw, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.0005,
  });

  const animate = !reduceMotion;

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
    >
      {org && (
        <svg
          viewBox={`0 0 ${org.w} ${org.h}`}
          preserveAspectRatio="xMidYMin meet"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          {org.stems.map((stem, i) => (
            <StemPath key={`s-${i}`} stem={stem} progress={progress} animate={animate} />
          ))}
          {org.leaves.map((leaf, i) => (
            <LeafNode key={`l-${i}`} leaf={leaf} progress={progress} animate={animate} />
          ))}
        </svg>
      )}
    </div>
  );
}
