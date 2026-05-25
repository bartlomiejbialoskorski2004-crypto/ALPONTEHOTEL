"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="[filter:invert(1)_brightness(1.5)]"
        >
          <Image
            src="/logo.png"
            alt=""
            width={96}
            height={96}
            priority
            aria-hidden
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.45 }}
          className="my-8 block h-px w-16 origin-center bg-paper/80"
          aria-hidden
        />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="font-serif text-5xl leading-none tracking-tight md:text-7xl"
        >
          {data.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          className="mt-6 max-w-xl text-xs uppercase tracking-[0.3em] md:text-sm"
        >
          {data.tagline}
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
          href={data.bookingUrl ?? "#contact"}
          className="mt-12 inline-flex items-center border border-paper px-7 py-3 text-xs uppercase tracking-[0.3em] transition-colors hover:bg-paper hover:text-forest"
        >
          {t("ctaContact")}
        </motion.a>
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
