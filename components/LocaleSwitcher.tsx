"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  tone?: "dark" | "light";
};

export default function LocaleSwitcher({ tone = "dark" }: Props) {
  const active = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const inactive =
    tone === "dark"
      ? "opacity-60 hover:opacity-100"
      : "opacity-70 hover:opacity-100";
  const separator = tone === "dark" ? "text-mist" : "text-paper/40";

  return (
    <nav
      aria-label="Language"
      className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em]"
    >
      {routing.locales.map((code, i) => {
        const isActive = code === active;
        return (
          <span key={code} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                router.replace(
                  // @ts-expect-error -- pathname/params typed strictly per route
                  { pathname, params },
                  { locale: code },
                )
              }
              aria-current={isActive ? "true" : undefined}
              className={
                isActive ? "" : `${inactive} transition-opacity duration-200`
              }
            >
              {code.toUpperCase()}
            </button>
            {i < routing.locales.length - 1 && (
              <span aria-hidden className={separator}>
                |
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
