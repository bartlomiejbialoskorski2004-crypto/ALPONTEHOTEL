"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ROOM_PANELS } from "./roomPanels";
import { scrollToRoom } from "./RoomNav";

const CATEGORIES = ["apartments", "superior", "budgetPlus", "budget"] as const;

// Each category card jumps to that category's first room panel.
const firstPanel = Object.fromEntries(
  CATEGORIES.map((key) => [
    key,
    ROOM_PANELS.find((p) => p.categoryKey === key)!.id,
  ]),
) as Record<(typeof CATEGORIES)[number], string>;

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
      className="bg-paper px-6 py-16 text-ink sm:py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
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
              {/* Card click targets, layered under the (pointer-transparent)
                  content: from sm up the whole card links to the category's
                  first room panel; on mobile a tap reveals the description,
                  which carries its own "view rooms" link. */}
              <a
                href={`#${firstPanel[key]}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToRoom(firstPanel[key]);
                }}
                aria-label={t(`mega.rooms.${key}.title`)}
                className="absolute inset-0 z-0 hidden sm:block"
              />
              <button
                type="button"
                onClick={() => setOpenKey((k) => (k === key ? null : key))}
                aria-expanded={openKey === key}
                aria-label={t(`mega.rooms.${key}.title`)}
                className="absolute inset-0 z-0 sm:hidden"
              />
              <div className="pointer-events-none relative flex min-h-[9.5rem] w-full flex-col items-center justify-center bg-mist px-4 pb-4 pt-9 text-center transition-colors duration-500 group-hover:bg-ink/[0.08] sm:min-h-[18rem] sm:p-8 lg:p-10">
                <span className="absolute left-1/2 top-4 -translate-x-1/2 text-[9px] font-medium uppercase tracking-[0.3em] text-forest sm:top-6 sm:text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-sm leading-tight text-ink sm:text-lg lg:text-xl">
                  {t(`mega.rooms.${key}.title`)}
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-4 sm:max-h-none sm:opacity-100 ${
                    openKey === key
                      ? "mt-3 max-h-60 opacity-100"
                      : "mt-0 max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs leading-relaxed text-ink/70">
                    {t(`mega.rooms.${key}.desc`)}
                  </p>
                  {/* Mobile-only jump to the category (desktop: whole card). */}
                  <a
                    href={`#${firstPanel[key]}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToRoom(firstPanel[key]);
                    }}
                    tabIndex={openKey === key ? 0 : -1}
                    className="pointer-events-auto mt-3 inline-block py-1 text-center text-[10px] font-medium uppercase leading-relaxed tracking-[0.15em] text-forest sm:hidden"
                  >
                    {/* NBSP keeps the arrow glued to the last word when the
                        label wraps in the narrow card. */}
                    {t("rooms.viewCategory")}
                    <span aria-hidden>{" →"}</span>
                  </a>
                </div>
                {/* Subtle tap affordance (mobile): a thin chevron that flips
                    up when open - matches the site's line-icon style. */}
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
                {/* Click affordance (sm+): nudges down on hover. */}
                <span
                  aria-hidden
                  className="mt-6 hidden text-base text-forest transition-transform duration-300 group-hover:translate-y-1 sm:block"
                >
                  ↓
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
