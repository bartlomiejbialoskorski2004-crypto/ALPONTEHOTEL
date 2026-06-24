"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FlipText from "./FlipText";
import { NAV } from "./menu";
import { useAnchor } from "./useAnchor";
import AnimatedGenerateButton from "./ui/animated-generate-button-shadcn-tailwind";
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

  // Scroll-driven parallax: the giant wordmark rises from below the bottom
  // edge as the footer passes through the viewport.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // The footer is the last element on the page, so it never scrolls past
    // the viewport top — end the range at "end end" (page fully scrolled) so
    // the parallax can actually run its full course.
    offset: ["start end", "end end"],
  });
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["80%", "0%"],
  );

  const name = t("fallback.name"); // "Al Ponte"
  const year = new Date().getFullYear();

  // Credit button toggles to the "book a call" label on click and opens
  // viralabs.pl in a new tab.
  const [viralabsClicked, setViralabsClicked] = useState(false);

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
            <a
              href={BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-1 inline-flex w-fit items-center gap-2 border border-paper/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-paper hover:text-forest"
            >
              <FlipText>{t("nav.bookNow")}</FlipText>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>

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

      {/* Bottom bar */}
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-[11px] uppercase tracking-[0.15em] text-paper/45 sm:grid sm:grid-cols-3 sm:items-center lg:px-10">
          <span className="sm:justify-self-start">©{year} Hotel Al Ponte Cademario</span>
          {/* Credit — animated glass button. Idle: "VIRALABS.PL". On click:
              opens viralabs.pl and flips the label to the localized
              "BOOK A CALL". The button consumes shadcn-style HSL tokens
              (--background / --foreground / --border), which we scope
              locally so it renders correctly inside the dark footer. */}
          <div
            className="viralabs-credit-tokens flex flex-col items-center gap-1 sm:justify-self-center"
            style={
              {
                ["--background" as string]: "0 0% 6%",
                ["--foreground" as string]: "48 23% 97%",
                ["--border" as string]: "0 0% 60%",
              } as React.CSSProperties
            }
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-paper/35">
              {t("footer.createdBy")}
            </span>
            <AnimatedGenerateButton
              labelIdle="VIRALABS.PL"
              labelActive={t("footer.bookCall")}
              generating={viralabsClicked}
              highlightHueDeg={270}
              ariaLabel="Viralabs.pl — created by"
              onClick={() => {
                if (!viralabsClicked) {
                  // First click: just flip the label to "UMÓW ROZMOWĘ".
                  setViralabsClicked(true);
                  return;
                }
                // Second click (on the active label): now open viralabs.pl.
                window.open(
                  "https://viralabs.pl",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            />
          </div>
          <div className="flex items-center gap-6 sm:justify-self-end">
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

      {/* Giant "Al Ponte" wordmark — full-bleed, rises with scroll, clipped
          by the footer's bottom edge. Sits clear below the copyright (mt gap)
          and only ever moves downward, so it never covers it. Decorative: the
          name is already exposed by the columns above. */}
      <motion.div
        style={{ y: wordmarkY }}
        aria-hidden
        className="pointer-events-none mt-10 select-none lg:mt-16"
      >
        <span className="-mb-[0.1em] block whitespace-nowrap text-center font-serif text-[clamp(4rem,26vw,24rem)] leading-[0.75] tracking-tight text-paper">
          {name}
        </span>
      </motion.div>
    </footer>
  );
}
