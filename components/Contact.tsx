"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

const PHONE = "+41 91 605 24 92";
const PHONE_HREF = "tel:+41916052492";
const EMAIL = "gatti@al-ponte.ch";
const MAPS_QUERY = "Via Cantonale 61, 6936 Cademario";
const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY,
)}&z=15&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAPS_QUERY,
)}`;

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
        className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16"
      >
        {/* Details */}
        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            / {t("contact.title")}
          </span>
          <h2
            id="contact-title"
            className="mt-6 font-serif text-3xl leading-tight lg:text-5xl"
          >
            {t("fallback.name")}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
            {t("contact.intro")}
          </p>

          <dl className="mt-12 divide-y divide-mist border-y border-mist">
            <div className="flex items-baseline gap-6 py-5">
              <dt className="w-24 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
                {t("contact.address")}
              </dt>
              <dd className="flex-1 text-base leading-relaxed">
                {t("info.address")}
              </dd>
            </div>
            <div className="flex items-baseline gap-6 py-5">
              <dt className="w-24 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
                {t("contact.phone")}
              </dt>
              <dd className="flex-1 text-base tabular-nums">
                <a
                  href={PHONE_HREF}
                  className="transition-colors hover:text-forest"
                >
                  {PHONE}
                </a>
              </dd>
            </div>
            <div className="flex items-baseline gap-6 py-5">
              <dt className="w-24 shrink-0 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
                {t("contact.email")}
              </dt>
              <dd className="flex-1 text-base">
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors hover:text-forest"
                >
                  {EMAIL}
                </a>
              </dd>
            </div>
          </dl>

          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-forest transition-opacity hover:opacity-70"
          >
            {t("contact.directions")}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        {/* Map */}
        <div className="relative min-h-[22rem] overflow-hidden border border-mist lg:min-h-0">
          <iframe
            title={`Al Ponte — ${MAPS_QUERY}`}
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0 [filter:grayscale(0.35)_contrast(1.05)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
