"use client";

import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { REVIEWS, RATINGS, type Review, type ReviewSource } from "./reviewsData";
import Sprig from "./Sprig";

type CardData = Review & { quote: string; meta: string };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Small Tripadvisor "two eyes" owl mark.
function OwlMark() {
  return (
    <svg width="30" height="16" viewBox="0 0 30 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.4" stroke="#00aa6c" strokeWidth="2" />
      <circle cx="8" cy="8" r="2.2" fill="#00aa6c" />
      <circle cx="22" cy="8" r="6.4" stroke="#00aa6c" strokeWidth="2" />
      <circle cx="22" cy="8" r="2.2" fill="#00aa6c" />
    </svg>
  );
}

// Subtle 5-star mark; the forest row is clipped to the score fraction so the
// rating reads visually (e.g. 8.8/10 → ~88% filled).
const STAR_PATH =
  "M12 2l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.77l-5.88 3.09 1.12-6.55L2.48 8.92l6.58-.96L12 2z";

function Stars({ fraction }: { fraction: number }) {
  const pct = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
  const row = (cls: string) => (
    <span className={`flex flex-nowrap gap-0.5 ${cls}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5 shrink-0"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" aria-hidden>
      {row("text-gold/25")}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: pct }}
      >
        {row("whitespace-nowrap text-gold")}
      </span>
    </span>
  );
}

function SourceMark({ source }: { source: ReviewSource }) {
  if (source === "booking") {
    return (
      <span className="text-[10px] font-bold tracking-tight text-[#003b95]">
        Booking.com
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-tight text-ink/70">
      <span className="h-1.5 w-1.5 rounded-full bg-[#00aa6c]" />
      Tripadvisor
    </span>
  );
}

function ReviewCard({ r }: { r: CardData }) {
  return (
    <li className="flex h-36 w-[14rem] shrink-0 flex-col border border-mist bg-paper p-4 sm:h-40 sm:w-[16rem] sm:p-5">
      <p className="text-xs leading-relaxed text-ink/80 line-clamp-3 sm:text-[13px]">
        {r.quote}
      </p>
      <div className="mt-auto flex items-center gap-2.5 border-t border-mist pt-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist font-serif text-sm text-forest sm:h-9 sm:w-9">
          {r.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-ink">{r.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink/45">
            {r.meta && <span>{r.meta}</span>}
            {r.meta && <span className="text-ink/20">·</span>}
            <SourceMark source={r.source} />
          </p>
        </div>
      </div>
    </li>
  );
}

export default function Reviews() {
  const t = useTranslations("reviews");

  const cards: CardData[] = REVIEWS.map((r) => ({
    ...r,
    quote: t(`items.${r.id}.quote`),
    meta: t(`items.${r.id}.meta`),
  }));
  const rowA = cards.filter((_, i) => i % 2 === 0);
  const rowB = cards.filter((_, i) => i % 2 === 1);

  const badge =
    "group inline-flex items-center gap-3 border border-mist bg-paper px-4 py-3 transition-colors hover:border-forest sm:gap-4 sm:px-5 sm:py-3.5";

  const bookingFraction =
    Number(RATINGS.booking.score) / Number(RATINGS.booking.scale);
  const tripadvisorFraction =
    Number(RATINGS.tripadvisor.score) / Number(RATINGS.tripadvisor.scale);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="bg-paper py-14 text-ink lg:py-20"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Heading */}
        <motion.div variants={fadeUp} className="px-6 text-center lg:px-10">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
            {t("eyebrow")}
          </span>
          <h2
            id="reviews-title"
            className="mt-5 font-serif text-2xl leading-[1.05] sm:text-3xl lg:text-5xl"
          >
            {t("title")}
          </h2>
          <Sprig className="mx-auto mt-5 w-16" />
        </motion.div>

        {/* Rating badges */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 px-6 lg:px-10"
        >
          <a
            href={RATINGS.booking.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Booking.com ${RATINGS.booking.score}/${RATINGS.booking.scale}`}
            className={badge}
          >
            <span className="text-base font-bold tracking-tight text-[#003b95]">
              Booking.com
            </span>
            <span className="h-7 w-px bg-mist" />
            <span className="flex items-baseline gap-1 font-serif text-xl leading-none sm:text-2xl">
              {RATINGS.booking.score}
              <span className="font-sans text-xs text-ink/45">
                /{RATINGS.booking.scale}
              </span>
            </span>
            <Stars fraction={bookingFraction} />
            <span className="text-[11px] uppercase tracking-[0.15em] text-ink/45">
              {RATINGS.booking.count} {t("reviewsLabel")}
            </span>
          </a>

          <a
            href={RATINGS.tripadvisor.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tripadvisor ${RATINGS.tripadvisor.score}/${RATINGS.tripadvisor.scale}`}
            className={badge}
          >
            <span className="inline-flex items-center gap-2">
              <OwlMark />
              <span className="text-base font-semibold tracking-tight text-ink">
                Tripadvisor
              </span>
            </span>
            <span className="h-7 w-px bg-mist" />
            <span className="flex items-baseline gap-1 font-serif text-xl leading-none sm:text-2xl">
              {RATINGS.tripadvisor.score}
              <span className="font-sans text-xs text-ink/45">
                /{RATINGS.tripadvisor.scale}
              </span>
            </span>
            <Stars fraction={tripadvisorFraction} />
            <span className="text-[11px] uppercase tracking-[0.15em] text-ink/45">
              {RATINGS.tripadvisor.count} {t("reviewsLabel")}
            </span>
          </a>
        </motion.div>

        {/* Infinite marquees — two rows, opposite directions */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-10 flex max-w-5xl flex-col gap-3.5 overflow-hidden px-6 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] lg:px-10"
        >
          <ul className="flex w-max gap-3.5 animate-[marquee-left_42s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation:none]">
            {[...rowA, ...rowA].map((r, i) => (
              <ReviewCard key={`a-${i}`} r={r} />
            ))}
          </ul>
          <ul className="flex w-max gap-3.5 animate-[marquee-right_50s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation:none]">
            {[...rowB, ...rowB].map((r, i) => (
              <ReviewCard key={`b-${i}`} r={r} />
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
