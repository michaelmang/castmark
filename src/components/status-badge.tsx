import type { LinkLifecycleStatus } from "@/lib/link-status";

const STYLES: Record<LinkLifecycleStatus, string> = {
  active: "bg-success/10 text-success",
  scheduled: "bg-muted/15 text-muted",
  paused: "bg-warning/10 text-warning",
  expired: "bg-danger/10 text-danger",
};

const LABELS: Record<LinkLifecycleStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  paused: "Paused",
  expired: "Expired",
};

export function StatusBadge({ status }: { status: LinkLifecycleStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}
