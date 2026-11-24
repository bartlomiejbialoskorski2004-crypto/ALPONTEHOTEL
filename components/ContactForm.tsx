"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import FlipText from "./FlipText";
import InfoNote from "./InfoNote";
import { EMAIL, PHONE, PHONE_HREF } from "./contact-info";
import { ROOM_DETAILS } from "./roomData";
import { DIRECT_BOOKING_EVENT, type DirectBookingDetail } from "./booking";

// Flagship first, then the room panels in homepage order.
const ROOM_KEYS = ["tripleDeluxe", ...ROOM_DETAILS.map((r) => r.ns)];

const label =
  "block text-[10px] font-medium uppercase tracking-[0.2em] text-ink/55";
const field =
  "mt-1.5 w-full rounded-none border-0 border-b border-ink/20 bg-transparent px-0 py-2 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-forest";

// ISO date (2026-12-01) -> 01.12.2026 for the e-mail body.
const fmt = (iso: string) => (iso ? iso.split("-").reverse().join(".") : "");

// Direct-booking enquiry with no backend: on submit it composes a ready
// e-mail to the hotel (mailto:) in the visitor's language. "Book with us"
// buttons on the room panels preselect their room via DIRECT_BOOKING_EVENT.
export default function ContactForm() {
  const t = useTranslations();
  const f = (k: string) => t(`contact.form.${k}`);
  const benefits = t.raw("booking.benefits") as string[];
  const [room, setRoom] = useState("");
  const [arrival, setArrival] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const [today, setToday] = useState("");

  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);

  useEffect(() => {
    const onRequest = (e: Event) => {
      const detail = (e as CustomEvent<DirectBookingDetail>).detail;
      if (detail?.room && ROOM_KEYS.includes(detail.room)) setRoom(detail.room);
      // Focus once the smooth scroll has landed, without a second jump.
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 1100);
    };
    window.addEventListener(DIRECT_BOOKING_EVENT, onRequest);
    return () => window.removeEventListener(DIRECT_BOOKING_EVENT, onRequest);
  }, []);

  // Plain e-mail to the hotel for people who prefer to write it themselves.
  const selfMailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(f("subject"))}`;

  const roomName = (key: string) =>
    key === "tripleDeluxe" ? t("triple.title") : t(`rooms.items.${key}.name`);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const v = (k: string) => String(data.get(k) ?? "").trim();
    const roomLabel = v("room") ? roomName(v("room")) : f("roomAny");

    const lines = [
      f("greeting"),
      "",
      f("request"),
      "",
      `${f("arrival")}: ${fmt(v("arrival"))}`,
      `${f("departure")}: ${fmt(v("departure"))}`,
      `${f("adults")}: ${v("adults")}`,
      `${f("children")}: ${v("children") || "0"}`,
      `${f("room")}: ${roomLabel}`,
    ];
    if (v("message")) lines.push("", `${f("message")}:`, v("message"));
    lines.push("", `${f("name")}: ${v("name")}`, `${f("email")}: ${v("email")}`);
    if (v("phone")) lines.push(`${f("phone")}: ${v("phone")}`);
    lines.push("", f("closing"), v("name"));

    const subject = `${f("subject")}: ${roomLabel}, ${fmt(v("arrival"))} – ${fmt(v("departure"))}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <div
      id="contact-form"
      className="mx-auto mt-12 grid max-w-5xl gap-8 px-6 text-left lg:mt-16 lg:grid-cols-[1fr_1.5fr] lg:gap-16 lg:px-10"
    >
      {/* Why book direct. */}
      <div>
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-forest">
          {f("eyebrow")}
        </span>
        <h3 className="mt-3 font-serif text-2xl leading-tight lg:text-3xl">{f("title")}</h3>
        <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink/55">
          {t("booking.benefitsTitle")}
        </p>
        <ul className="mt-3 space-y-1.5">
          {benefits.map((b) => (
            <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
              <Check aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-forest" strokeWidth={1.5} />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-ink/60">
          {f("orCall")}{" "}
          <a href={PHONE_HREF} className="tabular-nums text-ink underline-offset-4 hover:text-forest hover:underline">
            {PHONE}
          </a>
        </p>
      </div>

      {/* The enquiry itself. */}
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-5 gap-y-4 lg:gap-x-8">
        <label className="col-span-2">
          <span className={label}>{f("name")} *</span>
          <input ref={nameRef} name="name" required autoComplete="name" className={field} />
        </label>
        <label className="col-span-2 sm:col-span-1">
          <span className={label}>{f("email")} *</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="col-span-2 sm:col-span-1">
          <span className={label}>
            {f("phone")} <span className="normal-case tracking-normal text-ink/35">({f("optional")})</span>
          </span>
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label>
          <span className={label}>{f("arrival")} *</span>
          <input
            name="arrival"
            type="date"
            required
            min={today || undefined}
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className={field}
          />
        </label>
        <label>
          <span className={label}>{f("departure")} *</span>
          <input name="departure" type="date" required min={arrival || today || undefined} className={field} />
        </label>
        <label>
          <span className={label}>{f("adults")}</span>
          <input name="adults" type="number" min={1} max={20} defaultValue={2} className={field} />
        </label>
        <label>
          <span className={label}>{f("children")}</span>
          <input name="children" type="number" min={0} max={20} defaultValue={0} className={field} />
        </label>
        <label className="col-span-2">
          <span className={label}>{f("room")}</span>
          <select
            name="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className={`${field} cursor-pointer`}
          >
            <option value="">{f("roomAny")}</option>
            {ROOM_KEYS.map((k) => (
              <option key={k} value={k}>
                {roomName(k)}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-2">
          <span className={label}>
            {f("message")} <span className="normal-case tracking-normal text-ink/35">({f("optional")})</span>
          </span>
          <textarea name="message" rows={2} className={`${field} resize-y`} />
        </label>

        <div className="col-span-2">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 whitespace-nowrap bg-forest px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-forest-soft"
          >
            <FlipText>{f("submit")}</FlipText>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
          <a
            href={selfMailHref}
            className="group inline-flex items-center justify-center whitespace-nowrap border border-ink/15 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:border-forest hover:text-forest"
          >
            <FlipText>{f("selfEmail")}</FlipText>
          </a>
          </div>
          <InfoNote className="mt-3 text-ink/55">{f("note")}</InfoNote>
        </div>
      </form>
    </div>
  );
}
