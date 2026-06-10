"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Vine from "./Vine";

const CATEGORIES = ["apartments", "superior", "budgetPlus", "budget"] as const;

export default function Rooms() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  // On mobile the cards are compact; tapping one reveals its description
  // (always shown from sm up).
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section
      id="rooms"
      aria-labelledby="rooms-title"
      className="relative bg-paper px-6 py-16 text-ink sm:py-24 lg:px-10 lg:py-32"
    >
      {/* Densest vine cluster on the page — arranged per the sketch: a
          runner along the top-left, stems down both edges, a branchy vine
          crossing the cards in front, and a sprig bowing in from the right. */}
      <Vine
        variant="arch"
        side="left"
        weight="thin"
        className="absolute left-0 top-8 w-56 sm:w-80 lg:w-[30rem]"
      />
      <Vine
        variant="column"
        side="left"
        weight="regular"
        className="absolute left-0 top-1/4 w-16 sm:w-24 lg:w-36"
      />
      <Vine
        variant="tall"
        side="left"
        weight="thick"
        className="absolute left-[4%] top-1/3 z-10 w-32 rotate-12 sm:w-44 lg:w-64"
      />
      <Vine
        variant="column"
        side="right"
        weight="thick"
        className="absolute right-0 top-6 w-20 sm:w-28 lg:w-40"
      />
      <Vine
        variant="sprig"
        side="right"
        weight="thin"
        className="absolute right-[8%] top-1/4 z-10 w-24 sm:w-32 lg:w-44"
      />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center lg:mb-10"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {t("nav.rooms")}
          </span>
          <h2
            id="rooms-title"
            className="mt-5 font-serif text-2xl leading-[1.05] sm:text-3xl lg:text-5xl"
          >
            {t("rooms.heading")}
          </h2>
        </motion.div>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-ink/70"
        >
          {t("rooms.intro")}
        </motion.p>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:mt-20 lg:grid-cols-4 lg:gap-5">
          {CATEGORIES.map((key, i) => (
            <motion.li
              key={key}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: reduceMotion ? 0 : i * 0.06,
              }}
              className="group relative flex flex-col"
            >
              <button
                type="button"
                onClick={() => setOpenKey((k) => (k === key ? null : key))}
                aria-expanded={openKey === key}
                className="group/card relative flex min-h-[9.5rem] w-full flex-col items-center justify-center bg-mist px-4 pb-4 pt-9 text-center transition-colors duration-500 hover:bg-ink/[0.08] sm:min-h-[18rem] sm:cursor-default sm:p-8 lg:p-10"
              >
                <span className="absolute left-1/2 top-4 -translate-x-1/2 text-[9px] font-medium uppercase tracking-[0.3em] text-forest sm:top-6 sm:text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-sm leading-tight text-ink sm:text-lg lg:text-xl">
                  {t(`mega.rooms.${key}.title`)}
                </h3>
                <p
                  className={`overflow-hidden text-xs leading-relaxed text-ink/70 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-4 sm:max-h-none sm:opacity-100 ${
                    openKey === key
                      ? "mt-3 max-h-48 opacity-100"
                      : "mt-0 max-h-0 opacity-0"
                  }`}
                >
                  {t(`mega.rooms.${key}.desc`)}
                </p>
                {/* Subtle tap affordance (mobile): a thin chevron that flips
                    up when open — matches the site's line-icon style. */}
                <span
                  aria-hidden
                  className={`mt-3 inline-flex text-forest transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hidden ${
                    openKey === key ? "rotate-180" : ""
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 5L7 9L11 5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
