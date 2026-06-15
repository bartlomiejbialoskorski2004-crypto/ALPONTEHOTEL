import { HOTEL, siteUrl, localeUrl } from "@/lib/site";

// Server component — emits a JSON-LD <script>. No "use client".
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Schema is built from static constants (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Site-wide Hotel + WebSite graph. Render once, in the locale layout.
export function HotelJsonLd({ locale }: { locale: string }) {
  const hotelId = `${siteUrl}/#hotel`;
  const websiteId = `${siteUrl}/#website`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Hotel",
        "@id": hotelId,
        name: HOTEL.name,
        legalName: HOTEL.legalName,
        url: localeUrl(locale),
        image: [`${siteUrl}/opengraph-image`],
        telephone: HOTEL.telephone,
        email: HOTEL.email,
        priceRange: HOTEL.priceRange,
        currenciesAccepted: HOTEL.currenciesAccepted,
        checkinTime: HOTEL.checkinTime,
        checkoutTime: HOTEL.checkoutTime,
        petsAllowed: HOTEL.petsAllowed,
        smokingAllowed: HOTEL.smokingAllowed,
        inLanguage: locale,
        areaServed: "Lugano, Ticino, Switzerland",
        address: {
          "@type": "PostalAddress",
          streetAddress: HOTEL.streetAddress,
          postalCode: HOTEL.postalCode,
          addressLocality: HOTEL.addressLocality,
          addressRegion: HOTEL.addressRegion,
          addressCountry: HOTEL.addressCountry,
        },
        amenityFeature: HOTEL.amenities.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: HOTEL.rating.value,
          bestRating: HOTEL.rating.scale,
          reviewCount: HOTEL.rating.count,
        },
        sameAs: HOTEL.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: HOTEL.name,
        inLanguage: locale,
        publisher: { "@id": hotelId },
      },
    ],
  };

  return <JsonLd data={data} />;
}

export type Crumb = { name: string; path: string };

// BreadcrumbList for subpages (not the homepage). `items` are ordered crumbs;
// each `path` is relative ("" for home, "/attractions", …).
export function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: string;
  items: Crumb[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localeUrl(locale, item.path),
    })),
  };

  return <JsonLd data={data} />;
}
