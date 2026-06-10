"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

// Background slideshow. Drop the matching files in /public.
// Sanity-managed gallery can replace this list in a later iteration.
const SLIDES = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"];
const SLIDE_INTERVAL = 6000;

export default function Hero() {
  const t = useTranslations("hero");
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || SLIDES.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  // Scroll-driven parallax: the photo layer drifts vertically as the hero
  // passes through the viewport — the same effect shared with the sub-page
  // heroes (see ParallaxImage). The layer is taller than the section so the
  // drift never exposes an edge.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["0%", "-12%"],
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden"
    >
      <motion.div
        className="absolute -inset-y-[18%] inset-x-0"
        aria-hidden
        style={reduceMotion ? undefined : { y: heroY }}
      >
        {SLIDES.map((src, i) => (
          <motion.div
            key={src}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/15 to-black/45" />

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((src, i) => {
          const isActive = i === index;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${t("scrollHint")} ${i + 1}`}
              aria-current={isActive}
              className="group flex h-4 items-center"
            >
              <span
                className={`relative block h-[2px] overflow-hidden transition-all duration-500 ${
                  isActive ? "w-8 bg-paper/30" : "w-4 bg-paper/45 group-hover:bg-paper/80"
                }`}
              >
                {/* Loading-progress fill: drains the active slide's remaining
                    time. Keyed by index so it restarts on every slide change. */}
                {isActive && (
                  <motion.span
                    key={index}
                    className="absolute inset-y-0 left-0 block bg-paper"
                    initial={{ width: reduceMotion ? "100%" : 0 }}
                    animate={{ width: "100%" }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: SLIDE_INTERVAL / 1000, ease: "linear" }
                    }
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
