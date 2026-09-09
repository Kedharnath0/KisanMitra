import React from "react";
import { cn } from "@/lib/utils";
import type { StatusColorScheme } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  colorScheme: StatusColorScheme;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ label, colorScheme, pulse = false, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
        colorScheme.bg,
        colorScheme.text,
        colorScheme.border,
        className
      )}
    >
      {colorScheme.dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                colorScheme.dot
              )}
            />
          )}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colorScheme.dot)} />
        </span>
      )}
      {label}
    </span>
  );
}
