"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import BookNowButton from "./BookNowButton";
import LocaleSwitcher from "./LocaleSwitcher";
import { NAV } from "./menu";

type Props = {
  open: boolean;
  onClose: () => void;
  bookingUrl?: string;
};

export default function MobileMenu({ open, onClose, bookingUrl }: Props) {
  const t = useTranslations("nav");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
          <div className="flex h-20 items-center justify-between px-6">
            <Link href="/" onClick={onClose} aria-label="Al Ponte">
              <Image src="/logo.png" alt="Al Ponte" width={36} height={36} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("closeMenu")}
              className="p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
            {NAV.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={onClose}
                className="font-serif text-3xl text-ink transition-colors hover:text-forest"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-6 px-6 pb-10">
            <LocaleSwitcher tone="dark" />
            <BookNowButton
              href={bookingUrl ?? "#contact"}
              variant="primary"
              className="w-full justify-center"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
