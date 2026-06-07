import Image from "next/image";
import FlipText from "./FlipText";

export type LinkItem = { label: string; url: string };

// A clearly tappable, button-style external link — replaces faint text links.
export function ResourceLink({ label, url }: LinkItem) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 border border-ink/15 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink/80 transition-colors hover:border-forest hover:text-forest"
    >
      <FlipText>{label}</FlipText>
      <span
        aria-hidden
        className="text-[13px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        ↗
      </span>
    </a>
  );
}

export function LinkRow({ links }: { links?: LinkItem[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((l) => (
        <ResourceLink key={l.url} {...l} />
      ))}
    </div>
  );
}

type VideoCardProps = {
  url: string;
  thumbnail: string;
  label: string;
};

// A real video affordance: thumbnail + centred play badge, opens the video.
export function VideoCard({ url, thumbnail, label }: VideoCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative mt-10 block aspect-video w-full max-w-xl overflow-hidden"
    >
      <Image
        src={thumbnail}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 640px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/15" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M7 5L15 10L7 15V5Z" fill="currentColor" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-0 left-0 flex items-center gap-2 p-5 text-[12px] font-medium uppercase tracking-[0.18em] text-paper">
        {label}
      </span>
    </a>
  );
}
