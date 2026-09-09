"use client";

import React, { useState } from "react";
import { MapPin, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { MarketPrice } from "@/types";

interface MarketCardProps {
  priceData: MarketPrice;
  distanceKm?: number;
  isRecommended?: boolean;
  className?: string;
  onClick?: () => void;
}

export function MarketCard({ priceData, distanceKm, isRecommended, className, onClick }: MarketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUp = priceData.modalPrice > priceData.minPrice; // Demo trend logic

  return (
    <div
      onClick={onClick}
      className={cn(
        "km-card km-card-interactive relative flex flex-col overflow-hidden p-5",
        isRecommended && "ring-2 ring-km-primary-500/30 border-km-primary-300",
        className
      )}
    >
      {/* Recommended shimmer accent */}
      {isRecommended && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16A34A] via-[#10B981] to-[#16A34A]" />
      )}

      {/* Level 1: Essentials — Market name, price, trend */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-km-neutral-900 group-hover:text-km-primary-700 transition-colors tracking-tight">
              {priceData.marketName}
            </h3>
            {isRecommended && (
              <span className="km-animate-badge-pop inline-flex items-center rounded-full bg-km-primary-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                Best
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-km-neutral-500">
            <MapPin className="h-3.5 w-3.5" />
            <span>{distanceKm ? `${distanceKm} km away` : priceData.source || "Local Market"}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-km-neutral-900 tracking-tight">
            {formatCurrency(priceData.modalPrice)}<span className="text-sm font-medium text-km-neutral-400">/kg</span>
          </p>
          <div className={cn("mt-1 flex items-center justify-end gap-1 text-sm font-bold", isUp ? "text-km-success" : "text-km-error")}>
            {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-xs">{isUp ? "Rising" : "Falling"}</span>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        aria-expanded={isExpanded}
        className="km-disclosure-toggle mt-4 self-start"
      >
        <span>{isExpanded ? "Hide Details" : "More Details"}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isExpanded && "rotate-180")} />
      </button>

      {/* Level 2: Expanded details — Price range, arrivals */}
      {isExpanded && (
        <div className="mt-3 km-animate-expand">
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-km-neutral-50/80 p-3.5 ring-1 ring-inset ring-km-neutral-200/50">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Arrivals</p>
              <p className="mt-0.5 text-sm font-bold text-km-neutral-800">{priceData.arrivalQuantity.toLocaleString()} tonnes</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Price Range</p>
              <p className="mt-0.5 text-sm font-bold text-km-neutral-800">{formatCurrency(priceData.minPrice)} – {formatCurrency(priceData.maxPrice)}</p>
            </div>
            {distanceKm && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Distance</p>
                <p className="mt-0.5 text-sm font-bold text-km-neutral-800">{distanceKm} km</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Updated</p>
              <p className="mt-0.5 text-sm font-bold text-km-neutral-800">{priceData.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
