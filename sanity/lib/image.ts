import createImageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { Image } from "sanity";
import { dataset, isSanityConfigured, projectId } from "../env";

let builder: ImageUrlBuilder | null = null;

function getBuilder(): ImageUrlBuilder | null {
  if (builder) return builder;
  if (!isSanityConfigured) return null;
  builder = createImageUrlBuilder({ projectId, dataset });
  return builder;
}

export function urlFor(
  source: Image | { asset?: { _ref?: string } },
): ImageUrlBuilder | null {
  const b = getBuilder();
  if (!b) return null;
  return b.image(source as Image);
}
