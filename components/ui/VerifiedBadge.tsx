"use client";

import React, { useState } from "react";
import { ShieldCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  isVerified: boolean;
  className?: string;
}

export function VerifiedBadge({ isVerified, className }: VerifiedBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-200",
          isVerified 
            ? "bg-gradient-to-r from-[#16A34A] to-[#10B981] text-white shadow-sm ring-1 ring-green-900/10 km-animate-badge-pop" 
            : "bg-km-neutral-100 text-km-neutral-500 border border-km-neutral-200/60 shadow-sm",
          isVerified && "hover:shadow-md hover:shadow-green-500/20",
          className
        )}
      >
        {isVerified ? (
          <>
            <ShieldCheck className="h-3.5 w-3.5 text-white" />
            <span>Verified</span>
          </>
        ) : (
          <>
            <Shield className="h-3.5 w-3.5 text-km-neutral-400" />
            <span>Unverified</span>
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && isVerified && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-lg bg-km-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg km-animate-fade-in">
          Verified by KisanMitra
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-km-neutral-900" />
        </div>
      )}
    </div>
  );
}
