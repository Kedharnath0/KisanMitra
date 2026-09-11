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
  Camera,
  Eye,
  Sparkles,
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
import { CROP_IMAGES } from "@/lib/crop-images";

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
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string>("");
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Photo viewer / lightbox state
  const [previewModal, setPreviewModal] = useState<{
    crop: string;
    images: string[];
    selectedIndex: number;
  } | null>(null);

  // Photo upload handling (up to 5 photos)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const availableSlots = 5 - formImages.length;
    if (availableSlots <= 0) {
      setImageError("Maximum 5 photos allowed per crop listing.");
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    setImageError("");

    filesToProcess.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("One or more files exceed 5MB. Please choose smaller photos.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormImages((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, result];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUseSamplePhotos = () => {
    const defaultInfo = CROP_IMAGES[formCrop];
    if (defaultInfo?.image) {
      setFormImages([
        defaultInfo.image,
        "https://images.unsplash.com/photo-1546470427-227c7369a689?w=600&auto=format&fit=crop&q=80",
      ]);
      setImageError("");
    }
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate photo upload (required)
    if (formImages.length === 0) {
      setImageError("Please upload at least 1 photo of your crop so buyers can check quality.");
      return;
    }

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
      images: formImages,
    };

    setLots([newLot, ...lots]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddModal(false);
      // Reset form
      setFormVariety("");
      setFormQuantity(1000);
      setFormImages([]);
      setImageError("");
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
            const displayImages =
              lot.images && lot.images.length > 0
                ? lot.images
                : CROP_IMAGES[lot.crop]?.image
                ? [CROP_IMAGES[lot.crop].image]
                : [];

            return (
              <div
                key={lot.id}
                className="km-card flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all hover:border-[#D9A441] rounded-2xl group"
              >
                <div>
                  {/* Photo Header Section with Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-km-neutral-100">
                    {displayImages.length > 0 ? (
                      <img
                        src={displayImages[0]}
                        alt={lot.crop}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-50/50">
                        <CropImage crop={lot.crop} size="lg" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Badges: Quality Grade & Delete button */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider backdrop-blur-md shadow-xs ${qualityColor.bg} ${qualityColor.text} ${qualityColor.border} border`}
                      >
                        {QUALITY_LABELS[lot.quality]}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCrop(lot.id);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-red-600 bg-white/95 hover:bg-red-50 hover:text-red-700 px-2.5 py-1 rounded-lg transition-colors shadow-xs border border-red-200"
                        title="Delete this crop"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {/* Bottom Photo Count Badge & Lightbox Trigger */}
                    {displayImages.length > 0 && (
                      <button
                        onClick={() =>
                          setPreviewModal({
                            crop: lot.crop,
                            images: displayImages,
                            selectedIndex: 0,
                          })
                        }
                        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-colors shadow-xs"
                      >
                        <Camera className="h-3.5 w-3.5 text-[#D9A441]" />
                        <span>
                          {displayImages.length} Photo{displayImages.length > 1 ? "s" : ""}
                        </span>
                      </button>
                    )}

                    {/* Bottom left crop title on image */}
                    <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                      <h3 className="font-fraunces font-bold text-xl text-white drop-shadow-md leading-tight">
                        {lot.crop}
                      </h3>
                      {lot.variety && (
                        <span className="text-xs font-medium text-white/90 drop-shadow-sm">
                          Variety: {lot.variety}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Multiple Photo Thumbnails Strip (if > 1 photo) */}
                  {displayImages.length > 1 && (
                    <div className="flex items-center gap-1.5 px-4 pt-2.5 overflow-x-auto bg-white">
                      {displayImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setPreviewModal({
                              crop: lot.crop,
                              images: displayImages,
                              selectedIndex: idx,
                            })
                          }
                          className="w-10 h-10 rounded-lg overflow-hidden border border-km-neutral-200 hover:border-[#D9A441] shrink-0 transition-all hover:scale-105"
                          title="Click to preview full photo"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      <span className="text-[10px] text-km-neutral-400 font-semibold pl-1">
                        Tap photo to view
                      </span>
                    </div>
                  )}

                  {/* Body with Crop Details */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-km-neutral-600">
                        Quantity for Sale:
                      </span>
                      <span className="text-sm font-extrabold text-km-neutral-900 bg-km-neutral-100 px-2.5 py-1 rounded-lg border border-km-neutral-200">
                        {formatQuantity(lot.quantity)}
                      </span>
                    </div>

                    {/* Key Attributes Box (Harvest date and Price) */}
                    <div className="bg-km-neutral-50 rounded-xl p-3 border border-km-neutral-200/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-km-neutral-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-km-neutral-400" />
                          Harvest Date:
                        </span>
                        <span className="text-km-neutral-700 font-medium">{lot.harvestDate}</span>
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
              onClick={() => {
                setShowAddModal(false);
                setFormImages([]);
                setImageError("");
              }}
              className="absolute right-5 top-5 p-2 rounded-xl text-km-neutral-400 hover:text-km-neutral-700 hover:bg-km-neutral-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
              Add Crop for Sale
            </h2>
            <p className="text-xs text-km-neutral-500 mb-6">
              Enter your crop details and upload real photos to receive direct offers from verified buyers.
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
                {/* ─── Crop Photos Upload Field (Required, 1-5 photos, mobile-friendly) ─── */}
                <div className="space-y-2 p-4 rounded-2xl bg-km-neutral-50/70 border border-km-neutral-200/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-800 flex items-center gap-1.5">
                      <Camera className="h-4 w-4 text-[#D9A441]" />
                      <span>Crop Photos * (1 to 5 Photos)</span>
                    </label>
                    <span className="text-[11px] font-bold text-km-neutral-500 bg-white px-2 py-0.5 rounded-full border border-km-neutral-200">
                      {formImages.length} / 5 added
                    </span>
                  </div>
                  <p className="text-[11px] text-km-neutral-500">
                    Add photos of your harvest so buyers can visually inspect crop quality and freshness.
                  </p>

                  {/* Empty state: Large Mobile-Friendly Tap Target */}
                  {formImages.length === 0 ? (
                    <div className="space-y-2 pt-1">
                      <label
                        htmlFor="crop-photo-upload"
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-km-neutral-300 hover:border-[#D9A441] bg-white hover:bg-amber-50/20 rounded-2xl cursor-pointer transition-all active:scale-[0.99] text-center group shadow-2xs"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-[#D9A441] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Camera className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-bold text-km-neutral-900 group-hover:text-[#D9A441] transition-colors">
                          Tap to take photo or choose from gallery
                        </span>
                        <span className="text-xs text-km-neutral-500 mt-1">
                          Camera or phone photo library • Up to 5 photos (JPG, PNG)
                        </span>
                        <input
                          id="crop-photo-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          capture="environment"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {/* Quick demo helper button */}
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={handleUseSamplePhotos}
                          className="text-xs font-semibold text-[#D9A441] hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Quick Demo: Use sample {formCrop} photos</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 pt-1">
                      {/* Thumbnail Previews Grid with Remove / Re-upload */}
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                        {formImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden border-2 border-km-neutral-200 bg-white group shadow-xs"
                          >
                            <img
                              src={img}
                              alt={`Crop preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Cover photo indicator */}
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0E2318] text-[#F4F1E4] shadow-xs">
                                Cover
                              </span>
                            )}

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-md transition-all active:scale-90"
                              title="Remove photo"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {/* Add More button if < 5 */}
                        {formImages.length < 5 && (
                          <label
                            htmlFor="crop-photo-upload-more"
                            className="aspect-square rounded-xl border-2 border-dashed border-km-neutral-300 hover:border-[#D9A441] bg-white hover:bg-amber-50/30 flex flex-col items-center justify-center cursor-pointer transition-all text-center p-2 shadow-2xs"
                          >
                            <PlusCircle className="h-5 w-5 text-[#D9A441] mb-1" />
                            <span className="text-[10px] font-bold text-km-neutral-700">Add More</span>
                            <input
                              id="crop-photo-upload-more"
                              type="file"
                              accept="image/*"
                              multiple
                              capture="environment"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Photo actions row */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-km-neutral-200/60">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {formImages.length} photo{formImages.length > 1 ? "s" : ""} attached
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormImages([])}
                          className="text-red-600 hover:underline font-semibold text-[11px]"
                        >
                          Clear all photos
                        </button>
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <p className="text-xs font-bold text-red-600 animate-in fade-in">
                      {imageError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Crop */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                      Crop Type *
                    </label>
                    <select
                      value={formCrop}
                      onChange={(e) => {
                        setFormCrop(e.target.value);
                        // If demo photos were loaded, clear or re-seed
                        if (formImages.length > 0 && !formImages[0].startsWith("data:")) {
                          const newInfo = CROP_IMAGES[e.target.value];
                          if (newInfo?.image) {
                            setFormImages([newInfo.image]);
                          }
                        }
                      }}
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

      {/* ─── Lightbox Modal for Photo Inspection ─── */}
      {previewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-km-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-km-neutral-100">
              <div>
                <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
                  {previewModal.crop} Harvest Photos
                </h3>
                <p className="text-xs text-km-neutral-500">
                  Visual quality inspection • Photo {previewModal.selectedIndex + 1} of{" "}
                  {previewModal.images.length}
                </p>
              </div>
              <button
                onClick={() => setPreviewModal(null)}
                className="p-1.5 rounded-xl text-km-neutral-400 hover:text-km-neutral-900 hover:bg-km-neutral-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Preview Image */}
            <div className="relative aspect-[4/3] w-full bg-km-neutral-900/5 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={previewModal.images[previewModal.selectedIndex]}
                alt={previewModal.crop}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails if > 1 */}
            {previewModal.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2 overflow-x-auto">
                {previewModal.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setPreviewModal({ ...previewModal, selectedIndex: idx })
                    }
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      previewModal.selectedIndex === idx
                        ? "border-[#D9A441] scale-105 shadow-md ring-2 ring-[#D9A441]/30"
                        : "border-km-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
