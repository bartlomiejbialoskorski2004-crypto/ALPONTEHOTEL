// Shared by the homepage Wellness band (client) and the "At the hotel" page
// (server) - kept free of "use client" and hooks so both can import it.

export const SAUNA_IMAGE = "/wellness/sauna.jpg";
export const SAUNA_PRICE = 15;

// Round price badge, echoing the hotel's sauna flyer.
export function PriceBadge({
  perHour,
  className = "",
}: {
  perHour: string;
  className?: string;
}) {
  return (
    <span
      className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border border-paper/25 bg-forest/90 text-paper shadow-lg backdrop-blur-sm ${className}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-paper/70">
        CHF
      </span>
      <span className="font-serif text-4xl leading-none tabular-nums">{SAUNA_PRICE}</span>
      <span className="mt-1 px-2 text-center text-[10px] uppercase leading-tight tracking-[0.15em] text-paper/75">
        {perHour}
      </span>
    </span>
  );
}
