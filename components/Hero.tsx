"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type HeroData = {
  name: string;
  tagline: string;
  heroImage: { asset?: { _ref?: string } } | null;
  bookingUrl?: string;
};

export default function Hero({ data }: { data: HeroData }) {
  const t = useTranslations("hero");

  const sanityImageUrl = data.heroImage?.asset?._ref
    ? urlFor(data.heroImage).width(2400).quality(85).url()
    : null;

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {sanityImageUrl ? (
        <Image
          src={sanityImageUrl}
          alt={data.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <Image
          src="/hero.svg"
          alt={data.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/55" />

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center text-paper">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="[filter:invert(1)_brightness(1.5)]"
        >
          <Image
            src="/logo.svg"
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em]"
        >
          {t("scrollHint")}
        </motion.div>
      </div>
    </section>
  );
}
