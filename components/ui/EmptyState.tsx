import React from "react";
import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-km-neutral-300 bg-km-neutral-50 p-8 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-km-neutral-100 p-4 text-km-neutral-400">
        {icon || <PackageOpen className="h-8 w-8" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-km-neutral-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-km-neutral-500">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
