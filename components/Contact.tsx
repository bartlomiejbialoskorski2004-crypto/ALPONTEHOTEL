"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import FlipText from "./FlipText";
import { EMAIL, MAPS_EMBED, MAPS_LINK, PHONE, PHONE_HREF } from "./contact-info";

export default function Contact() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-paper px-6 py-24 text-ink lg:px-10 lg:py-32"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-16"
      >
        {/* Details */}
        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {t("contact.title")}
          </span>
          <h2
            id="contact-title"
            className="mt-5 font-serif text-4xl leading-[1.05] lg:text-6xl"
          >
            {t("fallback.name")}
          </h2>

          <dl className="mt-10 border-t border-mist lg:mt-auto">
            <div className="grid gap-1 border-b border-mist py-6 sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-6">
              <dt className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink/40">
                {t("contact.address")}
              </dt>
              <dd className="text-lg leading-snug">
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-forest"
                >
                  {t("info.address")}
                </a>
              </dd>
            </div>
            <div className="grid gap-1 border-b border-mist py-6 sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-6">
              <dt className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink/40">
                {t("contact.phone")}
              </dt>
              <dd className="text-lg tabular-nums">
                <a href={PHONE_HREF} className="transition-colors hover:text-forest">
                  {PHONE}
                </a>
              </dd>
            </div>
            <div className="grid gap-1 border-b border-mist py-6 sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-6">
              <dt className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink/40">
                {t("contact.email")}
              </dt>
              <dd className="text-lg">
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors hover:text-forest"
                >
                  {EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Map */}
        <div className="relative min-h-[24rem] overflow-hidden border border-mist lg:min-h-[32rem]">
          <iframe
            title="Al Ponte"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group absolute bottom-4 left-4 inline-flex items-center gap-2 border border-mist bg-paper/90 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ink shadow-sm backdrop-blur transition-colors hover:text-forest"
          >
            <FlipText>{t("contact.directions")}</FlipText>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              ↗
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
