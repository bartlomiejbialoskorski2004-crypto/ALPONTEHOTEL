import { BOOKING } from "./contact-info";

// Real guest reviews pulled from the hotel's Booking.com and Tripadvisor
// pages (short, attributed quotes). Obvious typos lightly tidied for a clean
// presentation; replace any quote here with the exact source text if needed.

export type ReviewSource = "booking" | "tripadvisor";

export type Review = {
  quote: string;
  name: string;
  meta: string; // country (Booking) — empty for Tripadvisor
  source: ReviewSource;
};

export const REVIEWS: Review[] = [
  {
    quote:
      "Our stay at Al Ponte was amazing! Located in Cademario, you have a stunning view of the Lugano region. The service all around was fantastico!",
    name: "Danny",
    meta: "United States",
    source: "booking",
  },
  {
    quote:
      "The view is simply breathtaking! Situated high above Lugano, you really feel like you are above all else.",
    name: "Dome H",
    meta: "",
    source: "tripadvisor",
  },
  {
    quote:
      "Al Ponte is a warm, family-run gem that truly exceeded our expectations. We truly felt at home.",
    name: "Iren",
    meta: "Turkey",
    source: "booking",
  },
  {
    quote:
      "The food was delicious, the staff was so kind and attentive, and the views were amazing!",
    name: "Dachelle J",
    meta: "",
    source: "tripadvisor",
  },
  {
    quote:
      "The place has a unique atmosphere. The owners are super friendly. Food excellent. The view breathtaking.",
    name: "Robert",
    meta: "Poland",
    source: "booking",
  },
  {
    quote:
      "The balcony view is just a dream and we had total peace and quiet.",
    name: "Michael T",
    meta: "",
    source: "tripadvisor",
  },
  {
    quote:
      "Fabulous hostess, a real pleasure to meet her. Property was nearly on top of a mountain and had a fantastic view.",
    name: "Sadaf",
    meta: "India",
    source: "booking",
  },
  {
    quote:
      "Family-run hotel, small but nice! Super friendly people — we've been here for the second year in a row.",
    name: "Icegirl80",
    meta: "",
    source: "tripadvisor",
  },
  {
    quote:
      "Exceptional views. Staff impeccable. Super clean. Silence, calmness.",
    name: "Romuald",
    meta: "Switzerland",
    source: "booking",
  },
  {
    quote:
      "At the Bridge, if you absorb the energy of the place well, you can really relax.",
    name: "José P",
    meta: "",
    source: "tripadvisor",
  },
  {
    quote:
      "Lovely hotel run by a family, with amazing views on Lake Lugano. Very nice, friendly owners.",
    name: "Patrick",
    meta: "Netherlands",
    source: "booking",
  },
];

export const RATINGS = {
  booking: {
    score: "8.8",
    scale: "10",
    label: "Superb",
    count: "240+",
    url: `${BOOKING}#tab-reviews`,
  },
  tripadvisor: {
    score: "4.5",
    scale: "5",
    count: "68",
    url: "https://www.tripadvisor.com/Hotel_Review-g1130043-d1737528-Reviews-Albergo_Al_Ponte-Cademario_Canton_of_Ticino_Swiss_Alps.html",
  },
} as const;
