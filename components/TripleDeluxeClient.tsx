"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Bath,
  Bed,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Maximize2,
  Mountain,
  Square,
  Tv,
  Umbrella,
  Utensils,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const TAGS: { key: string; Icon: LucideIcon }[] = [
  { key: "bath", Icon: Bath },
  { key: "kitchen", Icon: Utensils },
  { key: "tv", Icon: Tv },
  { key: "balcony", Icon: Mountain },
  { key: "wifi", Icon: Wifi },
  { key: "shower", Icon: Droplet },
  { key: "towels", Icon: Square },
];

const FEATURES: { key: string; Icon: LucideIcon }[] = [
  { key: "king", Icon: BedDouble },
  { key: "single", Icon: Bed },
  { key: "view", Icon: Mountain },
  { key: "balcony", Icon: Umbrella },
  { key: "space", Icon: Maximize2 },
  { key: "wifi", Icon: Wifi },
];

type Props = {
  photos: string[];
};

export default function TripleDeluxeClient({ photos }: Props) {
  const t = useTranslations("triple");
  const tNav = useTranslations("nav");
  const [index, setIndex] = useState(0);

  const hasPhotos = photos.length > 0;
  const total = photos.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section
      id="triple-deluxe"
      aria-labelledby="triple-title"
      className="bg-paper px-6 py-24 text-ink lg:px-10 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Left — content panel */}
        <div className="flex flex-col bg-mist">
          <div className="flex flex-1 flex-col p-8 lg:p-12">
            <h2
              id="triple-title"
              className="text-center font-serif text-3xl uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              {t("title")}
            </h2>

            <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
              {TAGS.map(({ key, Icon }) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-2 bg-paper px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-ink"
                >
                  <Icon size={14} strokeWidth={1.5} aria-hidden />
                  <span>{t(`tags.${key}`)}</span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-ink/70">
              {t("intro")}
            </p>

            <ul className="mt-12 grid grid-cols-3 gap-x-4 gap-y-10 text-center">
              {FEATURES.map(({ key, Icon }) => (
                <li key={key} className="flex flex-col items-center">
                  <Icon
                    size={28}
                    strokeWidth={1}
                    className="text-ink"
                    aria-hidden
                  />
                  <h3 className="mt-3 text-sm font-semibold text-ink">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    {t(`features.${key}.desc`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#contact"
            className="mt-auto block bg-ink/[0.08] py-5 text-center text-xs font-semibold uppercase tracking-[0.3em] text-ink transition-colors duration-300 hover:bg-forest hover:text-paper"
          >
            {tNav("bookNow")}
          </a>
        </div>

        {/* Right — sticky photo carousel */}
        <div className="relative lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/10">
            {hasPhotos &&
              photos.map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt=""
                  initial={false}
                  animate={{ opacity: i === index ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ))}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/80 text-ink backdrop-blur-sm transition-colors hover:bg-paper"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/80 text-ink backdrop-blur-sm transition-colors hover:bg-paper"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-paper/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
                  {index + 1} / {total}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
