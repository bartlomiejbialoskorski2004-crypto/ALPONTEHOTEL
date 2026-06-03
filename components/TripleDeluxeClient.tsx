"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Bath,
  Bed,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Expand,
  Maximize2,
  Mountain,
  Square,
  Tv,
  Umbrella,
  Utensils,
  Wifi,
  X,
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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1,
  }),
  center: { x: 0, opacity: 1, scale: 1.06 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 1.06,
  }),
};

type Props = {
  photos: string[];
};

export default function TripleDeluxeClient({ photos }: Props) {
  const t = useTranslations("triple");
  const tNav = useTranslations("nav");
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [lightbox, setLightbox] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const total = photos.length;
  const hasPhotos = total > 0;

  const paginate = (dir: number) =>
    setIndex(([i]) => [(i + dir + total) % total, dir]);

  const jumpTo = (target: number) =>
    setIndex(([i]) => [target, target === i ? 0 : target > i ? 1 : -1]);

  // Keep the active thumbnail centred in the strip.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(
      `[data-thumb-index="${index}"]`,
    );
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [index]);

  // Lightbox: lock body scroll + Escape + arrow keys
  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowLeft") paginate(-1);
      else if (e.key === "ArrowRight") paginate(1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  return (
    <section
      id="triple-deluxe"
      aria-labelledby="triple-title"
      className="bg-paper px-6 py-24 text-ink lg:px-10 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Left — staggered content panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="flex flex-col bg-mist"
        >
          <div className="flex flex-1 flex-col p-8 lg:p-12">
            <motion.h2
              id="triple-title"
              variants={fadeUp}
              className="text-center font-serif text-3xl uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              {t("title")}
            </motion.h2>

            <motion.ul
              variants={fadeUp}
              className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2"
            >
              {TAGS.map(({ key, Icon }) => (
                <motion.li
                  key={key}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 bg-paper/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink"
                >
                  <Icon size={14} strokeWidth={1.25} aria-hidden />
                  <span>{t(`tags.${key}`)}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-ink/70"
            >
              {t("intro")}
            </motion.p>

            <motion.ul
              variants={fadeUp}
              className="mt-12 grid grid-cols-3 gap-x-4 gap-y-8 text-center"
            >
              {FEATURES.map(({ key, Icon }) => (
                <motion.li
                  key={key}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group flex flex-col items-center"
                >
                  <Icon
                    size={24}
                    strokeWidth={1}
                    className="text-ink transition-colors duration-300 group-hover:text-forest"
                    aria-hidden
                  />
                  <h3 className="mt-3 text-sm font-medium text-ink">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    {t(`features.${key}.desc`)}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.a
            href="#contact"
            variants={fadeUp}
            className="group relative mt-auto block overflow-hidden bg-ink/[0.04] py-5 text-center text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:bg-forest hover:text-paper"
          >
            <span className="relative z-10">{tNav("bookNow")}</span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-paper/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[300%]"
            />
          </motion.a>
        </motion.div>

        {/* Right — sticky carousel with thumbnail strip */}
        <div className="relative lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/10 lg:aspect-auto lg:h-[calc(100svh-12rem)]">
            {hasPhotos && (
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.img
                  key={index}
                  src={photos[index]}
                  alt=""
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
                    opacity: { duration: 0.4 },
                    scale: { duration: 8, ease: "linear" },
                  }}
                  drag={total > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) paginate(1);
                    else if (info.offset.x > 60) paginate(-1);
                  }}
                  onClick={() => setLightbox(true)}
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full cursor-zoom-in object-cover select-none"
                />
              </AnimatePresence>
            )}

            {total > 1 && (
              <>
                <motion.button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label="Previous photo"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="absolute left-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-paper/85 text-ink shadow-sm backdrop-blur-md transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next photo"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="absolute right-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-paper/85 text-ink shadow-sm backdrop-blur-md transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </motion.button>

                <div className="absolute right-3 top-3 z-10 flex items-baseline bg-paper/85 px-3 py-1.5 font-serif text-xs tracking-[0.25em] text-ink backdrop-blur-md">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={index}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="inline-block w-[1.5em] text-right"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                  <span className="mx-1 text-ink/40">/</span>
                  <span className="text-ink/60">
                    {String(total).padStart(2, "0")}
                  </span>
                </div>
              </>
            )}

            {hasPhotos && (
              <motion.button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="Open full image"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute bottom-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center bg-paper/85 text-ink shadow-sm backdrop-blur-md transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
              >
                <Expand size={16} strokeWidth={1.5} />
              </motion.button>
            )}
          </div>

          {/* Thumbnail strip */}
          {total > 1 && (
            <div
              ref={stripRef}
              className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  data-thumb-index={i}
                  onClick={() => jumpTo(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === index}
                  className={`relative h-14 w-14 flex-shrink-0 overflow-hidden bg-ink/10 transition-all duration-300 lg:h-16 lg:w-16 ${
                    i === index
                      ? "opacity-100 ring-2 ring-forest"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox — full image with object-contain */}
      <AnimatePresence>
        {lightbox && hasPhotos && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                key={index}
                src={photos[index]}
                alt=""
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
              />
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(false);
              }}
              aria-label="Close"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center bg-paper/10 text-paper backdrop-blur-md transition-colors hover:bg-paper/20"
            >
              <X size={20} strokeWidth={1.5} />
            </motion.button>

            {total > 1 && (
              <>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                  aria-label="Previous photo"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-paper/10 text-paper backdrop-blur-md transition-colors hover:bg-paper/20"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                  aria-label="Next photo"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-paper/10 text-paper backdrop-blur-md transition-colors hover:bg-paper/20"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </motion.button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif text-sm tracking-[0.3em] text-paper/80">
                  {String(index + 1).padStart(2, "0")}
                  <span className="mx-2 text-paper/40">/</span>
                  {String(total).padStart(2, "0")}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
