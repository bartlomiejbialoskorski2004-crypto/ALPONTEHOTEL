import { createClient, type SanityClient } from "next-sanity";
import { apiVersion } from "../env";

let cached: SanityClient | null = null;

export function getClient(): SanityClient | null {
  if (cached) return cached;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  cached = createClient({ projectId, dataset, apiVersion, useCdn: true });
  return cached;
}

export const client = {
  fetch: async <T>(query: string): Promise<T | null> => {
    const c = getClient();
    if (!c) return null;
    return c.fetch<T>(query);
  },
};
