"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ShieldCheck,
  Package,
  Send,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  MOCK_AVAILABLE_LOTS,
  CROPS,
  MockAvailableLot,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getQualityColor } from "@/lib/utils";
import { QUALITY_LABELS } from "@/types";

export default function BuyerLotsPage() {
  const searchParams = useSearchParams();
  const preselectedLotId = searchParams.get("lotId");

  const [lots, setLots] = useState<MockAvailableLot[]>(MOCK_AVAILABLE_LOTS);
  const [selectedCrop, setSelectedCrop] = useState<string>("ALL");
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [offerModalLot, setOfferModalLot] = useState<MockAvailableLot | null>(
    preselectedLotId
      ? lots.find((l) => l.id === preselectedLotId) || null
      : null
  );

  // Offer form states
  const [bidPrice, setBidPrice] = useState<number>(26);
  const [bidQuantity, setBidQuantity] = useState<number>(1000);
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-09-12");
  const [bidMessage, setBidMessage] = useState<string>(
    "Can arrange farm gate pickup. Payment within 48h of quality verification."
  );
  const [offerSuccess, setOfferSuccess] = useState<boolean>(false);

  const handleOpenOfferModal = (lot: MockAvailableLot) => {
    setOfferModalLot(lot);
    setBidPrice(lot.expectedPrice);
    setBidQuantity(lot.quantity);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSuccess(true);
    setTimeout(() => {
      setOfferSuccess(false);
      setOfferModalLot(null);
    }, 1500);
  };

  const filteredLots = lots.filter((lot) => {
    const cropMatch = selectedCrop === "ALL" || lot.crop === selectedCrop;
    const distanceMatch = !lot.distanceKm || lot.distanceKm <= maxDistance;
    return cropMatch && distanceMatch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
          Browse Farm Produce Lots
        </h1>
        <p className="text-sm text-km-neutral-500 mt-1">
          Source directly from verified farmers and FPOs across Andhra Pradesh with verified quality grades
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-km-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-km-neutral-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Crop:
          </span>
          <button
            onClick={() => setSelectedCrop("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCrop === "ALL"
                ? "bg-[#D9A441] text-[#0E2318]"
                : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
            }`}
          >
            All Crops
          </button>
          {CROPS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCrop === c
                  ? "bg-[#D9A441] text-[#0E2318]"
                  : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-km-neutral-500 font-medium">
            Max Distance: <strong>{maxDistance} km</strong>
          </span>
          <input
            type="range"
            min="20"
            max="150"
            step="10"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-24 accent-[#D9A441]"
          />
        </div>
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => {
          const qualityColor = getQualityColor(lot.quality);

          return (
            <div
              key={lot.id}
              className="km-card p-6 flex flex-col justify-between border-2 border-km-neutral-200/80 hover:border-[#D9A441] transition-all shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-km-neutral-700">
                        {lot.farmerName}
                      </span>
                      {lot.farmerVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-fraunces font-bold text-2xl text-km-neutral-900 mt-1">
                      {lot.crop}
                    </h3>
                    {lot.variety && (
                      <p className="text-xs text-km-neutral-500">
                        Variety: {lot.variety}
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md border ${qualityColor.bg} ${qualityColor.text} ${qualityColor.border}`}
                  >
                    {QUALITY_LABELS[lot.quality]}
                  </span>
                </div>

                <div className="bg-km-neutral-50 rounded-xl p-3.5 border border-km-neutral-200/60 space-y-2 text-xs">
                  <div className="flex justify-between text-km-neutral-600">
                    <span>Available Quantity:</span>
                    <strong className="text-km-neutral-900 text-sm">
                      {formatQuantity(lot.quantity)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-km-neutral-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#D9A441]" />
                      Location:
                    </span>
                    <span className="font-medium text-km-neutral-800">
                      {lot.farmerLocation} ({lot.distanceKm} km away)
                    </span>
                  </div>
                  <div className="flex justify-between text-km-neutral-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-km-neutral-400" />
                      Harvested On:
                    </span>
                    <span className="text-km-neutral-800 font-medium">
                      {lot.harvestDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-km-neutral-600 pt-2 border-t border-km-neutral-200/40">
                    <span className="font-semibold text-km-neutral-700">Farmer Asking Rate:</span>
                    <strong className="text-lg font-black text-km-neutral-900">
                      ₹{lot.expectedPrice}/kg
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-km-neutral-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-km-neutral-500">
                  Est. Lot: {formatCurrency(lot.quantity * lot.expectedPrice)}
                </span>
                <button
                  onClick={() => handleOpenOfferModal(lot)}
                  className="btn-gold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Make Bid Offer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Make Offer Modal ─── */}
      {offerModalLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-km-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOfferModalLot(null)}
              className="absolute right-5 top-5 text-km-neutral-400 hover:text-km-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Send className="h-5 w-5 text-[#D9A441]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E2318]">
                Binding Procurement Bid
              </span>
            </div>
            <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
              Make Offer to {offerModalLot.farmerName}
            </h2>
            <p className="text-xs text-km-neutral-500 mb-6">
              Bidding on {offerModalLot.crop} (Grade {offerModalLot.quality}) · Farmer asks ₹{offerModalLot.expectedPrice}/kg
            </p>

            {offerSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#7CB342] mx-auto animate-bounce" />
                <h3 className="font-fraunces font-bold text-xl text-km-neutral-900">
                  Offer Transmitted Successfully!
                </h3>
                <p className="text-xs text-km-neutral-500">
                  The farmer has received an alert with your proposed rate and delivery terms.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Price/kg */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Offer Rate (₹ per kg) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-sm font-bold text-km-neutral-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        required
                        value={bidPrice}
                        onChange={(e) => setBidPrice(Math.max(1, Number(e.target.value)))}
                        className="w-full rounded-xl border border-km-neutral-200 p-2.5 pl-8 text-sm font-bold text-km-neutral-900 focus:ring-2 focus:ring-[#D9A441] outline-none"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Quantity (kg) *
                    </label>
                    <input
                      type="number"
                      min="10"
                      max={offerModalLot.quantity}
                      required
                      value={bidQuantity}
                      onChange={(e) => setBidQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-bold text-km-neutral-900 focus:ring-2 focus:ring-[#D9A441] outline-none"
                    />
                  </div>
                </div>

                {/* Proposed Pickup Date */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                    Proposed Pickup Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm text-km-neutral-800 focus:ring-2 focus:ring-[#D9A441] outline-none"
                  />
                </div>

                {/* Custom Message */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                    Procurement Message to Farmer
                  </label>
                  <textarea
                    rows={3}
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-xs text-km-neutral-800 focus:ring-2 focus:ring-[#D9A441] outline-none"
                  />
                </div>

                {/* Total Calculation */}
                <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900">
                    Total Escrow Commitment:
                  </span>
                  <strong className="font-fraunces text-xl font-bold text-amber-950">
                    {formatCurrency(bidPrice * bidQuantity)}
                  </strong>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-km-neutral-100">
                  <button
                    type="button"
                    onClick={() => setOfferModalLot(null)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-km-neutral-600 hover:bg-km-neutral-100"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold text-xs shadow-md">
                    Send Binding Bid
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
