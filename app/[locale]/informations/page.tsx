import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import Informations from "@/components/Informations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("informations.title"),
    description: t("informations.description"),
    alternates: { canonical: localeUrl(locale, "/informations") },
  };
}

export default async function InformationsPage({
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
          { name: t("nav.info"), path: "/informations" },
        ]}
      />
      <Informations />
    </main>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
