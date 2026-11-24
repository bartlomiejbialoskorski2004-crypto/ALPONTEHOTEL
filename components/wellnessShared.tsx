// Shared by the homepage Wellness band (client) and the "At the hotel" page
// (server) - kept free of "use client" and hooks so both can import it.

export const SAUNA_IMAGE = "/wellness/sauna.jpg";
export const SAUNA_PRICE = 15;

// Round price badge, echoing the hotel's sauna flyer.
export function PriceBadge({
  perHour,
  size = "md",
  className = "",
}: {
  perHour: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={`flex flex-col items-center justify-center rounded-full border border-paper/25 bg-forest/90 text-paper shadow-lg backdrop-blur-sm ${
        size === "sm" ? "h-24 w-24" : "h-28 w-28"
      } ${className}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-paper/70">
        CHF
      </span>
      <span
        className={`font-serif leading-none tabular-nums ${size === "sm" ? "text-3xl" : "text-4xl"}`}
      >
        {SAUNA_PRICE}
      </span>
      <span
        className={`mt-1 px-2 text-center uppercase leading-tight text-paper/75 ${
          size === "sm" ? "text-[8px] tracking-[0.1em]" : "text-[10px] tracking-[0.15em]"
        }`}
      >
        {perHour}
      </span>
    </span>
  );
}
