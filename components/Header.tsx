"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import BookNowButton from "./BookNowButton";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";
import { MEGA_HREF, NAV, type MegaGroup, type NavEntry } from "./menu";

type Props = {
  bookingUrl?: string;
};

export default function Header({ bookingUrl }: Props) {
  const t = useTranslations();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openMenu, setOpenMenu] = useState<MegaGroup | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const threshold =
      typeof window !== "undefined" ? window.innerHeight * 0.8 : 600;
    setScrolled(latest > threshold);
  });

  // White (solid) when scrolled down, hovering the bar, or a megamenu is open.
  const active = scrolled || hovered || openMenu !== null;

  const left = NAV.filter((n) => n.side === "left");
  const right = NAV.filter((n) => n.side === "right");
  const openEntry = NAV.find((n) => n.mega?.group === openMenu) ?? null;

  const renderTopItem = (item: NavEntry) => {
    if (!item.mega) {
      return (
        <a
          key={item.key}
          href={item.href}
          onMouseEnter={() => setOpenMenu(null)}
          className="text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
        >
          {t(`nav.${item.key}`)}
        </a>
      );
    }
    const group = item.mega.group;
    const isOpen = openMenu === group;
    return (
      <div
        key={item.key}
        onMouseEnter={() => setOpenMenu(group)}
        className="relative flex h-full items-center"
      >
        <span className="flex cursor-default items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em]">
          {t(`nav.${item.key}`)}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-forest transition-transform duration-300 ${
            isOpen ? "scale-x-100" : "scale-x-0"
          }`}
          aria-hidden
        />
      </div>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setOpenMenu(null);
        }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          active
            ? "bg-paper/95 text-ink backdrop-blur-md"
            : "bg-transparent text-paper"
        }`}
      >
        <div
          className={`grid h-20 grid-cols-[1fr_auto_1fr] items-stretch px-6 transition-colors duration-500 md:h-24 md:px-10 ${
            active ? "border-b border-mist" : "border-b border-transparent"
          }`}
        >
          <div className="hidden h-full items-center justify-start gap-8 md:flex">
            {left.map(renderTopItem)}
          </div>

          <Link
            href="/"
            aria-label="Al Ponte"
            onMouseEnter={() => setOpenMenu(null)}
            className="flex h-full items-center justify-center"
          >
            <span
              className={`inline-flex items-center justify-center transition-[filter] duration-500 ${
                active ? "" : "[filter:invert(1)_brightness(1.5)]"
              }`}
            >
              <Image
                src="/logo.png"
                alt="Al Ponte"
                width={52}
                height={52}
                priority
              />
            </span>
          </Link>

          <div className="flex h-full items-center justify-end gap-6">
            <nav className="hidden h-full items-center gap-8 md:flex">
              {right.map(renderTopItem)}
            </nav>
            <div className="hidden items-center gap-6 md:flex">
              <LocaleSwitcher tone={active ? "dark" : "light"} />
              <BookNowButton
                href={bookingUrl ?? "#contact"}
                variant={active ? "primary" : "ghost"}
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t("nav.openMenu")}
              className="p-2 md:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {openEntry?.mega && (
            <motion.div
              key={openEntry.mega.group}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="hidden overflow-hidden border-t border-mist bg-paper text-ink md:block"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-mist px-6 md:px-10">
                {openEntry.mega.items.map((sub) => (
                  <a
                    key={sub}
                    href={MEGA_HREF}
                    className="group block px-8 py-12 first:pl-0"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
                      / {t(`nav.${openEntry.mega!.group}`)}
                    </span>
                    <span className="mt-4 block font-serif text-2xl leading-tight">
                      {t(`mega.${openEntry.mega!.group}.${sub}`)}
                    </span>
                    <span className="mt-6 block text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        bookingUrl={bookingUrl}
      />
    </>
  );
}
