"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Truck,
  Building,
  CheckCircle2,
  Clock,
  PlusCircle,
} from "lucide-react";
import {
  MOCK_FARMER,
  MOCK_RECOMMENDATIONS,
  MOCK_OFFERS,
} from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { RecommendationBadge } from "@/components/ui/RecommendationBadge";

export default function FarmerDashboard() {
  const topRec = MOCK_RECOMMENDATIONS[0]; // Vijayawada
  const pendingOffers = MOCK_OFFERS.filter((o) => o.status === "PENDING");

  return (
    <div className="space-y-6 pb-10">
      {/* ─── 1. Header Card: Rural-Modern Hero Strip ─── */}
      <div className="card-forest p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D9A441]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4E8F5E]/20 text-[#7CB342] border border-[#4E8F5E]/30">
                <span className="h-2 w-2 rounded-full bg-[#7CB342] animate-pulse" />
                Live Market Advisory Active
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#D9D5BE] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7CB342]" />
                KYC Verified Farmer
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-fraunces text-[#F4F1E4] tracking-tight">
              Namaste, {MOCK_FARMER.name}
            </h1>
            <p className="text-sm sm:text-base text-[#D9D5BE] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#D9A441]" />
              <span>{MOCK_FARMER.location}, {MOCK_FARMER.district} District</span>
              <span className="text-white/30">|</span>
              <span>Farm Area: <strong className="text-[#F4F1E4]">{MOCK_FARMER.landArea}</strong></span>
              <span className="text-white/30">|</span>
              <span>Crops: <strong className="text-[#D9A441]">{MOCK_FARMER.activeCrops.join(", ")}</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/farmer/recommendations"
              className="btn-gold shadow-md hover:shadow-lg transition-all"
            >
              <span>Net Realization Calculator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/farmer/offers"
              className="btn-ghost-dark text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span>View Offers ({pendingOffers.length})</span>
            </Link>
          </div>
        </div>

        {/* Summary Strip: Gold Stat Block Pattern */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">{MOCK_FARMER.landArea}</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">No. of Acres</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">{pendingOffers.length}</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">Buyer Offers Pending</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">{MOCK_FARMER.activeCrops.length}</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">Total Crops</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">₹42,800</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">Total Realized Net</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Highlight Card: Smart Market Recommendation ─── */}
      <div className="km-card p-6 sm:p-8 border-l-4 border-l-[#D9A441] relative overflow-hidden bg-gradient-to-br from-white via-white to-amber-50/20 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-km-neutral-100">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#D9A441]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0E2318]">
              AI Market Intelligence & Recommendation
            </span>
          </div>
          <RecommendationBadge recommendation={topRec.recommendation} />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Best Market Highlight */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-km-neutral-500 uppercase tracking-wider">
                Top Recommended Market
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold font-fraunces text-km-neutral-900 mt-1">
                {topRec.marketName}
              </h3>
              <p className="text-sm text-km-neutral-600 flex items-center gap-1.5 mt-1.5">
                <Building className="h-4 w-4 text-[#D9A441]" />
                <span>35 km away · Krishna District Mandi Yard</span>
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-km-neutral-200/80 shadow-xs space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-km-neutral-600">Modal Mandi Price:</span>
                <strong className="text-km-neutral-900 text-base">₹{topRec.expectedPrice}/kg</strong>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-km-neutral-600">Farmer Lot:</span>
                <strong className="text-km-neutral-900">Tomato Grade A (1,000 kg)</strong>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-km-neutral-600">Est. Transport Cost:</span>
                <span className="text-red-600 font-semibold">-₹{topRec.estimatedTransport}</span>
              </div>
            </div>
          </div>

          {/* Expected Net Return Box */}
          <div className="bg-[#0E2318] text-[#F4F1E4] rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9A441]">
                Expected Net Realization
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-fraunces text-3xl sm:text-4xl font-bold text-[#D9A441]">
                  {formatCurrency(topRec.expectedNetRealization)}
                </span>
              </div>
              <p className="text-xs text-[#D9D5BE]">
                Net in-hand after transit & loading deductions
              </p>
            </div>

            <div className="my-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-[#D9D5BE]">
              <div className="flex justify-between">
                <span>Gross (₹27 × 1,000 kg):</span>
                <span className="text-white font-medium">₹27,000</span>
              </div>
              <div className="flex justify-between">
                <span>Net Margin Gain vs Guntur:</span>
                <span className="text-[#7CB342] font-semibold">+₹1,800</span>
              </div>
            </div>

            <Link
              href="/farmer/recommendations"
              className="w-full text-center py-2.5 px-4 rounded-full text-xs font-bold bg-[#D9A441] text-[#0E2318] hover:bg-[#C08A2E] transition-colors shadow-xs"
            >
              View Explainable Net Breakdown →
            </Link>
          </div>
        </div>

        {/* Sell Window Advice Bar */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                SELL WINDOW ADVICE: SELL WITHIN 1–2 DAYS
              </p>
              <p className="text-xs text-amber-800">
                Institutional tomato demand high at Vijayawada. Arrivals falling 12% week-on-week.
              </p>
            </div>
          </div>
          <Link
            href="/farmer/offers"
            className="shrink-0 text-xs font-bold text-amber-900 hover:text-amber-950 underline"
          >
            Check Buyer Offers ({pendingOffers.length} pending)
          </Link>
        </div>
      </div>

      {/* ─── 3. Inbound Buyer Offers ─── */}
      <div className="km-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-km-neutral-100">
          <div>
            <h3 className="font-fraunces font-bold text-xl text-km-neutral-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#D9A441]" />
              <span>Pending Buyer Offers</span>
            </h3>
            <p className="text-xs text-km-neutral-500 mt-0.5">
              Direct offers received from verified food processors & commercial buyers
            </p>
          </div>
          <Link
            href="/farmer/offers"
            className="text-xs font-bold text-[#D9A441] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Review All ({pendingOffers.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {pendingOffers.map((offer) => (
            <div
              key={offer.id}
              className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-3.5 flex flex-col justify-between hover:border-amber-300 transition-all shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-base text-km-neutral-900">
                        {offer.buyer.companyName}
                      </strong>
                      {offer.buyer.verified && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-km-neutral-500 mt-0.5">
                      {offer.buyer.location} · Reliability: {offer.buyer.reliabilityScore}%
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-km-neutral-500 block">Offer Rate</span>
                    <strong className="text-lg font-black text-km-neutral-900">
                      ₹{offer.pricePerKg}/kg
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-km-neutral-700 italic bg-white/80 p-3 rounded-xl border border-amber-100 leading-relaxed">
                  &ldquo;{offer.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs border-t border-amber-100">
                <span className="font-bold text-km-neutral-800">
                  Total: {formatCurrency(offer.totalAmount)} ({offer.quantity} kg)
                </span>
                <Link
                  href="/farmer/offers"
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#D9A441] text-[#0E2318] hover:bg-[#C08A2E] transition-all shadow-xs"
                >
                  Respond
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-km-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/farmer/transactions"
            className="text-xs font-semibold text-km-neutral-600 hover:text-km-neutral-900 flex items-center gap-1.5"
          >
            <Truck className="h-4 w-4 text-km-neutral-400" />
            <span>Track active transit and settlements in Transactions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-xs text-km-neutral-400">
            Payment escrow protection guaranteed by KisanMitra
          </span>
        </div>
      </div>
    </div>
  );
}
