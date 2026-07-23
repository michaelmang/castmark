export type LinkLifecycleStatus = "active" | "scheduled" | "paused" | "expired";

export function getLinkLifecycleStatus(input: {
  sponsorStatus: string;
  startDate: Date | null;
  endDate: Date | null;
  now?: Date;
}): LinkLifecycleStatus {
  const now = input.now ?? new Date();

  if (input.sponsorStatus === "expired") return "expired";
  if (input.sponsorStatus === "paused") return "paused";
  if (input.startDate && input.startDate > now) return "scheduled";
  if (input.endDate && input.endDate < now) return "expired";
  return "active";
}
