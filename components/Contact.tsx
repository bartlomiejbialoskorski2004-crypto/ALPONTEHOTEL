import { getTranslations } from "next-intl/server";

type ContactData = {
  address: string;
  phone: string;
  email: string;
  mapsUrl?: string;
};

export default async function Contact({ data }: { data: ContactData }) {
  const t = await getTranslations("contact");

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t("address"), value: data.address },
    {
      label: t("phone"),
      value: (
        <a
          href={`tel:${data.phone.replace(/\s+/g, "")}`}
          className="text-forest transition-colors hover:text-forest-soft hover:underline underline-offset-4"
        >
          {data.phone}
        </a>
      ),
    },
    {
      label: t("email"),
      value: (
        <a
          href={`mailto:${data.email}`}
          className="text-forest transition-colors hover:text-forest-soft hover:underline underline-offset-4"
        >
          {data.email}
        </a>
      ),
    },
  ];

  if (data.mapsUrl) {
    rows.push({
      label: t("directions"),
      value: (
        <a
          href={data.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest transition-colors hover:text-forest-soft hover:underline underline-offset-4"
        >
          Google Maps →
        </a>
      ),
    });
  }

  return (
    <section
      id="contact"
      className="bg-paper px-6 py-24 text-ink md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-24">
        <div>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">
            {t("intro")}
          </p>
        </div>

        <dl className="md:pt-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 gap-6 py-5 ${
                i === 0 ? "border-t border-mist" : ""
              } border-b border-mist`}
            >
              <dt className="col-span-1 text-xs uppercase tracking-[0.2em] text-ink/60">
                {row.label}
              </dt>
              <dd className="col-span-2 text-sm">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
