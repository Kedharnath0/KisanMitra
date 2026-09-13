"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Package,
  Building2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Star,
} from "lucide-react";
import { MOCK_OFFERS, MockOffer } from "@/data/mock";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ReliabilityScore } from "@/components/ui/ReliabilityScore";
import type { OfferStatus } from "@/types";
import { OFFER_STATUS_LABELS } from "@/types";

type FilterStatus = "ALL" | OfferStatus;
const STATUS_FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "ALL", label: "All Offers" },
  { key: "PENDING", label: "Pending" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "REJECTED", label: "Rejected" },
];

function OfferStatusChip({ status }: { status: OfferStatus }) {
  const styles: Record<OfferStatus, string> = {
    PENDING: "bg-amber-50 text-amber-800 border-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-800 border-emerald-200",
    REJECTED: "bg-red-50 text-red-800 border-red-200",
    EXPIRED: "bg-neutral-50 text-neutral-600 border-neutral-200",
  };
  return (
    <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border", styles[status])}>
      {OFFER_STATUS_LABELS[status]}
    </span>
  );
}

export default function OffersPage() {
  const [offers, setOffers] = useState<MockOffer[]>(MOCK_OFFERS);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const filteredOffers =
    filter === "ALL" ? offers : offers.filter((o) => o.status === filter);

  const pendingCount = offers.filter((o) => o.status === "PENDING").length;
  const acceptedCount = offers.filter((o) => o.status === "ACCEPTED").length;
  const totalValue = offers
    .filter((o) => o.status === "ACCEPTED")
    .reduce((s, o) => s + o.totalAmount, 0);

  const handleAccept = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: "ACCEPTED" as OfferStatus } : o
      )
    );
    setAcceptedId(offerId);
    setTimeout(() => setAcceptedId(null), 3000);
  };

  const handleReject = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: "REJECTED" as OfferStatus } : o
      )
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Buyer Offers
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Review and respond to offers from verified buyers on your crop lots.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200 self-start">
            <Clock className="h-4 w-4" />
            {pendingCount} pending offer{pendingCount > 1 ? "s" : ""} waiting
          </span>
        )}
      </div>

      {/* ─── Accepted notification ─── */}
      {acceptedId && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl km-animate-fade-in">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm text-emerald-900">Offer Accepted!</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              A transaction has been created.{" "}
              <Link href="/farmer/transactions" className="underline font-semibold">
                Track it in Transactions →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* ─── Summary Strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="km-card p-4 shadow-sm border-l-4 border-l-amber-400">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Pending Offers</p>
          <p className="font-fraunces text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="km-card p-4 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Accepted</p>
          <p className="font-fraunces text-2xl font-black text-emerald-700 mt-1">{acceptedCount}</p>
        </div>
        <div className="km-card p-4 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Value Confirmed</p>
          <p className="font-fraunces text-2xl font-black text-[#D9A441] mt-1">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* ─── Status Filter Tabs ─── */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ key, label }) => {
          const count = key === "ALL" ? offers.length : offers.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 flex items-center gap-1.5",
                filter === key
                  ? "bg-[#0E2318] text-[#F4F1E4] border-[#0E2318] shadow-sm"
                  : "bg-white text-km-neutral-600 border-km-neutral-200 hover:border-km-neutral-400"
              )}
            >
              {label}
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  filter === key ? "bg-white/20 text-white" : "bg-km-neutral-100 text-km-neutral-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Offers List ─── */}
      {filteredOffers.length === 0 ? (
        <div className="km-card p-12 text-center shadow-sm">
          <MessageSquare className="h-12 w-12 text-km-neutral-300 mx-auto mb-3" />
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-700">No offers found</h3>
          <p className="text-sm text-km-neutral-400 mt-1">
            {filter === "ALL"
              ? "Create a crop lot first to start receiving buyer offers."
              : `No offers with status "${OFFER_STATUS_LABELS[filter as OfferStatus]}".`}
          </p>
          {filter === "ALL" && (
            <Link
              href="/farmer/lots"
              className="mt-5 btn-gold text-sm shadow-sm inline-flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              <span>Create a Lot</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOffers.map((offer) => {
            const isTopOffer = offer.buyer.reliabilityScore >= 85;
            return (
              <div
                key={offer.id}
                className={cn(
                  "km-card overflow-hidden shadow-sm",
                  offer.status === "PENDING" && "border-l-4 border-l-amber-400",
                  offer.status === "ACCEPTED" && "border-l-4 border-l-emerald-500"
                )}
              >
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-km-neutral-100 bg-km-neutral-50/50">
                  <div className="flex items-center gap-2 text-xs text-km-neutral-500 font-medium">
                    <Package className="h-3.5 w-3.5" />
                    <span>
                      Lot: <strong className="text-km-neutral-800">{offer.lotCrop}</strong> ·{" "}
                      {offer.lotQuantity.toLocaleString()} kg
                    </span>
                  </div>
                  <OfferStatusChip status={offer.status} />
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Buyer Info */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-km-neutral-50 to-km-neutral-100 text-km-neutral-500 border border-km-neutral-200/60 shadow-sm">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-km-neutral-900 leading-tight">
                          {offer.buyer.companyName}
                          {isTopOffer && (
                            <Star className="inline-block h-3.5 w-3.5 text-[#D9A441] ml-1.5 mb-0.5" />
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <VerifiedBadge isVerified={offer.buyer.verified} />
                          <span className="text-xs text-km-neutral-500">
                            {offer.buyer.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-km-neutral-50/80 p-3.5 ring-1 ring-inset ring-km-neutral-200/50">
                      <ReliabilityScore score={offer.buyer.reliabilityScore} />
                    </div>

                    {offer.message && (
                      <div className="rounded-xl border border-km-neutral-100 bg-km-neutral-50/50 p-3.5 text-xs text-km-neutral-700 italic">
                        &ldquo;{offer.message}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Right: Offer Details */}
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="rounded-xl bg-km-neutral-50 border border-km-neutral-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-km-neutral-400">
                          Offered Price
                        </span>
                        <span className="font-black text-2xl text-emerald-700 tracking-tight">
                          ₹{offer.pricePerKg}
                          <span className="text-sm text-km-neutral-400 font-medium">/kg</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-km-neutral-500">
                          <Package className="h-3.5 w-3.5" />
                          Quantity
                        </span>
                        <span className="font-bold text-km-neutral-900">
                          {offer.quantity.toLocaleString()} kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-km-neutral-500">
                          <Tag className="h-3.5 w-3.5" />
                          Total Amount
                        </span>
                        <span className="font-black text-km-neutral-900 text-base">
                          {formatCurrency(offer.totalAmount)}
                        </span>
                      </div>
                      {offer.deliveryDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-km-neutral-500">Delivery by</span>
                          <span className="font-bold text-km-neutral-800">
                            {formatDate(offer.deliveryDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {offer.status === "PENDING" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReject(offer.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-km-neutral-200 bg-white px-4 py-3 text-sm font-bold text-km-error shadow-sm hover:bg-red-50 hover:border-red-200 transition-all duration-200 active:scale-[0.98]"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAccept(offer.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#10B981] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept Offer
                        </button>
                      </div>
                    )}

                    {offer.status === "ACCEPTED" && (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                        <div className="text-xs">
                          <p className="font-bold text-emerald-900">Offer Accepted</p>
                          <p className="text-emerald-700 mt-0.5">
                            Transaction created.{" "}
                            <Link href="/farmer/transactions" className="underline font-semibold">
                              Track payment →
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}

                    {offer.status === "REJECTED" && (
                      <div className="flex items-center gap-2 p-3 bg-km-neutral-50 rounded-xl border border-km-neutral-200">
                        <XCircle className="h-5 w-5 text-km-neutral-400 shrink-0" />
                        <p className="text-xs text-km-neutral-500 font-medium">Offer declined</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-km-neutral-100 bg-km-neutral-50/40 text-[11px] text-km-neutral-400">
                  Received {formatDate(offer.createdAt)} · Offer ID: {offer.id.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Bottom CTA ─── */}
      <div className="km-card p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-km-neutral-900">Looking for more buyers?</p>
          <p className="text-xs text-km-neutral-500 mt-0.5">
            Create additional lots or get a smart recommendation to reach the best market.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/farmer/lots"
            className="text-xs font-bold px-4 py-2 rounded-xl border border-km-neutral-200 bg-white text-km-neutral-700 hover:bg-km-neutral-50 transition-all flex items-center gap-1.5"
          >
            <Package className="h-3.5 w-3.5" />
            My Lots
          </Link>
          <Link
            href="/farmer/recommendations"
            className="btn-gold text-xs shadow-sm flex items-center gap-1.5"
          >
            <span>Get Recommendation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
