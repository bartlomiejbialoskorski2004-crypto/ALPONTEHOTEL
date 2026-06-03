import { getTranslations } from "next-intl/server";
import InformationsToc, { BackToTop } from "./InformationsToc";

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

const sectionTitle =
  "font-serif text-3xl leading-tight lg:text-4xl";
const sectionNum =
  "text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums";
const sectionBody =
  "mt-8 max-w-prose text-base leading-relaxed text-ink/80";

export default async function Informations() {
  const t = await getTranslations("info");

  return (
    <article className="bg-paper text-ink">
      <section className="relative flex min-h-[60svh] w-full items-end overflow-hidden bg-forest text-paper">
        <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-40 lg:px-10 lg:pb-16 lg:pt-48">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/70">
            / {t("eyebrow")}
          </span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] lg:text-6xl">
            {t("title")}
          </h1>
          <div className="mt-10 h-px w-16 bg-paper/30" />
          <p className="mt-6 text-sm tracking-wide text-paper/80 lg:text-base">
            {t("address")}
          </p>

          {/* Quick-reference facts. */}
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-paper/15 pt-8 sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.key}>
                <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-paper/55">
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

      <div className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-16 lg:px-10 lg:py-24">
        <aside className="mb-12 lg:mb-0">
          <InformationsToc />
        </aside>

        <div className="min-w-0">
          <section id="hours" className="scroll-mt-24 lg:scroll-mt-28">
            <span className={sectionNum}>/ 01</span>
            <h2 className={`mt-5 ${sectionTitle}`}>{t("hours.title")}</h2>
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
              <section
                id="safety"
                className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
              >
                <span className={sectionNum}>/ 02</span>
                <h2 className={`mt-5 ${sectionTitle}`}>{heading}</h2>
                <div className="mt-10 max-w-prose space-y-7 text-base leading-relaxed text-ink/80">
                  {introRest && <p>{introRest}</p>}
                  <p>{t("safety.smokingBan")}</p>
                  <p>{t("safety.acknowledgment")}</p>
                </div>
                <aside className="mt-12 max-w-prose border border-mist bg-paper p-7 lg:p-9">
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
                    ! {t("nav.safety")}
                  </span>
                  <p className="mt-4 font-serif text-lg leading-snug text-ink lg:text-xl">
                    {t("safety.pleaseNote")}
                  </p>
                </aside>
              </section>
            );
          })()}

          <section
            id="pool"
            className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
          >
            <span className={sectionNum}>/ 03</span>
            <h2 className={`mt-5 ${sectionTitle}`}>{t("pool.title")}</h2>
            <p className={sectionBody}>{t("pool.body")}</p>
          </section>

          <section
            id="parking"
            className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
          >
            <span className={sectionNum}>/ 04</span>
            <h2 className={`mt-5 ${sectionTitle}`}>{t("parking.title")}</h2>
            <p className={sectionBody}>{t("parking.body")}</p>
          </section>

          <section
            id="tax"
            className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
          >
            <span className={sectionNum}>/ 05</span>
            <h2 className={`mt-5 ${sectionTitle}`}>{t("tax.title")}</h2>
            <p className={sectionBody}>{t("tax.body")}</p>
          </section>

          <section
            id="services"
            className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
          >
            <span className={sectionNum}>/ 06</span>
            <h2 className={`mt-5 ${sectionTitle}`}>{t("services.title")}</h2>
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

          <section
            id="tv"
            className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
          >
            <span className={sectionNum}>/ 07</span>
            <h2 className={`mt-5 ${sectionTitle}`}>{t("tv.title")}</h2>
            <p className={sectionBody}>{t("tv.body")}</p>
          </section>

          <section
            id="transport"
            className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
          >
            <span className={sectionNum}>/ 08</span>
            <h2 className={`mt-5 ${sectionTitle}`}>{t("transport.title")}</h2>
            <p className={sectionBody}>{t("transport.body")}</p>
          </section>

          <section
            id="requests"
            className="mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
          >
            <span className={sectionNum}>/ 09</span>
            <h2 className={`mt-5 ${sectionTitle}`}>
              {t("otherRequests.title")}
            </h2>
            <p className={sectionBody}>{t("otherRequests.body")}</p>
          </section>

          <div className="mt-24 flex flex-col items-center border-t border-mist pt-16 text-center lg:mt-28 lg:pt-20">
            <p className="font-serif text-xl italic leading-relaxed text-ink/80 lg:text-2xl">
              {t("signoff")}
            </p>
            <BackToTop />
          </div>
        </div>
      </div>
    </article>
  );
}
