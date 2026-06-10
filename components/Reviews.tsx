"use client";

import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { REVIEWS, RATINGS, type Review, type ReviewSource } from "./reviewsData";

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

function ReviewCard({ r }: { r: Review }) {
  return (
    <li className="flex h-44 w-[17rem] shrink-0 flex-col border border-mist bg-paper p-5">
      <p className="text-[13px] leading-relaxed text-ink/80 line-clamp-3">
        {r.quote}
      </p>
      <div className="mt-auto flex items-center gap-2.5 border-t border-mist pt-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist font-serif text-sm text-forest">
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

  const rowA = REVIEWS.filter((_, i) => i % 2 === 0);
  const rowB = REVIEWS.filter((_, i) => i % 2 === 1);

  const badge =
    "group inline-flex items-center gap-4 border border-mist bg-paper px-5 py-3.5 transition-colors hover:border-forest";

  return (
    <section
      aria-labelledby="reviews-title"
      className="bg-paper py-20 text-ink lg:py-28"
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
            className="mt-5 font-serif text-3xl leading-[1.05] lg:text-5xl"
          >
            {t("title")}
          </h2>
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
            <span className="flex items-baseline gap-1 font-serif text-2xl leading-none">
              {RATINGS.booking.score}
              <span className="font-sans text-xs text-ink/45">
                /{RATINGS.booking.scale}
              </span>
            </span>
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
            <span className="flex items-baseline gap-1 font-serif text-2xl leading-none">
              {RATINGS.tripadvisor.score}
              <span className="font-sans text-xs text-ink/45">
                /{RATINGS.tripadvisor.scale}
              </span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-ink/45">
              {RATINGS.tripadvisor.count} {t("reviewsLabel")}
            </span>
          </a>
        </motion.div>

        {/* Infinite marquees — two rows, opposite directions */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] lg:mt-14"
        >
          <ul className="flex w-max gap-4 animate-[marquee-left_42s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation:none]">
            {[...rowA, ...rowA].map((r, i) => (
              <ReviewCard key={`a-${i}`} r={r} />
            ))}
          </ul>
          <ul className="flex w-max gap-4 animate-[marquee-right_50s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation:none]">
            {[...rowB, ...rowB].map((r, i) => (
              <ReviewCard key={`b-${i}`} r={r} />
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
