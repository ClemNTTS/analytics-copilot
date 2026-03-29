"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartDatum = Record<string, string | number | boolean | null | undefined>;

interface SmartChartProps {
  data: ChartDatum[];
  config: {
    type: "bar" | "line" | "pie";
    xAxis: string;
    yAxis: string;
    label?: string;
  };
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function SmartChart({ data, config }: SmartChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    [config.yAxis]: Number(item[config.yAxis]),
  }));

  if (config.type === "bar") {
    return (
      <div className="mt-4 h-75 w-full rounded-xl border border-card-border bg-muted/30 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(0,0,0,0.1)"
            />
            <XAxis
              dataKey={config.xAxis}
              fontSize={10}
              tick={{ fill: "currentColor", opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              fontSize={10}
              tick={{ fill: "currentColor", opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey={config.yAxis}
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              name={config.label || config.yAxis}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (config.type === "line") {
    return (
      <div className="mt-4 h-75 w-full rounded-xl border border-card-border bg-muted/30 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(0,0,0,0.1)"
            />
            <XAxis
              dataKey={config.xAxis}
              fontSize={10}
              tick={{ fill: "currentColor", opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              fontSize={10}
              tick={{ fill: "currentColor", opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey={config.yAxis}
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2563eb" }}
              name={config.label || config.yAxis}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (config.type === "pie") {
    const sortedData = [...chartData].sort(
      (left, right) =>
        Number(right[config.yAxis] ?? 0) - Number(left[config.yAxis] ?? 0),
    );

    const maxSegments = 6;
    let finalPieData = sortedData;

    if (sortedData.length > maxSegments) {
      const topSegments = sortedData.slice(0, maxSegments - 1);
      const otherSegments = sortedData.slice(maxSegments - 1);
      const otherValue = otherSegments.reduce(
        (sum, item) => sum + Number(item[config.yAxis] ?? 0),
        0,
      );

      finalPieData = [
        ...topSegments,
        {
          [config.xAxis]: `Autres (${otherSegments.length})`,
          [config.yAxis]: otherValue,
          isOther: true,
        },
      ];
    }

    return (
      <div className="mt-4 flex h-75 w-full flex-col rounded-xl border border-card-border bg-muted/30 p-4 shadow-sm">
        {config.label && (
          <h4 className="mb-2 text-center text-xs font-bold uppercase text-foreground/50">
            {config.label}
          </h4>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={finalPieData}
              dataKey={config.yAxis}
              nameKey={config.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
              label={({ percent }) =>
                percent && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
              }
            >
              {finalPieData.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={item.isOther ? "#94a3b8" : COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | string | undefined) =>
                new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(value ?? 0))
              }
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
