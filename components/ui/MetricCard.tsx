import React from "react";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | React.ReactNode;
  icon?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "compact" | "detailed";
  details?: Array<{ label: string; value: string | React.ReactNode }>;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  variant = "compact",
  details,
  className,
}: MetricCardProps) {
  const Icon = icon ? (Icons as any)[icon] : null;

  return (
    <div className={cn("km-card km-card-interactive p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-km-neutral-400 mb-1.5 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-km-neutral-900 tracking-tight">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
                  trend.isPositive ? "bg-emerald-50 text-km-success" : "bg-red-50 text-km-error"
                )}
              >
                {trend.isPositive ? <Icons.TrendingUp className="mr-1 h-3 w-3" /> : <Icons.TrendingDown className="mr-1 h-3 w-3" />}
                {trend.value}
              </span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-km-primary-50 to-km-emerald-50 shadow-sm border border-km-primary-100/60">
            <Icon className="h-5 w-5 text-km-primary-600" />
          </div>
        )}
      </div>

      {variant === "detailed" && details && details.length > 0 && (
        <div className="mt-4 pt-4 border-t border-km-neutral-100/80 space-y-2.5">
          {details.map((detail, idx) => (
             <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-km-neutral-500 font-medium">{detail.label}</span>
                <span className="font-bold text-km-neutral-900">{detail.value}</span>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
