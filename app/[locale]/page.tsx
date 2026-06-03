import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { hotelQuery, type HotelDoc } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import Hero from "@/components/Hero";
import Rooms from "@/components/Rooms";
import TripleDeluxe from "@/components/TripleDeluxe";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import AttractionsTeaser from "@/components/AttractionsTeaser";
import Contact from "@/components/Contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const hotel = await fetchHotel().catch(() => null);

  const data = {
    name: hotel?.name?.[locale] || t("fallback.name"),
    tagline: hotel?.tagline?.[locale] || t("fallback.tagline"),
    address: hotel?.address?.[locale] || t("fallback.address"),
    phone: hotel?.phone || t("fallback.phone"),
    email: hotel?.email || t("fallback.email"),
    mapsUrl: hotel?.mapsUrl,
    bookingUrl: hotel?.bookingUrl,
    heroImage: hotel?.heroImage ?? null,
  };

  return (
    <main id="top">
      <Hero />
      <Amenities />
      <Rooms />
      <TripleDeluxe />
      <Gallery />
      <AttractionsTeaser />
      <Contact />
    </main>
  );
}

async function fetchHotel(): Promise<HotelDoc | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  return client.fetch<HotelDoc | null>(hotelQuery);
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
