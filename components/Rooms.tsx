"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

const CATEGORIES = ["apartments", "superior", "budgetPlus", "budget"] as const;

export default function Rooms() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="rooms"
      aria-labelledby="rooms-title"
      className="bg-paper px-6 py-16 text-ink sm:py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="rooms-title" className="sr-only">
          {t("rooms.title")}
        </h2>

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
              className="group relative flex min-h-[9.5rem] flex-col items-center justify-center bg-mist p-4 text-center transition-colors duration-500 hover:bg-ink/[0.08] sm:min-h-[18rem] sm:p-8 lg:p-10"
            >
              <span className="absolute left-1/2 top-4 -translate-x-1/2 text-[9px] font-medium uppercase tracking-[0.3em] text-forest sm:top-6 sm:text-[10px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-sm leading-tight text-ink sm:text-lg lg:text-xl">
                {t(`mega.rooms.${key}.title`)}
              </h3>
              <p className="mt-4 hidden text-xs leading-relaxed text-ink/70 sm:block">
                {t(`mega.rooms.${key}.desc`)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
