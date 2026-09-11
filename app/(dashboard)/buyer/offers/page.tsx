"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle,
  Clock,
  ArrowRight,
  Package,
} from "lucide-react";
import {
  MOCK_BUYER_OFFERS,
  MockBuyerOffer,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getOfferStatusColor } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OFFER_STATUS_LABELS } from "@/types";

export default function BuyerOffersPage() {
  const [offers, setOffers] = useState<MockBuyerOffer[]>(MOCK_BUYER_OFFERS);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Procurement Bids & Offers Made
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Track status of procurement offers submitted to farmers across AP
          </p>
        </div>

        <Link
          href="/buyer/lots"
          className="btn-gold text-xs shadow-md self-start md:self-auto"
        >
          <span>Find More Lots</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="km-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-km-neutral-100 bg-gradient-to-r from-km-neutral-50 to-white flex items-center justify-between">
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
            All Submitted Bids
          </h3>
          <span className="text-xs font-bold text-km-neutral-500">
            {offers.length} Bids Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Offer ID</th>
                <th className="py-3.5 px-4">Farmer Seller</th>
                <th className="py-3.5 px-4">Produce</th>
                <th className="py-3.5 px-4 text-right">Quantity</th>
                <th className="py-3.5 px-4 text-right">Offered Rate</th>
                <th className="py-3.5 px-4 text-right">Total Escrow Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Date Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-km-neutral-800">
                    {offer.id.toUpperCase()}
                  </td>
                  <td className="py-4 px-4 font-bold text-km-neutral-900">
                    {offer.farmerName}
                  </td>
                  <td className="py-4 px-4 text-km-neutral-700 font-medium">
                    {offer.crop}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-km-neutral-800">
                    {formatQuantity(offer.quantity)}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-km-neutral-900">
                    ₹{offer.pricePerKg}/kg
                  </td>
                  <td className="py-4 px-4 text-right font-black text-emerald-700 text-base">
                    {formatCurrency(offer.totalAmount)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusBadge
                      label={OFFER_STATUS_LABELS[offer.status]}
                      colorScheme={getOfferStatusColor(offer.status)}
                      pulse={offer.status === "PENDING"}
                    />
                  </td>
                  <td className="py-4 px-5 text-right text-xs text-km-neutral-500">
                    {offer.sentAt}
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
