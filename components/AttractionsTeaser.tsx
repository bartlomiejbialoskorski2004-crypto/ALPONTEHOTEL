"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import FlipText from "./FlipText";

// Small homepage band teasing the Discover Ticino attractions page.
export default function AttractionsTeaser() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  // Scroll-driven parallax: the background photo drifts vertically as the band
  // passes through the viewport while the text stays put. The image layer is
  // taller than the section so the drift never exposes a blank edge.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-12%", "12%"],
  );

  return (
    <section
      ref={ref}
      aria-label={t("nav.attractions")}
      className="relative flex min-h-[52svh] w-full items-center overflow-hidden bg-forest text-paper"
    >
      <motion.div
        style={{ y: imgY }}
        className="absolute -inset-y-[12%] inset-x-0"
      >
        <Image
          src="/mega/Lakelugano.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest/80 via-forest/65 to-forest/85" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl px-6 py-20 text-center lg:px-10 lg:py-28"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/70">
          {t("nav.attractions")}
        </span>
        <h2 className="mt-6 font-serif text-3xl leading-tight lg:text-5xl">
          {t("attractions.title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-paper/85 lg:text-base">
          {t("attractions.intro")}
        </p>
        <Link
          href="/attractions"
          className="group mt-10 inline-flex items-center gap-2 border border-paper/40 px-7 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-paper transition-colors hover:bg-paper hover:text-forest"
        >
          <FlipText>{t("attractions.eyebrow")}</FlipText>
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
