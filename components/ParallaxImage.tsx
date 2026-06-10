"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

// Scroll-driven background photo that drifts vertically as its section passes
// through the viewport, while the section's content stays put. The image layer
// is taller than the section (-inset-y-[12%]) so the drift never exposes an
// edge. Render this as the first child of a `relative overflow-hidden` section.
export default function ParallaxImage({
  src,
  alt = "",
  sizes = "100vw",
  priority = false,
  className = "object-cover object-center",
}: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-12%", "12%"],
  );

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={className}
        />
      </motion.div>
    </div>
  );
}
