"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  Filter,
  Calendar,
  CheckCircle2,
  X,
  MessageSquare,
  ArrowRight,
  Trash2,
} from "lucide-react";
import {
  MOCK_LOTS,
  CROPS,
  QUALITY_OPTIONS,
  MockLot,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getQualityColor } from "@/lib/utils";
import { QUALITY_LABELS, QualityGrade } from "@/types";
import { CropImage } from "@/components/ui/CropImage";

export default function FarmerLotsPage() {
  const searchParams = useSearchParams();
  const [lots, setLots] = useState<MockLot[]>(MOCK_LOTS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>("ALL");

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

  const handleDeleteCrop = (lotId: string) => {
    setLots((prev) => prev.filter((lot) => lot.id !== lotId));
  };

  const filteredLots = lots.filter((lot) => {
    return selectedCropFilter === "ALL" || lot.crop === selectedCropFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            My Crops for Sale
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            List your harvested crops to get direct offers from verified buyers without middlemen
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gold shadow-md hover:shadow-lg transition-all self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Crop for Sale</span>
        </button>
      </div>

      {/* ─── Filter Strip ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-km-neutral-200/80 shadow-xs">
        {/* Crop Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-km-neutral-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter Crop:
          </span>
          <button
            onClick={() => setSelectedCropFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCropFilter === "ALL"
                ? "bg-[#0E2318] text-[#F4F1E4] shadow-xs"
                : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
            }`}
          >
            All Crops ({lots.length})
          </button>
          {CROPS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCropFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCropFilter === c
                  ? "bg-[#D9A441] text-[#0E2318] shadow-xs"
                  : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
              }`}
            >
              <CropImage crop={c} size="sm" className="w-4 h-4 rounded-md" />
              <span>{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Crops Grid ─── */}
      {filteredLots.length === 0 ? (
        <div className="km-card p-12 text-center">
          <Package className="h-12 w-12 text-km-neutral-300 mx-auto mb-3" />
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-800">
            No crops listed yet
          </h3>
          <p className="text-sm text-km-neutral-500 mt-1 mb-5">
            Click &ldquo;Add Crop for Sale&rdquo; to list your harvest and get buyer offers
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-gold text-xs">
            <PlusCircle className="h-4 w-4" /> Add Crop for Sale
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => {
            const qualityColor = getQualityColor(lot.quality);

            return (
              <div
                key={lot.id}
                className="km-card flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all hover:border-[#D9A441]"
              >
                <div>
                  {/* Top Bar: Quality Grade & Delete button */}
                  <div className="p-4 border-b border-km-neutral-100 flex items-center justify-between bg-km-neutral-50/50">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${qualityColor.bg} ${qualityColor.text} ${qualityColor.border} border`}
                    >
                      {QUALITY_LABELS[lot.quality]}
                    </span>

                    <button
                      onClick={() => handleDeleteCrop(lot.id)}
                      className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors border border-transparent hover:border-red-200"
                      title="Delete this crop"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Body with Crop Image (No status, no location text) */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <CropImage crop={lot.crop} size="lg" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-fraunces font-bold text-xl text-km-neutral-900 leading-tight truncate">
                          {lot.crop}
                        </h3>
                        {lot.variety && (
                          <span className="text-xs font-medium text-km-neutral-500 block truncate">
                            Variety: {lot.variety}
                          </span>
                        )}
                        <span className="text-xs font-bold text-km-neutral-700 block mt-0.5">
                          Quantity: {formatQuantity(lot.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Key Attributes Box (Harvest date and Price) */}
                    <div className="bg-km-neutral-50 rounded-xl p-3 border border-km-neutral-200/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-km-neutral-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-km-neutral-400" />
                          Harvest Date:
                        </span>
                        <span className="text-km-neutral-700">{lot.harvestDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-km-neutral-600 pt-1 border-t border-km-neutral-200/40">
                        <span>Expected Price:</span>
                        <strong className="text-sm text-km-neutral-900">
                          ₹{lot.expectedPrice}/kg
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-km-neutral-600">
                        <span>Total Expected:</span>
                        <strong className="text-sm font-black text-[#D9A441]">
                          {formatCurrency(lot.expectedPrice * lot.quantity)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-km-neutral-100 bg-km-neutral-50/50 flex items-center justify-between">
                  <span className="text-xs text-km-neutral-500">
                    {(lot.offerCount ?? 0) > 0 ? (
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {lot.offerCount} buyer offer{(lot.offerCount ?? 0) > 1 ? "s" : ""}
                      </span>
                    ) : (
                      "Waiting for buyer bids"
                    )}
                  </span>

                  <Link
                    href={`/farmer/offers?lot=${lot.id}`}
                    className="text-xs font-bold text-[#D9A441] hover:underline flex items-center gap-1"
                  >
                    <span>View Offers</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Modal: Add Crop for Sale ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-km-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-km-neutral-200/80 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-km-neutral-400 hover:text-km-neutral-700 hover:bg-km-neutral-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
              Add Crop for Sale
            </h2>
            <p className="text-xs text-km-neutral-500 mb-6">
              Enter your crop details to receive direct offers from verified buyers.
            </p>

            {formSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#7CB342] mx-auto animate-bounce" />
                <h3 className="font-fraunces font-bold text-xl text-km-neutral-900">
                  Crop Listed Successfully!
                </h3>
                <p className="text-xs text-km-neutral-500">
                  Your crop is now open for verified buyers. You will be notified when offers arrive.
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
                      placeholder="e.g. Teja, Sona Masuri, Hybrid"
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
                      className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm text-km-neutral-800 focus:ring-2 focus:ring-[#D9A441] outline-none"
                    />
                  </div>
                </div>

                {/* Expected Price */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                    Expected Price per kg (₹) *
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
                    <span className="absolute right-3.5 top-2.5 text-xs text-km-neutral-400">
                      / kg
                    </span>
                  </div>
                  <p className="text-[11px] text-km-neutral-500 mt-1">
                    Estimated total in-hand:{" "}
                    <strong>
                      {formatCurrency(
                        formExpectedPrice * (formUnit === "quintal" ? formQuantity * 100 : formQuantity)
                      )}
                    </strong>
                  </p>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full btn-gold justify-center py-3 text-sm shadow-md hover:shadow-lg"
                  >
                    <span>Confirm & List Crop</span>
                    <ArrowRight className="h-4 w-4" />
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
