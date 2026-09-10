"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  PlusCircle,
  Filter,
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  MOCK_LOTS,
  CROPS,
  QUALITY_OPTIONS,
  MockLot,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getLotStatusColor, getQualityColor } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LOT_STATUS_LABELS, QUALITY_LABELS, QualityGrade, LotStatus } from "@/types";

export default function FarmerLotsPage() {
  const searchParams = useSearchParams();
  const [lots, setLots] = useState<MockLot[]>(MOCK_LOTS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Open modal if URL has ?action=create
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  // Form states
  const [formCrop, setFormCrop] = useState<string>("Tomato");
  const [formVariety, setFormVariety] = useState<string>("");
  const [formQuantity, setFormQuantity] = useState<number>(1000);
  const [formUnit, setFormUnit] = useState<"kg" | "quintal">("kg");
  const [formQuality, setFormQuality] = useState<QualityGrade>("A");
  const [formHarvestDate, setFormHarvestDate] = useState<string>("2026-09-09");
  const [formLocation, setFormLocation] = useState<string>("Guntur");
  const [formExpectedPrice, setFormExpectedPrice] = useState<number>(26);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuantity = formUnit === "quintal" ? formQuantity * 100 : formQuantity;

    const newLot: MockLot = {
      id: `lot_${Date.now()}`,
      farmerId: "ramesh_001",
      crop: formCrop,
      variety: formVariety || undefined,
      quantity: finalQuantity,
      quality: formQuality,
      harvestDate: formHarvestDate,
      expectedPrice: formExpectedPrice,
      location: formLocation,
      status: "OPEN",
      createdAt: new Date().toISOString().slice(0, 10),
      offerCount: 0,
    };

    setLots([newLot, ...lots]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddModal(false);
      // Reset form
      setFormVariety("");
      setFormQuantity(1000);
    }, 1200);
  };

  const filteredLots = lots.filter((lot) => {
    const cropMatch = selectedCropFilter === "ALL" || lot.crop === selectedCropFilter;
    const statusMatch = selectedStatusFilter === "ALL" || lot.status === selectedStatusFilter;
    return cropMatch && statusMatch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Produce Lots & Quality Grading
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Publish standardized produce lots with quality grades to attract verified institutional buyers
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gold shadow-md hover:shadow-lg transition-all self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Produce Lot</span>
        </button>
      </div>

      {/* ─── Filter Strip ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-km-neutral-200/80 shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-km-neutral-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Status:
          </span>
          {["ALL", "OPEN", "OFFER_RECEIVED", "SOLD", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedStatusFilter === status
                  ? "bg-[#0E2318] text-[#F4F1E4] shadow-xs"
                  : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
              }`}
            >
              {status === "ALL" ? "All Lots" : LOT_STATUS_LABELS[status as LotStatus]}
            </button>
          ))}
        </div>

        {/* Crop Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-km-neutral-500 font-medium">Crop:</span>
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="rounded-lg border border-km-neutral-200 px-3 py-1.5 text-xs font-semibold text-km-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
          >
            <option value="ALL">All Crops</option>
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Lots Grid ─── */}
      {filteredLots.length === 0 ? (
        <div className="km-card p-12 text-center">
          <Package className="h-12 w-12 text-km-neutral-300 mx-auto mb-3" />
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-800">
            No produce lots match the filter
          </h3>
          <p className="text-sm text-km-neutral-500 mt-1 mb-5">
            Try selecting a different status or create a new lot
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-gold text-xs">
            <PlusCircle className="h-4 w-4" /> Create Produce Lot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => {
            const statusColor = getLotStatusColor(lot.status);
            const qualityColor = getQualityColor(lot.quality);

            return (
              <div
                key={lot.id}
                className="km-card flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all hover:border-[#D9A441]"
              >
                <div>
                  {/* Top Bar: Status + Grade */}
                  <div className="p-4 border-b border-km-neutral-100 flex items-center justify-between bg-km-neutral-50/50">
                    <StatusBadge
                      label={LOT_STATUS_LABELS[lot.status]}
                      colorScheme={statusColor}
                      pulse={lot.status === "OFFER_RECEIVED"}
                    />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${qualityColor.bg} ${qualityColor.text} ${qualityColor.border} border`}
                    >
                      {QUALITY_LABELS[lot.quality]}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-fraunces font-bold text-xl text-km-neutral-900 leading-tight">
                          {lot.crop}
                        </h3>
                        {lot.variety && (
                          <span className="text-xs font-medium text-km-neutral-500">
                            Variety: {lot.variety}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-km-neutral-400 block">Quantity</span>
                        <strong className="text-base font-black text-km-neutral-900">
                          {formatQuantity(lot.quantity)}
                        </strong>
                      </div>
                    </div>

                    {/* Key Attributes Box */}
                    <div className="bg-km-neutral-50 rounded-xl p-3 border border-km-neutral-200/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-km-neutral-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#D9A441]" />
                          Farm Location:
                        </span>
                        <strong className="text-km-neutral-800">{lot.location}</strong>
                      </div>
                      <div className="flex items-center justify-between text-km-neutral-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-km-neutral-400" />
                          Harvest Date:
                        </span>
                        <span className="font-medium text-km-neutral-800">{lot.harvestDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-km-neutral-600 pt-1 border-t border-km-neutral-200/40">
                        <span className="font-semibold text-km-neutral-700">Expected Rate:</span>
                        <strong className="text-sm font-bold text-km-neutral-900">
                          ₹{lot.expectedPrice}/kg
                        </strong>
                      </div>
                    </div>

                    {/* Active Offer Notification */}
                    {lot.offerCount && lot.offerCount > 0 ? (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-amber-700" />
                          {lot.offerCount} buyer offer{lot.offerCount > 1 ? "s" : ""} received!
                        </span>
                        <a href="/farmer/offers" className="underline font-bold">
                          Review
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-km-neutral-100 bg-km-neutral-50/30 flex items-center justify-between text-xs">
                  <span className="text-km-neutral-400">Created: {lot.createdAt}</span>
                  <span className="font-semibold text-km-neutral-700">
                    Est. Value: {formatCurrency(lot.quantity * lot.expectedPrice)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Add Produce Lot Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-km-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 text-km-neutral-400 hover:text-km-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Package className="h-5 w-5 text-[#D9A441]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E2318]">
                New Listing
              </span>
            </div>
            <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
              Create Produce Lot
            </h2>
            <p className="text-xs text-km-neutral-500 mb-6">
              Post your harvest specifications to match directly with verified buyers in the network.
            </p>

            {formSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#7CB342] mx-auto animate-bounce" />
                <h3 className="font-fraunces font-bold text-xl text-km-neutral-900">
                  Produce Lot Created Successfully!
                </h3>
                <p className="text-xs text-km-neutral-500">
                  Your lot is now open for verified buyers. You will receive notifications when offers arrive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateLot} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Crop */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Crop Type *
                    </label>
                    <select
                      value={formCrop}
                      onChange={(e) => setFormCrop(e.target.value)}
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 bg-white focus:ring-2 focus:ring-[#D9A441] outline-none"
                    >
                      {CROPS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variety */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Crop Variety (Optional)
                    </label>
                    <input
                      type="text"
                      value={formVariety}
                      onChange={(e) => setFormVariety(e.target.value)}
                      placeholder="e.g. Hybrid F1, Teja, Sona Masuri"
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm text-km-neutral-800 focus:ring-2 focus:ring-[#D9A441] outline-none"
                    />
                  </div>
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Quantity *
                    </label>
                    <div className="flex rounded-xl border border-km-neutral-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#D9A441]">
                      <input
                        type="number"
                        min="10"
                        required
                        value={formQuantity}
                        onChange={(e) => setFormQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full p-2.5 text-sm font-semibold text-km-neutral-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFormUnit(formUnit === "kg" ? "quintal" : "kg")}
                        className="px-3 bg-km-neutral-100 text-xs font-bold text-km-neutral-600 hover:bg-km-neutral-200 uppercase transition-colors"
                      >
                        {formUnit}
                      </button>
                    </div>
                  </div>

                  {/* Quality Grade */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Quality Grade *
                    </label>
                    <select
                      value={formQuality}
                      onChange={(e) => setFormQuality(e.target.value as QualityGrade)}
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 bg-white focus:ring-2 focus:ring-[#D9A441] outline-none"
                    >
                      {QUALITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Harvest Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Harvest Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formHarvestDate}
                      onChange={(e) => setFormHarvestDate(e.target.value)}
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm text-km-neutral-800 focus:ring-2 focus:ring-[#D9A441] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Farm Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Guntur"
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm text-km-neutral-800 focus:ring-2 focus:ring-[#D9A441] outline-none"
                    />
                  </div>
                </div>

                {/* Expected Price */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                    Expected Price (₹ per kg) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-km-neutral-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formExpectedPrice}
                      onChange={(e) => setFormExpectedPrice(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 pl-8 text-sm font-bold text-km-neutral-900 focus:ring-2 focus:ring-[#D9A441] outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-km-neutral-400 mt-1">
                    Reference mandi modal rate for {formCrop} is approx ₹27/kg at Vijayawada
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-km-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-km-neutral-600 hover:bg-km-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold text-xs shadow-md"
                  >
                    Publish Produce Lot
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
