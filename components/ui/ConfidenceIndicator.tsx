"use client";

import React from "react";
import { cn, getConfidenceColor } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  confidence: number; // 0 to 100
  /** Simple mode hides the percentage number — shows only visual meter */
  variant?: "simple" | "detailed";
  className?: string;
}

export function ConfidenceIndicator({ confidence, variant = "detailed", className }: ConfidenceIndicatorProps) {
  const colors = getConfidenceColor(confidence);

  // Simple emoji face for farmers
  const getEmoji = (c: number) => {
    if (c >= 75) return "😊";
    if (c >= 50) return "🤔";
    return "😟";
  };

  if (variant === "simple") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <span className="text-2xl" role="img" aria-label="Confidence level">{getEmoji(confidence)}</span>
        <div className="flex-1">
          <div className="h-2.5 w-full rounded-full bg-km-neutral-100 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.fill)}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-km-neutral-500 uppercase tracking-wider">AI Confidence</span>
        <div className="flex items-center gap-1.5">
          <span className="text-base" role="img" aria-label="Confidence level">{getEmoji(confidence)}</span>
          <span className={colors.text}>{confidence}%</span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-km-neutral-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.fill)}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
