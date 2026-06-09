import fs from "node:fs";
import path from "node:path";
import RoomPanelClient from "./RoomPanelClient";
import type { RoomDetail } from "./roomData";

// Read every image in public/<folder> at build time. The "główne"/"glowne"
// (Polish "main") file sorts first; the rest alphabetically. Each path segment
// is URL-encoded so folder/file names with spaces and parens resolve.
function listPhotos(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", folder);
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
  return files.map(
    (f) => `/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`,
  );
}

export default function RoomPanel({
  id,
  folder,
  categoryKey,
  ns,
  amenities,
  features,
}: RoomDetail) {
  const photos = listPhotos(folder);
  return (
    <RoomPanelClient
      id={id}
      photos={photos}
      categoryKey={categoryKey}
      ns={ns}
      amenities={amenities}
      features={features}
    />
  );
}
