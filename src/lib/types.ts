export type SponsorStatus = "active" | "paused" | "expired";
export const SPONSOR_STATUSES: SponsorStatus[] = [
  "active",
  "paused",
  "expired",
];

export type FallbackBehavior = "expired_page" | "redirect_url";
