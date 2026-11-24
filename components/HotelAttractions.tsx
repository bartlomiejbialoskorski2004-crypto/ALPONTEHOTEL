import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Flame, Flower2, Sunrise, Waves, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ParallaxImage from "./ParallaxImage";
import { JumpLink } from "./PageToc";
import InfoNote from "./InfoNote";
import FlipText from "./FlipText";
import { BookingChoice } from "./booking";
import { PriceBadge, SAUNA_IMAGE } from "./wellnessShared";
import { HERO_TEXT_SCRIM } from "./groups/shared";

type BlockKey = "pool" | "sauna" | "terrace" | "garden";
type Block = {
  eyebrow: string;
  title: string;
  text: string;
  imageAlt: string;
  facts: string[];
  note?: string;
};

// Each block is its own full-width band; backgrounds alternate so the
// sections read as clearly separate.
const BLOCKS: {
  key: BlockKey;
  Icon: LucideIcon;
  image: string;
  bg: string;
  focus?: string;
}[] = [
  { key: "pool", Icon: Waves, image: "/hero1.jpg", bg: "bg-paper", focus: "object-[85%_50%]" },
  { key: "sauna", Icon: Flame, image: SAUNA_IMAGE, bg: "bg-sand" },
  { key: "terrace", Icon: Sunrise, image: "/gallery/4.jpg", bg: "bg-paper" },
  { key: "garden", Icon: Flower2, image: "/gallery/3.jpg", bg: "bg-sand" },
];

const container = "mx-auto w-full max-w-6xl px-6 lg:px-10";
const eyebrow = "text-[11px] font-medium uppercase tracking-[0.3em] text-forest";

// "At the hotel": the warm, photo-led counterpart to the black-on-white
// Informations page - pool, private sauna, terrace, garden and breakfast as
// separate minimal bands (alternating paper / sand), no table of contents.
export default async function HotelAttractions() {
  const t = await getTranslations("hotelAttractions");
  const tInfo = await getTranslations("info");
  const tWell = await getTranslations("wellness");

  return (
    <article className="text-ink">
      {/* Full first screen, like the homepage hero. */}
      <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink text-paper">
        <ParallaxImage src="/gallery/2.jpg" alt={t("imageAlt")} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/70" />
        <div className={HERO_TEXT_SCRIM} />
        <div className={`relative ${container} pb-12 pt-28 lg:pb-16`}>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/80">
            {t("eyebrow")}
          </span>
          <h1 className="mt-6 max-w-4xl text-balance break-words font-serif text-[2rem] leading-[1.04] hyphens-auto sm:text-4xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/85 lg:text-base">
            {t("intro")}
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-paper/20 pt-6">
            {BLOCKS.map(({ key, Icon }) => (
              <li key={key}>
                <JumpLink
                  target={`#${key}`}
                  className="group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/85 transition-colors hover:text-paper"
                >
                  <Icon aria-hidden className="h-4 w-4" strokeWidth={1.25} />
                  <FlipText>{t(`highlights.${key}`)}</FlipText>
                </JumpLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {BLOCKS.map(({ key, image, bg, focus }, i) => {
        const b = t.raw(key) as Block;
        const flip = i % 2 === 1;
        return (
          <section key={key} id={key} className={`${bg} scroll-mt-20`}>
            <div
              className={`${container} grid items-center gap-10 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28`}
            >
              <div className={`relative ${flip ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[3/2] w-full overflow-hidden">
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
                    className={`absolute -bottom-6 right-6 ${flip ? "lg:-left-8 lg:right-auto" : "lg:-right-8"}`}
                  />
                )}
              </div>

              <div className="max-w-md">
                <span className={eyebrow}>{b.eyebrow}</span>
                <h2 className="mt-4 text-balance font-serif text-3xl leading-tight lg:text-4xl">
                  {b.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink/70">{b.text}</p>
                {b.facts.length > 0 && (
                  <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                    {b.facts.map((fact) => (
                      <li key={fact} className="py-3 text-[15px] text-ink/85">
                        {fact}
                      </li>
                    ))}
                  </ul>
                )}
                {key === "pool" && (
                  <InfoNote className="mt-5 text-ink/55">{tInfo("pool.closure")}</InfoNote>
                )}
                {b.note && <InfoNote className="mt-5 text-ink/55">{b.note}</InfoNote>}
              </div>
            </div>
          </section>
        );
      })}

      {/* Breakfast: a quiet text band (no photo of the breakfast room). */}
      <section id="breakfast" className="scroll-mt-20 bg-paper">
        <div className={`${container} py-20 text-center lg:py-24`}>
          <span className={eyebrow}>{t("breakfast.eyebrow")}</span>
          <h2 className="mt-4 font-serif text-3xl leading-tight">{t("breakfast.title")}</h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink/70">
            {t("breakfast.text")}
          </p>
          <InfoNote className="mx-auto mt-4 w-fit max-w-md text-left text-ink/55">
            {t("breakfast.note")}
          </InfoNote>
        </div>
      </section>

      {/* Outro: going out is one bus away; or book. */}
      <section className="bg-forest text-paper">
        <div
          className={`${container} flex flex-col gap-10 py-20 lg:flex-row lg:items-center lg:justify-between lg:py-24`}
        >
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl leading-tight lg:text-4xl">{t("outro.title")}</h2>
            <p className="mt-5 text-base leading-relaxed text-paper/75">{t("outro.text")}</p>
            <Link
              href="/attractions"
              className="group mt-8 inline-flex items-center gap-2 border border-paper/40 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-paper hover:text-forest"
            >
              <FlipText>{t("outro.cta")}</FlipText>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
          <BookingChoice tone="light" className="w-full sm:w-80" />
        </div>
      </section>
    </article>
  );
}
