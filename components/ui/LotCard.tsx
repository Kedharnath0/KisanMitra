"use client";

import React, { useState } from "react";
import { Package, MapPin, Calendar, ChevronDown } from "lucide-react";
import { cn, formatQuantity, formatDate, getLotStatusColor, getQualityColor } from "@/lib/utils";
import type { Lot } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { LOT_STATUS_LABELS, QUALITY_LABELS } from "@/types";

interface LotCardProps {
  lot: Lot;
  className?: string;
  onClick?: () => void;
}

export function LotCard({ lot, className, onClick }: LotCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusColor = getLotStatusColor(lot.status);
  const qualityColor = getQualityColor(lot.quality);

  return (
    <div
      onClick={onClick}
      className={cn(
        "km-card km-card-interactive flex flex-col",
        className
      )}
    >
      {/* Level 1: Essentials — Status badge + crop + quantity */}
      <div className="flex items-center justify-between p-4 border-b border-km-neutral-100/80">
        <StatusBadge label={LOT_STATUS_LABELS[lot.status]} colorScheme={statusColor} pulse={lot.status === "OFFER_RECEIVED"} />
        <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", qualityColor.bg, qualityColor.text, qualityColor.border, "border")}>
          {QUALITY_LABELS[lot.quality]}
        </span>
      </div>
      
      {/* Optional Lot Photo Preview */}
      {lot.images && lot.images.length > 0 && (
        <div className="relative w-full h-36 bg-km-neutral-100 overflow-hidden border-b border-km-neutral-100">
          <img
            src={lot.images[0]}
            alt={`${lot.crop} lot`}
            className="w-full h-full object-cover"
          />
          {lot.images.length > 1 && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
              +{lot.images.length - 1} photos
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-km-primary-50 to-km-emerald-50 text-km-primary-600 border border-km-primary-100/60 shadow-sm">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-km-neutral-900 tracking-tight leading-tight">
              {lot.crop} {lot.variety && <span className="text-km-neutral-400 font-medium">· {lot.variety}</span>}
            </h3>
            <p className="text-sm font-bold text-km-neutral-500 mt-0.5">{formatQuantity(lot.quantity)}</p>
          </div>
        </div>

        {/* Price footer — always visible */}
        <div className="rounded-xl bg-km-neutral-50/80 p-3 ring-1 ring-inset ring-km-neutral-200/50 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Expected Price</span>
          <span className="font-black text-km-neutral-900">₹{lot.expectedPrice}/kg</span>
        </div>

        {/* Progressive Disclosure Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          aria-expanded={isExpanded}
          className="km-disclosure-toggle mt-3 self-start"
        >
          <span>{isExpanded ? "Hide Details" : "Details"}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isExpanded && "rotate-180")} />
        </button>

        {/* Level 2: Expanded — Location, harvest date */}
        {isExpanded && (
          <div className="mt-3 space-y-2.5 km-animate-expand">
            <div className="flex items-center gap-2.5 text-sm text-km-neutral-600 font-medium">
              <MapPin className="h-4 w-4 text-km-neutral-400" />
              <span>{lot.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-km-neutral-600 font-medium">
              <Calendar className="h-4 w-4 text-km-neutral-400" />
              <span>Harvested on {formatDate(lot.harvestDate)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
