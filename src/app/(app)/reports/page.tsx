import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/account";
import { daysAgo } from "@/lib/time";
import { buildDailyClickBuckets } from "@/lib/buckets";
import { Leaderboard } from "@/components/leaderboard";
import { TrendChartCard } from "@/components/trend-chart-card";
import { CampaignsLeaderboard } from "@/components/campaigns-leaderboard";
import { RangePills } from "@/components/range-pills";
import { ChartCardSkeleton, LeaderboardSkeleton } from "@/components/skeletons";
import {
  computeBrandAndCampaignStats,
  computeEpisodeStats,
} from "@/lib/reports";

export const dynamic = "force-dynamic";

const RANGES = [
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
  { value: "all", label: "All time" },
];

function cutoffFromRange(range: string): Date | null {
  return range === "all" ? null : daysAgo(Number(range));
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const range = RANGES.some((r) => r.value === rawRange) ? rawRange! : "30";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-lg font-semibold">Reports</h1>
        <RangePills ranges={RANGES} active={range} basePath="/reports" />
      </div>

      <Suspense key={`trend-${range}`} fallback={<ChartCardSkeleton />}>
        <TrendSection range={range} />
      </Suspense>

      <Suspense key={`brands-${range}`} fallback={<LeaderboardSkeleton />}>
        <BrandsAndCampaignsSection range={range} />
      </Suspense>

      <Suspense key={`episodes-${range}`} fallback={<LeaderboardSkeleton />}>
        <EpisodesSection range={range} />
      </Suspense>
    </div>
  );
}

async function TrendSection({ range }: { range: string }) {
  const account = await getCurrentAccount();
  const cutoff = cutoffFromRange(range);
  const clicks = await prisma.click.findMany({
    where: {
      accountId: account.id,
      ...(cutoff ? { timestamp: { gte: cutoff } } : {}),
    },
    select: { timestamp: true },
  });

  const days = range === "all" ? 90 : Math.min(Number(range), 90);
  return (
    <TrendChartCard
      title={`Clicks, last ${days} days`}
      chartData={buildDailyClickBuckets(clicks, days)}
    />
  );
}

async function BrandsAndCampaignsSection({ range }: { range: string }) {
  const account = await getCurrentAccount();
  const cutoff = cutoffFromRange(range);

  const [clicks, links] = await Promise.all([
    prisma.click.findMany({
      where: {
        accountId: account.id,
        ...(cutoff ? { timestamp: { gte: cutoff } } : {}),
      },
      select: { linkId: true },
    }),
    prisma.link.findMany({
      where: { accountId: account.id },
      select: {
        id: true,
        slug: true,
        sponsorId: true,
        sponsor: { select: { name: true } },
      },
    }),
  ]);

  const { brands, campaigns } = computeBrandAndCampaignStats(
    clicks,
    links.map((l) => ({
      id: l.id,
      slug: l.slug,
      sponsorId: l.sponsorId,
      sponsorName: l.sponsor.name,
    })),
  );

  const totalCount = clicks.length;
  const brandOptions = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-8">
      <Leaderboard
        title="Brands"
        totalCount={totalCount}
        items={brands.map((b) => ({ id: b.id, label: b.name, count: b.count }))}
        emptyText="No sponsors yet"
      />

      <CampaignsLeaderboard
        campaigns={campaigns}
        brands={brandOptions}
        totalCount={totalCount}
      />
    </div>
  );
}

async function EpisodesSection({ range }: { range: string }) {
  const account = await getCurrentAccount();
  const cutoff = cutoffFromRange(range);

  const [clicks, episodes] = await Promise.all([
    prisma.click.findMany({
      where: {
        accountId: account.id,
        ...(cutoff ? { timestamp: { gte: cutoff } } : {}),
      },
      select: { episodeId: true },
    }),
    prisma.episode.findMany({
      where: { accountId: account.id },
      include: { links: { include: { link: { include: { sponsor: true } } } } },
    }),
  ]);

  const episodeStats = computeEpisodeStats(
    clicks,
    episodes.map((ep) => ({
      id: ep.id,
      title: ep.title,
      sponsorNames: [...new Set(ep.links.map((le) => le.link.sponsor.name))],
    })),
  );

  return (
    <Leaderboard
      title="Episodes"
      totalCount={clicks.length}
      items={episodeStats.map((ep) => ({
        id: ep.episodeId,
        label: ep.title,
        sublabel: ep.sponsorNames.join(", "),
        count: ep.count,
        href: `/episodes/${ep.episodeId}`,
      }))}
      emptyText="No episodes tagged yet"
    />
  );
}
