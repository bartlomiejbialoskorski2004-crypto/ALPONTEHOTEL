import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

// Read every image in public/<folder> at build time. The "główne"/"glowne"
// (Polish "main") file sorts first; the rest alphabetically. Each path segment
// is URL-encoded so folder/file names with spaces and parens resolve.
export function listPhotos(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", folder);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => IMAGE_RE.test(f));
  } catch {
    return [];
  }
  files.sort((a, b) => {
    const aMain = /^g[lł]owne\./i.test(a);
    const bMain = /^g[lł]owne\./i.test(b);
    if (aMain !== bMain) return aMain ? -1 : 1;
    return a.localeCompare(b);
  });
  return files.map(
    (f) => `/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`,
  );
}

// Content hash of a public image (by its URL path), or null if unreadable.
function hashOf(src: string): string | null {
  try {
    const file = path.join(
      process.cwd(),
      "public",
      ...src.split("/").filter(Boolean).map(decodeURIComponent),
    );
    return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
  } catch {
    return null;
  }
}

// Returns a filter that keeps only the first occurrence of each distinct
// image (byte-identical copies in other folders are dropped, as are missing
// files). Share one filter across a whole page so duplicates never show twice.
export function createDedupe() {
  const seen = new Set<string>();
  return <T extends { src: string }>(items: T[]): T[] =>
    items.filter((item) => {
      const key = hashOf(item.src);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
