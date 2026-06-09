"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItemType } from "./InteractiveBentoGallery";
import FlipOnChange from "./FlipOnChange";

// Accessible mobile gallery: a clean 2-column tappable grid that opens a
// simple fullscreen viewer (swipe / arrows / counter / caption). Replaces the
// bento + drag-to-reorder + floating dock on phones; desktop keeps the bento.
export default function MobileGallery({ items }: { items: MediaItemType[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [open, setOpen] = useState(false);
  const total = items.length;

  const paginate = (d: number) =>
    setState(([i]) => [(i + d + total) % total, d]);
  const openAt = (i: number) => {
    setState([i, 0]);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowLeft") paginate(-1);
      else if (e.key === "ArrowRight") paginate(1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const current = items[index];

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openAt(i)}
            aria-label={item.title}
            className="relative aspect-square overflow-hidden bg-ink/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 active:scale-[0.98]"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
          >
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                key={current.id}
                src={current.url}
                alt={current.title}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) paginate(1);
                  else if (info.offset.x > 60) paginate(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[78vh] max-w-[92vw] cursor-grab object-contain shadow-2xl active:cursor-grabbing"
              />
            </AnimatePresence>

            {/* Caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 text-center">
              <h3 className="font-serif text-lg text-paper">{current.title}</h3>
              <p className="mt-1 text-sm text-paper/80">{current.desc}</p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center bg-paper/10 text-paper backdrop-blur-md transition-colors hover:bg-paper/20"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {total > 1 && (
              <>
                <div className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center font-serif text-sm tracking-[0.3em] text-paper/80">
                  <FlipOnChange value={String(index + 1).padStart(2, "0")} />
                  <span className="mx-2 text-paper/40">/</span>
                  {String(total).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-paper/10 text-paper backdrop-blur-md transition-colors hover:bg-paper/20"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-paper/10 text-paper backdrop-blur-md transition-colors hover:bg-paper/20"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
