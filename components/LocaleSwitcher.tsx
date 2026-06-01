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
};

export default function LocaleSwitcher({ tone = "dark" }: Props) {
  const active = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={active.toUpperCase()}
        className="flex items-center p-2.5 sm:p-2"
      >
        {ActiveFlag && (
          <ActiveFlag className="h-7 w-10 rounded-none shadow-sm ring-1 ring-black/10 sm:h-6 sm:w-9" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            variants={popoverVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute left-1/2 top-full z-50 flex -translate-x-1/2 flex-row gap-2 pt-2"
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
        )}
      </AnimatePresence>
    </div>
  );
}
