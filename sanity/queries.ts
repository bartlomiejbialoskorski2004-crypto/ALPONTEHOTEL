import { groq } from "next-sanity";

export type LocaleMap = Partial<Record<string, string>>;

export type HotelDoc = {
  name?: LocaleMap;
  tagline?: LocaleMap;
  heroImage?: { asset?: { _ref?: string } };
  address?: LocaleMap;
  phone?: string;
  email?: string;
  mapsUrl?: string;
  bookingUrl?: string;
};

export const hotelQuery = groq`*[_type == "hotel"][0]{
  name,
  tagline,
  heroImage,
  address,
  phone,
  email,
  mapsUrl,
  bookingUrl
}`;

export const hotelBookingUrlQuery = groq`*[_type == "hotel"][0]{ bookingUrl }`;
