import Image from "next/image";
import { LinkRow, type LinkItem } from "./ResourceLink";

export type EditorialItem = {
  heading?: string;
  text: string;
  links?: LinkItem[];
};

type Props = {
  id: string;
  num: string;
  title: string;
  items: EditorialItem[];
  image?: string;
  /** When true the photo sits on the right (desktop); alternate by index. */
  flip?: boolean;
  first?: boolean;
};

function Body({ title, num, items }: Pick<Props, "title" | "num" | "items">) {
  return (
    <div className="relative">
      {/* Oversized ghost numeral behind the heading. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-2 select-none font-serif text-7xl leading-none text-forest/10 lg:-top-14 lg:text-8xl"
      >
        {num}
      </span>
      <span className="relative text-[11px] font-medium uppercase tracking-[0.25em] text-forest tabular-nums">
        / {num}
      </span>
      <h2 className="relative mt-4 font-serif text-3xl leading-tight lg:text-4xl">
        {title}
      </h2>
      <div className="mt-7 space-y-7">
        {items.map((item, idx) => (
          <div key={idx}>
            {item.heading && (
              <h3 className="font-serif text-lg leading-snug text-ink lg:text-xl">
                {item.heading}
              </h3>
            )}
            <p
              className={`text-base leading-relaxed text-ink/80 ${
                item.heading ? "mt-2" : ""
              }`}
            >
              {item.text}
            </p>
            <LinkRow links={item.links} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditorialSection({
  id,
  num,
  title,
  items,
  image,
  flip,
  first,
}: Props) {
  const sectionClass = first
    ? "scroll-mt-24 lg:scroll-mt-28"
    : "mt-20 scroll-mt-24 border-t border-mist pt-16 lg:mt-28 lg:scroll-mt-28 lg:pt-24";

  if (!image) {
    return (
      <section id={id} className={sectionClass}>
        <div className="max-w-2xl">
          <Body title={title} num={num} items={items} />
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={sectionClass}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/2] lg:aspect-[4/5] ${
            flip ? "lg:order-2" : ""
          }`}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <Body title={title} num={num} items={items} />
      </div>
    </section>
  );
}
