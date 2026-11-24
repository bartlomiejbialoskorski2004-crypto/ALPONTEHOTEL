"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import FlipText from "./FlipText";
import ContactForm from "./ContactForm";
import { MAPS_EMBED, MAPS_LINK } from "./contact-info";

export default function Contact() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 bg-paper pt-16 pb-0 text-ink lg:pt-24 lg:pb-0"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Contact details (forest column) + direct-booking enquiry
            (composes an e-mail, no backend). */}
        <ContactForm />

        {/* Map - full-bleed across the viewport */}
        <div className="relative mt-12 min-h-[24rem] w-full overflow-hidden border-y border-mist lg:mt-16 lg:min-h-[34rem]">
          <iframe
            title="Al Ponte"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />

          {/* Switzerland outline - hints where the hotel sits on the map. */}
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
