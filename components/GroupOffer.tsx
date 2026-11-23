import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  buildLanguages,
  localeUrl,
  ogAlternateLocales,
  ogLocale,
} from "@/lib/site";
import { BreadcrumbJsonLd } from "./JsonLd";
import { GROUP_PAGES, type GroupKey } from "./groupPages";
import Conferences from "./groups/Conferences";
import Workshops from "./groups/Workshops";
import Celebrations from "./groups/Celebrations";
import SchoolTrips from "./groups/SchoolTrips";
import CompanyEvents from "./groups/CompanyEvents";

// Route helpers shared by the five app/[locale]/<offer>/page.tsx files.
// Each offer has its own page component (own hero + signature module) built
// on the shared frame in ./groups/shared.tsx.

const PAGES: Record<GroupKey, () => Promise<React.ReactElement>> = {
  conferences: Conferences,
  workshops: Workshops,
  celebrations: Celebrations,
  schoolTrips: SchoolTrips,
  companyEvents: CompanyEvents,
};

type RouteProps = { params: Promise<{ locale: string }> };

export function groupMetadata(page: GroupKey) {
  return async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const path = GROUP_PAGES[page].href;
    const url = localeUrl(locale, path);
    const title = t(`groups.pages.${page}.seoTitle`);
    const description = t(`groups.pages.${page}.seoDescription`);
    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: {
          ...buildLanguages(path),
          "x-default": localeUrl(routing.defaultLocale, path),
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
  };
}

export function groupStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GroupRoute({
  page,
  params,
}: RouteProps & { page: GroupKey }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const Page = PAGES[page];
  return (
    <main id="top">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: t("seo.siteName"), path: "" },
          { name: t(`groups.pages.${page}.navLabel`), path: GROUP_PAGES[page].href },
        ]}
      />
      <Page />
    </main>
  );
}
