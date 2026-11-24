"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BookingChoice } from "./booking";
import FlipText from "./FlipText";
import LocaleSwitcher from "./LocaleSwitcher";
import { NAV, type NavKey } from "./menu";
import { useAnchor } from "./useAnchor";
import { ROOM_PANELS } from "./roomPanels";
import { GROUP_KEYS, GROUP_PAGES } from "./groupPages";

type Props = {
  open: boolean;
  onClose: () => void;
  bookingUrl?: string;
};

type Sub = { key: string; label: string; href: string; hash?: boolean };

const EASE = [0.22, 1, 0.36, 1] as const;

const itemClass =
  "group font-serif text-3xl text-ink transition-colors hover:text-forest";
const subClass =
  "group font-serif text-lg text-ink/65 transition-colors hover:text-forest";

export default function MobileMenu({ open, onClose }: Props) {
  const t = useTranslations();
  const anchor = useAnchor();
  // One expandable group open at a time (rooms / attractions / events).
  const [expanded, setExpanded] = useState<NavKey | null>(null);

  useEffect(() => {
    if (!open) {
      setExpanded(null);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Sub-links of the expandable groups.
  const roomCategories = NAV.find((n) => n.key === "rooms")?.mega?.items ?? [];
  const subs: Partial<Record<NavKey, Sub[]>> = {
    rooms: roomCategories.map((c) => {
      const first = ROOM_PANELS.find((p) => p.categoryKey === c);
      return {
        key: c,
        label: t(`mega.rooms.${c}.title`),
        href: anchor(first ? `#${first.id}` : "#rooms"),
        hash: true,
      };
    }),
    attractions: [
      { key: "region", label: t("nav.regionAttractions"), href: "/attractions" },
      { key: "hotel", label: t("hotelAttractions.label"), href: "/hotel-attractions" },
    ],
    events: GROUP_KEYS.map((k) => ({
      key: k,
      label: t(`groups.pages.${k}.navLabel`),
      href: GROUP_PAGES[k].href,
    })),
  };

  const renderLink = (href: string, hash: boolean, className: string, label: string, key: string) =>
    hash || href.startsWith("#") ? (
      <a key={key} href={href} onClick={onClose} className={className}>
        <FlipText>{label}</FlipText>
      </a>
    ) : (
      <Link key={key} href={href} onClick={onClose} className={className}>
        <FlipText>{label}</FlipText>
      </Link>
    );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col bg-paper text-ink"
        >
          <div className="flex h-20 shrink-0 items-center px-6">
            <Link href="/" onClick={onClose} aria-label="Al Ponte">
              <Image src="/logo.png" alt="Al Ponte" width={36} height={36} />
            </Link>
          </div>

          {/* Scrolls when a group is expanded; centred otherwise. */}
          <nav data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6">
            <div className="flex min-h-full flex-col items-center justify-center gap-6 py-4">
              {NAV.map((item) => {
                const children = subs[item.key];
                if (!children) {
                  return renderLink(
                    item.href.startsWith("/") ? item.href : anchor(item.href),
                    !item.href.startsWith("/"),
                    itemClass,
                    t(`nav.${item.key}`),
                    item.key,
                  );
                }
                const isOpen = expanded === item.key;
                return (
                  <div key={item.key} className="flex flex-col items-center">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : item.key)}
                      className={`${itemClass} inline-flex items-center gap-3`}
                    >
                      <FlipText>{t(`nav.${item.key}`)}</FlipText>
                      {/* + that turns into − */}
                      <span aria-hidden className="relative h-3 w-3 text-forest">
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                        <span
                          className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="sub"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <ul className="flex flex-col items-center gap-2 pt-3">
                            {children.map((c) => (
                              <li key={c.key}>
                                {renderLink(c.href, !!c.hash, subClass, c.label, c.key)}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="flex shrink-0 flex-col items-center gap-5 px-6 pb-8 pt-4">
            <LocaleSwitcher tone="dark" />
            <BookingChoice onNavigate={onClose} className="w-full max-w-sm" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
