"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import GallerySlider, { type GalleryPhoto } from "./GallerySlider";

// One album on the /gallery page (a room, or a whole category): a quiet grid
// of square thumbnails; clicking one opens the room-style slider on it.
export default function GalleryAlbum({
  title,
  eyebrow,
  photos,
  showTitle = false,
}: {
  title: string;
  eyebrow?: string;
  photos: GalleryPhoto[];
  showTitle?: boolean;
}) {
  const t = useTranslations("gallery");
  const [[open, index, direction], setState] = useState<[boolean, number, number]>([
    false,
    0,
    0,
  ]);

  if (photos.length === 0) return null;

  return (
    <div>
      {showTitle && (
        <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-ink/10 pb-2">
          <h3 className="font-serif text-lg leading-tight lg:text-xl">{title}</h3>
          <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-ink/45">
            {t("photos", { count: photos.length })}
          </span>
        </div>
      )}
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-6">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => setState([true, i, 0])}
              aria-label={`${title} – ${i + 1} / ${photos.length}`}
              className="group relative block aspect-square w-full overflow-hidden bg-ink/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <GallerySlider
            title={title}
            eyebrow={eyebrow}
            photos={photos}
            index={index}
            direction={direction}
            onChange={(i, d) => setState([true, i, d])}
            onClose={() => setState(([, i, d]) => [false, i, d])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
