"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronDown,
  Check,
  Building2,
  Coins,
} from "lucide-react";
import { MOCK_MARKET_PRICES, MockMarketPrice } from "@/data/mock";
import { CropImage } from "@/components/ui/CropImage";
import { useFarmerProfile } from "@/lib/farmer-profile-context";
import { cn } from "@/lib/utils";

// List of supported crops with rich data
const AVAILABLE_CROPS = [
  "Tomato",
  "Chilli",
  "Cotton",
  "Onion",
  "Rice",
  "Maize",
] as const;

function TrendBadge({ trend, pct }: { trend: MockMarketPrice["trend"]; pct: number }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <TrendingUp className="h-3 w-3" />+{pct}%
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
        <TrendingDown className="h-3 w-3" />{pct}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-full">
      <Minus className="h-3 w-3" />Stable
    </span>
  );
}

export default function MarketsPage() {
  const { profile } = useFarmerProfile();

  // Sensible default: farmer's primary active crop if available, otherwise "Tomato"
  const defaultCrop =
    profile?.crops && profile.crops.length > 0 && AVAILABLE_CROPS.includes(profile.crops[0] as any)
      ? profile.crops[0]
      : "Tomato";

  const [activeCrop, setActiveCrop] = useState<string>(defaultCrop);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter prices for the active crop (or all)
  const filteredPrices =
    activeCrop === "All Crops"
      ? MOCK_MARKET_PRICES
      : MOCK_MARKET_PRICES.filter((p) => p.crop === activeCrop);

  // Best price for selected crop
  const bestPrice = filteredPrices.reduce<MockMarketPrice | null>((best, p) => {
    if (!best) return p;
    return p.modalPrice > best.modalPrice ? p : best;
  }, null);

  // Summary stats
  const avgPrice =
    filteredPrices.length > 0
      ? Math.round(
          filteredPrices.reduce((s, p) => s + p.modalPrice, 0) / filteredPrices.length
        )
      : 0;
  const totalArrivals = filteredPrices.reduce((s, p) => s + p.arrivalQuantity, 0);

  // Helper to get quick preview data for each crop in dropdown
  const getCropOverview = (cropName: string) => {
    const list = MOCK_MARKET_PRICES.filter((p) => p.crop === cropName);
    const top = list.reduce<MockMarketPrice | null>((best, p) => {
      if (!best) return p;
      return p.modalPrice > best.modalPrice ? p : best;
    }, null);
    return {
      topRate: top ? top.modalPrice : 0,
      topMandi: top ? top.marketName : "—",
      trend: top ? top.trend : "stable",
      trendPct: top ? top.trendPct : 0,
    };
  };

  const activeOverview = getCropOverview(activeCrop);

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Live Market Prices
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Mandi modal rates and arrivals across Andhra Pradesh yards.{" "}
            <span className="text-amber-600 font-medium">Prototype demo data.</span>
          </p>
        </div>
        <Link
          href="/farmer/recommendations"
          className="btn-gold text-xs shadow-sm flex items-center gap-1.5 self-start"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Get Smart Recommendation</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ─── Summary Strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="km-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">
            {activeCrop} Mandis Tracked
          </p>
          <p className="font-fraunces text-2xl font-black text-km-neutral-900 mt-1">
            {filteredPrices.length}
          </p>
        </div>
        <div className="km-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">
            Avg Modal Price
          </p>
          <p className="font-fraunces text-2xl font-black text-[#D9A441] mt-1">
            ₹{avgPrice}/kg
          </p>
        </div>
        <div className="km-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">
            Top Rate Today
          </p>
          <p className="font-fraunces text-2xl font-black text-emerald-700 mt-1">
            {bestPrice ? `₹${bestPrice.modalPrice}/kg` : "—"}
          </p>
        </div>
        <div className="km-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">
            Total Arrivals
          </p>
          <p className="font-fraunces text-2xl font-black text-km-neutral-900 mt-1">
            {(totalArrivals / 1000).toFixed(0)}T kg
          </p>
        </div>
      </div>

      {/* ─── FEATURE 3: Horizontal Crop Selector Bar (Replaces Graph) ─── */}
      <div
        ref={dropdownRef}
        className="relative bg-[#0E2318] rounded-3xl p-5 sm:p-6 text-[#F4F1E4] shadow-xl border border-[#D9A441]/30 overflow-visible"
      >
        {/* Background glow styling */}
        <div className="absolute right-0 top-0 w-72 h-44 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D9A441]/20 via-transparent to-transparent pointer-events-none rounded-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Active Crop Meta & Headline */}
          <div className="flex items-center gap-4">
            <div className="p-1.5 rounded-2xl bg-white/10 border border-white/10 shrink-0">
              <CropImage crop={activeCrop} size="lg" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A441]">
                  Currently Monitoring
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex items-baseline gap-3 mt-0.5">
                <h2 className="text-2xl sm:text-3xl font-bold font-fraunces text-[#F4F1E4] tracking-tight">
                  {activeCrop}
                </h2>
                {activeOverview.topRate > 0 && (
                  <span className="font-fraunces text-xl font-black text-[#D9A441]">
                    ₹{activeOverview.topRate}/kg
                  </span>
                )}
              </div>

              <p className="text-xs text-[#D9D5BE] flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1">
                <span>
                  Top Mandi: <strong className="text-white">{activeOverview.topMandi}</strong>
                </span>
                <span className="text-white/30 hidden sm:inline">|</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  {activeOverview.trend === "up" ? "▲" : activeOverview.trend === "down" ? "▼" : "•"}{" "}
                  {activeOverview.trendPct > 0 ? `+${activeOverview.trendPct}% demand` : "steady"}
                </span>
              </p>
            </div>
          </div>

          {/* Interactive Dropdown Button */}
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[#D9A441] text-[#0E2318] hover:bg-[#c99432] font-bold text-sm shadow-md transition-all duration-200 active:scale-98 cursor-pointer select-none group border border-[#D9A441]"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                <span>Select Crop: </span>
                <strong className="underline underline-offset-2">{activeCrop}</strong>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        {/* Quick-Access Crop Pills Bar right on the selector */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9D5BE]/70 shrink-0 mr-1">
            Quick Switch:
          </span>
          {AVAILABLE_CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => {
                setActiveCrop(crop);
                setIsDropdownOpen(false);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 shrink-0 cursor-pointer flex items-center gap-1.5",
                activeCrop === crop
                  ? "bg-[#D9A441] text-[#0E2318] shadow-sm font-bold"
                  : "bg-white/10 text-[#D9D5BE] hover:bg-white/20 hover:text-white border border-white/10"
              )}
            >
              <span>{crop}</span>
              {activeCrop === crop && <Check className="h-3 w-3 stroke-[3]" />}
            </button>
          ))}
          <button
            onClick={() => {
              setActiveCrop("All Crops");
              setIsDropdownOpen(false);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 shrink-0 cursor-pointer",
              activeCrop === "All Crops"
                ? "bg-[#D9A441] text-[#0E2318] font-bold"
                : "bg-white/10 text-[#D9D5BE] hover:bg-white/20 hover:text-white border border-white/10"
            )}
          >
            All Crops
          </button>
        </div>

        {/* ─── Expandable Crop Selector Dropdown List ─── */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-white text-km-neutral-900 rounded-2xl shadow-2xl border border-km-neutral-200 p-3 sm:p-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 px-2 pb-2 mb-1 border-b border-km-neutral-100 flex items-center justify-between">
              <span>Choose Crop to Compare Mandi Rates</span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                ● Live APMC Modal Rates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto p-1">
              {AVAILABLE_CROPS.map((crop) => {
                const info = getCropOverview(crop);
                const isSelected = activeCrop === crop;

                return (
                  <button
                    key={crop}
                    onClick={() => {
                      setActiveCrop(crop);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer",
                      isSelected
                        ? "bg-amber-50/70 border-[#D9A441] ring-2 ring-[#D9A441]/30 shadow-xs"
                        : "bg-white hover:bg-km-neutral-50 border-km-neutral-200 hover:border-[#D9A441]/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CropImage crop={crop} size="sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-km-neutral-900">
                            {crop}
                          </h4>
                          {isSelected && (
                            <span className="h-4 w-4 rounded-full bg-[#D9A441] text-[#0E2318] flex items-center justify-center text-[10px] font-black">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-km-neutral-500 truncate max-w-[140px]">
                          Top: {info.topMandi}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-km-neutral-900 block">
                        ₹{info.topRate}/kg
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          info.trend === "up"
                            ? "text-emerald-700"
                            : info.trend === "down"
                            ? "text-red-600"
                            : "text-neutral-500"
                        )}
                      >
                        {info.trend === "up" ? "▲" : info.trend === "down" ? "▼" : "•"}{" "}
                        {info.trendPct}%
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Option to show All Crops */}
              <button
                onClick={() => {
                  setActiveCrop("All Crops");
                  setIsDropdownOpen(false);
                }}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer sm:col-span-2 lg:col-span-3",
                  activeCrop === "All Crops"
                    ? "bg-amber-50/70 border-[#D9A441] ring-2 ring-[#D9A441]/30"
                    : "bg-km-neutral-50 hover:bg-km-neutral-100/80 border-km-neutral-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-km-neutral-600" />
                  <span className="font-bold text-sm text-km-neutral-800">
                    View All Mandis (All Crops Table)
                  </span>
                </div>
                <span className="text-xs text-[#D9A441] font-bold">
                  Compare all →
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Market Price Table (Driven by the Selected Crop) ─── */}
      <div className="km-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-km-neutral-100 bg-gradient-to-r from-km-neutral-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-fraunces font-bold text-lg text-km-neutral-900">
              {activeCrop} — Mandi Price Comparison
            </h2>
            <span className="text-xs text-km-neutral-400 font-normal">
              ({filteredPrices.length} yards)
            </span>
          </div>
          {bestPrice && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              Highest Rate: {bestPrice.marketName} (₹{bestPrice.modalPrice}/kg)
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-4">Market Yard</th>
                {activeCrop === "All Crops" && <th className="py-3 px-4">Crop</th>}
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4 text-right">Min</th>
                <th className="py-3 px-4 text-right">Modal Rate</th>
                <th className="py-3 px-4 text-right">Max</th>
                <th className="py-3 px-4 text-right">Arrivals (kg)</th>
                <th className="py-3 px-4 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {filteredPrices.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeCrop === "All Crops" ? 8 : 7}
                    className="py-10 text-center text-sm text-km-neutral-400"
                  >
                    No market data available for {activeCrop}.
                  </td>
                </tr>
              ) : (
                filteredPrices.map((price) => {
                  const isTopPrice = price.id === bestPrice?.id;
                  return (
                    <tr
                      key={price.id}
                      className={cn(
                        "transition-colors",
                        isTopPrice
                          ? "bg-emerald-50/60 hover:bg-emerald-50 font-medium"
                          : "hover:bg-amber-50/20"
                      )}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isTopPrice && (
                            <span className="inline-flex items-center justify-center w-4 h-4 bg-[#D9A441] rounded-full text-[9px] font-black text-[#0E2318]">
                              ★
                            </span>
                          )}
                          <span className="font-bold text-km-neutral-900">
                            {price.marketName}
                          </span>
                        </div>
                      </td>
                      {activeCrop === "All Crops" && (
                        <td className="py-3.5 px-4 font-semibold text-km-neutral-800">
                          {price.crop}
                        </td>
                      )}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-km-neutral-500">
                          <MapPin className="h-3 w-3" />
                          {price.district}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-km-neutral-500">
                        ₹{price.minPrice}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-km-neutral-900 text-base">
                          ₹{price.modalPrice}
                        </span>
                        <span className="text-km-neutral-400 text-xs">/kg</span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-km-neutral-500">
                        ₹{price.maxPrice}
                      </td>
                      <td className="py-3.5 px-4 text-right text-km-neutral-700 font-semibold">
                        {price.arrivalQuantity.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <TrendBadge trend={price.trend} pct={price.trendPct} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-km-neutral-50/50 border-t border-km-neutral-100 text-[11px] text-km-neutral-400">
          Data updated: 09 Sep 2026 · Source: Prototype simulated APMC data · Not live market feed
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="card-forest p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-fraunces font-bold text-lg text-[#F4F1E4]">
            Ready to sell your {activeCrop} at the best market?
          </h3>
          <p className="text-xs text-[#D9D5BE] mt-1">
            Get an instant recommendation calculating exact net returns factoring in transport and storage.
          </p>
        </div>
        <Link
          href="/farmer/recommendations"
          className="btn-gold text-sm shadow-md flex items-center gap-2 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Get Recommendation</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
