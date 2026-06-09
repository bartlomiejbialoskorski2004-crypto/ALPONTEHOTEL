"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { REVIEWS, RATINGS, type ReviewSource } from "./reviewsData";

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
      <span className="text-[11px] font-bold tracking-tight text-[#003b95]">
        Booking.com
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-tight text-ink/70">
      <span className="h-2 w-2 rounded-full bg-[#00aa6c]" />
      Tripadvisor
    </span>
  );
}

export default function Reviews() {
  const t = useTranslations("reviews");
  const reduceMotion = useReducedMotion();

  // Carousel: drag-to-scroll (mouse) + touch swipe + slow autoplay + dots.
  const stripRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const pausedUntil = useRef(0);

  const scrollTo = (i: number) => {
    const strip = stripRef.current;
    const child = strip?.children[i] as HTMLElement | undefined;
    if (!strip || !child) return;
    strip.scrollTo({
      left: child.offsetLeft - (strip.clientWidth - child.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  const onScroll = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const center = strip.scrollLeft + strip.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(strip.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - center);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setIndex(nearest);
  };

  useEffect(() => {
    if (reduceMotion) return;
    const strip = stripRef.current;
    if (!strip) return;
    const id = window.setInterval(() => {
      if (strip.scrollWidth <= strip.clientWidth + 4) return;
      if (Date.now() < pausedUntil.current) return;
      scrollTo((index + 1) % REVIEWS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [index, reduceMotion]);

  const drag = useRef<{ x: number; left: number } | null>(null);
  const onDown = (e: React.PointerEvent<HTMLUListElement>) => {
    pausedUntil.current = Date.now() + 6000;
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: stripRef.current?.scrollLeft ?? 0 };
  };
  const onMove = (e: React.PointerEvent<HTMLUListElement>) => {
    if (!drag.current || !stripRef.current) return;
    stripRef.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    drag.current = null;
    pausedUntil.current = Date.now() + 6000;
  };

  const badge =
    "group inline-flex items-center gap-4 border border-mist bg-paper px-5 py-3.5 transition-colors hover:border-forest";

  return (
    <section
      aria-labelledby="reviews-title"
      className="bg-paper px-6 py-20 text-ink lg:px-10 lg:py-28"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto max-w-7xl"
      >
        {/* Heading */}
        <motion.div variants={fadeUp} className="text-center">
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
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
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

        {/* Review carousel */}
        <motion.ul
          ref={stripRef}
          variants={fadeUp}
          onScroll={onScroll}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="mt-12 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing lg:mt-14"
        >
          {REVIEWS.map((r, i) => (
            <li
              key={i}
              className="flex min-w-[82%] shrink-0 snap-center flex-col border border-mist bg-paper p-6 sm:min-w-[46%] sm:p-7 lg:min-w-[31%]"
            >
              <span
                aria-hidden
                className="font-serif text-4xl leading-none text-forest/25"
              >
                &ldquo;
              </span>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/80">
                {r.quote}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-mist pt-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist font-serif text-base text-forest">
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {r.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-ink/45">
                    {r.meta && <span>{r.meta}</span>}
                    {r.meta && <span className="text-ink/20">·</span>}
                    <SourceMark source={r.source} />
                  </p>
                </div>
              </div>
            </li>
          ))}
        </motion.ul>

        {/* Dots */}
        <motion.div
          variants={fadeUp}
          className="mt-6 flex items-center justify-center gap-2"
        >
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to review ${i + 1}`}
              aria-current={i === index}
              className="group flex h-4 items-center"
            >
              <span
                className={`block h-[2px] transition-all duration-300 ${
                  i === index ? "w-6 bg-forest" : "w-3 bg-ink/25 group-hover:bg-ink/45"
                }`}
              />
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
