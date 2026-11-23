import { getTranslations } from "next-intl/server";
import ParallaxImage from "../ParallaxImage";
import { GROUP_MAX_GUESTS, GROUP_PAGES, GROUP_VENUES } from "../groupPages";
import {
  Enquiry,
  HeroCta,
  HotelAtAGlance,
  OfferSwitcher,
  TextLink,
  container,
  eyebrow,
} from "./shared";

const HALLS = ["conference", "seminar"] as const;

// Conferences - "two rooms": a full-bleed photo hero, then the two venues
// side by side, each led by its capacity in large numerals.
export default async function Conferences() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.conferences.${key}`);

  return (
    <>
      <section className="relative flex min-h-[68svh] w-full items-end overflow-hidden bg-forest text-paper">
        <ParallaxImage src={GROUP_PAGES.conferences.image} alt={p("imageAlt")} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/40 to-forest/85" />
        <div className={`relative ${container} pb-14 pt-40 lg:pb-20 lg:pt-48`}>
          <span className={`${eyebrow} text-paper/70`}>{t("eyebrow")}</span>
          <h1 className="mt-6 max-w-3xl text-balance font-serif text-4xl leading-[1.05] lg:text-6xl">
            {p("title")}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/80 lg:text-base">
            {p("intro")}
          </p>
          <HeroCta className="mt-10" />
        </div>
      </section>

      <OfferSwitcher current="conferences" />

      <section className="bg-paper py-20 text-ink lg:py-28">
        <div className={container}>
          <span className={`${eyebrow} text-forest`}>{p("halls.title")}</span>
          <div className="mt-10 grid border-y border-mist lg:grid-cols-2">
            {HALLS.map((hall, i) => (
              <div
                key={hall}
                className={`py-10 lg:py-14 ${
                  i === 0 ? "lg:pr-14" : "border-t border-mist lg:border-l lg:border-t-0 lg:pl-14"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-7xl leading-none text-forest tabular-nums lg:text-8xl">
                    {GROUP_VENUES[hall]}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/50">
                    {p("halls.people")}
                  </span>
                </div>
                <h2 className="mt-8 font-serif text-2xl leading-tight lg:text-3xl">
                  {p(`halls.${hall}.name`)}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  {p(`halls.${hall}.where`)}
                  <span aria-hidden className="mx-2 text-ink/30">·</span>
                  {p(`halls.${hall}.feature`)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-base leading-relaxed text-ink/70">
              {t("pages.conferences.stay", { guests: GROUP_MAX_GUESTS })}
            </p>
            <TextLink href={GROUP_PAGES.companyEvents.href}>{p("evening")}</TextLink>
          </div>
        </div>
      </section>

      <HotelAtAGlance />
      <Enquiry page="conferences" />
    </>
  );
}
