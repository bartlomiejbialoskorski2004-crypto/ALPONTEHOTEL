import FlipText from "./FlipText";

type Variant = "light" | "dark";

const VARIANT_CLASSES: Record<Variant, string> = {
  // On the dark hero band: paper outline + text that fills on hover.
  light:
    "border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-forest",
  // On the paper body: ink outline that turns forest on hover.
  dark: "border-ink/15 text-ink/80 hover:border-forest hover:text-forest",
};

// A clearly tappable download affordance for the (locale-shared) rules PDF.
export default function DownloadLink({
  href,
  label,
  variant = "dark",
}: {
  href: string;
  label: string;
  variant?: Variant;
}) {
  return (
    <a
      href={href}
      download
      className={`group inline-flex items-center gap-2 border px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${VARIANT_CLASSES[variant]}`}
    >
      <FlipText>{label}</FlipText>
      <span
        aria-hidden
        className="text-[13px] transition-transform duration-300 group-hover:translate-y-0.5"
      >
        ↓
      </span>
    </a>
  );
}
