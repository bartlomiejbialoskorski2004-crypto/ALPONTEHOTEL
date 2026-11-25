import { getTranslations } from "next-intl/server";
import { createDedupe, listPhotos } from "@/lib/photos";
import ParallaxImage from "./ParallaxImage";
import { JumpLink } from "./PageToc";
import FlipText from "./FlipText";
import GalleryAlbum from "./GalleryAlbum";
import type { GalleryPhoto } from "./GallerySlider";
import { ROOM_PANELS, type RoomPanel } from "./roomPanels";
import { ROOM_DETAILS } from "./roomData";
import { HERO_TEXT_SCRIM } from "./groups/shared";

type Album = { title: string; photos: GalleryPhoto[] };
type Category = { id: string; title: string; eyebrow: string; albums: Album[] };

const ROOM_CATEGORIES: RoomPanel["categoryKey"][] = [
  "apartments",
  "superior",
  "budgetPlus",
  "budget",
];
const REGION = ["Lakelugano.jpg", "Oldtown.jpg", "sansalvatore.jpg", "bre.jpg"];

const container = "mx-auto w-full max-w-6xl px-6 lg:px-10";
const numbered = (name: string, n: number) => (n > 1 ? `${name} (${n})` : name);

// Photo folder of each room panel (Triple Deluxe has its own).
const roomFolder = (id: string) =>
  id === "triple-deluxe" ? "triple-deluxe" : ROOM_DETAILS.find((r) => r.id === id)?.folder;

// /gallery: the hotel and its views, the pool, the four room categories (one
// album per room) and the region. Byte-identical copies are dropped.
// Thumbnails open the room-style slider (dark, like the room lightbox).
export default async function GalleryPage() {
  const t = await getTranslations();
  const dedupe = createDedupe();

  const hotelTitle = t("gallery.categories.hotel");
  const hotel: GalleryPhoto[] = dedupe(
    [1, 2, 3, 4, 5, 6, 7].map((n) => ({
      src: `/gallery/${n}.jpg`,
      alt: t(`gallery.items.${n}.title`),
    })),
  );

  // Pool: the terrace shot with the pool, plus anything dropped into
  // public/pool/ later (picked up automatically).
  const poolTitle = t("gallery.categories.pool");
  const pool: GalleryPhoto[] = dedupe([
    { src: "/hero1.jpg", alt: t("hotelAttractions.pool.imageAlt") },
    ...listPhotos("pool").map((src, i) => ({ src, alt: numbered(poolTitle, i + 2) })),
  ]);

  const rooms: Category[] = ROOM_CATEGORIES.map((cat) => ({
    id: cat,
    title: t(`mega.rooms.${cat}.title`),
    eyebrow: t("nav.rooms"),
    albums: ROOM_PANELS.filter((p) => p.categoryKey === cat).map((p) => {
      const name = t(p.nameKey);
      const folder = roomFolder(p.id);
      return {
        title: name,
        photos: dedupe(
          (folder ? listPhotos(folder) : []).map((src, i) => ({
            src,
            alt: numbered(name, i + 1),
          })),
        ),
      };
    }),
  }));

  const regionTitle = t("gallery.categories.region");
  const region: GalleryPhoto[] = dedupe(
    REGION.map((f, i) => ({ src: `/mega/${f}`, alt: numbered(regionTitle, i + 1) })),
  );

  const label = t("gallery.label");
  const categories: Category[] = [
    { id: "hotel", title: hotelTitle, eyebrow: label, albums: [{ title: hotelTitle, photos: hotel }] },
    { id: "pool", title: poolTitle, eyebrow: label, albums: [{ title: poolTitle, photos: pool }] },
    ...rooms,
    { id: "region", title: regionTitle, eyebrow: label, albums: [{ title: regionTitle, photos: region }] },
  ]
    .map((c) => ({ ...c, albums: c.albums.filter((a) => a.photos.length > 0) }))
    .filter((c) => c.albums.length > 0);

  const count = (c: Category) => c.albums.reduce((n, a) => n + a.photos.length, 0);

  return (
    <article className="text-ink">
      {/* Full first screen, like the other subpages. */}
      <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink text-paper">
        <ParallaxImage src="/gallery/6.jpg" alt={t("gallery.items.6.title")} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/70" />
        <div className={HERO_TEXT_SCRIM} />
        <div className={`relative ${container} pb-12 pt-28 lg:pb-16`}>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/80">
            {label}
          </span>
          <h1 className="mt-6 max-w-4xl text-balance break-words font-serif text-[2rem] leading-[1.04] hyphens-auto sm:text-4xl lg:text-7xl">
            {t("gallery.title")}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/85 lg:text-base">
            {t("gallery.intro")}
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-paper/20 pt-6">
            {categories.map((c) => (
              <li key={c.id}>
                <JumpLink
                  target={`#${c.id}`}
                  className="group inline-flex text-[11px] font-medium uppercase tracking-[0.18em] text-paper/85 transition-colors hover:text-paper"
                >
                  <FlipText>{c.title}</FlipText>
                </JumpLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {categories.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          className={`scroll-mt-20 bg-paper ${i > 0 ? "border-t border-ink/10" : ""}`}
        >
          <div className={`${container} py-12 lg:py-16`}>
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
                  {c.eyebrow}
                </span>
                <h2 className="mt-2 font-serif text-2xl leading-tight lg:text-3xl">{c.title}</h2>
              </div>
              <span className="shrink-0 pb-1 text-[11px] uppercase tracking-[0.18em] text-ink/45">
                {t("gallery.photos", { count: count(c) })}
              </span>
            </div>
            <div className="mt-6 space-y-8 lg:mt-8 lg:space-y-10">
              {c.albums.map((a) => (
                <GalleryAlbum
                  key={a.title}
                  title={a.title}
                  eyebrow={c.title === a.title ? c.eyebrow : c.title}
                  photos={a.photos}
                  showTitle={c.albums.length > 1}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </article>
  );
}
