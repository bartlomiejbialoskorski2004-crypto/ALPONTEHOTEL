import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
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
  };
}

export default async function AttractionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="top">
      <Attractions />
    </main>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
