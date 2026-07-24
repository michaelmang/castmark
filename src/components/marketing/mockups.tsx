import { ArrowRight, Copy } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Sparkline } from "@/components/marketing/sparkline";
import type { LinkLifecycleStatus } from "@/lib/link-status";

const TREND_VALUES = [
  120, 145, 132, 168, 190, 174, 210, 244, 226, 268, 290, 312, 298, 340,
];

export function DashboardMockup() {
  const rows: {
    sponsor: string;
    slug: string;
    destination: string;
    status: LinkLifecycleStatus;
    clicks: string;
  }[] = [
    {
      sponsor: "Acme Coffee",
      slug: "acme-coffee",
      destination: "roastworks.com/fall-blend",
      status: "active",
      clicks: "1,204",
    },
    {
      sponsor: "Nimbus VPN",
      slug: "nimbus-vpn",
      destination: "nimbusvpn.com/podcast20",
      status: "active",
      clicks: "892",
    },
    {
      sponsor: "Old Gear Co",
      slug: "old-gear",
      destination: "oldgear.co/clearance",
      status: "expired",
      clicks: "340",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total clicks" value="84,213" />
        <StatCard label="Clicks this week" value="3,842" />
        <StatCard label="Active links" value="12" />
      </div>

      <div className="border-border bg-surface-raised rounded-2xl border p-4">
        <p className="text-muted text-xs font-medium">
          Clicks in the last 30 days
        </p>
        <div className="mt-2 h-28">
          <Sparkline values={TREND_VALUES} />
        </div>
      </div>

      <div className="border-border bg-surface-raised overflow-hidden rounded-2xl border">
        {rows.map((row, i) => (
          <div
            key={row.sponsor}
            className={`flex items-center gap-3 px-4 py-3 text-sm ${
              i !== rows.length - 1 ? "border-border border-b" : ""
            }`}
          >
            <span className="text-foreground w-24 shrink-0 truncate font-medium">
              {row.sponsor}
            </span>
            <span className="text-muted hidden min-w-0 flex-1 truncate font-mono text-xs sm:inline">
              castmark.pro/{row.slug} → {row.destination}
            </span>
            <StatusBadge status={row.status} />
            <span className="text-foreground w-14 shrink-0 text-right">
              {row.clicks}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UrlPill({ slug }: { slug: string }) {
  return (
    <div className="border-border bg-surface-raised text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm">
      <Copy className="text-muted-2 h-3.5 w-3.5 shrink-0" />
      castmark.pro/{slug}
    </div>
  );
}

export function ShowNotesMockup() {
  return (
    <div className="border-border bg-surface-raised rounded-2xl border p-5 text-left">
      <p className="text-muted-2 text-xs font-medium tracking-wide uppercase">
        Episode 142 show notes
      </p>
      <p className="text-muted mt-3 text-sm leading-relaxed">
        This week&apos;s episode is brought to you by Acme Coffee. Get 20%
        off your first bag at{" "}
        <span className="text-accent font-mono">
          castmark.pro/acme-coffee
        </span>
        . Same link every episode. Bookmark it once.
      </p>
    </div>
  );
}

export function DestinationSwapMockup() {
  return (
    <div className="border-border bg-surface-raised rounded-2xl border p-5">
      <p className="text-muted-2 text-xs font-medium tracking-wide uppercase">
        Destination URL
      </p>
      <p className="text-muted-2 mt-3 font-mono text-sm line-through decoration-danger/60">
        roastworks.com/fall-blend
      </p>
      <div className="text-muted-2 my-1.5">
        <ArrowRight className="h-3.5 w-3.5 rotate-90" />
      </div>
      <p className="text-foreground font-mono text-sm">
        roastworks.com/winter-blend
      </p>
      <p className="text-success mt-4 text-xs font-medium">
        Updates 42 episodes instantly. Nothing else to edit.
      </p>
    </div>
  );
}

export function AnalyticsMockup() {
  const breakdown = [
    { label: "Mobile", share: 58 },
    { label: "Desktop", share: 34 },
    { label: "Tablet", share: 8 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border bg-surface-raised rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <p className="text-muted text-xs font-medium">
            Acme Coffee clicks
          </p>
          <p className="text-foreground text-sm font-semibold">1,204</p>
        </div>
        <div className="mt-2 h-32">
          <Sparkline values={TREND_VALUES} />
        </div>
      </div>
      <div className="border-border bg-surface-raised rounded-2xl border p-4">
        <p className="text-muted text-xs font-medium">By device</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-muted w-16 shrink-0 text-xs">
                {item.label}
              </span>
              <div className="bg-background h-1.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: `${item.share}%` }}
                />
              </div>
              <span className="text-muted-2 w-8 shrink-0 text-right text-xs">
                {item.share}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LeaderboardMockup() {
  const episodes = [
    { label: "Ep. 142: Why coffee prices spiked", clicks: 1204 },
    { label: "Ep. 138: Live from the roastery", clicks: 812 },
    { label: "Ep. 135: Listener mailbag", clicks: 431 },
    { label: "Ep. 129: The sponsor swap experiment", clicks: 289 },
  ];
  const max = Math.max(...episodes.map((e) => e.clicks));

  return (
    <div className="border-border bg-surface-raised rounded-2xl border p-5">
      <p className="text-muted text-xs font-medium">
        Top episodes for Acme Coffee
      </p>
      <div className="mt-3 flex flex-col">
        {episodes.map((ep, i) => (
          <div
            key={ep.label}
            className="border-border flex items-center gap-3 border-b py-2.5 text-sm last:border-b-0"
          >
            <span className="text-muted-2 w-4 shrink-0 text-xs">{i + 1}</span>
            <span className="text-foreground min-w-0 flex-1 truncate">
              {ep.label}
            </span>
            <div className="bg-background hidden h-1.5 w-16 shrink-0 overflow-hidden rounded-full sm:block">
              <div
                className="bg-accent h-full rounded-full"
                style={{ width: `${(ep.clicks / max) * 100}%` }}
              />
            </div>
            <span className="text-muted w-12 shrink-0 text-right text-xs">
              {ep.clicks.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CampaignsMockup() {
  const rows: { label: string; detail: string; status: LinkLifecycleStatus }[] =
    [
      { label: "Acme Coffee", detail: "Runs through Dec 31", status: "active" },
      {
        label: "Nimbus VPN: Black Friday",
        detail: "Starts Nov 24",
        status: "scheduled",
      },
      {
        label: "Trailhead Boots",
        detail: "Paused by sponsor",
        status: "paused",
      },
      {
        label: "Old Gear Co",
        detail: "Falls back to /expired",
        status: "expired",
      },
    ];

  return (
    <div className="border-border bg-surface-raised overflow-hidden rounded-2xl border">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center justify-between gap-3 px-4 py-3.5 text-sm ${
            i !== rows.length - 1 ? "border-border border-b" : ""
          }`}
        >
          <div className="min-w-0">
            <p className="text-foreground truncate font-medium">
              {row.label}
            </p>
            <p className="text-muted-2 truncate text-xs">{row.detail}</p>
          </div>
          <StatusBadge status={row.status} />
        </div>
      ))}
    </div>
  );
}
