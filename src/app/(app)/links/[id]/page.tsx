import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/account";
import { LinkDetailHeader } from "@/components/link-detail-header";
import { StatCard } from "@/components/stat-card";
import { TrendChartCard } from "@/components/trend-chart-card";
import { BreakdownList } from "@/components/breakdown-list";
import { EpisodeTags } from "@/components/episode-tags";
import {
  ChartCardSkeleton,
  BreakdownListSkeleton,
  EpisodeTagsSkeleton,
} from "@/components/skeletons";
import { daysAgo } from "@/lib/time";
import { buildDailyClickBuckets } from "@/lib/buckets";
import {
  computeDeviceBreakdown,
  computeReferrerBreakdown,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await getCurrentAccount();

  const [link, clicksThisWeek] = await Promise.all([
    prisma.link.findFirst({
      where: { id, accountId: account.id },
      include: { sponsor: true, _count: { select: { clicks: true } } },
    }),
    prisma.click.count({
      where: {
        accountId: account.id,
        linkId: id,
        timestamp: { gte: daysAgo(7) },
      },
    }),
  ]);

  if (!link) notFound();

  return (
    <div className="flex flex-col gap-8">
      <LinkDetailHeader
        accountSlug={account.slug}
        link={{
          id: link.id,
          slug: link.slug,
          destinationUrl: link.destinationUrl,
          discountCode: link.discountCode,
          startDate: link.startDate,
          endDate: link.endDate,
          fallbackUrl: link.fallbackUrl,
          clickCount: link._count.clicks,
        }}
        sponsorId={link.sponsorId}
        sponsorName={link.sponsor.name}
        sponsorStatus={link.sponsor.status}
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total clicks"
          value={link._count.clicks.toLocaleString()}
        />
        <StatCard
          label="Clicks this week"
          value={clicksThisWeek.toLocaleString()}
        />
        <StatCard label="Discount code" value={link.discountCode ?? "—"} />
      </div>

      <Suspense fallback={<ChartCardSkeleton />}>
        <ChartSection accountId={account.id} linkId={id} />
      </Suspense>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<BreakdownListSkeleton />}>
          <DeviceSection accountId={account.id} linkId={id} />
        </Suspense>
        <Suspense fallback={<BreakdownListSkeleton />}>
          <ReferrerSection accountId={account.id} linkId={id} />
        </Suspense>
      </div>

      <Suspense fallback={<EpisodeTagsSkeleton />}>
        <EpisodesSection accountId={account.id} linkId={id} />
      </Suspense>
    </div>
  );
}

async function ChartSection({
  accountId,
  linkId,
}: {
  accountId: string;
  linkId: string;
}) {
  const clicks = await prisma.click.findMany({
    where: { accountId, linkId },
    select: { timestamp: true },
  });
  const chartData = buildDailyClickBuckets(clicks, 30);

  return (
    <TrendChartCard
      title="Clicks, last 30 days"
      chartData={chartData}
      action={
        <a
          href={`/links/${linkId}/csv`}
          className="text-muted hover:text-foreground flex items-center gap-1.5 text-xs transition-colors active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </a>
      }
    />
  );
}

async function DeviceSection({
  accountId,
  linkId,
}: {
  accountId: string;
  linkId: string;
}) {
  const clicks = await prisma.click.findMany({
    where: { accountId, linkId },
    select: { deviceType: true },
  });
  return (
    <BreakdownList title="Devices" items={computeDeviceBreakdown(clicks)} />
  );
}

async function ReferrerSection({
  accountId,
  linkId,
}: {
  accountId: string;
  linkId: string;
}) {
  const clicks = await prisma.click.findMany({
    where: { accountId, linkId },
    select: { referrer: true },
  });
  return (
    <BreakdownList
      title="Top referrers"
      items={computeReferrerBreakdown(clicks)}
    />
  );
}

async function EpisodesSection({
  accountId,
  linkId,
}: {
  accountId: string;
  linkId: string;
}) {
  const [episodes, clicks] = await Promise.all([
    prisma.linkEpisode.findMany({
      where: { accountId, linkId },
      include: { episode: true },
    }),
    prisma.click.findMany({
      where: { accountId, linkId },
      select: { episodeId: true },
    }),
  ]);

  const episodeClickCounts = new Map<string, number>();
  let directClicks = 0;
  for (const click of clicks) {
    if (click.episodeId) {
      episodeClickCounts.set(
        click.episodeId,
        (episodeClickCounts.get(click.episodeId) ?? 0) + 1,
      );
    } else {
      directClicks++;
    }
  }

  return (
    <EpisodeTags
      linkId={linkId}
      directClicks={directClicks}
      episodes={episodes.map((le) => ({
        id: le.episode.id,
        title: le.episode.title,
        slug: le.slug,
        clickCount: episodeClickCounts.get(le.episode.id) ?? 0,
      }))}
    />
  );
}
