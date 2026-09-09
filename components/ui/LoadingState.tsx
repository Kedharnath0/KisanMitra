import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = "Loading...", className, fullScreen = false }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        fullScreen ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm" : "min-h-[200px] w-full",
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-km-primary-600" />
      {message && <p className="text-sm font-medium text-km-neutral-500 animate-pulse">{message}</p>}
    </div>
  );
}
