export type BrandStat = {
  id: string;
  name: string;
  count: number;
};

export type CampaignStat = {
  linkId: string;
  sponsorId: string;
  sponsorName: string;
  slug: string;
  count: number;
};

export type EpisodeStat = {
  episodeId: string;
  title: string;
  count: number;
  sponsorNames: string[];
};

type LinkInfo = {
  id: string;
  slug: string;
  sponsorId: string;
  sponsorName: string;
};

export function computeBrandAndCampaignStats(
  clicks: { linkId: string }[],
  links: LinkInfo[],
): { brands: BrandStat[]; campaigns: CampaignStat[] } {
  const linkMap = new Map(links.map((l) => [l.id, l]));

  const brandCounts = new Map<string, BrandStat>();
  const campaignCounts = new Map<string, CampaignStat>();

  for (const link of links) {
    if (!brandCounts.has(link.sponsorId)) {
      brandCounts.set(link.sponsorId, {
        id: link.sponsorId,
        name: link.sponsorName,
        count: 0,
      });
    }
    campaignCounts.set(link.id, {
      linkId: link.id,
      sponsorId: link.sponsorId,
      sponsorName: link.sponsorName,
      slug: link.slug,
      count: 0,
    });
  }

  for (const click of clicks) {
    const link = linkMap.get(click.linkId);
    if (!link) continue;
    brandCounts.get(link.sponsorId)!.count++;
    campaignCounts.get(link.id)!.count++;
  }

  return {
    brands: [...brandCounts.values()].sort((a, b) => b.count - a.count),
    campaigns: [...campaignCounts.values()].sort((a, b) => b.count - a.count),
  };
}

export function computeEpisodeStats(
  clicks: { episodeId: string | null }[],
  episodes: { id: string; title: string; sponsorNames: string[] }[],
): EpisodeStat[] {
  const counts = new Map<string, number>();
  for (const click of clicks) {
    if (!click.episodeId) continue;
    counts.set(click.episodeId, (counts.get(click.episodeId) ?? 0) + 1);
  }

  return episodes
    .map((ep) => ({
      episodeId: ep.id,
      title: ep.title,
      count: counts.get(ep.id) ?? 0,
      sponsorNames: ep.sponsorNames,
    }))
    .sort((a, b) => b.count - a.count);
}
