"use client";

import React from "react";
import { cn, getRecommendationColor } from "@/lib/utils";
import type { Recommendation } from "@/types";
import { RECOMMENDATION_LABELS } from "@/types";
import { CircleCheckBig, CircleAlert, Timer } from "lucide-react";

interface RecommendationBadgeProps {
  recommendation: Recommendation;
  /** Render as a massive hero badge (for RecommendationCard hero zone) */
  variant?: "default" | "hero";
  className?: string;
}

export function RecommendationBadge({ recommendation, variant = "default", className }: RecommendationBadgeProps) {
  const colors = getRecommendationColor(recommendation);
  const label = RECOMMENDATION_LABELS[recommendation];

  const iconMap = {
    SELL_NOW: CircleCheckBig,
    SELL_SOON: CircleAlert,
    WAIT: Timer,
  };
  const Icon = iconMap[recommendation];

  // Emoji for the hero variant — extremely simple visual cue
  const emojiMap = {
    SELL_NOW: "🟢",
    SELL_SOON: "🟡",
    WAIT: "⏳",
  };

  if (variant === "hero") {
    // Full-width massive high-contrast badge for farmers
    const heroBg = {
      SELL_NOW: "bg-gradient-to-r from-emerald-500 to-[#16A34A]",
      SELL_SOON: "bg-gradient-to-r from-amber-400 to-amber-500",
      WAIT: "bg-gradient-to-r from-km-neutral-400 to-km-neutral-500",
    };
    const heroTextColor = {
      SELL_NOW: "text-white",
      SELL_SOON: "text-amber-950",
      WAIT: "text-white",
    };

    return (
      <div
        className={cn(
          "km-animate-badge-pop w-full rounded-2xl px-6 py-5 flex items-center justify-between gap-4 shadow-lg",
          heroBg[recommendation],
          heroTextColor[recommendation],
          recommendation === "SELL_NOW" && "km-animate-glow",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl" role="img" aria-label={label}>{emojiMap[recommendation]}</span>
          <div>
            <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none">
              {label}
            </p>
            <p className={cn("text-sm font-semibold mt-1 opacity-80", heroTextColor[recommendation])}>
              {recommendation === "SELL_NOW" && "Prices are favorable — act fast!"}
              {recommendation === "SELL_SOON" && "Good window opening — plan to sell"}
              {recommendation === "WAIT" && "Prices may improve — hold for now"}
            </p>
          </div>
        </div>
        <Icon className={cn("h-10 w-10 opacity-60 hidden sm:block", heroTextColor[recommendation])} />
      </div>
    );
  }

  // Default compact badge
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold border-2 shadow-sm km-animate-badge-pop",
        colors.bg,
        colors.text,
        colors.border,
        recommendation === "SELL_NOW" && "km-animate-glow",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="tracking-wide uppercase">{label}</span>
    </div>
  );
}
