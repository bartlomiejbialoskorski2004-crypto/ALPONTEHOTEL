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
import {
  Bed,
  BedDouble,
  Home,
  Landmark,
  Mountain,
  MountainSnow,
  Star,
  Waves,
  type LucideIcon,
} from "lucide-react";

const MEGA_ICONS: Record<string, LucideIcon> = {
  // rooms
  apartments: Home,
  superior: Star,
  budgetPlus: BedDouble,
  budget: Bed,
  // attractions
  lake: Waves,
  sanSalvatore: MountainSnow,
  monteBre: Mountain,
  oldTown: Landmark,
};

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
    setScrolled(latest > 24);
  });

  // White (solid) when scrolled down, hovering the bar, or a megamenu is open.
  const active = scrolled || hovered || openMenu !== null;
  const openEntry = NAV.find((n) => n.mega?.group === openMenu) ?? null;

  const renderTopItem = (item: NavEntry) => {
    if (!item.mega) {
      return (
        <a
          key={item.key}
          href={item.href}
          onMouseEnter={() => setOpenMenu(null)}
          className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
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
        <span className="flex cursor-default items-center gap-1.5 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.15em]">
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
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          active ? "text-ink" : "text-paper"
        }`}
      >
        {/* Centered logo (always white). z-0 so the white bar slides over it.
            On active, the logo itself slides up out of the bar with a fade. */}
        <Link
          href="/"
          aria-label="Al Ponte"
          className="absolute left-1/2 top-0 z-0 flex h-20 -translate-x-1/2 items-center lg:h-24"
        >
          <motion.span
            initial={false}
            animate={{
              y: active ? "-150%" : 0,
              opacity: active ? 0 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center [filter:invert(1)_brightness(1.5)]"
          >
            <Image
              src="/logo.png"
              alt="Al Ponte"
              width={64}
              height={64}
              priority
            />
          </motion.span>
        </Link>

        {/* Solid white bar that slides down from the top when active.
            z-[1] sits over the centered logo so it physically covers it. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ y: active ? "0%" : "-100%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-20 border-b border-mist bg-paper lg:h-24"
        />

        <div className="relative z-10 flex h-20 items-stretch justify-between px-6 lg:h-24 lg:px-10">
          {/* Left logo — slides in from off-screen when the bar is active */}
          <motion.div
            initial={false}
            animate={{ x: active ? 0 : -200, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-6 top-0 flex h-full items-center lg:left-10"
          >
            <Link
              href="/"
              aria-label="Al Ponte"
              onMouseEnter={() => setOpenMenu(null)}
            >
              <Image
                src="/logo.png"
                alt="Al Ponte"
                width={48}
                height={48}
                priority
              />
            </Link>
          </motion.div>

          <motion.nav
            initial={false}
            animate={{ paddingLeft: active ? 96 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden h-full items-center gap-6 lg:flex"
          >
            {NAV.map(renderTopItem)}
          </motion.nav>

          <div className="ml-auto flex h-full items-center gap-5">
            <div
              onMouseEnter={() => setOpenMenu(null)}
              className="relative z-30 hidden items-center gap-5 lg:flex"
            >
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
              className="p-2 lg:hidden"
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
              className="relative z-10 hidden overflow-hidden bg-paper text-ink lg:block"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-mist px-6 lg:px-10">
                {openEntry.mega.items.map((sub) => {
                  const group = openEntry.mega!.group;
                  const hasDesc = group === "rooms";
                  const href = group === "rooms" ? "#rooms" : MEGA_HREF;
                  const Icon = MEGA_ICONS[sub];
                  return (
                    <a
                      key={sub}
                      href={href}
                      className="group flex flex-col px-8 py-12 first:pl-0"
                    >
                      {Icon && (
                        <Icon
                          size={28}
                          strokeWidth={1}
                          className="text-ink transition-colors duration-300 group-hover:text-forest"
                          aria-hidden
                        />
                      )}
                      <span className="mt-5 text-[11px] font-medium uppercase tracking-[0.25em] text-forest">
                        / {t(`nav.${group}`)}
                      </span>
                      <span className="mt-4 block font-serif text-2xl leading-tight">
                        {hasDesc
                          ? t(`mega.rooms.${sub}.title`)
                          : t(`mega.${group}.${sub}`)}
                      </span>
                      {hasDesc && (
                        <span className="mt-3 block text-sm leading-relaxed text-ink/70">
                          {t(`mega.rooms.${sub}.desc`)}
                        </span>
                      )}
                      <span className="mt-6 block text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </a>
                  );
                })}
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
