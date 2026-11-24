"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import FlipOnChange from "./FlipOnChange";
import { getLenis } from "./lenisStore";

export type GalleryPhoto = { src: string; alt: string };

// Same motion as the room panel sliders: the photo slides in from the side
// with a slow Ken Burns drift.
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0, scale: 1 }),
  center: { x: 0, opacity: 1, scale: 1.03 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, scale: 1.03 }),
};

const navBtn =
  "absolute top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/85 text-ink shadow-sm backdrop-blur-md transition-colors hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest sm:h-12 sm:w-12";

// Full-screen album viewer for the /gallery page, styled like the room
// sliders: arrows, "01 / 12" counter, swipe, and a thumbnail strip that keeps
// the current photo centred. Arrow keys / Escape work; page scroll is locked.
export default function GallerySlider({
  title,
  eyebrow,
  photos,
  index,
  direction,
  onChange,
  onClose,
}: {
  title: string;
  eyebrow?: string;
  photos: GalleryPhoto[];
  index: number;
  direction: number;
  onChange: (index: number, direction: number) => void;
  onClose: () => void;
}) {
  const t = useTranslations("gallery");
  const total = photos.length;
  const stripRef = useRef<HTMLDivElement>(null);

  const paginate = (dir: number) => onChange((index + dir + total) % total, dir);
  const jumpTo = (target: number) =>
    onChange(target, target === index ? 0 : target > index ? 1 : -1);

  // Lock the page (and Lenis) while open; keys for navigation.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = getLenis();
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") paginate(-1);
      else if (e.key === "ArrowRight") paginate(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // Keep the active thumbnail centred (horizontal scroll only).
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector<HTMLElement>(`[data-thumb-index="${index}"]`);
    if (!strip || !active) return;
    strip.scrollTo({
      left: active.offsetLeft - (strip.clientWidth - active.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [index]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[70] flex flex-col bg-paper text-ink"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 lg:px-10 lg:py-5">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-forest">
              {eyebrow}
            </p>
          )}
          <p className="truncate font-serif text-lg leading-tight lg:text-2xl">{title}</p>
        </div>
        <motion.button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-ink/15 transition-colors hover:border-forest hover:text-forest"
        >
          <X size={20} strokeWidth={1.5} />
        </motion.button>
      </div>

      <div className="relative mx-4 min-h-0 flex-1 overflow-hidden bg-ink lg:mx-10">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
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
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              draggable={false}
              className="select-none object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <motion.button
              type="button"
              onClick={() => paginate(-1)}
              aria-label={t("prev")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className={`${navBtn} left-3`}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => paginate(1)}
              aria-label={t("next")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className={`${navBtn} right-3`}
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </motion.button>
          </>
        )}

        <div className="absolute right-3 top-3 z-10 flex items-center bg-paper/85 px-3 py-1.5 font-serif text-xs tracking-[0.25em] text-ink backdrop-blur-md">
          <FlipOnChange value={String(index + 1).padStart(2, "0")} />
          <span className="mx-1 text-ink/40">/</span>
          <span className="text-ink/60">{String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {total > 1 && (
        <div
          ref={stripRef}
          className="mx-4 mb-4 mt-3 flex shrink-0 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-10 lg:mb-6 [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              data-thumb-index={i}
              onClick={() => jumpTo(i)}
              aria-label={`${i + 1} / ${total}`}
              aria-current={i === index}
              className={`relative h-12 w-12 shrink-0 overflow-hidden bg-ink/10 transition-all duration-300 sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${
                i === index ? "opacity-100 ring-2 ring-inset ring-forest" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={p.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
