// Smooth "flip" label: the text slides up out of view while an identical
// copy rises from below to take its place. The interaction is driven by the
// nearest `.group` ancestor, so wrap the label in a link/button that carries
// the `group` class (and let that element clip nothing — clipping happens
// here). Keep the label to a single line; the duplicate is aria-hidden.

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function FlipText({ children, className = "" }: Props) {
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <span className="block transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
