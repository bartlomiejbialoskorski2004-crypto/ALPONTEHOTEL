import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { GROUP_MAX_GUESTS, GROUP_VENUES } from "../groupPages";
import {
  Enquiry,
  OfferHero,
  HotelAtAGlance,
  OfferSwitcher,
  container,
} from "./shared";

// Celebrations - "invitation": the shared offer hero, then a centred
// typographic card with gold hairlines and two key numbers.
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
      <OfferHero page="celebrations" />

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
