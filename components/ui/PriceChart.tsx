"use client";

import dynamic from "next/dynamic";
import { BarChart3, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Create a static fallback skeleton that matches the collapsed state
// so there is no layout shift or visual flash while loading Recharts
const Fallback = ({ crop, defaultOpen, className }: any) => (
  <div className={cn("km-card overflow-hidden", className)}>
    <button
      disabled
      className="flex w-full items-center justify-between px-5 py-4 hover:bg-km-neutral-50/50 transition-colors duration-200 opacity-70"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-km-primary-50 to-km-emerald-50 text-km-primary-600 border border-km-primary-100/60 shadow-sm">
          <BarChart3 className="h-5 w-5 animate-pulse" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-km-neutral-900">
            📊 {crop ? `${crop} Price Trends` : "Price Trends"}
          </p>
          <p className="text-xs text-km-neutral-500 font-medium">
            Loading chart...
          </p>
        </div>
      </div>
      <ChevronDown className="h-5 w-5 text-km-neutral-400" />
    </button>
  </div>
);

// Dynamically import the entire chart component to prevent SSR hang
const PriceChartInner = dynamic(() => import("./PriceChartInner"), {
  ssr: false,
  loading: (props) => <Fallback {...props} />,
});

interface PriceDataPoint {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  currentPrice?: number;
  crop?: string;
  defaultOpen?: boolean;
  className?: string;
}

export function PriceChart(props: PriceChartProps) {
  return <PriceChartInner {...props} />;
}
