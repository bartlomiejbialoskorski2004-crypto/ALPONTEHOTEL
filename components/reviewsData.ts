import { BOOKING } from "./contact-info";

// Guest reviews from the hotel's Booking.com / Tripadvisor pages. The quote +
// country live in i18n (`reviews.items.<id>.{quote,meta}`) so they follow the
// site language; the name + source stay here.

export type ReviewSource = "booking" | "tripadvisor";

export type Review = {
  id: string;
  name: string;
  source: ReviewSource;
};

export const REVIEWS: Review[] = [
  { id: "danny", name: "Danny", source: "booking" },
  { id: "domeh", name: "Dome H", source: "tripadvisor" },
  { id: "iren", name: "Iren", source: "booking" },
  { id: "dachelle", name: "Dachelle J", source: "tripadvisor" },
  { id: "robert", name: "Robert", source: "booking" },
  { id: "michaelt", name: "Michael T", source: "tripadvisor" },
  { id: "sadaf", name: "Sadaf", source: "booking" },
  { id: "icegirl", name: "Icegirl80", source: "tripadvisor" },
  { id: "romuald", name: "Romuald", source: "booking" },
  { id: "jose", name: "José P", source: "tripadvisor" },
  { id: "patrick", name: "Patrick", source: "booking" },
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
