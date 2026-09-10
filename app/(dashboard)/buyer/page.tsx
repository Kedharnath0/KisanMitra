"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Package,
  Send,
  CreditCard,
  Search,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Clock,
} from "lucide-react";
import {
  MOCK_AVAILABLE_LOTS,
  MOCK_BUYER_OFFERS,
  MOCK_DEMAND_LISTINGS,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getOfferStatusColor, getQualityColor } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OFFER_STATUS_LABELS } from "@/types";

export default function BuyerDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* ─── 1. Header Card: Rural-Modern Buyer Strip ─── */}
      <div className="card-forest p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D9A441]/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4E8F5E]/20 text-[#7CB342] border border-[#4E8F5E]/30">
                <span className="h-2 w-2 rounded-full bg-[#7CB342] animate-pulse" />
                Procurement Network Live
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#D9D5BE] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-[#7CB342]" />
                Institutional Verified Buyer
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-fraunces text-[#F4F1E4] tracking-tight">
              FreshFoods Procurement Portal
            </h1>
            <p className="text-sm sm:text-base text-[#D9D5BE] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#D9A441]" />
              <span>Vijayawada Central Hub · Krishna District</span>
              <span className="text-white/30">|</span>
              <span>Buyer Reliability Rating: <strong className="text-[#D9A441]">88% (4.5/5)</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/buyer/lots"
              className="btn-gold shadow-md hover:shadow-lg transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Browse Farmer Lots</span>
            </Link>
            <Link
              href="/buyer/demand"
              className="btn-ghost-dark text-sm"
            >
              <span>Post Sourcing Demand</span>
              <PlusCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Summary Strip: Gold Stat Blocks */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">
              {MOCK_DEMAND_LISTINGS.length}
            </span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">
              Active Sourcing Demands
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">
              {MOCK_BUYER_OFFERS.length}
            </span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">
              Bids Placed to Farmers
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">
              1,800 kg
            </span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">
              Total Volume Sourced
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">
              ₹42,800
            </span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">
              Escrow Trade Volume
            </span>
          </div>
        </div>
      </div>

      {/* ─── Available Lots Matching Sourcing Requirements ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
              Recommended Farmer Lots Ready for Sourcing
            </h2>
            <p className="text-xs text-km-neutral-500">
              Verified lots within 100 km of Vijayawada processing unit
            </p>
          </div>
          <Link
            href="/buyer/lots"
            className="text-xs font-bold text-[#D9A441] hover:underline flex items-center gap-1"
          >
            <span>View All Marketplace Lots</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_AVAILABLE_LOTS.slice(0, 3).map((lot) => {
            const qualityColor = getQualityColor(lot.quality);
            return (
              <div
                key={lot.id}
                className="km-card p-5 flex flex-col justify-between border-2 border-km-neutral-200/80 hover:border-[#D9A441] transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-km-neutral-500">
                        Farmer: {lot.farmerName}
                      </span>
                      <h3 className="text-xl font-bold font-fraunces text-km-neutral-900">
                        {lot.crop} {lot.variety ? `(${lot.variety})` : ""}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${qualityColor.bg} ${qualityColor.text} ${qualityColor.border}`}
                    >
                      Grade {lot.quality}
                    </span>
                  </div>

                  <div className="bg-km-neutral-50 rounded-xl p-3 border border-km-neutral-200/60 space-y-1 text-xs">
                    <div className="flex justify-between text-km-neutral-600">
                      <span>Available Volume:</span>
                      <strong className="text-km-neutral-900">
                        {formatQuantity(lot.quantity)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-km-neutral-600">
                      <span>Farm Origin:</span>
                      <span className="font-medium text-km-neutral-800">
                        {lot.farmerLocation} ({lot.distanceKm} km away)
                      </span>
                    </div>
                    <div className="flex justify-between text-km-neutral-600 pt-1 border-t border-km-neutral-200/40">
                      <span className="font-semibold text-km-neutral-700">Asking Rate:</span>
                      <strong className="text-base font-black text-km-neutral-900">
                        ₹{lot.expectedPrice}/kg
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-km-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-km-neutral-400">
                    Harvested: {lot.harvestDate}
                  </span>
                  <Link
                    href={`/buyer/lots?lotId=${lot.id}`}
                    className="btn-gold text-xs shadow-xs"
                  >
                    Make Offer
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Recent Offers Placed ─── */}
      <div className="km-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-km-neutral-100">
          <div>
            <h3 className="font-fraunces font-bold text-lg text-km-neutral-900 flex items-center gap-2">
              <Send className="h-4 w-4 text-[#D9A441]" />
              Recent Procurement Offers Made
            </h3>
            <p className="text-xs text-km-neutral-500">
              Track status of binding offers submitted to farmers
            </p>
          </div>
          <Link
            href="/buyer/offers"
            className="text-xs font-bold text-[#D9A441] hover:underline"
          >
            Manage All Offers →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-4">Offer ID</th>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-4">Produce</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Offered Rate</th>
                <th className="py-3 px-4 text-right">Total Bid Value</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Date Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {MOCK_BUYER_OFFERS.map((boffer) => (
                <tr key={boffer.id} className="hover:bg-amber-50/20">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-km-neutral-800">
                    {boffer.id.toUpperCase()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-km-neutral-900">
                    {boffer.farmerName}
                  </td>
                  <td className="py-3.5 px-4 text-km-neutral-700 font-medium">
                    {boffer.crop}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-km-neutral-800">
                    {formatQuantity(boffer.quantity)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-km-neutral-900">
                    ₹{boffer.pricePerKg}/kg
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                    {formatCurrency(boffer.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge
                      label={OFFER_STATUS_LABELS[boffer.status]}
                      colorScheme={getOfferStatusColor(boffer.status)}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-km-neutral-400">
                    {boffer.sentAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
