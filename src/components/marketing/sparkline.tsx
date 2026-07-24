/** Static decorative area chart for marketing mockups. Renders without
 * client JS or recharts; real charts with live data use ClickChart on app
 * pages. */
export function Sparkline({
  values,
  height = 140,
}: {
  values: number[];
  height?: number;
}) {
  const width = 400;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 16) - 8;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2b04f" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#e2b04f" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparklineFill)" />
      <path d={linePath} fill="none" stroke="#e2b04f" strokeWidth={2} />
    </svg>
  );
}
