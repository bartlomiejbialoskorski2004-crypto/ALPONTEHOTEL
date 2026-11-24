import { getTranslations } from "next-intl/server";
import { BedDouble, Bus, Presentation, Users, type LucideIcon } from "lucide-react";
import {
  Enquiry,
  OfferHero,
  HotelAtAGlance,
  OfferSwitcher,
  TextLink,
  container,
} from "./shared";

const TILES: { key: string; Icon: LucideIcon }[] = [
  { key: "rooms", Icon: BedDouble },
  { key: "staff", Icon: Users },
  { key: "transport", Icon: Bus },
  { key: "classroom", Icon: Presentation },
];

// School trips - "tiles": the shared offer hero, then four practical icon
// tiles.
export default async function SchoolTrips() {
  const t = await getTranslations("groups");
  const p = (key: string) => t(`pages.schoolTrips.${key}`);

  return (
    <>
      <OfferHero page="schoolTrips" />

      <OfferSwitcher current="schoolTrips" />

      <section className="bg-paper py-20 text-ink lg:py-28">
        <div className={container}>
          <ul className="grid gap-px border border-mist bg-mist sm:grid-cols-2 lg:grid-cols-4">
            {TILES.map(({ key, Icon }) => (
              <li key={key} className="bg-paper p-8 lg:p-10">
                <Icon aria-hidden className="h-7 w-7 text-forest" strokeWidth={1.25} />
                <h2 className="mt-8 font-serif text-xl leading-snug">
                  {p(`tiles.${key}.title`)}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {p(`tiles.${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <TextLink href="/attractions">{p("attractions")}</TextLink>
          </div>
        </div>
      </section>

      <HotelAtAGlance />
      <Enquiry page="schoolTrips" />
    </>
  );
}
