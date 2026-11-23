import { getTranslations } from "next-intl/server";
import { BedDouble, Bus, Presentation, Users, type LucideIcon } from "lucide-react";
import ParallaxImage from "../ParallaxImage";
import { GROUP_PAGES } from "../groupPages";
import {
  Enquiry,
  HeroCta,
  HotelAtAGlance,
  OfferSwitcher,
  TextLink,
  container,
  eyebrow,
  heroHeight,
} from "./shared";

const TILES: { key: string; Icon: LucideIcon }[] = [
  { key: "rooms", Icon: BedDouble },
  { key: "staff", Icon: Users },
  { key: "transport", Icon: Bus },
  { key: "classroom", Icon: Presentation },
];

// School trips - "tiles": a bright daylight photo with the title on a paper
// card, then four practical icon tiles.
export default async function SchoolTrips() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.schoolTrips.${key}`);

  return (
    <>
      <section className={`relative flex ${heroHeight} w-full items-end overflow-hidden bg-forest`}>
        <ParallaxImage src={GROUP_PAGES.schoolTrips.image} alt={p("imageAlt")} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/65 via-forest/5 to-transparent" />
        <div className={`relative ${container} pb-8 pt-28 lg:pb-14`}>
          <div className="max-w-xl bg-paper p-8 text-ink lg:p-12">
            <span className={`${eyebrow} text-forest`}>{t("eyebrow")}</span>
            <h1 className="mt-5 text-balance break-words font-serif text-3xl leading-[1.1] hyphens-auto lg:text-5xl">
              {p("title")}
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-ink/70 lg:text-base">
              {p("intro")}
            </p>
            <HeroCta tone="dark" className="mt-8" />
          </div>
        </div>
      </section>

      <OfferSwitcher current="schoolTrips" />

      <section className="bg-paper py-20 text-ink lg:py-28">
        <div className={container}>
          <ul className="grid gap-px border border-mist bg-mist sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map(({ key, Icon }) => (
              <li key={key} className="bg-paper p-8 lg:p-10">
                <Icon aria-hidden className="h-7 w-7 text-forest" strokeWidth={1.25} />
                <h2 className="mt-8 font-serif text-xl leading-snug">
                  {p(`tiles.${key}.title`)}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {p(`tiles.${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <TextLink href="/attractions">{p("attractions")}</TextLink>
          </div>
        </div>
      </section>

      <HotelAtAGlance />
      <Enquiry page="schoolTrips" />
    </>
  );
}
