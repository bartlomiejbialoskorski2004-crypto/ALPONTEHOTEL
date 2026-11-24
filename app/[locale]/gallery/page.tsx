import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  buildLanguages,
  localeUrl,
  ogAlternateLocales,
  ogLocale,
} from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import GalleryPage from "@/components/GalleryPage";

const PATH = "/gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const url = localeUrl(locale, PATH);
  const title = t("gallery.seoTitle");
  const description = t("gallery.seoDescription");
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...buildLanguages(PATH),
        "x-default": localeUrl(routing.defaultLocale, PATH),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: t("seo.siteName"),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GalleryRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main id="top">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: t("seo.siteName"), path: "" },
          { name: t("gallery.label"), path: PATH },
        ]}
      />
      <GalleryPage />
    </main>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
