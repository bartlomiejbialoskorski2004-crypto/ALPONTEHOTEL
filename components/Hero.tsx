"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

type HeroData = {
  name: string;
  tagline: string;
  heroImage?: { asset?: { _ref?: string } } | null;
  bookingUrl?: string;
};

// Background slideshow. Drop the matching files in /public.
// Sanity-managed gallery can replace this list in a later iteration.
const SLIDES = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"];
const SLIDE_INTERVAL = 6000;

export default function Hero({ data }: { data: HeroData }) {
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

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center text-paper">
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={reduceMotion ? false : { opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl leading-none tracking-tight md:text-7xl"
          >
            {data.name}
          </motion.h1>
        </AnimatePresence>
      </div>

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
