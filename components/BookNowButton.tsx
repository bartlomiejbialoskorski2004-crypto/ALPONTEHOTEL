"use client";

import { useTranslations } from "next-intl";

type Variant = "primary" | "ghost" | "light";

type Props = {
  href?: string;
  variant?: Variant;
  className?: string;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  // Forest button on a paper / light bar
  primary: "bg-forest text-paper hover:bg-forest-soft",
  // Paper border on a transparent / dark background (e.g. hero photo)
  ghost: "border-paper text-paper hover:bg-paper hover:text-forest",
  // Paper button on a forest bar — flips to forest on hover
  light: "bg-paper text-forest hover:bg-forest hover:text-paper",
};

export default function BookNowButton({
  href = "#contact",
  variant = "primary",
  className = "",
}: Props) {
  const t = useTranslations("nav");

  const base =
    "inline-flex items-center border border-transparent px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300";
  const styles = VARIANT_CLASSES[variant];

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
