"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Truck,
  ShieldCheck,
  Star,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  MOCK_OFFERS,
  MockOffer,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getOfferStatusColor } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OFFER_STATUS_LABELS, OfferStatus } from "@/types";

export default function FarmerOffersPage() {
  const [offers, setOffers] = useState<MockOffer[]>(MOCK_OFFERS);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: "ACCEPTED" as OfferStatus } : o
      )
    );
    setActionNotice(
      "Offer accepted! Transaction record and logistics pickup order generated."
    );
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: "REJECTED" as OfferStatus } : o
      )
    );
    setActionNotice("Offer rejected.");
    setTimeout(() => setActionNotice(null), 3500);
  };

  const filteredOffers = offers.filter((o) => {
    if (activeTab === "ALL") return true;
    return o.status === activeTab;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Buyer Offers & Negotiations
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Review binding procurement bids from verified institutional processors and regional buyers
          </p>
        </div>

        <Link
          href="/farmer/transactions"
          className="btn-ghost-dark text-xs text-km-neutral-700 border-km-neutral-300 self-start md:self-auto"
        >
          <span>View Confirmed Transactions</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <Link
            href="/farmer/transactions"
            className="text-xs font-bold underline hover:text-emerald-950"
          >
            Track in Transactions →
          </Link>
        </div>
      )}

      {/* ─── Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-km-neutral-200/80 pb-3 overflow-x-auto">
        {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((tab) => {
          const count =
            tab === "ALL"
              ? offers.length
              : offers.filter((o) => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-[#D9A441] text-[#0E2318] shadow-xs"
                  : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
              }`}
            >
              <span>
                {tab === "ALL"
                  ? "All Offers"
                  : tab === "PENDING"
                  ? "Pending Review"
                  : tab === "ACCEPTED"
                  ? "Accepted"
                  : "Rejected"}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab ? "bg-[#0E2318] text-[#F4F1E4]" : "bg-km-neutral-200 text-km-neutral-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Offers List ─── */}
      {filteredOffers.length === 0 ? (
        <div className="km-card p-12 text-center">
          <MessageSquare className="h-12 w-12 text-km-neutral-300 mx-auto mb-3" />
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-800">
            No offers in this category
          </h3>
          <p className="text-sm text-km-neutral-500 mt-1">
            New offers will appear here when verified buyers bid on your active lots.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffers.map((offer) => {
            const statusColor = getOfferStatusColor(offer.status);

            return (
              <div
                key={offer.id}
                className={`km-card p-6 flex flex-col justify-between border-2 transition-all shadow-xs ${
                  offer.status === "PENDING"
                    ? "border-amber-300 bg-gradient-to-br from-white to-amber-50/20"
                    : "border-km-neutral-200/80 bg-white"
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Buyer Profile Snippet */}
                  <div className="flex items-start justify-between pb-3 border-b border-km-neutral-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
                          {offer.buyer.companyName}
                        </h3>
                        {offer.buyer.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="h-3 w-3" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-km-neutral-500 mt-0.5">
                        {offer.buyer.location} · Reliability Score:{" "}
                        <strong className="text-km-neutral-800">
                          {offer.buyer.reliabilityScore}%
                        </strong>
                      </p>
                    </div>

                    <StatusBadge
                      label={OFFER_STATUS_LABELS[offer.status]}
                      colorScheme={statusColor}
                      pulse={offer.status === "PENDING"}
                    />
                  </div>

                  {/* Lot & Bid Details */}
                  <div className="bg-km-neutral-50 rounded-xl p-3.5 border border-km-neutral-200/60 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-km-neutral-400 font-semibold block">Target Lot</span>
                      <strong className="text-km-neutral-900 text-sm">
                        {offer.lotCrop} ({formatQuantity(offer.lotQuantity)})
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-km-neutral-400 font-semibold block">Offered Rate</span>
                      <strong className="text-lg font-black text-km-neutral-900">
                        ₹{offer.pricePerKg}
                        <span className="text-xs font-normal text-km-neutral-500">/kg</span>
                      </strong>
                    </div>

                    <div>
                      <span className="text-km-neutral-400 font-semibold block">Quantity Bid</span>
                      <span className="font-bold text-km-neutral-800">
                        {formatQuantity(offer.quantity)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-km-neutral-400 font-semibold block">Total Transaction</span>
                      <span className="font-fraunces text-base font-bold text-[#D9A441]">
                        {formatCurrency(offer.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Proposed Delivery Date */}
                  <div className="flex items-center gap-2 text-xs text-km-neutral-600 bg-white p-2.5 rounded-lg border border-km-neutral-200/60">
                    <Calendar className="h-4 w-4 text-[#D9A441] shrink-0" />
                    <span>
                      Proposed Pickup / Delivery: <strong>{offer.deliveryDate}</strong>
                    </span>
                  </div>

                  {/* Custom Message from Buyer */}
                  {offer.message && (
                    <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 text-xs text-km-neutral-700 italic">
                      &ldquo;{offer.message}&rdquo;
                    </div>
                  )}
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-5 mt-4 border-t border-km-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-km-neutral-400">
                    Received: {offer.createdAt}
                  </span>

                  {offer.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="btn-gold text-xs shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Accept Offer
                      </button>
                    </div>
                  ) : offer.status === "ACCEPTED" ? (
                    <Link
                      href="/farmer/transactions"
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>View in Transactions Tracker</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-km-neutral-400 italic">
                      Offer rejected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
