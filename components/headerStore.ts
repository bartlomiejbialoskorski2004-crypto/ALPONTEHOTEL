// Tiny module-level holder for the main header's "hidden" (scrolled-away) state,
// mirroring lenisStore. The Header is the single source of truth; sibling
// components (e.g. RoomNav) subscribe so they can stay docked to the top when
// the header slides out of view — without re-deriving the scroll math and
// drifting a frame out of sync.

let hidden = false;
const listeners = new Set<(hidden: boolean) => void>();

export function setHeaderHidden(next: boolean) {
  if (next === hidden) return;
  hidden = next;
  listeners.forEach((l) => l(hidden));
}

export function getHeaderHidden(): boolean {
  return hidden;
}

export function subscribeHeaderHidden(
  listener: (hidden: boolean) => void,
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
