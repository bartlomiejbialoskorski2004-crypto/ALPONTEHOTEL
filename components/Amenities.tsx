"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  HandHeart,
  Mountain,
  ParkingMeter,
  PawPrint,
  Sparkles,
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
  { key: "renovated", Icon: Sparkles },
  { key: "parking", Icon: ParkingMeter },
];

export default function Amenities() {
  const t = useTranslations("amenities");
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="amenities"
      aria-labelledby="amenities-eyebrow"
      className="bg-paper px-6 py-24 text-ink lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.p
          id="amenities-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-forest"
        >
          / {t("eyebrow")}
        </motion.p>

        <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
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
                size={36}
                strokeWidth={1.25}
                className="text-forest transition-colors duration-300 group-hover:text-forest-soft"
                aria-hidden
              />
              <h3 className="mt-5 font-serif text-lg leading-tight lg:text-xl">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/70">
                {t(`${key}.desc`)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
