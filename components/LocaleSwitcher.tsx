"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
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
      { locale: code },
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
        className="flex items-center p-2"
      >
        {ActiveFlag && (
          <ActiveFlag className="h-6 w-9 rounded-[3px] shadow-sm ring-1 ring-black/10" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 flex flex-col gap-1 p-2"
        >
          {others.map((code) => {
            const Flag = FLAGS[code];
            return (
              <button
                key={code}
                type="button"
                role="menuitem"
                onClick={() => select(code)}
                aria-label={code.toUpperCase()}
                className="transition-transform duration-200 hover:scale-110"
              >
                {Flag && (
                  <Flag className="h-6 w-9 rounded-[3px] shadow-md ring-1 ring-black/10" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
