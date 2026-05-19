import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { client } from "@/sanity/lib/client";
import { hotelBookingUrlQuery } from "@/sanity/queries";
import Header from "@/components/Header";

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

export const metadata: Metadata = {
  title: "Al Ponte — Boutique Hotel, Lago di Lugano",
  description:
    "Al Ponte is a boutique hotel on the shores of Lake Lugano, in the Italian-speaking heart of Switzerland.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  const [bookingUrl, messages] = await Promise.all([
    fetchBookingUrl(),
    getMessages(),
  ]);

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${libreBaskerville.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages} locale={locale as Locale}>
          <Header bookingUrl={bookingUrl} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
