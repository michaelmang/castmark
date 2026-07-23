export function buildDailyClickBuckets(
  clicks: { timestamp: Date }[],
  days: number,
): { date: string; count: number }[] {
  const buckets: Record<string, number> = {};
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }

  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  cutoff.setHours(0, 0, 0, 0);

  for (const click of clicks) {
    if (click.timestamp < cutoff) continue;
    const key = click.timestamp.toISOString().slice(0, 10);
    if (key in buckets) buckets[key]++;
  }

  return Object.entries(buckets).map(([date, count]) => ({ date, count }));
}
