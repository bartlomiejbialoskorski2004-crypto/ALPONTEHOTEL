import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { GROUP_PAGES, GROUP_VENUES } from "../groupPages";
import {
  Enquiry,
  HeroCta,
  HotelAtAGlance,
  OfferSwitcher,
  TextLink,
  container,
  eyebrow,
} from "./shared";

type Step = { when: string; what: string };

// Workshops - "rhythm of the day": a solid forest hero with a framed photo,
// then the training day as four steps on a thin timeline.
export default async function Workshops() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.workshops.${key}`);
  const steps = t.raw("pages.workshops.day.steps") as Step[];

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-paper">
        <div
          className={`${container} grid gap-12 pb-16 pt-36 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16 lg:pb-20 lg:pt-44`}
        >
          <div className="lg:pb-4">
            <span className={`${eyebrow} text-paper/70`}>{t("eyebrow")}</span>
            <h1 className="mt-6 text-balance font-serif text-4xl leading-[1.05] lg:text-6xl">
              {p("title")}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/80 lg:text-base">
              {p("intro")}
            </p>
            <HeroCta className="mt-10" />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[5/6]">
            <Image
              src={GROUP_PAGES.workshops.image}
              alt={p("imageAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

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
