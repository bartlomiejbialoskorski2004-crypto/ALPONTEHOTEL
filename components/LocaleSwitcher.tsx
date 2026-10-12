"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import IT from "country-flag-icons/react/3x2/IT";
import GB from "country-flag-icons/react/3x2/GB";
import PL from "country-flag-icons/react/3x2/PL";
import FR from "country-flag-icons/react/3x2/FR";
import DE from "country-flag-icons/react/3x2/DE";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type FlagComponent = ComponentType<{ className?: string; title?: string }>;

const popoverVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const flagItemVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

const FLAGS: Record<string, FlagComponent> = {
  it: IT,
  en: GB,
  pl: PL,
  fr: FR,
  de: DE,
};

type Props = {
  tone?: "dark" | "light";
  // "right" anchors the dropdown to the flag's right edge so it doesn't
  // overflow when the switcher sits near the screen's right edge (mobile bar).
  align?: "center" | "right" | "left";
  // "flag" (default) shows the country flag; "letters" shows the locale code
  // (e.g. "PL") - a compact, always-legible text switcher.
  variant?: "flag" | "letters";
};

export default function LocaleSwitcher({
  tone = "dark",
  align = "center",
  variant = "flag",
}: Props) {
  const active = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Hover-to-open only with a real pointer. On touch, a tap fires an emulated
  // mouseenter followed by click, which would open and immediately toggle the
  // list shut again (visible flicker).
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (code: string) => {
    setOpen(false);
    router.replace(
      // @ts-expect-error -- pathname/params typed strictly per route
      { pathname, params },
      { locale: code, scroll: false },
    );
  };

  const ActiveFlag = FLAGS[active];
  const others = routing.locales.filter((c) => c !== active);
  const letters = variant === "letters";

  const alignClass =
    align === "right"
      ? "right-0"
      : align === "left"
        ? "left-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      ref={ref}
      onMouseEnter={canHover ? () => setOpen(true) : undefined}
      onMouseLeave={canHover ? () => setOpen(false) : undefined}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={active.toUpperCase()}
        className={
          letters
            ? "flex items-center p-1 text-sm font-medium uppercase tracking-[0.15em]"
            : "flex items-center p-2.5 sm:p-2"
        }
      >
        {letters ? (
          <span>{active.toUpperCase()}</span>
        ) : (
          ActiveFlag && (
            <ActiveFlag className="h-7 w-10 rounded-none shadow-sm ring-1 ring-black/10 sm:h-6 sm:w-9" />
          )
        )}
      </button>

      <AnimatePresence>
        {open &&
          (letters ? (
            // Letters: one centred column directly under the active code
            // (same padding + tracking as the trigger), a single quick fade
            // with no per-item stagger or scale.
            <motion.div
              key="letters"
              role="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-x-0 top-full z-50 flex flex-col items-center pt-2"
            >
              {others.map((code) => (
                <button
                  key={code}
                  type="button"
                  role="menuitem"
                  onClick={() => select(code)}
                  aria-label={code.toUpperCase()}
                  className="p-1 text-center text-sm font-medium uppercase tracking-[0.15em] opacity-70 transition-opacity hover:opacity-100"
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="flags"
              role="menu"
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`absolute top-full z-50 flex flex-row gap-2 pt-2 sm:flex-col sm:gap-1 ${alignClass}`}
            >
              {others.map((code) => {
                const Flag = FLAGS[code];
                return (
                  <motion.button
                    key={code}
                    variants={flagItemVariants}
                    type="button"
                    role="menuitem"
                    onClick={() => select(code)}
                    aria-label={code.toUpperCase()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {Flag && (
                      <Flag className="h-7 w-10 rounded-none shadow-md ring-1 ring-black/10 sm:h-6 sm:w-9" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
