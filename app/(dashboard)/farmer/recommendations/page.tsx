"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calculator,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
} from "lucide-react";
import {
  MOCK_RECOMMENDATIONS,
  CROPS,
  QUALITY_OPTIONS,
  MOCK_BUYERS,
} from "@/data/mock";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { RecommendationBadge } from "@/components/ui/RecommendationBadge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import type { QualityGrade, Recommendation } from "@/types";

export default function RecommendationsPage() {
  const [crop, setCrop] = useState<string>("Tomato");
  const [quantity, setQuantity] = useState<number>(1000);
  const [unit, setUnit] = useState<"kg" | "quintal">("kg");
  const [quality, setQuality] = useState<QualityGrade>("A");
  const [location, setLocation] = useState<string>("Guntur");

  // Normalized qty in kg
  const qtyInKg = unit === "quintal" ? quantity * 100 : quantity;

  // Selected market for the breakdown calculator (defaults to top recommendation)
  const [selectedMarketId, setSelectedMarketId] = useState<string>("vijayawada");

  // Dynamic calculations based on user inputs
  // Base price modifier by quality
  const qualityMultiplier = quality === "A" ? 1.0 : quality === "B" ? 0.88 : 0.75;

  const recommendations = MOCK_RECOMMENDATIONS.map((rec) => {
    const adjustedPrice = Math.round(rec.expectedPrice * qualityMultiplier);
    const gross = adjustedPrice * qtyInKg;
    // Transport proportional to quantity
    const transport = Math.round(rec.estimatedTransport * (qtyInKg / 1000));
    const storage = 0;
    const net = gross - transport - storage;

    return {
      ...rec,
      expectedPrice: adjustedPrice,
      expectedGross: gross,
      estimatedTransport: transport,
      estimatedStorage: storage,
      expectedNetRealization: net,
    };
  }).sort((a, b) => b.score - a.score);

  const activeRec =
    recommendations.find((r) => r.marketId === selectedMarketId) ||
    recommendations[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-[#D9A441]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E2318]">
            Decision Support Engine
          </span>
        </div>
        <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
          Smart Market Recommendation & Net Return
        </h1>
        <p className="text-sm text-km-neutral-500 mt-1">
          Weighted model (Price 40%, Demand 25%, Distance 15%, Quality 10%, Buyer Reliability 10%) optimizing for maximum in-hand net realization.
        </p>
      </div>

      {/* ─── Input Form Strip ─── */}
      <div className="km-card p-5 sm:p-6 bg-white border border-km-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-km-neutral-100">
          <Sliders className="h-4 w-4 text-[#D9A441]" />
          <h2 className="font-fraunces font-bold text-base text-km-neutral-900">
            Specify Your Harvest Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Crop */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-500 block mb-1.5">
              Crop
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 bg-white focus:ring-2 focus:ring-[#D9A441] focus:outline-none"
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-500 block mb-1.5">
              Quantity
            </label>
            <div className="flex rounded-xl border border-km-neutral-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#D9A441]">
              <input
                type="number"
                min="10"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full p-2.5 text-sm font-semibold text-km-neutral-900 outline-none"
              />
              <button
                type="button"
                onClick={() => setUnit(unit === "kg" ? "quintal" : "kg")}
                className="px-3 bg-km-neutral-100 text-xs font-bold text-km-neutral-600 hover:bg-km-neutral-200 uppercase transition-colors"
              >
                {unit}
              </button>
            </div>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-500 block mb-1.5">
              Quality Grade
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as QualityGrade)}
              className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 bg-white focus:ring-2 focus:ring-[#D9A441] focus:outline-none"
            >
              {QUALITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Farm Location */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-500 block mb-1.5">
              Farm Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]"
              placeholder="e.g. Guntur"
            />
          </div>

          {/* Total Kg Notice */}
          <div className="flex flex-col justify-end">
            <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200/60 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Total Lot Volume
              </span>
              <strong className="text-sm font-black text-amber-950">
                {formatNumber(qtyInKg)} kg ({formatNumber(qtyInKg / 100)} quintals)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Hero Zone: Sell-Window Advice + Net Realization Calculator ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Sell-Window Advice Card */}
        <div className="lg:col-span-7 km-card p-6 border-l-4 border-l-[#D9A441] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-km-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-km-neutral-400">
                Optimal Timing Advice
              </span>
              <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900 mt-0.5">
                Sell Window Guidance
              </h2>
            </div>
            <RecommendationBadge recommendation={activeRec.recommendation} variant="hero" />
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-start gap-2.5">
                <Clock className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-amber-900">
                    SELL WITHIN 1–2 DAYS (Recommended Action)
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    Tomato arrivals at Vijayawada are dropping by 12% week-on-week while institutional food processor procurement orders remain unfilled. Selling within 48 hours maximizes price realization before weekend supply surges.
                  </p>
                </div>
              </div>
            </div>

            {/* Explainable Reasons */}
            <div className="p-4 rounded-xl bg-km-neutral-50 border border-km-neutral-200/60 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-km-neutral-500">
                Key Explainable Signals:
              </p>
              <ul className="space-y-2 text-xs text-km-neutral-700">
                {activeRec.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span className="font-medium">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-km-neutral-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-km-neutral-700">Confidence Score:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {activeRec.confidence}% (High Certainty)
              </span>
            </div>
            <Link
              href="/farmer/lots?action=create"
              className="font-bold text-[#D9A441] hover:underline flex items-center gap-1"
            >
              Lock in by Creating Lot →
            </Link>
          </div>
        </div>

        {/* Right 5 Cols: Net Return Calculator (Line-Item Breakdown) */}
        <div className="lg:col-span-5 card-forest p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#D9A441]" />
                <h3 className="font-fraunces font-bold text-lg text-[#F4F1E4]">
                  Net Return Calculator
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D9A441] text-[#0E2318]">
                {activeRec.marketName.replace(" Market Yard", "")}
              </span>
            </div>

            {/* Line-Item Breakdown */}
            <div className="space-y-3 text-xs text-[#D9D5BE]">
              <div className="flex justify-between items-center py-1">
                <span>Expected Mandi Price:</span>
                <strong className="text-white text-sm">₹{activeRec.expectedPrice}/kg</strong>
              </div>

              <div className="flex justify-between items-center py-1">
                <span>Gross Value ({formatNumber(qtyInKg)} kg × ₹{activeRec.expectedPrice}):</span>
                <span className="text-white font-semibold text-sm">
                  {formatCurrency(activeRec.expectedGross)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-red-300">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> Transport & Loading:
                </span>
                <span className="font-semibold text-sm">
                  -{formatCurrency(activeRec.estimatedTransport)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-neutral-400">
                <span>Cold Storage / Handling:</span>
                <span className="font-semibold text-sm">
                  ₹{activeRec.estimatedStorage} (Direct Sale)
                </span>
              </div>
            </div>
          </div>

          {/* Highlighted Net In-Hand Amount */}
          <div className="mt-6 pt-4 border-t border-white/15">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9A441] block mb-1">
              Estimated Net In-Hand Realization
            </span>
            <div className="font-fraunces text-3xl sm:text-4xl font-black text-[#D9A441] tracking-tight">
              {formatCurrency(activeRec.expectedNetRealization)}
            </div>
            <p className="text-[11px] text-[#D9D5BE] mt-1">
              Net proceeds deposited directly into verified bank account after buyer acceptance
            </p>

            <Link
              href="/farmer/offers"
              className="mt-5 w-full btn-gold text-xs shadow-md justify-center"
            >
              <span>Connect With Verified Buyers</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Ranked Market Recommendations Table ─── */}
      <div className="km-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-km-neutral-100 bg-gradient-to-r from-km-neutral-50 to-white">
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
            Ranked Markets by Composite Intelligence Score
          </h3>
          <p className="text-xs text-km-neutral-500">
            Click any row to simulate its Net Return Calculator breakdown above
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-4">Market Yard</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-right">Expected Rate</th>
                <th className="py-3.5 px-4 text-right">Gross Value</th>
                <th className="py-3.5 px-4 text-right">Transport</th>
                <th className="py-3.5 px-4 text-right">Net Realization</th>
                <th className="py-3.5 px-5 text-center">Sell Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {recommendations.map((rec, index) => {
                const isSelected = rec.marketId === selectedMarketId;
                return (
                  <tr
                    key={rec.marketId}
                    onClick={() => setSelectedMarketId(rec.marketId)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#D9A441]/10 font-medium"
                        : "hover:bg-amber-50/30"
                    }`}
                  >
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-[#D9A441] text-[#0E2318]"
                            : "bg-km-neutral-100 text-km-neutral-600"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-km-neutral-900">
                      {rec.marketName}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-km-neutral-100 text-km-neutral-800">
                        {rec.score} / 100
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-km-neutral-900">
                      ₹{rec.expectedPrice}/kg
                    </td>
                    <td className="py-4 px-4 text-right text-km-neutral-600">
                      {formatCurrency(rec.expectedGross)}
                    </td>
                    <td className="py-4 px-4 text-right text-red-600 font-medium">
                      -{formatCurrency(rec.estimatedTransport)}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-emerald-700 text-base">
                      {formatCurrency(rec.expectedNetRealization)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <RecommendationBadge recommendation={rec.recommendation} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
