"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
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
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${t("scrollHint")} ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index
                ? "w-8 bg-paper"
                : "w-1.5 bg-paper/50 hover:bg-paper/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
