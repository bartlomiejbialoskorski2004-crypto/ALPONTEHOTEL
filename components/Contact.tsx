"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import FlipText from "./FlipText";
import Sprig from "./Sprig";
import { EMAIL, MAPS_EMBED, MAPS_LINK, PHONE, PHONE_HREF } from "./contact-info";

export default function Contact() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-paper pt-24 pb-0 text-ink lg:pt-32 lg:pb-0"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Centred heading + contact line */}
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {t("contact.title")}
          </span>
          <h2
            id="contact-title"
            className="mt-5 font-serif text-4xl leading-[1.05] lg:text-6xl"
          >
            {t("fallback.name")}
          </h2>
          <Sprig className="mx-auto mt-6 w-16" />
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

        {/* Map — full-bleed across the viewport */}
        <div className="relative mt-12 min-h-[24rem] w-full overflow-hidden border-y border-mist lg:mt-16 lg:min-h-[34rem]">
          <iframe
            title="Al Ponte"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />

          {/* Switzerland outline — hints where the hotel sits on the map. */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 border border-mist bg-paper/95 p-3 backdrop-blur"
          >
            <svg viewBox="0 0 100 64" fill="none" className="h-auto w-24 lg:w-28">
              <path
                d="M4 52 L1 54 L8 44 L15 41 L24 32 L28 20 L36 8 L46 6 L59 3 L70 6 L79 9 L82 12 L88 18 L96 26 L100 38 L93 41 L89 48 L82 47 L76 52 L70 50 L68 63 L64 60 L60 54 L54 55 L48 60 L43 58 L34 52 L24 50 L15 44 L8 48 Z"
                className="stroke-forest"
                strokeWidth="1.6"
                strokeLinejoin="round"
                fill="rgba(31,61,43,0.05)"
              />
              <circle cx="66" cy="57" r="6" className="fill-gold/25" />
              <circle cx="66" cy="57" r="2.4" className="fill-gold" />
            </svg>
            <p className="mt-2 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-ink/60">
              Cademario · Ticino
            </p>
          </div>
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
