import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/account";
import { StatCard } from "@/components/stat-card";
import { TrendChartCard } from "@/components/trend-chart-card";
import { BreakdownList } from "@/components/breakdown-list";
import { CopyUrlButton } from "@/components/copy-url-button";
import {
  ChartCardSkeleton,
  BreakdownListSkeleton,
} from "@/components/skeletons";
import { daysAgo } from "@/lib/time";
import { buildDailyClickBuckets } from "@/lib/buckets";
import {
  computeDeviceBreakdown,
  computeReferrerBreakdown,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ id: string; episodeId: string }>;
}) {
  const { id, episodeId } = await params;
  const account = await getCurrentAccount();

  const [linkEpisode, totalClicks, clicksThisWeek] = await Promise.all([
    prisma.linkEpisode.findFirst({
      where: { linkId: id, episodeId, accountId: account.id },
      include: { link: { include: { sponsor: true } }, episode: true },
    }),
    prisma.click.count({
      where: { accountId: account.id, linkId: id, episodeId },
    }),
    prisma.click.count({
      where: {
        accountId: account.id,
        linkId: id,
        episodeId,
        timestamp: { gte: daysAgo(7) },
      },
    }),
  ]);

  if (!linkEpisode) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href={`/links/${id}`}
          className="text-muted hover:text-foreground flex w-fit items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {linkEpisode.link.sponsor.name} / {linkEpisode.link.slug}
        </Link>

        <div className="flex items-center gap-3">
          <h1 className="text-foreground text-xl font-semibold">
            {linkEpisode.episode.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <CopyUrlButton accountSlug={account.slug} slug={linkEpisode.slug} />
          <a
            href={`/${account.slug}/${linkEpisode.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-foreground transition-colors active:scale-90"
            title="Open link"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total clicks" value={totalClicks.toLocaleString()} />
        <StatCard
          label="Clicks this week"
          value={clicksThisWeek.toLocaleString()}
        />
      </div>

      <Suspense fallback={<ChartCardSkeleton />}>
        <ChartSection
          accountId={account.id}
          linkId={id}
          episodeId={episodeId}
        />
      </Suspense>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<BreakdownListSkeleton />}>
          <DeviceSection
            accountId={account.id}
            linkId={id}
            episodeId={episodeId}
          />
        </Suspense>
        <Suspense fallback={<BreakdownListSkeleton />}>
          <ReferrerSection
            accountId={account.id}
            linkId={id}
            episodeId={episodeId}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function ChartSection({
  accountId,
  linkId,
  episodeId,
}: {
  accountId: string;
  linkId: string;
  episodeId: string;
}) {
  const clicks = await prisma.click.findMany({
    where: { accountId, linkId, episodeId },
    select: { timestamp: true },
  });
  const chartData = buildDailyClickBuckets(clicks, 30);

  return (
    <TrendChartCard
      title="Clicks, last 30 days"
      chartData={chartData}
      action={
        <a
          href={`/links/${linkId}/csv?episodeId=${episodeId}`}
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
  episodeId,
}: {
  accountId: string;
  linkId: string;
  episodeId: string;
}) {
  const clicks = await prisma.click.findMany({
    where: { accountId, linkId, episodeId },
    select: { deviceType: true },
  });
  return (
    <BreakdownList title="Devices" items={computeDeviceBreakdown(clicks)} />
  );
}

async function ReferrerSection({
  accountId,
  linkId,
  episodeId,
}: {
  accountId: string;
  linkId: string;
  episodeId: string;
}) {
  const clicks = await prisma.click.findMany({
    where: { accountId, linkId, episodeId },
    select: { referrer: true },
  });
  return (
    <BreakdownList
      title="Top referrers"
      items={computeReferrerBreakdown(clicks)}
    />
  );
}
