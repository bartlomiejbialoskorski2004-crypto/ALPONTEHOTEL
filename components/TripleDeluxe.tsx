import fs from "node:fs";
import path from "node:path";
import TripleDeluxeClient from "./TripleDeluxeClient";

// Read every image in /public/triple-deluxe at build time. The file
// named "głowne"/"glowne" (Polish "main") is sorted first; the rest
// follow alphabetically. Filenames are URL-encoded so spaces and
// parens (WhatsApp exports) render correctly.
function listPhotos(): string[] {
  const dir = path.join(process.cwd(), "public", "triple-deluxe");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  } catch {
    return [];
  }
  files.sort((a, b) => {
    const aMain = /^g[lł]owne\./i.test(a);
    const bMain = /^g[lł]owne\./i.test(b);
    if (aMain !== bMain) return aMain ? -1 : 1;
    return a.localeCompare(b);
  });
  return files.map((f) => `/triple-deluxe/${encodeURIComponent(f)}`);
}

export default function TripleDeluxe() {
  const photos = listPhotos();
  return <TripleDeluxeClient photos={photos} />;
}
