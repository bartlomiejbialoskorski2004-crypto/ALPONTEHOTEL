import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import ParallaxImage from "../ParallaxImage";
import { GROUP_MAX_GUESTS, GROUP_PAGES, GROUP_VENUES } from "../groupPages";
import {
  Enquiry,
  HeroCta,
  HotelAtAGlance,
  OfferSwitcher,
  container,
  eyebrow,
} from "./shared";

// Celebrations - "invitation": a centred hero over the dusk terrace, then a
// centred typographic card with gold hairlines and two key numbers.
export default async function Celebrations() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.celebrations.${key}`);
  const occasions = t.raw("pages.celebrations.occasions") as string[];

  const numbers = [
    { value: GROUP_VENUES.restaurant, label: p("guests") },
    { value: GROUP_MAX_GUESTS, label: p("beds") },
  ];

  return (
    <>
      <section className="relative flex min-h-[80svh] w-full items-center justify-center overflow-hidden bg-forest text-center text-paper">
        <ParallaxImage src={GROUP_PAGES.celebrations.image} alt={p("imageAlt")} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-forest/80" />
        <div className={`relative ${container} pb-20 pt-40`}>
          <span className={`${eyebrow} text-paper/75`}>{t("eyebrow")}</span>
          <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-gold" />
          <h1 className="mx-auto mt-6 max-w-3xl text-balance font-serif text-4xl leading-[1.08] lg:text-6xl">
            {p("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-paper/80 lg:text-base">
            {p("intro")}
          </p>
          <HeroCta className="mt-10" />
        </div>
      </section>

      <OfferSwitcher current="celebrations" />

      <section className="bg-paper py-24 text-center text-ink lg:py-32">
        <div className={container}>
          <ul className="flex flex-col items-center gap-5 font-serif text-2xl leading-tight sm:flex-row sm:justify-center sm:gap-8 lg:gap-12 lg:text-4xl">
            {occasions.map((o, i) => (
              <Fragment key={o}>
                {i > 0 && (
                  <li aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold" />
                )}
                <li>{o}</li>
              </Fragment>
            ))}
          </ul>

          <div className="mx-auto mt-16 grid max-w-xl grid-cols-2 border-y border-gold/40 lg:mt-20">
            {numbers.map((n, i) => (
              <div
                key={n.label}
                className={`px-4 py-10 ${i === 1 ? "border-l border-gold/40" : ""}`}
              >
                <span className="block font-serif text-6xl leading-none text-forest tabular-nums lg:text-7xl">
                  {n.value}
                </span>
                <span className="mt-4 block text-[11px] font-medium uppercase leading-snug tracking-[0.2em] text-ink/55">
                  {n.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-14 max-w-lg text-base leading-relaxed text-ink/70">
            {p("view")}
          </p>
        </div>
      </section>

      <HotelAtAGlance />
      <Enquiry page="celebrations" />
    </>
  );
}
