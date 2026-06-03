import type Lenis from "lenis";

// Tiny module-level holder so anchor-based components (e.g. the
// Informations table of contents) can reach the live Lenis instance
// created in SmoothScroll for momentum-correct scrolls. Avoids a
// window global, which collides with lenis's own type augmentation.
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
