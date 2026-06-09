"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";
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
import FlipText from "./FlipText";
import FlipOnChange from "./FlipOnChange";

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
  const tRooms = useTranslations("mega.rooms");
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [lightbox, setLightbox] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  // Magnetic Book Now: the label is pulled toward the cursor and trails it
  // (spring lag) before settling back to centre on mouse-leave.
  const reduceMotion = useReducedMotion();
  const bookRef = useRef<HTMLAnchorElement>(null);
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const springX = useSpring(magX, { stiffness: 120, damping: 12, mass: 0.3 });
  const springY = useSpring(magY, { stiffness: 120, damping: 12, mass: 0.3 });
  const onBookMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !bookRef.current) return;
    const r = bookRef.current.getBoundingClientRect();
    magX.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    magY.set((e.clientY - (r.top + r.height / 2)) * 0.6);
  };
  const onBookLeave = () => {
    magX.set(0);
    magY.set(0);
  };

  // Features slider (mobile only): autoplay + drag-to-scroll + dot sync.
  const featRef = useRef<HTMLUListElement>(null);
  const [featIndex, setFeatIndex] = useState(0);
  const featPausedUntil = useRef(0);

  const scrollFeatTo = (i: number) => {
    const strip = featRef.current;
    if (!strip) return;
    const child = strip.children[i] as HTMLElement | undefined;
    if (!child) return;
    strip.scrollTo({
      left: child.offsetLeft - (strip.clientWidth - child.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  // Keep the active dot in sync with manual scroll/swipe.
  const onFeatScroll = () => {
    const strip = featRef.current;
    if (!strip) return;
    const center = strip.scrollLeft + strip.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(strip.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const cc = el.offsetLeft + el.clientWidth / 2;
      const d = Math.abs(cc - center);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setFeatIndex(nearest);
  };

  // Slow autoplay; only runs where the strip overflows (mobile) and pauses
  // briefly after any user interaction.
  useEffect(() => {
    if (reduceMotion) return;
    const strip = featRef.current;
    if (!strip) return;
    const id = window.setInterval(() => {
      if (strip.scrollWidth <= strip.clientWidth + 4) return;
      if (Date.now() < featPausedUntil.current) return;
      const next = (featIndex + 1) % FEATURES.length;
      scrollFeatTo(next);
    }, 3500);
    return () => window.clearInterval(id);
  }, [featIndex, reduceMotion]);

  // Pointer drag-to-scroll (mouse); touch swipes natively.
  const featDrag = useRef<{ startX: number; startLeft: number } | null>(null);
  const onFeatPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    featPausedUntil.current = Date.now() + 5000;
    if (e.pointerType !== "mouse") return;
    featDrag.current = {
      startX: e.clientX,
      startLeft: featRef.current?.scrollLeft ?? 0,
    };
  };
  const onFeatPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    if (!featDrag.current || !featRef.current) return;
    featRef.current.scrollLeft =
      featDrag.current.startLeft - (e.clientX - featDrag.current.startX);
  };
  const endFeatDrag = () => {
    featDrag.current = null;
    featPausedUntil.current = Date.now() + 5000;
  };

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
      className="scroll-mt-28 bg-paper px-6 pb-16 pt-24 text-ink sm:py-24 lg:scroll-mt-36 lg:px-10 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-10">
        {/* Left — staggered content panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="order-3 flex flex-col bg-mist lg:order-none lg:col-start-1 lg:row-start-1"
        >
          <div className="flex flex-1 flex-col px-4 pb-6 pt-1 sm:px-8 sm:pb-8 lg:p-12">
            <motion.h2
              id="triple-title"
              variants={fadeUp}
              className="hidden text-center font-serif text-2xl uppercase leading-tight tracking-tight sm:text-4xl lg:block lg:text-5xl"
            >
              {t("title")}
            </motion.h2>

            <motion.ul
              variants={fadeUp}
              className="mx-auto flex max-w-2xl flex-wrap justify-center gap-1.5 sm:gap-2 lg:mt-8"
            >
              {TAGS.map(({ key, Icon }) => (
                <motion.li
                  key={key}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="inline-flex items-center gap-1.5 bg-paper/60 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.15em] text-ink sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em]"
                >
                  <Icon size={12} strokeWidth={1.25} aria-hidden />
                  <span>{t(`tags.${key}`)}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-ink/70 sm:mt-10"
            >
              {t("intro")}
            </motion.p>

            <motion.ul
              ref={featRef}
              variants={fadeUp}
              onScroll={onFeatScroll}
              onPointerDown={onFeatPointerDown}
              onPointerMove={onFeatPointerMove}
              onPointerUp={endFeatDrag}
              onPointerLeave={endFeatDrag}
              className="mt-5 flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing sm:mt-12 lg:grid lg:cursor-default lg:grid-cols-3 lg:gap-x-4 lg:gap-y-8 lg:overflow-visible lg:pb-0 lg:[scroll-snap-type:none]"
            >
              {FEATURES.map(({ key, Icon }) => (
                <motion.li
                  key={key}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="group flex min-w-[42%] shrink-0 snap-center flex-col items-center text-center select-none sm:min-w-[33%] lg:min-w-0 lg:shrink"
                >
                  <Icon
                    size={24}
                    strokeWidth={1}
                    className="text-ink transition-colors duration-300 group-hover:text-forest"
                    aria-hidden
                  />
                  <h3 className="mt-3 text-[13px] font-medium text-ink sm:text-sm">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/60">
                    {t(`features.${key}.desc`)}
                  </p>
                </motion.li>
              ))}
            </motion.ul>

            {/* Slider dots — mobile affordance for the features carousel */}
            <motion.div
              variants={fadeUp}
              className="mt-4 flex items-center justify-center gap-2 lg:hidden"
            >
              {FEATURES.map(({ key }, i) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => scrollFeatTo(i)}
                  aria-label={`Go to feature ${i + 1}`}
                  aria-current={i === featIndex}
                  className="group flex h-4 items-center"
                >
                  <span
                    className={`block h-[2px] transition-all duration-300 ${
                      i === featIndex
                        ? "w-6 bg-forest"
                        : "w-3 bg-ink/25 group-hover:bg-ink/45"
                    }`}
                  />
                </button>
              ))}
            </motion.div>
          </div>

          <motion.a
            ref={bookRef}
            href="#contact"
            variants={fadeUp}
            onMouseMove={onBookMove}
            onMouseLeave={onBookLeave}
            className="group relative mt-auto block bg-ink/[0.04] py-5 text-center text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:bg-forest hover:text-paper"
          >
            <motion.span
              style={{ x: springX, y: springY }}
              className="relative z-10 inline-block"
            >
              <FlipText>{tNav("bookNow")}</FlipText>
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Right — sticky carousel with thumbnail strip. On mobile it's a gray
            (mist) card whose top holds the title, with the photo inside it;
            full desktop layout unchanged. */}
        <div className="relative order-2 bg-mist p-4 lg:order-none lg:m-0 lg:bg-transparent lg:p-0 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
          {/* Mobile-only title inside the gray card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden"
          >
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-forest/70">
              {tRooms("apartments.title")}
            </p>
            <h2 className="text-left font-serif text-3xl uppercase leading-[1.05] tracking-tight text-ink">
              {t("title")}
            </h2>
          </motion.div>

          <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden bg-ink/10 sm:aspect-[4/5] lg:mt-0 lg:aspect-auto lg:h-[calc(100svh-12rem)]">
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
                  className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/85 text-ink shadow-sm backdrop-blur-md transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest sm:h-12 sm:w-12"
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
                  className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/85 text-ink shadow-sm backdrop-blur-md transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest sm:h-12 sm:w-12"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </motion.button>

                <div className="absolute right-3 top-3 z-10 flex items-center bg-paper/85 px-3 py-1.5 font-serif text-xs tracking-[0.25em] text-ink backdrop-blur-md">
                  <FlipOnChange value={String(index + 1).padStart(2, "0")} />
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
                  className={`relative h-12 w-12 flex-shrink-0 overflow-hidden bg-ink/10 transition-all duration-300 sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${
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

                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center font-serif text-sm tracking-[0.3em] text-paper/80">
                  <FlipOnChange value={String(index + 1).padStart(2, "0")} />
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
