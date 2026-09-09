"use client";

import React, { useState } from "react";
import { Building2, Check, X, ChevronDown, Calendar } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Offer, BuyerMatch } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { ReliabilityScore } from "./ReliabilityScore";

interface OfferCardProps {
  offer: Offer;
  buyerInfo: BuyerMatch; // Passed down from Agent 3's query
  lotExpectedPrice?: number;
  className?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

export function OfferCard({
  offer,
  buyerInfo,
  lotExpectedPrice,
  className,
  onAccept,
  onReject,
}: OfferCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isGoodOffer = lotExpectedPrice ? offer.pricePerKg >= lotExpectedPrice : true;

  return (
    <div className={cn("km-card overflow-hidden", className)}>
      {/* Level 1: Essentials — Buyer name, verified badge, price, actions */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-km-neutral-50 to-km-neutral-100 text-km-neutral-500 border border-km-neutral-200/60 shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-km-neutral-900 tracking-tight">{buyerInfo.companyName}</h3>
              <div className="mt-1.5">
                <VerifiedBadge isVerified={buyerInfo.verified} />
              </div>
            </div>
          </div>
          
          {/* Price — always prominent */}
          <div className="text-left sm:text-right bg-km-neutral-50/80 rounded-xl p-3.5 ring-1 ring-inset ring-km-neutral-200/50 self-start min-w-[120px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Offered Price</p>
            <p className={cn("text-2xl font-black tracking-tight mt-0.5", isGoodOffer ? "text-km-success" : "text-km-warning")}>
              {formatCurrency(offer.pricePerKg)}<span className="text-sm font-medium text-km-neutral-400">/kg</span>
            </p>
          </div>
        </div>

        {/* Progressive Disclosure Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="km-disclosure-toggle mb-4"
        >
          <span>{isExpanded ? "Hide Buyer Details" : "Buyer Details"}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isExpanded && "rotate-180")} />
        </button>

        {/* Level 2: Expanded — Reliability, message, delivery date */}
        {isExpanded && (
          <div className="mb-5 space-y-3 km-animate-expand">
            <div className="rounded-xl bg-km-neutral-50/80 p-4 ring-1 ring-inset ring-km-neutral-200/50">
              <ReliabilityScore score={buyerInfo.reliabilityScore} />
            </div>

            {offer.message && (
              <div className="rounded-xl border border-km-neutral-100 bg-km-neutral-50/50 p-3.5 text-sm text-km-neutral-700 italic shadow-sm">
                &ldquo;{offer.message}&rdquo;
              </div>
            )}

            {offer.deliveryDate && (
              <div className="flex items-center gap-2 text-sm text-km-neutral-600 font-medium">
                <Calendar className="h-4 w-4 text-km-neutral-400" />
                <span>Delivery by {formatDate(offer.deliveryDate)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons — always visible when pending */}
      {offer.status === "PENDING" && (
        <div className="flex items-center gap-3 px-5 py-4 border-t border-km-neutral-100/80 bg-km-neutral-50/30">
          <button
            onClick={onReject}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-km-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-km-error shadow-sm hover:bg-red-50 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 active:scale-[0.98] transition-all duration-200"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={onAccept}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#10B981] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-[0.98] transition-all duration-200"
          >
            <Check className="h-4 w-4" /> Accept Offer
          </button>
        </div>
      )}
    </div>
  );
}
