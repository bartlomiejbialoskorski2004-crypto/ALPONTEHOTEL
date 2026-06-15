import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  setRequestLocale,
  getMessages,
  getTranslations,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { client } from "@/sanity/lib/client";
import { hotelBookingUrlQuery } from "@/sanity/queries";
import {
  localeUrl,
  buildLanguages,
  ogLocale,
  ogAlternateLocales,
  siteUrl,
} from "@/lib/site";
import { HotelJsonLd } from "@/components/JsonLd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const canonical = localeUrl(locale);
  const title = t("home.title");
  const description = t("home.description");

  return {
    title: { default: title, template: t("titleTemplate") },
    description,
    alternates: {
      canonical,
      languages: { ...buildLanguages(), "x-default": `${siteUrl}/` },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: t("siteName"),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

async function fetchBookingUrl(): Promise<string | undefined> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return undefined;
  try {
    const result = await client.fetch<{ bookingUrl?: string } | null>(
      hotelBookingUrlQuery,
    );
    return result?.bookingUrl;
  } catch {
    return undefined;
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const [bookingUrl, messages, t] = await Promise.all([
    fetchBookingUrl(),
    getMessages(),
    getTranslations({ locale, namespace: "seo" }),
  ]);

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${libreBaskerville.variable}`}
    >
      <body>
        <HotelJsonLd locale={locale} description={t("home.description")} />
        <NextIntlClientProvider messages={messages} locale={locale as Locale}>
          <SmoothScroll />
          <Header bookingUrl={bookingUrl} />
          {children}
          <Footer bookingUrl={bookingUrl} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
