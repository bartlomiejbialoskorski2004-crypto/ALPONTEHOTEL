// Small supplementary note ("Prices per person", "Pool closed until …")
// marked with a framed question mark so it reads as extra info. The size is
// fixed here (11px text, 12px mark) so every note looks the same on phones
// and desktop; callers pass only colour and spacing. The mark follows
// currentColor. No hooks - usable from server and client components alike.

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Render inline (span) instead of as a paragraph. */
  as?: "p" | "span" | "dd";
};

export default function InfoNote({ children, className = "", as = "p" }: Props) {
  const Tag = as;
  return (
    <Tag className={`flex items-start gap-1.5 text-[11px] leading-[1.45] ${className}`}>
      <span
        aria-hidden
        className="mt-[0.15em] inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border border-current font-sans text-[8px] font-semibold not-italic normal-case leading-none tracking-normal opacity-80"
      >
        ?
      </span>
      <span>{children}</span>
    </Tag>
  );
}
