import { getTranslations } from "next-intl/server";
import Image from "next/image";
import PageToc, { BackToTop, type TocSection } from "./PageToc";

type LinkItem = { label: string; url: string };
type Item = { heading?: string; text: string; links?: LinkItem[] };
type Section = { title: string; items: Item[] };

// Order of the section blocks (ids double as anchor targets + TOC keys).
const SECTION_ORDER = [
  "ticket",
  "cademario",
  "lugano",
  "mountains",
  "nature",
  "luino",
  "villages",
  "shopping",
  "asconaLocarno",
  "italy",
  "adventure",
] as const;

function LinkRow({ links }: { links?: LinkItem[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-forest transition-opacity hover:opacity-60"
        >
          {l.label}
          <span aria-hidden className="text-[13px]">
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}

export default async function Attractions() {
  const t = await getTranslations("attractions");
  const sections = t.raw("sections") as Record<string, Section>;

  const tocSections: TocSection[] = SECTION_ORDER.map((id, i) => ({
    id,
    num: String(i + 1).padStart(2, "0"),
    label: t(`nav.${id}`),
  }));

  return (
    <article className="bg-paper text-ink">
      {/* Hero band — scenic photo under a forest wash. */}
      <section className="relative flex min-h-[68svh] w-full items-end overflow-hidden bg-forest text-paper">
        <Image
          src="/mega/Lakelugano.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/55 to-forest/85" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-40 lg:px-10 lg:pb-20 lg:pt-48">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/75">
            / {t("eyebrow")}
          </span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-paper/85 lg:text-base">
            {t("intro")}
          </p>
          <a
            href={t("videoUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-paper/90 transition-opacity hover:opacity-70"
          >
            <span aria-hidden>▶</span>
            {t("videoLabel")}
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-16 lg:px-10 lg:py-24">
        <aside>
          <PageToc sections={tocSections} tocTitle={t("tocTitle")} />
        </aside>

        <div className="min-w-0">
          {SECTION_ORDER.map((id, i) => {
            const section = sections[id];
            if (!section) return null;
            const first = i === 0;
            return (
              <section
                key={id}
                id={id}
                className={
                  first
                    ? "scroll-mt-24 lg:scroll-mt-28"
                    : "mt-24 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-20"
                }
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-5 font-serif text-3xl leading-tight lg:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-8 space-y-8">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="max-w-prose">
                      {item.heading && (
                        <h3 className="font-serif text-lg leading-snug text-ink lg:text-xl">
                          {item.heading}
                        </h3>
                      )}
                      <p
                        className={`text-base leading-relaxed text-ink/80 ${
                          item.heading ? "mt-2" : ""
                        }`}
                      >
                        {item.text}
                      </p>
                      <LinkRow links={item.links} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <div className="mt-24 flex flex-col items-center border-t border-mist pt-16 text-center lg:mt-28 lg:pt-20">
            <p className="max-w-prose font-serif text-xl italic leading-relaxed text-ink/80 lg:text-2xl">
              {t("closing")}
            </p>
            <BackToTop label={t("backToTop")} />
          </div>
        </div>
      </div>
    </article>
  );
}
