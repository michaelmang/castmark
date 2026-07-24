import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export { slugify };

// Reserved top-level path segments — an account's slug can't collide with
// these, since account URLs are one segment (e.g. /my-podcast) and app
// routes like /dashboard, /login live at the same level.
export const RESERVED_ACCOUNT_SLUGS = new Set([
  "login",
  "signup",
  "dashboard",
  "reports",
  "links",
  "episodes",
  "expired",
  "api",
  "billing",
  "account",
  "settings",
  "pricing",
  "about",
  "admin",
]);

export async function isAccountSlugTaken(slug: string): Promise<boolean> {
  if (RESERVED_ACCOUNT_SLUGS.has(slug)) return true;
  const existing = await prisma.account.findUnique({ where: { slug } });
  return Boolean(existing);
}

async function isCampaignSlugTaken(
  accountId: string,
  slug: string,
): Promise<boolean> {
  const [existingLink, existingLinkEpisode] = await Promise.all([
    prisma.link.findUnique({ where: { accountId_slug: { accountId, slug } } }),
    prisma.linkEpisode.findUnique({
      where: { accountId_slug: { accountId, slug } },
    }),
  ]);
  return Boolean(existingLink || existingLinkEpisode);
}

export async function isCampaignSlugAvailable(
  accountId: string,
  slug: string,
): Promise<boolean> {
  return !(await isCampaignSlugTaken(accountId, slug));
}

/** Generates a unique episode-specific redirect slug, e.g. "acme-ep-42",
 * falling back to a numeric suffix on collision, scoped to one account. */
export async function generateUniqueEpisodeSlug(
  accountId: string,
  linkSlug: string,
  episodeTitle: string,
): Promise<string> {
  const base = `${linkSlug}-${slugify(episodeTitle) || "episode"}`.slice(0, 60);

  let candidate = base;
  let suffix = 2;
  while (await isCampaignSlugTaken(accountId, candidate)) {
    candidate = `${base}-${suffix}`;
    suffix++;
  }
  return candidate;
}
