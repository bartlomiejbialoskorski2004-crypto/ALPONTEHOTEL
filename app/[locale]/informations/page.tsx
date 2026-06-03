import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Informations from "@/components/Informations";

export default async function InformationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="top">
      <Informations />
    </main>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
