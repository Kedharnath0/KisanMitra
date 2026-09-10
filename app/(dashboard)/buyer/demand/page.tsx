"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  PlusCircle,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";
import {
  MOCK_DEMAND_LISTINGS,
  CROPS,
  QUALITY_OPTIONS,
  MockDemandListing,
} from "@/data/mock";
import { formatCurrency, formatQuantity } from "@/lib/utils";
import type { QualityGrade } from "@/types";

export default function BuyerDemandPage() {
  const [demands, setDemands] = useState<MockDemandListing[]>(MOCK_DEMAND_LISTINGS);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [crop, setCrop] = useState<string>("Tomato");
  const [variety, setVariety] = useState<string>("Grade A Hybrid");
  const [quantity, setQuantity] = useState<number>(5000);
  const [price, setPrice] = useState<number>(26);
  const [quality, setQuality] = useState<QualityGrade>("A");
  const [deadline, setDeadline] = useState<string>("2026-09-15");
  const [success, setSuccess] = useState<boolean>(false);

  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    const newDemand: MockDemandListing = {
      id: `demand_${Date.now()}`,
      buyerId: "buyer_freshfoods",
      crop,
      variety,
      quantity,
      offeredPrice: price,
      qualityRequirement: quality,
      location: "Vijayawada",
      deadline,
      status: "ACTIVE",
    };
    setDemands([newDemand, ...demands]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Institutional Procurement Demands
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Broadcast forward contracts and procurement quotas directly to regional farmers and FPOs
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-gold text-xs shadow-md self-start md:self-auto flex items-center gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Sourcing Demand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demands.map((demand) => (
          <div
            key={demand.id}
            className="km-card p-6 flex flex-col justify-between border-2 border-km-neutral-200/80 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400 block">
                    Target Commodity
                  </span>
                  <h3 className="font-fraunces font-bold text-2xl text-km-neutral-900">
                    {demand.crop}
                  </h3>
                  {demand.variety && (
                    <span className="text-xs text-km-neutral-500">{demand.variety}</span>
                  )}
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {demand.status}
                </span>
              </div>

              <div className="bg-km-neutral-50 rounded-xl p-3 border border-km-neutral-200/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-km-neutral-500">Target Volume:</span>
                  <strong className="text-km-neutral-900 font-bold">
                    {formatQuantity(demand.quantity)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-km-neutral-500">Quality Spec:</span>
                  <span className="font-bold text-km-neutral-800">
                    Grade {demand.qualityRequirement}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-km-neutral-500">Procurement Deadline:</span>
                  <span className="font-medium text-km-neutral-800">{demand.deadline}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-km-neutral-200/40">
                  <span className="font-semibold text-km-neutral-700">Buying Budget:</span>
                  <strong className="text-base font-black text-km-neutral-900">
                    ₹{demand.offeredPrice}/kg
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-km-neutral-100 text-xs text-km-neutral-500 flex justify-between">
              <span>Fulfillment Hub: {demand.location}</span>
              <span className="font-bold text-emerald-700">
                Budget: {formatCurrency(demand.quantity * demand.offeredPrice)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-km-neutral-200 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 text-km-neutral-400 hover:text-km-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900 mb-4">
              Post Procurement Demand Listing
            </h2>

            {success ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#7CB342] mx-auto animate-bounce" />
                <h3 className="font-fraunces font-bold text-xl text-km-neutral-900">
                  Demand Broadcasted!
                </h3>
              </div>
            ) : (
              <form onSubmit={handleCreateDemand} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                    Commodity
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]"
                  >
                    {CROPS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Required Quantity (kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-bold text-km-neutral-900 outline-none focus:ring-2 focus:ring-[#D9A441]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Offered Price (₹/kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-bold text-km-neutral-900 outline-none focus:ring-2 focus:ring-[#D9A441]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                    Procurement Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-km-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-km-neutral-600 hover:bg-km-neutral-100"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold text-xs shadow-md">
                    Broadcast Demand
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
