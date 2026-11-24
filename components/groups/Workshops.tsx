import { getTranslations } from "next-intl/server";
import { GROUP_PAGES, GROUP_VENUES } from "../groupPages";
import {
  Enquiry,
  OfferHero,
  HotelAtAGlance,
  OfferSwitcher,
  TextLink,
  container,
  eyebrow,
} from "./shared";

type Step = { when: string; what: string };

// Workshops - "rhythm of the day": the shared offer hero, then the
// training day as four steps on a thin timeline.
export default async function Workshops() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.workshops.${key}`);
  const steps = t.raw("pages.workshops.day.steps") as Step[];

  return (
    <>
      <OfferHero page="workshops" />

      <OfferSwitcher current="workshops" />

      <section className="bg-paper py-20 text-ink lg:py-28">
        <div className={container}>
          <span className={`${eyebrow} text-forest`}>{p("day.title")}</span>
          <ol className="mt-12 grid gap-10 border-l border-mist pl-8 lg:grid-cols-4 lg:gap-10 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10">
            {steps.map((s) => (
              <li key={s.when} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full border border-forest bg-paper lg:-top-[calc(2.5rem+5px)] lg:left-0"
                />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
                  {s.when}
                </span>
                <p className="mt-3 font-serif text-xl leading-snug">{s.what}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16">
            <TextLink href={GROUP_PAGES.conferences.href}>
              {t("pages.workshops.bigger", { people: GROUP_VENUES.conference })}
            </TextLink>
          </div>
        </div>
      </section>

      <HotelAtAGlance />
      <Enquiry page="workshops" />
    </>
  );
}
