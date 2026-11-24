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

// Homepage wellness band: the private sauna, on warm sand, linking to the
// "At the hotel" page. Sits between the gallery and the Ticino teaser - first
// unwind in the hotel, then go out.
export default function Wellness() {
  const t = useTranslations("wellness");
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
        };

  return (
    <section
      id="wellness"
      aria-label={t("eyebrow")}
      className="bg-sand px-6 py-20 text-ink lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div {...reveal()} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/2] lg:aspect-[4/5]">
            <Image
              src={SAUNA_IMAGE}
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <PriceBadge perHour={t("perHour")} className="absolute -bottom-6 right-6 lg:-right-8 lg:bottom-10" />
        </motion.div>

        <motion.div {...reveal(0.08)}>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {t("eyebrow")}
          </span>
          <h2 className="mt-5 text-balance font-serif text-3xl leading-tight lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
            {t("intro")}
          </p>

          <ul className="mt-10 space-y-4 border-t border-ink/10 pt-8">
            {ITEMS.map(({ key, Icon }) => (
              <li key={key} className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest/30 text-forest">
                  <Icon aria-hidden className="h-4 w-4" strokeWidth={1.25} />
                </span>
                <span className="text-base text-ink/85">{t(`items.${key}`)}</span>
              </li>
            ))}
          </ul>
          <InfoNote className="mt-6 max-w-md text-xs leading-relaxed text-ink/55">
            {t("note")}
          </InfoNote>

          <Link
            href="/hotel-attractions"
            className="group mt-10 inline-flex items-center gap-2 border border-ink/20 px-7 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:border-forest hover:bg-forest hover:text-paper"
          >
            <FlipText>{t("cta")}</FlipText>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
