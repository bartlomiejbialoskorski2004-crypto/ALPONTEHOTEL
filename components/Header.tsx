"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import BookNowButton from "./BookNowButton";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";

const items: { key: "hotel" | "location" | "contact"; href: string }[] = [
  { key: "hotel", href: "#top" },
  { key: "location", href: "#contact" },
  { key: "contact", href: "#contact" },
];

type Props = {
  bookingUrl?: string;
};

export default function Header({ bookingUrl }: Props) {
  const t = useTranslations("nav");
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const threshold =
      typeof window !== "undefined" ? window.innerHeight * 0.8 : 600;
    setScrolled(latest > threshold);
  });

  // White (solid) when scrolled down OR while hovering anywhere on the bar.
  const active = scrolled || hovered;

  return (
    <>
      <motion.header
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          active
            ? "border-b border-mist bg-paper/95 text-ink backdrop-blur-md"
            : "border-b border-transparent bg-transparent text-paper"
        }`}
      >
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-2 items-center px-6 md:h-24 md:grid-cols-3 md:px-10">
          <Link href="/" aria-label="Al Ponte" className="flex items-center gap-3">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center transition-[filter] duration-500 ${
                active ? "" : "[filter:invert(1)_brightness(1.5)]"
              }`}
            >
              <Image
                src="/logo.png"
                alt="Al Ponte"
                width={40}
                height={40}
                priority
              />
            </span>
            <span className="hidden font-serif text-base tracking-[0.15em] md:inline">
              AL&nbsp;PONTE
            </span>
          </Link>

          <nav className="hidden items-center justify-center gap-10 md:flex">
            {items.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="hidden items-center justify-end gap-6 md:flex">
            <LocaleSwitcher tone={active ? "dark" : "light"} />
            <BookNowButton
              href={bookingUrl ?? "#contact"}
              variant={active ? "primary" : "ghost"}
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={t("openMenu")}
            className="ml-auto p-2 md:hidden"
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
      </motion.header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        bookingUrl={bookingUrl}
      />
    </>
  );
}
