import { getTranslations } from "next-intl/server";
import PageToc, { BackToTop, type TocSection } from "./PageToc";
import ParallaxImage from "./ParallaxImage";
import EditorialSection, { type EditorialItem } from "./EditorialSection";

type Section = { title: string; items: EditorialItem[] };

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

// Real repo photos mapped to matching sections. Sections without a match
// render as text-only blocks for editorial rhythm. Drop user-supplied
// extras into /public/attractions and swap the path here.
// Only photos we are confident actually depict the place are used.
const SECTION_IMAGES: Partial<Record<(typeof SECTION_ORDER)[number], string>> = {
  lugano: "/mega/Oldtown.jpg",
  mountains: "/mega/sansalvatore.jpg",
};

export default async function Attractions() {
  const t = await getTranslations("attractions");
  const sections = t.raw("sections") as Record<string, Section>;

  const tocSections: TocSection[] = SECTION_ORDER.map((id, i) => ({
    id,
    num: String(i + 1).padStart(2, "0"),
    label: t(`nav.${id}`),
  }));

  // Pull-quote: the Mountains "free with your Ticino Ticket" line, placed
  // as a breather band mid-page.
  const quote = sections.mountains?.items?.[0]?.text ?? "";

  return (
    <article className="bg-paper text-ink">
      {/* Hero band — scenic photo under a forest wash. */}
      <section className="relative flex min-h-[72svh] w-full items-end overflow-hidden bg-forest text-paper">
        <ParallaxImage src="/mega/Lakelugano.jpg" alt={t("lakeAlt")} priority />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/65 via-forest/45 to-forest/85" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-40 lg:px-10 lg:pb-24 lg:pt-48">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-paper/75">
            {t("eyebrow")}
          </span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.04] lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-paper/85 lg:text-base">
            {t("intro")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-16 lg:px-10 lg:py-20">
        <aside>
          <PageToc sections={tocSections} tocTitle={t("tocTitle")} />
        </aside>

        <div className="min-w-0 pb-28 lg:pb-0">
          {SECTION_ORDER.map((id, i) => {
            const section = sections[id];
            if (!section) return null;
            const num = String(i + 1).padStart(2, "0");
            const image = SECTION_IMAGES[id];
            const withImage = SECTION_ORDER.filter((s) => SECTION_IMAGES[s]);
            const flip = withImage.indexOf(id) % 2 === 1;

            const block = (
              <EditorialSection
                key={id}
                id={id}
                num={num}
                title={section.title}
                items={section.items}
                image={image}
                flip={flip}
                first={i === 0}
              />
            );

            // Drop a pull-quote band right after the Lugano section.
            if (id === "lugano" && quote) {
              return (
                <div key={id}>
                  {block}
                  <figure className="mt-20 border-y border-mist py-14 text-center lg:mt-28 lg:py-20">
                    <blockquote className="mx-auto max-w-3xl font-serif text-2xl italic leading-snug text-forest lg:text-3xl">
                      “{quote}”
                    </blockquote>
                  </figure>
                </div>
              );
            }
            return block;
          })}

          <div className="mt-20 flex flex-col items-center border-t border-mist pt-16 text-center lg:mt-28 lg:pt-24">
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
