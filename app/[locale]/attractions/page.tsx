import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import Attractions from "@/components/Attractions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "attractions" });
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
    alternates: { canonical: localeUrl(locale, "/attractions") },
  };
}

export default async function AttractionsPage({
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
          { name: t("nav.attractions"), path: "/attractions" },
        ]}
      />
      <Attractions />
    </main>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
