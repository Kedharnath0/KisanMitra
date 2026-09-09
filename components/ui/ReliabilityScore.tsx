import React from "react";
import { Star } from "lucide-react";
import { cn, getReliabilityColor } from "@/lib/utils";

interface ReliabilityScoreProps {
  score: number; // 0 to 100
  className?: string;
}

export function ReliabilityScore({ score, className }: ReliabilityScoreProps) {
  const colors = getReliabilityColor(score);
  
  // Convert 0-100 score to 1-5 stars for visual representation
  const starCount = Math.round(score / 20);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <span className={cn("text-lg font-bold", colors.text)}>{score}%</span>
        <span className="text-xs text-km-neutral-500 font-medium uppercase tracking-wider">Reliability</span>
      </div>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= starCount ? colors.text : "text-km-neutral-200",
              star <= starCount ? "fill-current" : ""
            )}
          />
        ))}
      </div>
    </div>
  );
}
