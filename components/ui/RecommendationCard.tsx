"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { MarketRecommendation } from "@/types";
import { RecommendationBadge } from "./RecommendationBadge";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

interface RecommendationCardProps {
  recommendation: MarketRecommendation;
  className?: string;
}

export function RecommendationCard({ recommendation, className }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "km-card relative overflow-hidden shadow-md",
        className
      )}
    >
      {/* Top Banner — AI insight indicator */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-km-primary-50 via-km-emerald-50 to-km-primary-50 px-5 py-2.5 border-b border-km-primary-100/60">
        <Sparkles className="h-4 w-4 text-km-primary-600" />
        <span className="text-xs font-bold text-km-primary-800 tracking-widest uppercase">Smart Recommendation</span>
        <span className="text-[10px] font-medium text-km-primary-500 ml-auto">Demo Data</span>
      </div>

      <div className="p-5 sm:p-6">
        {/* ============================================
            LEVEL 1 — HERO ZONE (Farmer sees this first)
            Must be understandable in 2 seconds.
            ============================================ */}
        
        {/* Massive Recommendation Badge */}
        <RecommendationBadge recommendation={recommendation.recommendation} variant="hero" className="mb-5" />

        {/* Key numbers — market name + net realization */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-sm font-semibold text-km-neutral-500">Best Market</p>
            <h2 className="text-xl font-black text-km-neutral-900 tracking-tight">{recommendation.marketName}</h2>
          </div>
          <div className="text-left sm:text-right bg-km-primary-50/60 rounded-xl px-4 py-3 ring-1 ring-inset ring-km-primary-200/50">
            <p className="text-[10px] font-bold text-km-primary-700 uppercase tracking-wider">You Will Earn</p>
            <p className="text-3xl font-black text-[#16A34A] tracking-tight mt-0.5">{formatCurrency(recommendation.expectedNetRealization)}</p>
          </div>
        </div>

        {/* Simple confidence meter (no numbers — just visual) */}
        <ConfidenceIndicator confidence={recommendation.confidence} variant="simple" className="mb-5" />

        {/* ============================================
            LEVEL 2 — DETAILS (Hidden by default)
            Price breakdown, reasons, confidence %
            ============================================ */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="km-disclosure-toggle w-full justify-center"
        >
          <span>{isExpanded ? "Hide Details" : "View Details"}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isExpanded && "rotate-180")} />
        </button>

        {isExpanded && (
          <div className="mt-5 space-y-5 km-animate-expand">
            {/* Detailed confidence with percentage */}
            <ConfidenceIndicator confidence={recommendation.confidence} variant="detailed" />

            {/* Reasons list */}
            <div className="bg-km-neutral-50/80 p-4 rounded-xl border border-km-neutral-100/80">
              <p className="text-[10px] font-bold text-km-neutral-400 uppercase tracking-wider mb-3">Why this recommendation?</p>
              <ul className="space-y-2">
                {recommendation.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-km-neutral-800">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-km-primary-500 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price breakdown grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-km-neutral-100">
              <div>
                <p className="text-[10px] text-km-neutral-400 font-bold uppercase tracking-wider">Price/kg</p>
                <p className="font-black text-km-neutral-900 mt-1">{formatCurrency(recommendation.expectedPrice)}</p>
              </div>
              <div>
                <p className="text-[10px] text-km-neutral-400 font-bold uppercase tracking-wider">Gross</p>
                <p className="font-black text-km-neutral-900 mt-1">{formatCurrency(recommendation.expectedGross)}</p>
              </div>
              <div>
                <p className="text-[10px] text-km-neutral-400 font-bold uppercase tracking-wider">Transport</p>
                <p className="font-bold text-km-error mt-1">-{formatCurrency(recommendation.estimatedTransport)}</p>
              </div>
              <div>
                <p className="text-[10px] text-km-neutral-400 font-bold uppercase tracking-wider">Storage</p>
                <p className="font-bold text-km-error mt-1">-{formatCurrency(recommendation.estimatedStorage)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
