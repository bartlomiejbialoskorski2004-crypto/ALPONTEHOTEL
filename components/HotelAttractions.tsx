import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Coffee,
  Flame,
  Flower2,
  Sunrise,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import ParallaxImage from "./ParallaxImage";
import { JumpLink } from "./PageToc";
import InfoNote from "./InfoNote";
import FlipText from "./FlipText";
import BookNowButton from "./BookNowButton";
import { BOOKING } from "./contact-info";
import { PriceBadge, SAUNA_IMAGE } from "./wellnessShared";

type BlockKey = "pool" | "sauna" | "terrace" | "garden";
type Block = {
  eyebrow: string;
  title: string;
  text: string;
  imageAlt: string;
  facts: string[];
  note?: string;
  tagline?: string;
};

// `focus` = object-position, so portrait crops keep the subject (the pool
// sits at the right edge of hero1.jpg).
const BLOCKS: { key: BlockKey; Icon: LucideIcon; image: string; focus?: string }[] = [
  { key: "pool", Icon: Waves, image: "/hero1.jpg", focus: "object-[85%_50%]" },
  { key: "sauna", Icon: Flame, image: SAUNA_IMAGE },
  { key: "terrace", Icon: Sunrise, image: "/gallery/4.jpg" },
  { key: "garden", Icon: Flower2, image: "/gallery/3.jpg" },
];

const container = "mx-auto w-full max-w-6xl px-6 lg:px-10";
const eyebrow = "text-[11px] font-medium uppercase tracking-[0.3em] text-forest";

// "At the hotel": the warm, photo-led counterpart to the black-on-white
// Informations page - pool, private sauna, terrace, garden and breakfast,
// on sand with forest accents, no table of contents.
export default async function HotelAttractions() {
  const t = await getTranslations("hotelAttractions");
  const tInfo = await getTranslations("info");
  const tWell = await getTranslations("wellness");

  return (
    <article className="bg-sand text-ink">
      {/* Full first screen, like the homepage hero. */}
      <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink text-paper">
        <ParallaxImage src="/gallery/2.jpg" alt={t("imageAlt")} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/60" />
        <div className={`relative ${container} pb-12 pt-28 lg:pb-16`}>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/80">
            {t("eyebrow")}
          </span>
          <h1 className="mt-6 max-w-4xl text-balance break-words font-serif text-[2rem] leading-[1.04] hyphens-auto sm:text-4xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/80 lg:text-base">
            {t("intro")}
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-paper/20 pt-6">
            {BLOCKS.map(({ key, Icon }) => (
              <li key={key}>
                <JumpLink
                  target={`#${key}`}
                  className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/80 transition-colors hover:text-paper"
                >
                  <Icon aria-hidden className="h-4 w-4 text-paper" strokeWidth={1.25} />
                  <FlipText>{t(`highlights.${key}`)}</FlipText>
                </JumpLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Photo + text blocks, alternating sides. */}
      <div className={`${container} py-8 lg:py-16`}>
        {BLOCKS.map(({ key, Icon, image, focus }, i) => {
          const b = t.raw(key) as Block;
          const flip = i % 2 === 1;
          return (
            <section
              key={key}
              id={key}
              className="grid scroll-mt-28 items-center gap-10 py-12 lg:grid-cols-2 lg:gap-20 lg:py-16"
            >
              <div className={`relative ${flip ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[3/2] w-full overflow-hidden lg:aspect-[4/5]">
                  <Image
                    src={image}
                    alt={b.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover ${focus ?? ""}`}
                  />
                </div>
                {key === "sauna" && (
                  <PriceBadge
                    perHour={tWell("perHour")}
                    className={`absolute -bottom-6 right-6 ${flip ? "lg:-left-8 lg:right-auto" : "lg:-right-8"} lg:bottom-10`}
                  />
                )}
              </div>

              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/30 text-forest">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.25} />
                </span>
                <span className={`mt-6 block ${eyebrow}`}>{b.eyebrow}</span>
                <h2 className="mt-4 text-balance font-serif text-3xl leading-tight lg:text-4xl">
                  {b.title}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
                  {b.text}
                </p>
                {b.tagline && (
                  <p className="mt-4 font-serif text-base italic text-forest">{b.tagline}</p>
                )}
                {b.facts.length > 0 && (
                  <ul className="mt-8 space-y-2.5 border-t border-ink/10 pt-6">
                    {b.facts.map((f) => (
                      <li key={f} className="flex items-baseline gap-3 text-base text-ink/85">
                        <span aria-hidden className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rotate-45 bg-forest" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {key === "pool" && (
                  <InfoNote className="mt-5 max-w-md text-sm leading-relaxed text-ink/55">
                    {tInfo("pool.closure")}
                  </InfoNote>
                )}
                {b.note && (
                  <InfoNote className="mt-5 max-w-md text-sm leading-relaxed text-ink/55">
                    {b.note}
                  </InfoNote>
                )}
              </div>
            </section>
          );
        })}

        {/* Breakfast: a quiet text card (no photo of the breakfast room). */}
        <section
          id="breakfast"
          className="mx-auto my-12 max-w-2xl scroll-mt-28 border border-ink/10 bg-paper/60 px-8 py-12 text-center lg:my-16 lg:px-14"
        >
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-forest/30 text-forest">
            <Coffee aria-hidden className="h-5 w-5" strokeWidth={1.25} />
          </span>
          <span className={`mt-6 block ${eyebrow}`}>{t("breakfast.eyebrow")}</span>
          <h2 className="mt-4 font-serif text-3xl leading-tight">{t("breakfast.title")}</h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70">{t("breakfast.text")}</p>
          <InfoNote className="mx-auto mt-5 max-w-md justify-center text-left text-sm leading-relaxed text-ink/55">
            {t("breakfast.note")}
          </InfoNote>
        </section>
      </div>

      {/* Outro: going out is one bus away. */}
      <section className="bg-forest text-paper">
        <div className={`${container} flex flex-col gap-10 py-20 lg:flex-row lg:items-end lg:justify-between lg:py-24`}>
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl leading-tight lg:text-4xl">{t("outro.title")}</h2>
            <p className="mt-5 text-base leading-relaxed text-paper/75">{t("outro.text")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/attractions"
              className="group inline-flex items-center gap-2 border border-paper/40 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-paper hover:text-forest"
            >
              <FlipText>{t("outro.cta")}</FlipText>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <BookNowButton href={BOOKING} variant="light" />
          </div>
        </div>
      </section>
    </article>
  );
}
