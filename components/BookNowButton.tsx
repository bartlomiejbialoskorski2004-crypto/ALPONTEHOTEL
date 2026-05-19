"use client";

import { useTranslations } from "next-intl";

type Props = {
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
};

export default function BookNowButton({
  href = "#contact",
  variant = "primary",
  className = "",
}: Props) {
  const t = useTranslations("nav");

  const base =
    "inline-flex items-center px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300";
  const styles =
    variant === "primary"
      ? "bg-forest text-paper hover:bg-forest-soft"
      : "border border-paper text-paper hover:bg-paper hover:text-forest";

  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${base} ${styles} ${className}`}
    >
      {t("bookNow")}
    </a>
  );
}
