import { getTranslations } from "next-intl/server";
import InteractiveBentoGallery, {
  type MediaItemType,
} from "./InteractiveBentoGallery";
import MobileGallery from "./MobileGallery";

// Bento layout — keep the spans from the source design (4 tall + 3 wide).
// To add / reorder slots, edit this list. Drop the matching files in
// public/gallery/ as 1.jpg .. 7.jpg.
const SLOTS: { id: number; file: string; span: string }[] = [
  {
    id: 1,
    file: "1.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 2,
    file: "2.jpg",
    span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 3,
    file: "3.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 4,
    file: "4.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 5,
    file: "5.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 6,
    file: "6.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 7,
    file: "7.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  },
];

export default async function Gallery() {
  const t = await getTranslations("gallery");

  const items: MediaItemType[] = SLOTS.map((slot) => ({
    id: slot.id,
    type: "image",
    title: t(`items.${slot.id}.title`),
    desc: t(`items.${slot.id}.desc`),
    url: `/gallery/${slot.file}`,
    span: slot.span,
  }));

  return (
    <section
      id="gallery"
      className="bg-paper px-6 py-24 text-ink lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 lg:mb-16">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink/50">
            {t("eyebrow")}
          </span>
          <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-[1.05] lg:text-5xl">
            {t("title")}
          </h2>
        </div>
        {/* Mobile: accessible 2-col grid + fullscreen viewer */}
        <div className="lg:hidden">
          <MobileGallery items={items} />
        </div>
        {/* Desktop: interactive bento */}
        <div className="hidden lg:block">
          <InteractiveBentoGallery mediaItems={items} />
        </div>
      </div>
    </section>
  );
}
