import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JumpLink } from "../PageToc";
import FlipText from "../FlipText";
import { EMAIL, EMAIL_HREF, PHONE, PHONE_HREF } from "../contact-info";
import {
  GROUP_CAPACITY,
  GROUP_HALF_BOARD,
  GROUP_KEYS,
  GROUP_MEALS,
  GROUP_PAGES,
  GROUP_ROOM_TYPES,
  type GroupKey,
} from "../groupPages";
import {
  BedDouble,
  Hotel,
  Languages,
  Ticket,
  Tv,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import StripScroll from "./StripScroll";
import StickyUnderHeader from "./StickyUnderHeader";
import ParallaxImage from "../ParallaxImage";
import InfoNote from "../InfoNote";
import { GROUP_ICONS } from "../groupIcons";

// Building blocks shared by the five group-offer pages. Every page uses the
// same frame (switcher, hotel-at-a-glance, enquiry) around its own hero and
// signature module, so the pages read as one family but never as clones.

export const container = "mx-auto w-full max-w-6xl px-6 lg:px-10";
export const eyebrow = "text-[11px] font-medium uppercase tracking-[0.3em]";

// Every offer hero has exactly this height: the first screen (100svh) minus
// the offer switcher (h-14), so the switcher's bottom edge lands where the
// homepage hero ends - on all five pages. 38rem floor for very short windows.
export const heroHeight = "h-[max(calc(100svh-3.5rem),38rem)]";

type Tone = "light" | "dark";

// Quiet in-hero link that glides down to the enquiry block.
export async function HeroCta({
  tone = "light",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  const t = await getTranslations("groups");
  const colors =
    tone === "light"
      ? "border-paper/40 text-paper hover:bg-paper hover:text-forest"
      : "border-forest/30 text-forest hover:bg-forest hover:text-paper";
  return (
    <div className={className}>
      <JumpLink
        target="#enquiry"
        className={`group inline-flex items-center gap-2 border px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${colors}`}
      >
        <FlipText>{t("enquiryCta")}</FlipText>
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </JumpLink>
    </div>
  );
}

// Soft left-to-right scrim behind hero text on photo heroes that are not
// darkened (offer pages, "At the hotel").
export const HERO_TEXT_SCRIM =
  "absolute inset-0 bg-gradient-to-r from-ink/50 via-ink/15 to-transparent lg:via-ink/10";

// Only the company-events page is the dark, "evening" one; gold accents are
// reserved for it and for celebrations/weddings.
const DARK_HERO: GroupKey[] = ["companyEvents"];
const GOLD_PAGES: GroupKey[] = ["companyEvents", "celebrations"];

// The one hero every offer page uses: full-bleed photo, eyebrow, title, intro
// and enquiry link bottom-left. Company events keep the heavy ink wash; the
// others show the photo as is, with only a soft top/bottom gradient so the
// header and the white text stay legible.
export async function OfferHero({ page }: { page: GroupKey }) {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.${page}.${key}`);
  const dark = DARK_HERO.includes(page);
  return (
    <section
      className={`relative flex ${heroHeight} w-full items-end overflow-hidden bg-ink text-paper`}
    >
      <ParallaxImage
        src={GROUP_PAGES[page].image}
        alt={p("imageAlt")}
        priority
        className={`object-cover object-center ${dark ? "opacity-45" : ""}`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          dark
            ? "from-ink/75 via-ink/35 to-ink"
            : "from-ink/35 via-transparent to-ink/70"
        }`}
      />
      {/* Light heroes: a soft scrim behind the text column only, so the
          headline reads clearly without darkening the whole photo. */}
      {!dark && <div className={HERO_TEXT_SCRIM} />}
      <div className={`relative ${container} pb-14 pt-28 lg:pb-16`}>
        <span
          className={`${eyebrow} ${GOLD_PAGES.includes(page) ? "text-gold" : "text-paper/80"}`}
        >
          {t("eyebrow")}
        </span>
        <h1 className="mt-6 max-w-4xl text-balance break-words font-serif text-[2rem] leading-[1.04] hyphens-auto sm:text-4xl lg:text-7xl">
          {p("title")}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/75 lg:text-base">
          {p("intro")}
        </p>
        <HeroCta className="mt-10" />
      </div>
    </section>
  );
}

// Arrow text link to another page.
export function TextLink({
  href,
  children,
  tone = "light",
}: {
  href: string;
  children: string;
  tone?: Tone;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.18em] ${
        tone === "light" ? "text-forest" : "text-paper"
      }`}
    >
      <FlipText>{children}</FlipText>
      <span
        aria-hidden
        className={`transition-transform duration-300 group-hover:translate-x-1 ${
          tone === "light" ? "" : "text-gold"
        }`}
      >
        →
      </span>
    </Link>
  );
}

// Soft fade at both ends of the phone pill strip (no hard cut-off).
const PILL_FADE =
  "[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]";

// Slim strip under each hero listing all five offers, current one marked -
// the "you are here" anchor across the family.
export async function OfferSwitcher({
  current,
  tone = "light",
}: {
  current: GroupKey;
  tone?: Tone;
}) {
  const t = await getTranslations("groups");
  const dark = tone === "dark";
  return (
    <StickyUnderHeader>
    <nav
      aria-label={t("switcherLabel")}
      className={`h-14 ${
        dark
          ? "border-b border-paper/10 bg-ink/90 backdrop-blur"
          : "border-b border-mist bg-paper/90 backdrop-blur"
      }`}
    >
      {/* Phones: scrollable pills (icon + label, current one filled) with
          soft-faded edges instead of a hard cut, current pill centred. */}
      <StripScroll className={`flex h-full snap-x snap-mandatory items-center gap-2 overflow-x-auto px-6 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden ${PILL_FADE}`}>
        {GROUP_KEYS.map((key) => {
          const active = key === current;
          const Icon = GROUP_ICONS[key];
          const pill = active
            ? dark
              ? "border-gold bg-gold text-ink"
              : "border-forest bg-forest text-paper"
            : dark
              ? "border-paper/20 text-paper/80"
              : "border-ink/15 bg-paper text-ink/75";
          return (
            <li key={key} className="shrink-0 snap-center">
              <Link
                href={GROUP_PAGES[key].href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${pill}`}
              >
                <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                {t(`pages.${key}.navLabel`)}
              </Link>
            </li>
          );
        })}
      </StripScroll>

      {/* Desktop: the text strip; icon in the arrow's place. */}
      <div className={`${container} hidden h-full lg:block`}>
        <StripScroll className="flex h-full justify-between">
          {GROUP_KEYS.map((key) => {
            const active = key === current;
            const color = active
              ? dark
                ? "text-paper"
                : "text-forest"
              : dark
                ? "text-paper/45 hover:text-paper"
                : "text-ink/45 hover:text-ink";
            const Icon = GROUP_ICONS[key];
            return (
              <li key={key} className="h-full shrink-0">
                <Link
                  href={GROUP_PAGES[key].href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex h-full items-center whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${color}`}
                >
                  <FlipText>{t(`pages.${key}.navLabel`)}</FlipText>
                  {/* Offer icon in the arrow's place, right of the label
                      (absolute, so nothing shifts). Rolls with the label on
                      hover; always on for the current offer. */}
                  <span
                    aria-hidden
                    className={`absolute -right-5 transition-opacity duration-300 ${
                      dark ? "text-gold" : "text-forest"
                    } ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <FlipText>
                      <Icon className="block h-3.5 w-3.5" strokeWidth={1.25} />
                    </FlipText>
                  </span>
                  {active && (
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 bottom-0 h-px ${dark ? "bg-gold" : "bg-forest"}`}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </StripScroll>
      </div>
    </nav>
    </StickyUnderHeader>
  );
}

// Spec-sheet row: icon + label column, value column, hairline above.
function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 border-t border-mist py-7 md:grid-cols-[12rem_1fr] md:gap-10">
      <dt className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/50 md:items-start md:pt-1">
        <Icon aria-hidden className="h-4 w-4 shrink-0 text-forest" strokeWidth={1.25} />
        {label}
      </dt>
      <dd className="text-base leading-relaxed text-ink/85">{children}</dd>
    </div>
  );
}

// One spec sheet with every shared hotel fact, identical on all pages.
export async function HotelAtAGlance() {
  const t = await getTranslations("groups.glance");
  const tInfo = await getTranslations("info");
  const list = (key: string) => t.raw(key) as string[];

  return (
    <section id="glance" className="bg-paper py-20 text-ink lg:py-28">
      <div className={container}>
        <div className="max-w-2xl">
          <span className={`${eyebrow} text-forest`}>{t("eyebrow")}</span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70">
            {t("location")}
          </p>
        </div>

        <dl className="mt-12 border-b border-mist">
          <Row icon={Users} label={t("labels.capacity")}>
            <span className="flex flex-wrap gap-x-10 gap-y-3">
              {GROUP_CAPACITY.map((c) => (
                <span key={c.key} className="inline-flex items-baseline gap-2">
                  <span className="font-serif text-3xl leading-none text-forest tabular-nums">
                    {c.value}
                  </span>
                  <span className="text-sm text-ink/70">
                    {t(`capacity.${c.key}`)}
                  </span>
                </span>
              ))}
            </span>
          </Row>

          <Row icon={BedDouble} label={t("labels.rooms")}>
            <ul className="space-y-1.5">
              {GROUP_ROOM_TYPES.map((r) => (
                <li key={r.key} className="flex gap-4">
                  <span className="w-6 shrink-0 font-serif text-forest tabular-nums">
                    {r.count}
                  </span>
                  <span>{t(`roomTypes.${r.key}`)}</span>
                </li>
              ))}
            </ul>
            <InfoNote className="mt-4 text-ink/60">
              {t("staffRooms")}
            </InfoNote>
          </Row>

          <Row icon={Tv} label={t("labels.inRooms")}>
            <ul className="space-y-1.5">
              {list("inRooms").map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Row>

          <Row icon={UtensilsCrossed} label={t("labels.meals")}>
            {/* Restaurant-menu style: name, dotted leader, price - kept
                deliberately unlike the big serif capacity figures. */}
            <ul className="max-w-md">
              {[...GROUP_MEALS, GROUP_HALF_BOARD].map((m) => {
                const alt = m.key === GROUP_HALF_BOARD.key;
                return (
                  <li
                    key={m.key}
                    className={`flex items-baseline gap-3 py-1 ${alt ? "mt-2 border-t border-mist pt-3" : ""}`}
                  >
                    <span className="min-w-0">
                      {alt && (
                        <em className="mr-1.5 font-serif italic text-ink/45">
                          {t("meals.or")}
                        </em>
                      )}
                      {t(`meals.${m.key}`)}
                    </span>
                    <span
                      aria-hidden
                      className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-ink/25"
                    />
                    <span className="shrink-0 text-sm font-medium tracking-wide text-ink tabular-nums">
                      CHF {m.price}
                    </span>
                  </li>
                );
              })}
            </ul>
            <InfoNote className="mt-4 text-ink/55">{t("meals.unit")}</InfoNote>
          </Row>

          <Row icon={Hotel} label={t("labels.onSite")}>
            <ul className="space-y-1.5">
              {list("onSite").map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <InfoNote className="mt-4 text-ink/60">
              {tInfo("pool.closure")}
            </InfoNote>
          </Row>

          <Row icon={Ticket} label={t("labels.included")}>
            {t("included")}
          </Row>
          <Row icon={Languages} label={t("labels.service")}>
            {t("service")}
          </Row>
        </dl>
      </div>
    </section>
  );
}

// Closing band: e-mail with a prefilled subject + phone. Same on every page.
export async function Enquiry({ page }: { page: GroupKey }) {
  const t = await getTranslations("groups");
  const mailHref = `${EMAIL_HREF}?subject=${encodeURIComponent(
    t(`pages.${page}.mailSubject`),
  )}`;
  const button =
    "group inline-flex items-center justify-between gap-8 px-6 py-4 transition-colors sm:justify-start";

  return (
    <section id="enquiry" className="scroll-mt-24 bg-forest py-20 text-paper lg:py-24">
      <div className={`${container} grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16`}>
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl leading-tight lg:text-4xl">
            {t("enquiry.title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/75">
            {t("enquiry.body")}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={mailHref} className={`${button} bg-paper text-forest hover:bg-paper/90`}>
            <span className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-forest/60">
                {t("enquiry.email")}
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
            className={`${button} border border-paper/30 hover:border-paper`}
          >
            <span className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-paper/55">
                {t("enquiry.phone")}
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
      </div>
    </section>
  );
}
