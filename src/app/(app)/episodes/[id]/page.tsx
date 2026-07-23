import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { TrendChartCard } from "@/components/trend-chart-card";
import { BreakdownList } from "@/components/breakdown-list";
import { Leaderboard } from "@/components/leaderboard";
import {
  ChartCardSkeleton,
  BreakdownListSkeleton,
  LeaderboardSkeleton,
} from "@/components/skeletons";
import { daysAgo } from "@/lib/time";
import { buildDailyClickBuckets } from "@/lib/buckets";
import {
  computeDeviceBreakdown,
  computeReferrerBreakdown,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function EpisodeAggregatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [episode, totalClicks, clicksThisWeek] = await Promise.all([
    prisma.episode.findUnique({
      where: { id },
      include: { links: { include: { link: { include: { sponsor: true } } } } },
    }),
    prisma.click.count({ where: { episodeId: id } }),
    prisma.click.count({
      where: { episodeId: id, timestamp: { gte: daysAgo(7) } },
    }),
  ]);

  if (!episode) notFound();

  const sponsorNames = [
    ...new Set(episode.links.map((le) => le.link.sponsor.name)),
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/reports"
          className="text-muted hover:text-foreground flex w-fit items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Reports
        </Link>
        <h1 className="text-foreground text-xl font-semibold">
          {episode.title}
        </h1>
        {sponsorNames.length > 0 && (
          <p className="text-muted text-sm">{sponsorNames.join(", ")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total clicks" value={totalClicks.toLocaleString()} />
        <StatCard
          label="Clicks this week"
          value={clicksThisWeek.toLocaleString()}
        />
      </div>

      <Suspense fallback={<ChartCardSkeleton />}>
        <ChartSection episodeId={id} />
      </Suspense>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<BreakdownListSkeleton />}>
          <DeviceSection episodeId={id} />
        </Suspense>
        <Suspense fallback={<BreakdownListSkeleton />}>
          <ReferrerSection episodeId={id} />
        </Suspense>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <BySponsorSection episodeId={id} links={episode.links} />
      </Suspense>
    </div>
  );
}

async function ChartSection({ episodeId }: { episodeId: string }) {
  const clicks = await prisma.click.findMany({
    where: { episodeId },
    select: { timestamp: true },
  });
  return (
    <TrendChartCard
      title="Clicks, last 30 days"
      chartData={buildDailyClickBuckets(clicks, 30)}
    />
  );
}

async function DeviceSection({ episodeId }: { episodeId: string }) {
  const clicks = await prisma.click.findMany({
    where: { episodeId },
    select: { deviceType: true },
  });
  return (
    <BreakdownList title="Devices" items={computeDeviceBreakdown(clicks)} />
  );
}

async function ReferrerSection({ episodeId }: { episodeId: string }) {
  const clicks = await prisma.click.findMany({
    where: { episodeId },
    select: { referrer: true },
  });
  return (
    <BreakdownList
      title="Top referrers"
      items={computeReferrerBreakdown(clicks)}
    />
  );
}

async function BySponsorSection({
  episodeId,
  links,
}: {
  episodeId: string;
  links: {
    linkId: string;
    link: { slug: string; sponsor: { name: string } };
  }[];
}) {
  const clicks = await prisma.click.findMany({
    where: { episodeId },
    select: { linkId: true },
  });

  const bySponsorItems = links
    .map((le) => ({
      id: le.linkId,
      label: le.link.sponsor.name,
      sublabel: `/${le.link.slug}`,
      count: clicks.filter((c) => c.linkId === le.linkId).length,
      href: `/links/${le.linkId}/episodes/${episodeId}`,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Leaderboard
      title="By sponsor"
      totalCount={clicks.length}
      items={bySponsorItems}
      emptyText="Not tagged to any campaigns"
    />
  );
}
