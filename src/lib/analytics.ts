type ClickLike = { deviceType: string | null; referrer: string | null };

export function computeDeviceBreakdown(
  clicks: Pick<ClickLike, "deviceType">[],
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const click of clicks) {
    const label = click.deviceType ?? "other";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeReferrerBreakdown(
  clicks: Pick<ClickLike, "referrer">[],
  limit = 6,
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const click of clicks) {
    let label = "Direct";
    if (click.referrer) {
      try {
        label = new URL(click.referrer).hostname.replace(/^www\./, "");
      } catch {
        label = click.referrer;
      }
    }
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
