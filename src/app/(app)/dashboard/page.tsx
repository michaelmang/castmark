import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/account";
import { StatCard } from "@/components/stat-card";
import { LinksBoard } from "@/components/links-board";
import { TrendChartCard } from "@/components/trend-chart-card";
import {
  StatsRowSkeleton,
  ChartCardSkeleton,
  LinksBoardSkeleton,
} from "@/components/skeletons";
import { daysAgo } from "@/lib/time";
import { buildDailyClickBuckets } from "@/lib/buckets";
import { getLinkLifecycleStatus } from "@/lib/link-status";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={<StatsRowSkeleton />}>
        <StatsRow />
      </Suspense>

      <Suspense fallback={<ChartCardSkeleton />}>
        <TrendSection />
      </Suspense>

      <Suspense fallback={<LinksBoardSkeleton />}>
        <LinksSection />
      </Suspense>
    </div>
  );
}

async function StatsRow() {
  const account = await getCurrentAccount();

  const [totalClicks, clicksThisWeek, links] = await Promise.all([
    prisma.click.count({ where: { accountId: account.id } }),
    prisma.click.count({
      where: { accountId: account.id, timestamp: { gte: daysAgo(7) } },
    }),
    prisma.link.findMany({
      where: { accountId: account.id },
      select: {
        startDate: true,
        endDate: true,
        sponsor: { select: { status: true } },
      },
    }),
  ]);

  const activeLinks = links.filter(
    (l) =>
      getLinkLifecycleStatus({
        sponsorStatus: l.sponsor.status,
        startDate: l.startDate,
        endDate: l.endDate,
      }) === "active",
  ).length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Total clicks" value={totalClicks.toLocaleString()} />
      <StatCard
        label="Clicks this week"
        value={clicksThisWeek.toLocaleString()}
      />
      <StatCard label="Active links" value={activeLinks.toString()} />
    </div>
  );
}

async function TrendSection() {
  const account = await getCurrentAccount();

  const clicks = await prisma.click.findMany({
    where: { accountId: account.id, timestamp: { gte: daysAgo(30) } },
    select: { timestamp: true },
  });

  const chartData = buildDailyClickBuckets(clicks, 30);

  return (
    <TrendChartCard
      title="Clicks, last 30 days"
      chartData={chartData}
      href="/reports"
    />
  );
}

async function LinksSection() {
  const account = await getCurrentAccount();

  const sponsors = await prisma.sponsor.findMany({
    where: { accountId: account.id },
    include: {
      links: {
        include: { _count: { select: { clicks: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <LinksBoard
      accountSlug={account.slug}
      sponsors={sponsors.map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        links: s.links.map((l) => ({
          id: l.id,
          slug: l.slug,
          destinationUrl: l.destinationUrl,
          discountCode: l.discountCode,
          startDate: l.startDate,
          endDate: l.endDate,
          fallbackUrl: l.fallbackUrl,
          clickCount: l._count.clicks,
        })),
      }))}
    />
  );
}
