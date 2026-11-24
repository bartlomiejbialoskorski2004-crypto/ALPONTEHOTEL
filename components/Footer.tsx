"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FlipText from "./FlipText";
import { NAV } from "./menu";
import { useAnchor } from "./useAnchor";
import { BookingChoice } from "./booking";

// Site credit in the bottom bar.
const CREDIT_NAME = "Bartłomiej Białoskórski";
const CREDIT_URL =
  "https://www.linkedin.com/in/bartek-bia%C5%82osk%C3%B3rski-885096338/";
import {
  BOOKING,
  EMAIL,
  EMAIL_HREF,
  INSTAGRAM,
  MAPS_LINK,
  PHONE,
  PHONE_HREF,
} from "./contact-info";

type Props = {
  bookingUrl?: string;
};

export default function Footer({ bookingUrl }: Props) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  // Locale-aware homepage anchors (works from sub-pages in any language).
  const anchor = useAnchor();

  // Scroll-driven reveal: the giant wordmark slides up out of the footer's
  // bottom edge. Tracked on the bottom bar + wordmark only (not the whole,
  // very tall-on-phones footer), so the rise plays over the last few hundred
  // pixels of scroll and is clearly visible on mobile too. The page ends at
  // "end end", so the motion always completes.
  const ref = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ["start end", "end end"],
  });
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["100%", "0%"],
  );
  const wordmarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduceMotion ? [1, 1] : [0.35, 1],
  );

  const name = t("fallback.name"); // "Al Ponte"
  const year = new Date().getFullYear();

  const colHead =
    "text-[11px] font-medium uppercase tracking-[0.3em] text-paper/40";
  const navLink =
    "group inline-flex text-[12px] font-medium uppercase tracking-[0.18em] text-paper/65 transition-colors hover:text-paper";

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-10 lg:px-10 lg:pt-16 lg:pb-12">
        {/* Link columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Explore */}
          <nav className="flex flex-col gap-5" aria-label={t("footer.explore")}>
            <span className={colHead}>{t("footer.explore")}</span>
            <div className="flex flex-col gap-3.5">
              {NAV.map((item) => {
                const label = t(`nav.${item.key}`);
                if (item.href.startsWith("/")) {
                  return (
                    <Link key={item.key} href={item.href} className={navLink}>
                      <FlipText>{label}</FlipText>
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.key}
                    href={anchor(item.href)}
                    className={navLink}
                  >
                    <FlipText>{label}</FlipText>
                  </a>
                );
              })}
              <Link href="/hotel-attractions" className={navLink}>
                <FlipText>{t("hotelAttractions.label")}</FlipText>
              </Link>
              {/* Less-obvious on-page sections */}
              <a href={anchor("#amenities")} className={navLink}>
                <FlipText>{t("footer.amenities")}</FlipText>
              </a>
              <a href={anchor("#reviews")} className={navLink}>
                <FlipText>{t("footer.reviews")}</FlipText>
              </a>
            </div>
          </nav>

          {/* Rooms */}
          <nav className="flex flex-col gap-5" aria-label={t("footer.rooms")}>
            <span className={colHead}>{t("footer.rooms")}</span>
            <div className="flex flex-col gap-3.5">
              {NAV[0].mega!.items.map((key) => (
                <a key={key} href={anchor("#rooms")} className={navLink}>
                  <FlipText>{t(`mega.rooms.${key}.title`)}</FlipText>
                </a>
              ))}
            </div>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <span className={colHead}>{t("footer.contact")}</span>
            <div className="flex flex-col gap-3.5 text-sm leading-relaxed text-paper/65">
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-[16rem] transition-colors hover:text-paper"
              >
                {t("info.address")}
              </a>
              <a
                href={PHONE_HREF}
                className="tabular-nums transition-colors hover:text-paper"
              >
                {PHONE}
              </a>
              <a
                href={EMAIL_HREF}
                className="transition-colors hover:text-paper"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Reservations */}
          <div className="flex flex-col gap-5">
            <span className={colHead}>{t("footer.book")}</span>
            <p className="max-w-[16rem] text-sm leading-relaxed text-paper/65">
              {t("fallback.tagline")}
            </p>
            <BookingChoice tone="light" perks={false} className="mt-1 w-full max-w-[17rem]" />

            {/* Social */}
            <div className="mt-2 flex items-center gap-5">
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-paper/65 transition-colors hover:text-paper"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href={BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-2xl leading-none text-paper/65 transition-colors hover:text-paper"
              >
                <span aria-hidden>B.</span>
                <span className="sr-only">Booking.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar + wordmark: the scroll range of the wordmark reveal. */}
      <div ref={revealRef}>
      {/* Bottom bar */}
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-[11px] uppercase tracking-[0.15em] text-paper/45 sm:grid sm:grid-cols-3 sm:items-center lg:px-10">
          <span className="sm:justify-self-start">©{year} Hotel Al Ponte Cademario</span>
          {/* Credit: plain link, "Created by" prefix above (centred column
              on sm+, its own row on phones). */}
          <div className="flex flex-col gap-1 sm:items-center sm:justify-self-center">
            <span className="text-[10px] uppercase tracking-[0.18em] text-paper/35">
              {t("footer.createdBy")}
            </span>
            <a
              href={CREDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit transition-colors hover:text-paper"
            >
              <FlipText>{CREDIT_NAME}</FlipText>
            </a>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 sm:justify-self-end">
            <Link
              href="/informations"
              className="group inline-flex transition-colors hover:text-paper"
            >
              <FlipText>{t("nav.info")}</FlipText>
            </Link>
            <a
              href={anchor("#top")}
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-paper"
            >
              <FlipText>{t("footer.backToTop")}</FlipText>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                ↑
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Giant "Al Ponte" wordmark - full-bleed, rises with scroll, clipped
          by the footer's bottom edge. Sits clear below the copyright (mt gap)
          and only ever moves downward, so it never covers it. Like every
          Al Ponte logo it links home. */}
      <motion.div
        style={{ y: wordmarkY, opacity: wordmarkOpacity }}
        className="mt-10 select-none lg:mt-16"
      >
        <Link href="/" aria-label={name} className="block">
          <span
            aria-hidden
            className="-mb-[0.1em] block whitespace-nowrap text-center font-serif text-[clamp(4rem,26vw,24rem)] leading-[0.75] tracking-tight text-paper"
          >
            {name}
          </span>
        </Link>
      </motion.div>
      </div>
    </footer>
  );
}
