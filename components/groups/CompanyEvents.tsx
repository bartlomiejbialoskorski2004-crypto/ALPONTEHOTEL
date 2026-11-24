import { getTranslations } from "next-intl/server";
import { BedDouble, Disc3, Wine } from "lucide-react";
import { GROUP_MAX_GUESTS, GROUP_PAGES, GROUP_VENUES } from "../groupPages";
import InfoNote from "../InfoNote";
import {
  Enquiry,
  OfferHero,
  HotelAtAGlance,
  OfferSwitcher,
  TextLink,
  container,
  eyebrow,
} from "./shared";

const pill =
  "rounded-full border border-paper/25 px-4 py-1.5 text-xs tracking-wide text-paper/85";

// Small, quiet line icons above each figure of the evening row.
const icon = "mb-5 block h-5 w-5 text-gold/80";

// Company events - "evening": the one dark page. Shared offer hero, a compact
// ink module (three figures, the DJ's music choice as two small pills), then
// back to paper for the shared frame.
export default async function CompanyEvents() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.companyEvents.${key}`);

  return (
    <>
      <OfferHero page="companyEvents" />

      <OfferSwitcher current="companyEvents" tone="dark" />

      <section className="bg-ink py-20 text-paper lg:py-28">
        <div className={container}>
          <span className={`${eyebrow} text-gold`}>{p("evening")}</span>

          <ul className="mt-10 grid gap-10 border-t border-paper/15 pt-10 sm:grid-cols-3 sm:gap-8">
            <li>
              <Wine aria-hidden className={icon} strokeWidth={1.25} />
              <span className="block font-serif text-4xl leading-none tabular-nums">
                {GROUP_VENUES.restaurant}
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-paper/60">
                {p("details.restaurant")}
              </span>
            </li>
            <li>
              <BedDouble aria-hidden className={icon} strokeWidth={1.25} />
              <span className="block font-serif text-4xl leading-none tabular-nums">
                {GROUP_MAX_GUESTS}
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-paper/60">
                {p("details.beds")}
              </span>
            </li>
            <li>
              <Disc3 aria-hidden className={icon} strokeWidth={1.25} />
              <span className="block font-serif text-4xl leading-none">DJ</span>
              <span className="mt-3 block text-sm leading-relaxed text-paper/60">
                {p("details.dj")}
              </span>
              <InfoNote
                as="span"
                className="mt-6 font-medium uppercase tracking-[0.2em] text-paper/50"
              >
                {p("music.title")}
              </InfoNote>
              <span className="mt-3 flex flex-wrap items-center gap-2">
                <span className={pill}>{p("music.polish")}</span>
                <em className="px-1 font-serif text-sm italic text-gold">
                  {p("music.or")}
                </em>
                <span className={pill}>{p("music.italian")}</span>
              </span>
            </li>
          </ul>

          <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-paper/45">
              {p("combine")}
            </span>
            <TextLink href={GROUP_PAGES.conferences.href} tone="dark">
              {t("pages.conferences.navLabel")}
            </TextLink>
            <TextLink href={GROUP_PAGES.workshops.href} tone="dark">
              {t("pages.workshops.navLabel")}
            </TextLink>
          </div>
        </div>
      </section>

      <HotelAtAGlance />
      <Enquiry page="companyEvents" />
    </>
  );
}
