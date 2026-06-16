"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  HandHeart,
  Hammer,
  Mountain,
  ParkingMeter,
  PawPrint,
  Ticket,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

type ItemKey =
  | "pool"
  | "pet"
  | "view"
  | "hosts"
  | "ticket"
  | "wifi"
  | "renovated"
  | "parking";

const ITEMS: { key: ItemKey; Icon: LucideIcon }[] = [
  { key: "pool", Icon: Waves },
  { key: "pet", Icon: PawPrint },
  { key: "view", Icon: Mountain },
  { key: "hosts", Icon: HandHeart },
  { key: "ticket", Icon: Ticket },
  { key: "wifi", Icon: Wifi },
  { key: "renovated", Icon: Hammer },
  { key: "parking", Icon: ParkingMeter },
];

export default function Amenities() {
  const t = useTranslations("amenities");
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="amenities"
      className="relative overflow-hidden bg-paper px-6 py-24 text-ink lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink/50">
          {t("eyebrow")}
        </span>
        <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-[1.05] lg:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/70 lg:text-base">
          {t("intro")}
        </p>
        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ key, Icon }, i) => (
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
              className="group flex flex-col items-start"
            >
              <Icon
                size={28}
                strokeWidth={1}
                className="text-ink transition-colors duration-300 group-hover:text-ink/60"
                aria-hidden
              />
              <h3 className="mt-5 font-serif text-base leading-tight">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink/60">
                {t(`${key}.desc`)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
