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

// Music-choice panels: text sits on the bottom edge; smaller type on phones
// so long words ("międzynarodowa") never push the page wider than the screen.
const panel = "flex min-w-0 items-end border border-paper/15 p-6 sm:p-8 lg:min-h-56 lg:p-10";
const panelText =
  "break-words font-serif text-[1.75rem] leading-tight hyphens-auto sm:text-4xl lg:text-[2.6rem]";

// Company events - "evening": the one dark page. Ink hero and module, the
// music choice as two large panels, then back to paper for the shared frame.
export default async function CompanyEvents() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.companyEvents.${key}`);

  const details = [
    { value: String(GROUP_VENUES.restaurant), label: p("details.restaurant") },
    { value: String(GROUP_MAX_GUESTS), label: p("details.beds") },
    { value: "DJ", label: p("details.dj") },
  ];

  return (
    <>
      <section className="relative flex min-h-[72svh] w-full items-end overflow-hidden bg-ink text-paper">
        <ParallaxImage
          src={GROUP_PAGES.companyEvents.image}
          alt={p("imageAlt")}
          priority
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/35 to-ink" />
        <div className={`relative ${container} pb-14 pt-40 lg:pb-20 lg:pt-48`}>
          <span className={`${eyebrow} text-gold`}>{t("eyebrow")}</span>
          <h1 className="mt-6 max-w-4xl text-balance font-serif text-4xl leading-[1.04] lg:text-7xl">
            {p("title")}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/75 lg:text-base">
            {p("intro")}
          </p>
          <HeroCta className="mt-10" />
        </div>
      </section>

      <OfferSwitcher current="companyEvents" tone="dark" />

      <section className="bg-ink py-20 text-paper lg:py-28">
        <div className={container}>
          <span className={`${eyebrow} text-gold`}>{p("music.title")}</span>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
            <div className={panel}>
              <span className={panelText}>{p("music.polish")}</span>
            </div>
            <span className="self-center text-center font-serif text-lg italic text-gold">
              {p("music.or")}
            </span>
            <div className={panel}>
              <span className={panelText}>{p("music.italian")}</span>
            </div>
          </div>

          <ul className="mt-16 grid gap-8 border-t border-paper/15 pt-10 sm:grid-cols-3">
            {details.map((d) => (
              <li key={d.label}>
                <span className="block font-serif text-4xl leading-none text-paper tabular-nums">
                  {d.value}
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-paper/60">
                  {d.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
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
