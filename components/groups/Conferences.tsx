import { getTranslations } from "next-intl/server";
import { GROUP_MAX_GUESTS, GROUP_PAGES, GROUP_VENUES } from "../groupPages";
import {
  Enquiry,
  OfferHero,
  HotelAtAGlance,
  OfferSwitcher,
  TextLink,
  container,
  eyebrow,
} from "./shared";

const HALLS = ["conference", "seminar"] as const;

// Conferences - "two rooms": the shared offer hero, then the two venues
// side by side, each led by its capacity in large numerals.
export default async function Conferences() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.conferences.${key}`);

  return (
    <>
      <OfferHero page="conferences" />

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
