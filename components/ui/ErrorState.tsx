import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-xl border border-km-error/20 bg-km-error/5 p-8 text-center",
        className
      )}
    >
      <AlertTriangle className="mb-4 h-10 w-10 text-km-error" />
      <h3 className="mb-2 text-lg font-semibold text-km-neutral-900">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-km-neutral-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-km-neutral-700 shadow-sm border border-km-neutral-300 hover:bg-km-neutral-50 focus:outline-none focus:ring-2 focus:ring-km-neutral-200"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
