"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Clock, ConciergeBell, KeyRound, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import FlipText from "./FlipText";
import InfoNote from "./InfoNote";
import FloatingBadge from "./FloatingBadge";
import { PriceBadge, SAUNA_IMAGE } from "./wellnessShared";

const ITEMS: { key: "exclusive" | "price" | "booking"; Icon: LucideIcon }[] = [
  { key: "exclusive", Icon: KeyRound },
  { key: "price", Icon: Clock },
  { key: "booking", Icon: ConciergeBell },
];

// Compact homepage band for the private sauna (part of "At the hotel"), on
// warm sand: a "Details" link to the sauna on the in-hotel page and, separately,
// one to the other in-hotel attractions. On phones the photo is a low strip
// and the intro is dropped - only the concrete facts stay.
export default function Wellness() {
  const t = useTranslations("wellness");
  const tRoot = useTranslations();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="wellness"
      aria-label={tRoot("hotelAttractions.label")}
      className="bg-sand px-6 py-10 text-ink md:py-16 lg:px-10"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-4xl items-center gap-6 md:grid-cols-[0.8fr_1fr] md:gap-12"
      >
        <div className="relative">
          <div className="relative aspect-[3/1] w-full overflow-hidden md:aspect-[4/3]">
            <Image
              src={SAUNA_IMAGE}
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <FloatingBadge className="absolute -bottom-6 right-3 md:-right-5">
            <PriceBadge perHour={t("perHour")} size="sm" />
          </FloatingBadge>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {tRoot("hotelAttractions.label")}
          </span>
          <h2 className="mt-2 text-balance font-serif text-xl leading-tight md:mt-3 md:text-2xl lg:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-ink/70 md:block">
            {t("intro")}
          </p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 md:mt-4">
            {ITEMS.map(({ key, Icon }) => (
              <li key={key} className="inline-flex items-center gap-1.5 text-[13px] text-ink/80">
                <Icon aria-hidden className="h-3.5 w-3.5 text-forest" strokeWidth={1.25} />
                {t(`items.${key}`)}
              </li>
            ))}
          </ul>
          <InfoNote className="mt-2.5 max-w-md text-ink/55 md:mt-3">{t("note")}</InfoNote>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-6">
            <Link
              href="/hotel-attractions#sauna"
              className="group inline-flex items-center border border-ink/20 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:border-forest hover:bg-forest hover:text-paper md:px-5 md:py-2"
            >
              <FlipText>{t("details")}</FlipText>
            </Link>
            <Link
              href="/hotel-attractions"
              className="group inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-forest"
            >
              <FlipText>{t("cta")}</FlipText>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
