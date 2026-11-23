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
  heroHeight,
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
      <section className={`relative flex ${heroHeight} w-full overflow-hidden bg-forest text-paper`}>
        {/* Phones: the photo becomes a washed-out backdrop so the hero keeps
            the shared height; desktop shows it framed on the right. */}
        <div aria-hidden className="absolute inset-0 lg:hidden">
          <Image
            src={GROUP_PAGES.workshops.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest/85" />
        </div>
        <div
          className={`relative ${container} grid h-full grid-rows-[1fr] items-end gap-16 pb-14 pt-28 lg:grid-cols-[1.1fr_1fr] lg:pb-16 lg:pt-32`}
        >
          <div>
            <span className={`${eyebrow} text-paper/70`}>{t("eyebrow")}</span>
            <h1 className="mt-6 text-balance break-words font-serif text-[2rem] leading-[1.05] hyphens-auto sm:text-4xl lg:text-[3.4rem]">
              {p("title")}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/80 lg:text-base">
              {p("intro")}
            </p>
            <HeroCta className="mt-10" />
          </div>
          <div className="relative hidden h-full self-stretch overflow-hidden lg:block">
            <Image
              src={GROUP_PAGES.workshops.image}
              alt={p("imageAlt")}
              fill
              priority
              sizes="45vw"
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
