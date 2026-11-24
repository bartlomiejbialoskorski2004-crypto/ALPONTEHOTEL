"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import FlipText from "./FlipText";
import { getLenis } from "./lenisStore";
import { useAnchor } from "./useAnchor";
import { BOOKING } from "./contact-info";

// Direct booking vs Booking.com - shared pieces used by the room panels, the
// navbar "Book" menu, the mobile menu, the footer and the in-hotel page.

export const DIRECT_BOOKING_EVENT = "direct-booking";
export type DirectBookingDetail = { room?: string };

const FORM_ID = "contact-form";

// Booking.com wordmark (brand blue #003580), text only.
export function BookingLogo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span
      className={`font-sans font-bold normal-case tracking-normal ${
        tone === "light" ? "text-paper" : "text-[#003580]"
      }`}
    >
      Booking<span className={tone === "light" ? "text-paper/70" : "text-[#0071c2]"}>.com</span>
    </span>
  );
}

// The three direct-booking perks as a thin white tab sitting on the top edge
// of the "Book with us" button (not full width).
function PerksTab() {
  const t = useTranslations("booking");
  const perks = t.raw("perks") as string[];
  return (
    <ul className="ml-4 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-x-2.5 self-start gap-y-0.5 border border-b-0 border-ink/10 bg-white px-3 py-1 text-[9px] font-medium uppercase leading-snug tracking-[0.12em] text-ink/60">
      {perks.map((p) => (
        <li key={p} className="inline-flex items-center gap-1 whitespace-nowrap">
          <Check aria-hidden className="h-2.5 w-2.5 text-forest" strokeWidth={2} />
          {p}
        </li>
      ))}
    </ul>
  );
}

// Minimal line of the three direct-booking perks.
export function DirectPerks({
  tone = "dark",
  align = "center",
  className = "",
}: {
  tone?: "dark" | "light";
  align?: "center" | "start";
  className?: string;
}) {
  const t = useTranslations("booking");
  const perks = t.raw("perks") as string[];
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase leading-snug tracking-[0.14em] ${
        align === "center" ? "justify-center" : "justify-start"
      } ${
        tone === "light" ? "text-paper/70" : "text-ink/55"
      } ${className}`}
    >
      {perks.map((p) => (
        <li key={p} className="inline-flex items-center gap-1">
          <Check
            aria-hidden
            className={`h-3 w-3 ${tone === "light" ? "text-paper" : "text-forest"}`}
            strokeWidth={1.75}
          />
          {p}
        </li>
      ))}
    </ul>
  );
}

// "Book with us": on the homepage it scrolls to the contact form and (from a
// room panel) preselects that room; elsewhere it navigates to the homepage
// contact section like every other section anchor.
export function DirectBookingLink({
  room,
  className,
  onNavigate,
  children,
}: {
  room?: string;
  className?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const anchor = useAnchor();
  return (
    <a
      href={anchor("#contact")}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        const form = document.getElementById(FORM_ID);
        if (!form) return; // other pages: follow the link home
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent<DirectBookingDetail>(DIRECT_BOOKING_EVENT, {
            detail: { room },
          }),
        );
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(form, { offset: -96 });
        else form.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </a>
  );
}

// "or book via Booking.com" on one line; rolls like the navbar "Book" label.
function BookingLine({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("booking");
  return (
    <FlipText>
      <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
        {t("or")} {t("via")}
        <span className="text-[13px]">
          <BookingLogo tone={tone} />
        </span>
      </span>
    </FlipText>
  );
}

// The two booking options as a pair (rooms, footer, in-hotel page, mobile
// menu): the perks tab on top of the filled "Book with us" button, then a
// quiet borderless "or book on Booking.com".
export function BookingChoice({
  room,
  tone = "dark",
  perks = true,
  onNavigate,
  className = "",
}: {
  room?: string;
  tone?: "dark" | "light";
  perks?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useTranslations("booking");
  const light = tone === "light";
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {perks && <PerksTab />}
      <DirectBookingLink
        room={room}
        onNavigate={onNavigate}
        className={`group flex w-full items-center justify-center px-5 py-4 text-xs font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
          light ? "bg-paper text-forest hover:bg-white" : "bg-forest text-paper hover:bg-forest-soft"
        }`}
      >
        <FlipText>{t("direct")}</FlipText>
      </DirectBookingLink>
      <a
        href={BOOKING}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={`group mt-1 flex w-full items-center justify-center px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
          light ? "text-paper/75 hover:text-paper" : "text-ink/60 hover:text-ink"
        }`}
      >
        <BookingLine tone={tone} />
      </a>
    </div>
  );
}

// ---- Navbar "Book" menu ---------------------------------------------------

type MenuVariant = "primary" | "ghost" | "light";

// Same look as the old single "Book now" button, per header tone.
const MENU_VARIANTS: Record<MenuVariant, string> = {
  primary: "bg-forest text-paper hover:bg-forest-soft",
  ghost: "border-paper text-paper hover:bg-paper hover:text-forest",
  light: "bg-paper text-forest hover:bg-forest hover:text-paper",
};

const EASE = [0.22, 1, 0.36, 1] as const;

// The panel slides down from under the button; closing is a quick fade.
const sheetVariants: Variants = {
  hidden: { y: "-100%", transition: { duration: 0 } },
  visible: { y: "0%", transition: { duration: 0.45, ease: EASE } },
};

// Then the options settle in one after the other.
const optionVariants: Variants = {
  hidden: { opacity: 0, y: -8, transition: { duration: 0 } },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: 0.15 + i * 0.08 },
  }),
};

// Header "Book" button: hover (or click on touch) opens the two booking
// options - direct with the hotel, or Booking.com.
export function BookMenu({ variant = "primary" }: { variant?: MenuVariant }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={canHover ? () => setOpen(true) : undefined}
      onMouseLeave={canHover ? () => setOpen(false) : undefined}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`group inline-flex items-center border border-transparent px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${MENU_VARIANTS[variant]}`}
      >
        <FlipText>{t("nav.bookNow")}</FlipText>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="book-menu"
            role="menu"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute right-0 top-full z-50 w-80 pt-3"
          >
            {/* Clips the sheet so it appears to slide out from under the bar. */}
            <div className="overflow-hidden">
              <motion.div
                variants={sheetVariants}
                className="border border-mist bg-paper p-4 text-ink shadow-xl"
              >
                <motion.div custom={0} variants={optionVariants}>
                  <DirectBookingLink
                    onNavigate={() => setOpen(false)}
                    className="group flex w-full items-center justify-center bg-forest px-5 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-forest-soft"
                  >
                    <FlipText>{t("booking.direct")}</FlipText>
                  </DirectBookingLink>
                  <DirectPerks align="start" className="mt-3" />
                </motion.div>
                <motion.div custom={1} variants={optionVariants} className="mt-3 border-t border-mist pt-1">
                  <a
                    href={BOOKING}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="group flex w-full items-center justify-center px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/60 transition-colors hover:text-ink"
                  >
                    <BookingLine />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
