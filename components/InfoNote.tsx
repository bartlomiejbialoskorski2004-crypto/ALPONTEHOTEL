// Small supplementary note ("Prices per person", "Pool closed until …")
// marked with a framed question mark so it reads as extra info. Colour, size
// and spacing come from the caller's className; the mark follows currentColor.
// No hooks - usable from server and client components alike.

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Render inline (span) instead of as a paragraph. */
  as?: "p" | "span" | "dd";
};

export default function InfoNote({ children, className = "", as = "p" }: Props) {
  const Tag = as;
  return (
    <Tag className={`flex items-start gap-2 ${className}`}>
      <span
        aria-hidden
        className="mt-[0.2em] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[2px] border border-current font-sans text-[9px] font-semibold not-italic normal-case leading-none tracking-normal opacity-80"
      >
        ?
      </span>
      <span>{children}</span>
    </Tag>
  );
}
