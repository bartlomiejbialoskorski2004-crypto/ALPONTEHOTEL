"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Clock, ConciergeBell, KeyRound, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import FlipText from "./FlipText";
import InfoNote from "./InfoNote";
import { PriceBadge, SAUNA_IMAGE } from "./wellnessShared";

const ITEMS: { key: "exclusive" | "price" | "booking"; Icon: LucideIcon }[] = [
  { key: "exclusive", Icon: KeyRound },
  { key: "price", Icon: Clock },
  { key: "booking", Icon: ConciergeBell },
];

// Compact homepage wellness band: the private sauna on warm sand, with a
// "Details" link (sauna on the in-hotel page) and, separately, a link to the
// whole "At the hotel" page. Sits between the gallery and the Ticino teaser.
export default function Wellness() {
  const t = useTranslations("wellness");
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="wellness"
      aria-label={t("eyebrow")}
      className="bg-sand px-6 py-16 text-ink lg:px-10 lg:py-20"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.9fr_1fr] lg:gap-16"
      >
        <div className="relative">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={SAUNA_IMAGE}
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <PriceBadge
            perHour={t("perHour")}
            size="sm"
            className="absolute -bottom-5 right-5 lg:-right-6"
          />
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 text-balance font-serif text-2xl leading-tight lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70 lg:text-base">
            {t("intro")}
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {ITEMS.map(({ key, Icon }) => (
              <li key={key} className="inline-flex items-center gap-2 text-sm text-ink/80">
                <Icon aria-hidden className="h-4 w-4 text-forest" strokeWidth={1.25} />
                {t(`items.${key}`)}
              </li>
            ))}
          </ul>
          <InfoNote className="mt-4 max-w-md text-ink/55">{t("note")}</InfoNote>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/hotel-attractions#sauna"
              className="group inline-flex items-center gap-2 border border-ink/20 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:border-forest hover:bg-forest hover:text-paper"
            >
              <FlipText>{t("details")}</FlipText>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/hotel-attractions"
              className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-forest"
            >
              <FlipText>{t("cta")}</FlipText>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
