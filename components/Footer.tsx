"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import FlipText from "./FlipText";
import { NAV } from "./menu";
import {
  EMAIL,
  EMAIL_HREF,
  MAPS_LINK,
  PHONE,
  PHONE_HREF,
} from "./contact-info";

const EASE = [0.22, 1, 0.36, 1] as const;

// Giant wordmark: each letter rides up from a clipped mask, staggered.
const wordmarkContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const wordmarkLetter: Variants = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.85, ease: EASE } },
};

type Props = {
  bookingUrl?: string;
};

export default function Footer({ bookingUrl }: Props) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Same-page hashes smooth-scroll via Lenis on the homepage; from sub-pages
  // they need a leading "/" so Next navigates home first.
  const anchor = (hash: string) => (isHome ? hash : `/${hash}`);

  const name = t("fallback.name"); // "Al Ponte"
  const year = new Date().getFullYear();

  const colHead =
    "text-[11px] font-medium uppercase tracking-[0.3em] text-paper/40";
  const navLink =
    "group inline-flex text-[12px] font-medium uppercase tracking-[0.18em] text-paper/65 transition-colors hover:text-paper";

  return (
    <footer className="bg-forest text-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        {/* Big "Al Ponte" wordmark — letters wipe up on scroll into view */}
        <motion.div
          aria-label={name}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={wordmarkContainer}
          className="flex flex-wrap gap-x-[0.28em] font-serif text-[clamp(3.25rem,14vw,12rem)] leading-[0.85] tracking-tight"
        >
          {name.split(" ").map((wordPart, wi) => (
            <span key={wi} aria-hidden className="inline-flex">
              {[...wordPart].map((ch, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden pb-[0.12em]"
                >
                  <motion.span
                    variants={wordmarkLetter}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>

        {/* Link columns */}
        <div className="mt-16 grid gap-12 border-t border-paper/15 pt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:pt-16">
          {/* Explore */}
          <nav className="flex flex-col gap-5" aria-label={t("footer.explore")}>
            <span className={colHead}>/ {t("footer.explore")}</span>
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
            </div>
          </nav>

          {/* Rooms */}
          <nav className="flex flex-col gap-5" aria-label={t("footer.rooms")}>
            <span className={colHead}>/ {t("footer.rooms")}</span>
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
            <span className={colHead}>/ {t("footer.contact")}</span>
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
            <span className={colHead}>/ {t("footer.book")}</span>
            <p className="max-w-[16rem] text-sm leading-relaxed text-paper/65">
              {t("fallback.tagline")}
            </p>
            <a
              href={bookingUrl ?? anchor("#contact")}
              {...(bookingUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-[11px] uppercase tracking-[0.15em] text-paper/45 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>
            © {year} {name} — {t("footer.rights")}
          </span>
          <div className="flex items-center gap-6">
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
    </footer>
  );
}
