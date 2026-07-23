"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function ClickChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2b04f" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#e2b04f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8a8a86", fontSize: 11 }}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            interval="preserveStartEnd"
            minTickGap={40}
          />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.14)" }}
            contentStyle={{
              background: "#131313",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(value) =>
              new Date(String(value)).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            labelStyle={{ color: "#8a8a86" }}
            itemStyle={{ color: "#f5f5f4" }}
            formatter={(value) => [value, "Clicks"] as [number, string]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#e2b04f"
            strokeWidth={2}
            fill="url(#clicksFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
