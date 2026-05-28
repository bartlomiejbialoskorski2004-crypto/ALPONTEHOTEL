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
      className="bg-paper px-6 py-24 text-ink lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-serif text-4xl uppercase tracking-[0.25em] lg:text-5xl"
        >
          {t("rooms.title")}
        </motion.h2>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay: reduceMotion ? 0 : 0.08,
          }}
          className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-ink/70"
        >
          {t("rooms.intro")}
        </motion.p>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5">
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
              className="flex min-h-[16rem] flex-col items-center justify-center bg-mist p-8 text-center lg:p-10"
            >
              <h3 className="font-serif text-lg leading-tight text-ink lg:text-xl">
                {t(`mega.rooms.${key}.title`)}
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-ink/70">
                {t(`mega.rooms.${key}.desc`)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
