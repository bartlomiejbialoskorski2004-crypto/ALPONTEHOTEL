import { getTranslations } from "next-intl/server";
import Image from "next/image";
import PageToc, { BackToTop, type TocSection } from "./PageToc";

const SERVICE_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
] as const;

const HOURS_KEYS = [
  "openYearRound",
  "checkInOut",
  "receptionHours",
  "phone",
  "emailOutsideHours",
  "checkInDetails",
  "checkOutDetails",
  "breakfast",
  "pool",
  "quietHours",
] as const;

// Locale-independent quick facts surfaced in the hero strip.
const FACTS = [
  { key: "checkIn", value: "15:30" },
  { key: "checkOut", value: "10:00" },
  { key: "reception", value: "7:30–11:00 · 15:30–19:30" },
  { key: "phone", value: "+41 91 605 24 92" },
] as const;

// Section ids + TOC nav-label keys, in order.
const NAV_KEYS = [
  "hours",
  "safety",
  "pool",
  "parking",
  "tax",
  "services",
  "tv",
  "transport",
  "requests",
] as const;

const sectionBody = "mt-8 max-w-prose text-base leading-relaxed text-ink/80";

// Section heading with an oversized faded numeral behind it.
function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-2 select-none font-serif text-7xl leading-none text-forest/10 lg:-top-14 lg:text-8xl"
      >
        {num}
      </span>
      <span className="relative text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
        / {num}
      </span>
      <h2 className="relative mt-4 font-serif text-3xl leading-tight lg:text-4xl">
        {title}
      </h2>
    </div>
  );
}

const block = "mt-20 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-24";

export default async function Informations() {
  const t = await getTranslations("info");

  const tocSections: TocSection[] = NAV_KEYS.map((id, i) => ({
    id,
    num: String(i + 1).padStart(2, "0"),
    label: t(`nav.${id}`),
  }));

  return (
    <article className="bg-paper text-ink">
      {/* Hero band — hotel facade under a forest wash. */}
      <section className="relative flex min-h-[58svh] w-full items-end overflow-hidden bg-forest text-paper">
        <Image
          src="/gallery/5.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/55 to-forest/90" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-40 lg:px-10 lg:pb-16 lg:pt-48">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/75">
            / {t("eyebrow")}
          </span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] lg:text-6xl">
            {t("title")}
          </h1>
          <div className="mt-10 h-px w-16 bg-paper/30" />
          <p className="mt-6 text-sm tracking-wide text-paper/85 lg:text-base">
            {t("address")}
          </p>

          {/* Quick-reference facts. */}
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-paper/20 pt-8 sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.key}>
                <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-paper/60">
                  {t(`facts.${f.key}`)}
                </dt>
                <dd className="mt-2 font-serif text-base leading-tight tabular-nums lg:text-lg">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-16 lg:px-10 lg:py-20">
        <aside>
          <PageToc sections={tocSections} tocTitle={t("toc.title")} />
        </aside>

        <div className="min-w-0">
          <section id="hours" className="scroll-mt-24 lg:scroll-mt-28">
            <SectionHead num="01" title={t("hours.title")} />
            <div className="mt-10 divide-y divide-mist border-y border-mist">
              {HOURS_KEYS.map((k) => (
                <p
                  key={k}
                  className="py-4 text-base leading-relaxed text-ink/80 tabular-nums"
                >
                  {t(`hours.${k}`)}
                </p>
              ))}
            </div>
          </section>

          {(() => {
            const intro = t("safety.intro");
            const firstStop = intro.indexOf(".");
            const heading =
              firstStop > 0 ? intro.slice(0, firstStop + 1) : intro;
            const introRest =
              firstStop > 0 ? intro.slice(firstStop + 1).trim() : "";
            return (
              <section id="safety" className={block}>
                <SectionHead num="02" title={heading} />
                <div className="mt-10 max-w-prose space-y-7 text-base leading-relaxed text-ink/80">
                  {introRest && <p>{introRest}</p>}
                  <p>{t("safety.smokingBan")}</p>
                  <p>{t("safety.acknowledgment")}</p>
                </div>
                {/* Fire-safety notice as a pull-quote. */}
                <figure className="mt-12 border-l-2 border-forest pl-6 lg:pl-8">
                  <blockquote className="max-w-2xl font-serif text-lg italic leading-snug text-forest lg:text-2xl">
                    {t("safety.pleaseNote")}
                  </blockquote>
                </figure>
              </section>
            );
          })()}

          <section id="pool" className={block}>
            <SectionHead num="03" title={t("pool.title")} />
            <p className={sectionBody}>{t("pool.body")}</p>
          </section>

          <section id="parking" className={block}>
            <SectionHead num="04" title={t("parking.title")} />
            <p className={sectionBody}>{t("parking.body")}</p>
          </section>

          <section id="tax" className={block}>
            <SectionHead num="05" title={t("tax.title")} />
            <p className={sectionBody}>{t("tax.body")}</p>
          </section>

          <section id="services" className={block}>
            <SectionHead num="06" title={t("services.title")} />
            <ol className="mt-10">
              {SERVICE_KEYS.map((k) => {
                const isWarning = k === "11";
                return (
                  <li
                    key={k}
                    className={`grid grid-cols-[2.5rem_1fr] items-baseline gap-x-5 border-t border-mist py-5 lg:gap-x-8 lg:py-6 ${
                      isWarning ? "border-l-2 border-l-forest pl-4 lg:pl-6" : ""
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-forest tabular-nums">
                      {k.padStart(2, "0")}
                    </span>
                    <p
                      className={`text-base leading-relaxed ${
                        isWarning ? "text-ink" : "text-ink/85"
                      }`}
                    >
                      {t(`services.items.${k}`)}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section id="tv" className={block}>
            <SectionHead num="07" title={t("tv.title")} />
            <p className={sectionBody}>{t("tv.body")}</p>
          </section>

          <section id="transport" className={block}>
            <SectionHead num="08" title={t("transport.title")} />
            <p className={sectionBody}>{t("transport.body")}</p>
          </section>

          <section id="requests" className={block}>
            <SectionHead num="09" title={t("otherRequests.title")} />
            <p className={sectionBody}>{t("otherRequests.body")}</p>
          </section>

          <div className="mt-20 flex flex-col items-center border-t border-mist pt-16 text-center lg:mt-28 lg:pt-24">
            <p className="font-serif text-xl italic leading-relaxed text-ink/80 lg:text-2xl">
              {t("signoff")}
            </p>
            <BackToTop label={t("backToTop")} />
          </div>
        </div>
      </div>
    </article>
  );
}
