import { prisma } from "@/lib/prisma";

export const RESERVED_SLUGS = new Set([
  "links",
  "login",
  "expired",
  "api",
  "reports",
  "episodes",
  "dashboard",
]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function isSlugTaken(slug: string): Promise<boolean> {
  if (RESERVED_SLUGS.has(slug)) return true;
  const [existingLink, existingLinkEpisode] = await Promise.all([
    prisma.link.findUnique({ where: { slug } }),
    prisma.linkEpisode.findUnique({ where: { slug } }),
  ]);
  return Boolean(existingLink || existingLinkEpisode);
}

/** Generates a unique episode-specific redirect slug, e.g. "acme-ep-42",
 * falling back to a numeric suffix on collision. */
export async function generateUniqueEpisodeSlug(
  linkSlug: string,
  episodeTitle: string,
): Promise<string> {
  const base = `${linkSlug}-${slugify(episodeTitle) || "episode"}`.slice(0, 60);

  let candidate = base;
  let suffix = 2;
  while (await isSlugTaken(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix++;
  }
  return candidate;
}
