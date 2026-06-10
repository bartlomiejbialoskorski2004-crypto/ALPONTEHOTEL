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
      className="bg-paper px-6 pt-24 pb-0 text-ink lg:px-10 lg:pt-32 lg:pb-0"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl"
      >
        {/* Centred heading + contact line */}
        <div className="relative z-[2] mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {t("contact.title")}
          </span>
          <h2
            id="contact-title"
            className="mt-5 font-serif text-4xl leading-[1.05] lg:text-6xl"
          >
            {t("fallback.name")}
          </h2>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-base leading-relaxed text-ink/70 transition-colors hover:text-forest"
          >
            {t("info.address")}
          </a>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-base">
            <a
              href={PHONE_HREF}
              className="tabular-nums transition-colors hover:text-forest"
            >
              {PHONE}
            </a>
            <span aria-hidden className="text-ink/25">
              ·
            </span>
            <a
              href={`mailto:${EMAIL}`}
              className="transition-colors hover:text-forest"
            >
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="relative mt-12 min-h-[24rem] overflow-hidden border border-mist lg:mt-16 lg:min-h-[34rem]">
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
