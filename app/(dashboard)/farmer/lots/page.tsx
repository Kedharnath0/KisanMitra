"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  ArrowRight,
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  UploadCloud,
  ImageIcon,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { MOCK_LOTS, MockLot } from "@/data/mock";
import { CROPS, QUALITY_OPTIONS } from "@/data/mock";
import { cn, formatDate, getLotStatusColor, getQualityColor } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CropImage } from "@/components/ui/CropImage";
import { compressImageToFileUrl } from "@/lib/image-utils";
import type { LotStatus, QualityGrade } from "@/types";
import { LOT_STATUS_LABELS, QUALITY_LABELS } from "@/types";

type FilterStatus = "ALL" | LotStatus;
const STATUS_FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "ALL", label: "All Lots" },
  { key: "OPEN", label: "Open" },
  { key: "OFFER_RECEIVED", label: "Offer Received" },
  { key: "SOLD", label: "Sold" },
  { key: "CANCELLED", label: "Cancelled" },
];

interface CreateLotForm {
  crop: string;
  variety: string;
  quantity: string;
  quality: QualityGrade;
  expectedPrice: string;
  harvestDate: string;
  location: string;
}

const INITIAL_FORM: CreateLotForm = {
  crop: "Tomato",
  variety: "",
  quantity: "",
  quality: "A",
  expectedPrice: "",
  harvestDate: "",
  location: "Guntur",
};

const STORAGE_KEY = "kisanmitra_farmer_lots_v1";

export default function LotsPage() {
  const [lots, setLots] = useState<MockLot[]>(MOCK_LOTS);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<CreateLotForm>(INITIAL_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateLotForm & { images?: string }>>({});
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load lots from localStorage on mount and check query param ?action=create
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLots(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to load lots from localStorage:", e);
      }

      // Check if URL has ?action=create
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "create") {
        setIsFormOpen(true);
      }
    }
  }, []);

  const filteredLots =
    filter === "ALL" ? lots : lots.filter((l) => l.status === filter);

  const openCount = lots.filter((l) => l.status === "OPEN").length;
  const offerCount = lots.filter((l) => l.status === "OFFER_RECEIVED").length;
  const soldCount = lots.filter((l) => l.status === "SOLD").length;

  // Handle files selected (via picker or drag-drop)
  const processFiles = async (filesList: FileList | File[]) => {
    const validFiles = Array.from(filesList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload a maximum of 5 photos per lot.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }

    const availableSlots = 5 - images.length;
    const filesToProcess = validFiles.slice(0, availableSlots);

    setIsProcessingImages(true);
    try {
      const newUrls: string[] = [];
      for (const file of filesToProcess) {
        const compressed = await compressImageToFileUrl(file, 1024, 0.75);
        newUrls.push(compressed);
      }
      setImages((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error("Failed to process images:", err);
      setErrors((prev) => ({ ...prev, images: "Failed to process selected images." }));
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<CreateLotForm & { images?: string }> = {};
    const qty = Number(form.quantity);
    const price = Number(form.expectedPrice);
    if (!form.quantity || qty <= 0) newErrors.quantity = "Enter a valid quantity";
    if (qty > 0 && qty < 10) newErrors.quantity = "Minimum lot size is 10 kg";
    if (!form.expectedPrice || price <= 0) newErrors.expectedPrice = "Enter a valid price";
    if (!form.harvestDate) newErrors.harvestDate = "Select harvest date";
    if (!form.location.trim()) newErrors.location = "Enter farm location";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newLot: MockLot = {
      id: `lot_${Date.now()}`,
      farmerId: "ramesh_001",
      crop: form.crop,
      variety: form.variety || undefined,
      quantity: Number(form.quantity),
      quality: form.quality,
      harvestDate: form.harvestDate,
      expectedPrice: Number(form.expectedPrice),
      location: form.location,
      status: "OPEN",
      createdAt: new Date().toISOString().slice(0, 10),
      offerCount: 0,
      images: images.length > 0 ? images : undefined,
    };

    const updatedLots = [newLot, ...lots];
    setLots(updatedLots);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLots));
      } catch (err) {
        console.warn("Storage quota limit reached for localStorage:", err);
      }
    }

    setSubmitted(true);
    setErrors({});
    setTimeout(() => {
      setSubmitted(false);
      setIsFormOpen(false);
      setForm(INITIAL_FORM);
      setImages([]);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            My Crop Lots
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Create a digital lot to list your produce and receive verified buyer offers.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-gold text-sm shadow-md flex items-center gap-2 self-start"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Lot</span>
        </button>
      </div>

      {/* ─── Summary Strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="km-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Total Lots</p>
          <p className="font-fraunces text-2xl font-black text-km-neutral-900 mt-1">{lots.length}</p>
        </div>
        <div className="km-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Open</p>
          <p className="font-fraunces text-2xl font-black text-emerald-700 mt-1">{openCount}</p>
        </div>
        <div className="km-card p-4 shadow-sm border-l-4 border-l-[#D9A441]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Offer Received</p>
          <p className="font-fraunces text-2xl font-black text-[#D9A441] mt-1">{offerCount}</p>
        </div>
        <div className="km-card p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-km-neutral-400">Sold</p>
          <p className="font-fraunces text-2xl font-black text-km-neutral-700 mt-1">{soldCount}</p>
        </div>
      </div>

      {/* ─── Create Lot Form Modal ─── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-km-neutral-900/60 backdrop-blur-xs p-4">
          <div className="km-card w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-km-neutral-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#D9A441]" />
                <h2 className="font-fraunces font-bold text-xl text-km-neutral-900">
                  Create New Lot
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setForm(INITIAL_FORM);
                  setImages([]);
                  setErrors({});
                }}
                className="rounded-lg p-1.5 text-km-neutral-400 hover:text-km-neutral-700 hover:bg-km-neutral-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-10 text-center space-y-3">
                <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="font-fraunces font-bold text-xl text-km-neutral-900">
                  Lot Created Successfully!
                </h3>
                <p className="text-sm text-km-neutral-500">
                  Your produce lot {images.length > 0 ? `with ${images.length} photos` : ""} is now listed. Verified buyers can see and submit offers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Crop Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1.5">
                    Crop *
                  </label>
                  <select
                    value={form.crop}
                    onChange={(e) => setForm({ ...form, crop: e.target.value })}
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
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1.5">
                    Variety <span className="text-km-neutral-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.variety}
                    onChange={(e) => setForm({ ...form, variety: e.target.value })}
                    placeholder="e.g. Hybrid F1, Teja Super, Red Onion"
                    className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1.5">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="e.g. 1000"
                    className={cn(
                      "w-full rounded-xl border p-2.5 text-sm font-semibold text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]",
                      errors.quantity ? "border-red-300 bg-red-50" : "border-km-neutral-200"
                    )}
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                  )}
                </div>

                {/* Quality Grade */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1.5">
                    Quality Grade *
                  </label>
                  <div className="flex gap-3">
                    {QUALITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, quality: opt.value as QualityGrade })}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all",
                          form.quality === opt.value
                            ? "bg-[#0E2318] text-[#F4F1E4] border-[#0E2318]"
                            : "bg-white text-km-neutral-600 border-km-neutral-200 hover:border-km-neutral-400"
                        )}
                      >
                        {opt.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expected Price */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1.5">
                    Expected Price (₹/kg) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.expectedPrice}
                    onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })}
                    placeholder="e.g. 25"
                    className={cn(
                      "w-full rounded-xl border p-2.5 text-sm font-semibold text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]",
                      errors.expectedPrice ? "border-red-300 bg-red-50" : "border-km-neutral-200"
                    )}
                  />
                  {errors.expectedPrice && (
                    <p className="text-xs text-red-600 mt-1">{errors.expectedPrice}</p>
                  )}
                </div>

                {/* Harvest Date */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1.5">
                    Harvest Date *
                  </label>
                  <input
                    type="date"
                    value={form.harvestDate}
                    onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
                    className={cn(
                      "w-full rounded-xl border p-2.5 text-sm font-semibold text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]",
                      errors.harvestDate ? "border-red-300 bg-red-50" : "border-km-neutral-200"
                    )}
                  />
                  {errors.harvestDate && (
                    <p className="text-xs text-red-600 mt-1">{errors.harvestDate}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1.5">
                    Farm Location *
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Guntur"
                    className={cn(
                      "w-full rounded-xl border p-2.5 text-sm font-semibold text-km-neutral-800 outline-none focus:ring-2 focus:ring-[#D9A441]",
                      errors.location ? "border-red-300 bg-red-50" : "border-km-neutral-200"
                    )}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-600 mt-1">{errors.location}</p>
                  )}
                </div>

                {/* ─── FEATURE 2: Image Upload Section ─── */}
                <div className="pt-2 border-t border-km-neutral-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-[#D9A441]" />
                      <span>Produce Lot Photos</span>
                      <span className="text-km-neutral-400 font-normal">
                        ({images.length}/5)
                      </span>
                    </label>
                    <span className="text-[11px] text-km-neutral-400">
                      Up to 5 images
                    </span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200",
                      isDragging
                        ? "border-[#D9A441] bg-amber-50/60"
                        : "border-km-neutral-200 hover:border-[#D9A441] hover:bg-km-neutral-50/70",
                      images.length >= 5 && "opacity-50 pointer-events-none"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          processFiles(e.target.files);
                          e.target.value = "";
                        }
                      }}
                    />

                    {isProcessingImages ? (
                      <div className="py-3 flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 text-[#D9A441] animate-spin" />
                        <span className="text-xs font-semibold text-km-neutral-600">
                          Optimizing photos...
                        </span>
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center gap-1.5">
                        <div className="h-9 w-9 rounded-xl bg-amber-100/70 text-[#D9A441] flex items-center justify-center">
                          <UploadCloud className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-km-neutral-800">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-[11px] text-km-neutral-400">
                          JPG, PNG, WebP · High quality photos attract 40% more buyer offers
                        </p>
                      </div>
                    )}
                  </div>

                  {errors.images && (
                    <p className="text-xs text-red-600 mt-1">{errors.images}</p>
                  )}

                  {/* Thumbnail Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-km-neutral-200 group bg-km-neutral-100"
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 px-1 rounded bg-black/60 text-[9px] text-white font-mono">
                            {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setForm(INITIAL_FORM);
                      setImages([]);
                      setErrors({});
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-km-neutral-200 text-sm font-bold text-km-neutral-600 hover:bg-km-neutral-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingImages}
                    className="flex-1 btn-gold text-sm shadow-md justify-center"
                  >
                    <Package className="h-4 w-4" />
                    <span>Create Lot</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Lightbox Full Photo Modal ─── */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-black">
            <img
              src={previewModalImg}
              alt="Full size preview"
              className="w-full h-full object-contain max-h-[80vh]"
            />
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Status Filter Tabs ─── */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ key, label }) => {
          const count =
            key === "ALL" ? lots.length : lots.filter((l) => l.status === key).length;
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
                  filter === key
                    ? "bg-white/20 text-white"
                    : "bg-km-neutral-100 text-km-neutral-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Lots Grid ─── */}
      {filteredLots.length === 0 ? (
        <div className="km-card p-12 text-center shadow-sm">
          <Package className="h-12 w-12 text-km-neutral-300 mx-auto mb-3" />
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-700">
            No lots found
          </h3>
          <p className="text-sm text-km-neutral-400 mt-1">
            {filter === "ALL"
              ? "Create your first lot to start receiving buyer offers."
              : `No lots with status "${LOT_STATUS_LABELS[filter as LotStatus]}".`}
          </p>
          {filter === "ALL" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-5 btn-gold text-sm shadow-sm inline-flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create First Lot</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLots.map((lot) => {
            const statusColor = getLotStatusColor(lot.status);
            const qualityColor = getQualityColor(lot.quality);
            const hasImages = lot.images && lot.images.length > 0;

            return (
              <div
                key={lot.id}
                className="km-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Status & Quality Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-km-neutral-100 bg-km-neutral-50/50">
                  <StatusBadge
                    label={LOT_STATUS_LABELS[lot.status]}
                    colorScheme={statusColor}
                    pulse={lot.status === "OFFER_RECEIVED"}
                  />
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                      qualityColor.bg,
                      qualityColor.text,
                      qualityColor.border
                    )}
                  >
                    {QUALITY_LABELS[lot.quality]}
                  </span>
                </div>

                {/* ─── Lot Photo Header Banner (if images exist) ─── */}
                {hasImages && (
                  <div
                    onClick={() => setPreviewModalImg(lot.images![0])}
                    className="relative w-full h-40 bg-km-neutral-100 overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={lot.images![0]}
                      alt={`${lot.crop} crop lot photo`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold">
                        <ImageIcon className="h-3 w-3 text-[#D9A441]" />
                        {lot.images!.length} {lot.images!.length === 1 ? "Photo" : "Photos"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-white/90 bg-black/40 px-2 py-0.5 rounded-md">
                        <Eye className="h-3 w-3" /> Click to view
                      </span>
                    </div>

                    {/* Secondary thumbnails strip if multiple images */}
                    {lot.images!.length > 1 && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        {lot.images!.slice(1, 4).map((thumb, idx) => (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewModalImg(thumb);
                            }}
                            className="h-7 w-7 rounded-lg overflow-hidden border border-white/80 shadow-xs hover:scale-110 transition-transform"
                          >
                            <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Crop Info */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <CropImage crop={lot.crop} size="md" />
                    <div>
                      <h3 className="font-bold text-lg text-km-neutral-900 leading-tight">
                        {lot.crop}
                        {lot.variety && (
                          <span className="text-km-neutral-400 font-medium text-sm ml-1">
                            · {lot.variety}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-km-neutral-500 font-semibold">
                        {lot.quantity.toLocaleString()} kg
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-km-neutral-600">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-km-neutral-400" />
                      <span>
                        Expected: <strong className="text-km-neutral-900">₹{lot.expectedPrice}/kg</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-km-neutral-400" />
                      <span>{lot.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-km-neutral-400" />
                      <span>Harvested {formatDate(lot.harvestDate)}</span>
                    </div>
                  </div>

                  {/* Offer count */}
                  {(lot.offerCount ?? 0) > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">
                        🎉 {lot.offerCount} offer{lot.offerCount === 1 ? "" : "s"} received!
                      </span>
                      <Link
                        href="/farmer/offers"
                        className="text-xs font-bold text-[#D9A441] hover:underline flex items-center gap-1"
                      >
                        View <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-km-neutral-100 bg-km-neutral-50/40 text-[11px] text-km-neutral-400 flex items-center justify-between">
                  <span>Created {formatDate(lot.createdAt)}</span>
                  <span className="font-mono">ID: {lot.id.slice(0, 10).toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
