"use client";

import React, { useState } from "react";
import { BarChart3, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface PriceDataPoint {
  date: string;
  price: number;
}

export interface PriceChartInnerProps {
  data: PriceDataPoint[];
  currentPrice?: number;
  crop?: string;
  defaultOpen?: boolean;
  className?: string;
}

export default function PriceChartInner({
  data,
  currentPrice,
  crop,
  defaultOpen = false,
  className,
}: PriceChartInnerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isTrendUp = data.length >= 2 ? data[data.length - 1].price > data[0].price : true;
  const lineColor = isTrendUp ? "#16A34A" : "#dc2626";

  return (
    <div className={cn("km-card overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-5 py-4 hover:bg-km-neutral-50/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-km-primary-50 to-km-emerald-50 text-km-primary-600 border border-km-primary-100/60 shadow-sm">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-km-neutral-900">
              📊 {crop ? `${crop} Price Trends` : "Price Trends"}
            </p>
            <p className="text-xs text-km-neutral-500 font-medium">
              {isOpen ? "Viewing historical data" : "Tap to view price chart"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-km-neutral-400 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 km-animate-expand">
          <div className="rounded-xl bg-km-neutral-50/50 p-4 ring-1 ring-inset ring-km-neutral-200/50">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--km-neutral-200)"
                  strokeOpacity={0.6}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--km-neutral-500)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--km-neutral-200)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--km-neutral-500)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid var(--km-neutral-200)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: "8px 14px",
                  }}
                  formatter={(value: any) => [`₹${value}/kg`, "Price"]}
                  labelStyle={{ color: "var(--km-neutral-500)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}
                />
                {currentPrice && (
                  <ReferenceLine
                    y={currentPrice}
                    stroke="#16A34A"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{
                      value: `Current ₹${currentPrice}`,
                      position: "insideTopRight",
                      fill: "#16A34A",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={lineColor}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: lineColor, stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: lineColor, stroke: "white", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-km-neutral-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: lineColor }} />
              <span>{crop || "Crop"} price per kg</span>
            </div>
            {currentPrice && (
              <div className="flex items-center gap-2">
                <span className="inline-block h-px w-4 border-t-2 border-dashed border-km-primary-500" />
                <span>Current price</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
