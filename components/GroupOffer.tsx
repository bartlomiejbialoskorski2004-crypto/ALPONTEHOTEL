import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  buildLanguages,
  localeUrl,
  ogAlternateLocales,
  ogLocale,
} from "@/lib/site";
import { BreadcrumbJsonLd } from "./JsonLd";
import PageToc, { BackToTop, JumpLink, type TocSection } from "./PageToc";
import ParallaxImage from "./ParallaxImage";
import EditorialSection, {
  SectionHead,
  sectionClass,
  type EditorialItem,
} from "./EditorialSection";
import FlipText from "./FlipText";
import { EMAIL, EMAIL_HREF, PHONE, PHONE_HREF } from "./contact-info";
import {
  GROUP_CAPACITY,
  GROUP_HALF_BOARD,
  GROUP_KEYS,
  GROUP_MEALS,
  GROUP_PAGES,
  GROUP_ROOM_TYPES,
  type GroupKey,
} from "./groupPages";

type Section = { title: string; items: EditorialItem[] };
type Fact = { label: string; value: string };
type PageCopy = {
  sections: Record<string, Section>;
  facts: Fact[];
};

// Shared sections rendered after each page's own sections, in this order.
const SHARED_ORDER = ["hotel", "rooms", "meals", "facilities", "transport"] as const;

// Photos for the shared sections; dropped on a page whose hero already uses
// the same photo.
const SHARED_IMAGES: Partial<Record<(typeof SHARED_ORDER)[number], string>> = {
  rooms: "/mega/sup.jpeg",
  facilities: "/hero1.jpg",
};

const chf = (n: number) => `CHF ${n}`;

export default async function GroupOffer({ page }: { page: GroupKey }) {
  const t = await getTranslations("groups");
  const tInfo = await getTranslations("info");
  const copy = t.raw(`pages.${page}`) as PageCopy;
  const pageSectionIds = Object.keys(copy.sections);
  const hero = GROUP_PAGES[page].image;

  const tocSections: TocSection[] = [
    ...pageSectionIds.map((id) => ({ id, label: t(`pages.${page}.nav.${id}`) })),
    ...SHARED_ORDER.map((id) => ({ id, label: t(`shared.nav.${id}`) })),
    { id: "enquiry", label: t("cta.nav") },
  ].map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));
  const numOf = (id: string) => tocSections.find((s) => s.id === id)!.num;

  const shared = (id: (typeof SHARED_ORDER)[number]) =>
    t.raw(`shared.${id}`) as Section;
  const sharedImage = (id: (typeof SHARED_ORDER)[number]) => {
    const src = SHARED_IMAGES[id];
    return src && src !== hero ? src : undefined;
  };

  // Facilities copy plus the live pool-closure notice from /informations.
  const facilities = shared("facilities");
  const facilitiesItems: EditorialItem[] = [
    ...facilities.items,
    { text: tInfo("pool.closure") },
  ];

  const mailHref = `${EMAIL_HREF}?subject=${encodeURIComponent(
    t(`pages.${page}.mailSubject`),
  )}`;
  const others = GROUP_KEYS.filter((k) => k !== page);

  return (
    <article className="bg-paper text-ink">
      {/* Hero band - scenic photo under a forest wash. */}
      <section className="relative flex min-h-[72svh] w-full items-end overflow-hidden bg-forest text-paper">
        <ParallaxImage src={hero} alt={t(`pages.${page}.imageAlt`)} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/50 to-forest/90" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-40 lg:px-10 lg:pb-16 lg:pt-48">
          <span className="block pr-12 text-[11px] font-medium uppercase tracking-[0.3em] text-paper/75 lg:pr-0">
            {t("eyebrow")}
          </span>
          <h1 className="mt-6 max-w-3xl text-balance font-serif text-4xl leading-[1.05] lg:text-6xl">
            {t(`pages.${page}.title`)}
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-paper/85 lg:text-base">
            {t(`pages.${page}.intro`)}
          </p>

          {/* Quick facts for this offer. */}
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-paper/20 pt-8 sm:grid-cols-4 sm:gap-x-8">
            {copy.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-[10px] font-medium uppercase leading-snug tracking-[0.2em] text-paper/60">
                  {f.label}
                </dt>
                <dd className="mt-2 font-serif text-base leading-tight lg:text-lg">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <JumpLink
              target="#enquiry"
              className="group inline-flex items-center gap-2 border border-paper/40 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-paper hover:text-forest"
            >
              <FlipText>{t("enquiryCta")}</FlipText>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </JumpLink>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-16 lg:px-10 lg:py-20">
        <aside>
          <PageToc sections={tocSections} tocTitle={t("tocTitle")} />
        </aside>

        <div className="min-w-0 pb-28 lg:pb-0">
          {/* Offer-specific sections. */}
          {pageSectionIds.map((id, i) => (
            <EditorialSection
              key={id}
              id={id}
              num={numOf(id)}
              title={copy.sections[id].title}
              items={copy.sections[id].items}
              first={i === 0}
            />
          ))}

          {/* Hotel for groups: capacity figures + room breakdown. */}
          <section id="hotel" className={sectionClass()}>
            <div className="relative max-w-2xl">
              <SectionHead num={numOf("hotel")} title={t("shared.hotel.title")} />
              <p className="mt-7 text-base leading-relaxed text-ink/80">
                {t("shared.hotel.intro")}
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-y border-mist py-8 lg:gap-10">
              {GROUP_CAPACITY.map((c) => (
                // Figure shown above its label; dt stays first in the DOM.
                <div key={c.key} className="flex flex-col-reverse">
                  <dt className="mt-3 text-[11px] font-medium uppercase leading-snug tracking-[0.18em] text-ink/60">
                    {t(`shared.hotel.capacity.${c.key}`)}
                  </dt>
                  <dd className="font-serif text-4xl leading-none text-forest tabular-nums lg:text-5xl">
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-12 font-serif text-lg leading-snug lg:text-xl">
              {t("shared.hotel.roomTypesTitle")}
            </h3>
            <ul className="mt-4">
              {GROUP_ROOM_TYPES.map((r) => (
                <li
                  key={r.key}
                  className="grid grid-cols-[3rem_1fr] items-baseline gap-x-5 border-t border-mist py-4 lg:gap-x-8"
                >
                  <span className="font-serif text-2xl leading-none text-forest tabular-nums">
                    {r.count}
                  </span>
                  <span className="text-base leading-relaxed text-ink/85">
                    {t(`shared.hotel.roomTypes.${r.key}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-prose border-l-2 border-forest pl-6 text-base leading-relaxed text-ink/85 lg:pl-8">
              {t("shared.hotel.staffRooms")}
            </p>
          </section>

          <EditorialSection
            id="rooms"
            num={numOf("rooms")}
            title={shared("rooms").title}
            items={shared("rooms").items}
            image={sharedImage("rooms")}
          />

          {/* Meal price list (group pricing). */}
          <section id="meals" className={sectionClass()}>
            <div className="relative max-w-2xl">
              <SectionHead num={numOf("meals")} title={t("shared.meals.title")} />
              <p className="mt-7 text-base leading-relaxed text-ink/80">
                {t("shared.meals.intro")}
              </p>
            </div>
            <div className="mt-10 max-w-2xl">
              <ul>
                {GROUP_MEALS.map((m) => (
                  <MealRow
                    key={m.key}
                    label={t(`shared.meals.items.${m.key}.label`)}
                    note={t(`shared.meals.items.${m.key}.note`)}
                    price={chf(m.price)}
                    perPerson={t("shared.meals.perPerson")}
                  />
                ))}
              </ul>
              <div className="flex items-center gap-4 py-3" aria-hidden>
                <span className="h-px flex-1 bg-mist" />
                <span className="font-serif text-sm italic text-ink/55">
                  {t("shared.meals.or")}
                </span>
                <span className="h-px flex-1 bg-mist" />
              </div>
              <ul>
                <MealRow
                  label={t(`shared.meals.items.${GROUP_HALF_BOARD.key}.label`)}
                  note={t(`shared.meals.items.${GROUP_HALF_BOARD.key}.note`)}
                  price={chf(GROUP_HALF_BOARD.price)}
                  perPerson={t("shared.meals.perPerson")}
                />
              </ul>
            </div>
          </section>

          <EditorialSection
            id="facilities"
            num={numOf("facilities")}
            title={facilities.title}
            items={facilitiesItems}
            image={sharedImage("facilities")}
            flip
          />

          <EditorialSection
            id="transport"
            num={numOf("transport")}
            title={shared("transport").title}
            items={shared("transport").items}
          />

          {/* Enquiry: e-mail with a prefilled subject, phone, other offers. */}
          <section id="enquiry" className={sectionClass()}>
            <div className="relative max-w-2xl">
              <SectionHead num={numOf("enquiry")} title={t("cta.title")} />
              <p className="mt-7 text-base leading-relaxed text-ink/80">
                {t("cta.body")}
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={mailHref}
                className="group inline-flex items-center justify-between gap-6 bg-forest px-6 py-4 text-paper transition-colors hover:bg-forest-soft sm:justify-start"
              >
                <span className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-paper/70">
                    {t("cta.email")}
                  </span>
                  <span className="mt-1 text-base">{EMAIL}</span>
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <a
                href={PHONE_HREF}
                className="group inline-flex items-center justify-between gap-6 border border-ink/15 px-6 py-4 transition-colors hover:border-forest hover:text-forest sm:justify-start"
              >
                <span className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink/55">
                    {t("cta.phone")}
                  </span>
                  <span className="mt-1 text-base tabular-nums">{PHONE}</span>
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>

            <h3 className="mt-16 text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
              {t("cta.otherOffers")}
            </h3>
            <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
              {others.map((k) => (
                <li key={k}>
                  <Link
                    href={GROUP_PAGES[k].href}
                    className="group flex items-center justify-between gap-4 border-b border-mist py-4"
                  >
                    <FlipText className="font-serif text-lg leading-tight">
                      {t(`pages.${k}.navLabel`)}
                    </FlipText>
                    <span className="text-base text-forest transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-20 flex flex-col items-center border-t border-mist pt-16 text-center lg:mt-28 lg:pt-24">
            <p className="max-w-prose font-serif text-xl italic leading-relaxed text-ink/80 lg:text-2xl">
              {t(`pages.${page}.closing`)}
            </p>
            <BackToTop label={t("backToTop")} />
          </div>
        </div>
      </div>
    </article>
  );
}

function MealRow({
  label,
  note,
  price,
  perPerson,
}: {
  label: string;
  note: string;
  price: string;
  perPerson: string;
}) {
  return (
    <li className="flex items-baseline justify-between gap-6 border-t border-mist py-5 first:border-t-0">
      <span>
        <span className="block font-serif text-lg leading-snug">{label}</span>
        <span className="mt-1 block text-sm leading-relaxed text-ink/60">{note}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-serif text-xl text-forest tabular-nums lg:text-2xl">
          {price}
        </span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-ink/50">
          {perPerson}
        </span>
      </span>
    </li>
  );
}

// ---- Route helpers shared by the five app/[locale]/<offer>/page.tsx files.

type RouteProps = { params: Promise<{ locale: string }> };

export function groupMetadata(page: GroupKey) {
  return async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const path = GROUP_PAGES[page].href;
    const url = localeUrl(locale, path);
    const title = t(`groups.pages.${page}.seoTitle`);
    const description = t(`groups.pages.${page}.seoDescription`);
    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: {
          ...buildLanguages(path),
          "x-default": localeUrl(routing.defaultLocale, path),
        },
      },
      openGraph: {
        type: "website",
        url,
        siteName: t("seo.siteName"),
        locale: ogLocale(locale),
        alternateLocale: ogAlternateLocales(locale),
        title,
        description,
      },
      twitter: { card: "summary_large_image", title, description },
    };
  };
}

export function groupStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GroupRoute({
  page,
  params,
}: RouteProps & { page: GroupKey }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return (
    <main id="top">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: t("seo.siteName"), path: "" },
          { name: t("nav.info"), path: "/informations" },
          { name: t(`groups.pages.${page}.navLabel`), path: GROUP_PAGES[page].href },
        ]}
      />
      <GroupOffer page={page} />
    </main>
  );
}
