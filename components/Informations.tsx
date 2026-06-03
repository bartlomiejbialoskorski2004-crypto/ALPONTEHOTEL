import { getTranslations } from "next-intl/server";

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

export default async function Informations() {
  const t = await getTranslations("info");

  return (
    <article className="bg-paper text-ink">
      <section className="relative flex min-h-[60svh] w-full items-end overflow-hidden bg-forest text-paper">
        <div className="mx-auto w-full max-w-5xl px-6 pb-16 pt-40 lg:px-10 lg:pb-24 lg:pt-48">
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
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-32">
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
          / 01
        </span>
        <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
          {t("hours.title")}
        </h2>
        <dl className="mt-12 space-y-4 text-base leading-relaxed text-ink/80 tabular-nums">
          <p>{t("hours.openYearRound")}</p>
          <p>{t("hours.checkInOut")}</p>
          <p>{t("hours.receptionHours")}</p>
          <p>{t("hours.phone")}</p>
          <p>{t("hours.emailOutsideHours")}</p>
          <p>{t("hours.checkInDetails")}</p>
          <p>{t("hours.checkOutDetails")}</p>
          <p>{t("hours.breakfast")}</p>
          <p>{t("hours.pool")}</p>
          <p>{t("hours.quietHours")}</p>
        </dl>
      </section>

      {(() => {
        const intro = t("safety.intro");
        const firstStop = intro.indexOf(".");
        const heading = firstStop > 0 ? intro.slice(0, firstStop + 1) : intro;
        const introRest =
          firstStop > 0 ? intro.slice(firstStop + 1).trim() : "";
        return (
          <section className="border-t border-mist">
            <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-32">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
                / 02
              </span>
              <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
                {heading}
              </h2>
              <div className="mt-12 space-y-8 text-base leading-relaxed text-ink/80">
                {introRest && <p>{introRest}</p>}
                <p>{t("safety.smokingBan")}</p>
                <p>{t("safety.acknowledgment")}</p>
              </div>
              <aside className="mt-14 border border-mist bg-paper p-8 lg:p-10">
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
                  ! Note
                </span>
                <p className="mt-4 font-serif text-lg leading-snug text-ink lg:text-xl">
                  {t("safety.pleaseNote")}
                </p>
              </aside>
            </div>
          </section>
        );
      })()}

      <section className="border-t border-mist">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-28">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
            / 03
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("pool.title")}
          </h2>
          <p className="mt-8 max-w-prose text-base leading-relaxed text-ink/80">
            {t("pool.body")}
          </p>
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-28">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
            / 04
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("parking.title")}
          </h2>
          <p className="mt-8 max-w-prose text-base leading-relaxed text-ink/80">
            {t("parking.body")}
          </p>
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-28">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
            / 05
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("tax.title")}
          </h2>
          <p className="mt-8 max-w-prose text-base leading-relaxed text-ink/80">
            {t("tax.body")}
          </p>
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-10 lg:py-32">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
            / 06
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("services.title")}
          </h2>
          <ol className="mt-14">
            {SERVICE_KEYS.map((k) => {
              const isWarning = k === "11";
              return (
                <li
                  key={k}
                  className={`grid grid-cols-[3rem_1fr] items-baseline gap-x-6 border-t border-mist py-6 lg:gap-x-10 lg:py-7 ${
                    isWarning ? "border-l-2 border-l-forest pl-5 lg:pl-7" : ""
                  }`}
                >
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
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
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-28">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
            / 07
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("tv.title")}
          </h2>
          <p className="mt-8 max-w-prose text-base leading-relaxed text-ink/80">
            {t("tv.body")}
          </p>
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-28">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
            / 08
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("transport.title")}
          </h2>
          <p className="mt-8 max-w-prose text-base leading-relaxed text-ink/80">
            {t("transport.body")}
          </p>
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10 lg:py-28">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
            / 09
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
            {t("otherRequests.title")}
          </h2>
          <p className="mt-8 max-w-prose text-base leading-relaxed text-ink/80">
            {t("otherRequests.body")}
          </p>
        </div>
      </section>

      <section className="border-t border-mist">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-10 lg:py-32">
          <div className="h-px w-16 bg-mist" />
          <p className="mt-10 font-serif text-xl italic leading-relaxed text-ink/80 lg:text-2xl">
            {t("signoff")}
          </p>
        </div>
      </section>
    </article>
  );
}
