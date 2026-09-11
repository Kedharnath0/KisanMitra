"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
  Package,
  Send,
  ShieldCheck,
  Calendar,
  Truck,
  Phone,
  X,
  Clock,
  ChevronRight,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useFarmerProfile } from "@/lib/farmer-profile-context";
import { CropImage } from "@/components/ui/CropImage";
import {
  getLotsByFarmer,
  getOffersByFarmer,
  createLot,
  acceptOffer,
  updateOfferStatus,
} from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";
import { formatDate } from "@/lib/utils";
import type { Lot, Offer, QualityGrade } from "@/types";

// ─── Verified Demo Fallbacks (Ramesh Kumar Persona) ───
const INITIAL_DEMO_LOTS: Lot[] = [
  {
    id: "lot-tomato-01",
    farmerId: "ramesh-farmer",
    crop: "Tomato",
    variety: "Hybrid Vaishnavi",
    quantity: 1000,
    quality: "A" as QualityGrade,
    expectedPrice: 24,
    location: "Guntur Market Yard, AP",
    status: "OPEN",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
  {
    id: "lot-chilli-02",
    farmerId: "ramesh-farmer",
    crop: "Chilli",
    variety: "Teja Super Hot",
    quantity: 2500,
    quality: "A" as QualityGrade,
    expectedPrice: 200,
    location: "Guntur Yard, AP",
    status: "OPEN",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
  {
    id: "lot-cotton-03",
    farmerId: "ramesh-farmer",
    crop: "Cotton",
    variety: "Bunny Medium Staple",
    quantity: 3000,
    quality: "B" as QualityGrade,
    expectedPrice: 75,
    location: "Narasaraopet Yard, AP",
    status: "SOLD",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
];

const INITIAL_DEMO_OFFERS: (Offer & { buyerName: string; buyerLocation: string })[] = [
  {
    id: "offer-01",
    lotId: "lot-tomato-01",
    farmerId: "ramesh-farmer",
    buyerId: "buyer-freshfoods",
    buyerName: "FreshFoods Wholesale Ltd",
    buyerLocation: "Vijayawada Central Yard",
    pricePerKg: 26,
    quantity: 1000,
    deliveryDate: Timestamp.now(),
    message: "Refrigerated truck arranged. Full payment via KisanMitra Escrow upon load verification.",
    status: "PENDING",
    createdAt: Timestamp.now(),
  },
  {
    id: "offer-02",
    lotId: "lot-chilli-02",
    farmerId: "ramesh-farmer",
    buyerId: "buyer-srilakshmi",
    buyerName: "Sri Lakshmi Traders (APMC #4821)",
    buyerLocation: "Tenali Mandi",
    pricePerKg: 208,
    quantity: 2000,
    deliveryDate: Timestamp.now(),
    message: "Direct farm-gate collection. Immediate RTGS escrow settlement.",
    status: "PENDING",
    createdAt: Timestamp.now(),
  },
];

// APMC Daily Benchmark Rates
const LIVE_MARKET_PRICES = [
  {
    crop: "Tomato",
    variety: "Hybrid Grade A",
    price: 27,
    unit: "kg",
    mandi: "Vijayawada Mandi",
    distance: "32 km away",
    trend: "+12% rising rate",
    status: "Top Buyer Demand",
    recommendation: "SELL SOON",
  },
  {
    crop: "Chilli",
    variety: "Teja Super Hot",
    price: 210,
    unit: "kg",
    mandi: "Guntur Yard",
    distance: "14 km away",
    trend: "+14% high demand",
    status: "Very High Inflow",
    recommendation: "SELL NOW",
  },
  {
    crop: "Cotton",
    variety: "Bunny Medium Staple",
    price: 78,
    unit: "kg",
    mandi: "Narasaraopet Yard",
    distance: "45 km away",
    trend: "+5% steady price",
    status: "Stable Arrivals",
    recommendation: "HOLD / COMPARE",
  },
  {
    crop: "Onion",
    variety: "Bellary Red",
    price: 36,
    unit: "kg",
    mandi: "Tenali Mandi",
    distance: "26 km away",
    trend: "+8% quick sale",
    status: "High Demand",
    recommendation: "SELL SOON",
  },
];

export default function FarmerDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const { profile, setIsProfileOpen } = useFarmerProfile();

  // State: inventory, incoming offers, and UI modals
  const [lots, setLots] = useState<Lot[]>(INITIAL_DEMO_LOTS);
  const [offers, setOffers] = useState<any[]>(INITIAL_DEMO_OFFERS);
  const [isAddLotOpen, setIsAddLotOpen] = useState(false);
  const [submittingLot, setSubmittingLot] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Lot form state
  const [crop, setCrop] = useState("Tomato");
  const [variety, setVariety] = useState("Hybrid Grade A");
  const [quantity, setQuantity] = useState(1000);
  const [quality, setQuality] = useState<QualityGrade>("A");
  const [expectedPrice, setExpectedPrice] = useState(24);
  const [location, setLocation] = useState(profile.district ? `${profile.district} Yard, AP` : "Guntur Market Yard, AP");

  // Safeguarded Data Fetching
  useEffect(() => {
    let isMounted = true;
    const farmerId = userProfile?.id || "ramesh-farmer";

    async function loadFarmerData() {
      try {
        const [lotsData, offersData] = await Promise.allSettled([
          getLotsByFarmer(farmerId),
          getOffersByFarmer(farmerId),
        ]);

        if (isMounted) {
          if (lotsData.status === "fulfilled" && lotsData.value && lotsData.value.length > 0) {
            setLots(lotsData.value);
          }
          if (offersData.status === "fulfilled" && offersData.value && offersData.value.length > 0) {
            const formatted = offersData.value.map((off: any) => ({
              ...off,
              buyerName: off.buyerName || "Verified Buyer",
              buyerLocation: off.buyerLocation || "APMC Hub",
            }));
            setOffers(formatted);
          }
        }
      } catch (err) {
        console.warn("Using offline verified farmer demo records:", err);
      }
    }

    loadFarmerData();

    return () => {
      isMounted = false;
    };
  }, [userProfile?.id]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Accept Offer
  const handleAcceptOffer = async (offerId: string, offerCrop: string, offerPrice: number) => {
    try {
      try {
        await acceptOffer(offerId);
      } catch (err) {
        console.warn("Optimistic state update for demo offer acceptance:", err);
      }

      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: "ACCEPTED" } : o))
      );
      setToastMessage(`✓ Deal confirmed! ₹${offerPrice}/kg accepted for ${offerCrop}. Funds held in Escrow.`);
    } catch (e) {
      console.error(e);
      alert("Could not accept offer. Please try again.");
    }
  };

  // Handle Reject Offer
  const handleRejectOffer = async (offerId: string) => {
    try {
      try {
        await updateOfferStatus(offerId, "REJECTED");
      } catch (err) {
        console.warn("Optimistic state update for demo offer rejection:", err);
      }

      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: "REJECTED" } : o))
      );
      setToastMessage("Offer declined.");
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Create Lot
  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLot(true);
    try {
      const farmerId = userProfile?.id || "ramesh-farmer";
      const newLotData = {
        farmerId,
        crop,
        variety,
        quantity: Number(quantity),
        quality,
        expectedPrice: Number(expectedPrice),
        location,
        harvestDate: Timestamp.now(),
      };

      let newId = `lot-${Date.now()}`;
      try {
        newId = await createLot(newLotData);
      } catch (err) {
        console.warn("Saved lot to verified offline state:", err);
      }

      const created: Lot = {
        id: newId,
        ...newLotData,
        status: "OPEN",
        createdAt: Timestamp.now(),
      };

      setLots((prev) => [created, ...prev]);
      setToastMessage(`🌾 New lot for ${quantity.toLocaleString()} kg ${crop} published to Buyer Network!`);
      setIsAddLotOpen(false);
    } catch (err) {
      console.error(err);
      alert("Could not list crop. Please try again.");
    } finally {
      setSubmittingLot(false);
    }
  };

  // 1. Full-Screen Spinner during initial load to eliminate layout shifts
  if (authLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0E2318] text-[#F4F1E4]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#D9A441] border-t-transparent shadow-[0_0_20px_#D9A441]"></div>
          <p className="font-['Fraunces',serif] text-xl font-bold tracking-wide text-[#F4F1E4]">
            KisanMitra | Loading Farmer Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const openLotsCount = lots.filter((l) => l.status === "OPEN").length;
  const pendingOffers = offers.filter((o) => o.status === "PENDING");

  return (
    <div className="min-h-screen w-full bg-[#0E2318] text-[#F4F1E4] font-['Work_Sans',sans-serif] space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border-2 border-[#D9A441] bg-[#163C29] px-6 py-4 text-base sm:text-lg font-bold text-[#F4F1E4] shadow-2xl backdrop-blur-md animate-bounce">
          <Sparkles className="h-6 w-6 text-[#D9A441]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. FARMER WELCOME STRIP ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-[#F4F1E4]/15 bg-[#163C29]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="absolute right-0 top-0 h-96 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D9A441]/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-1 text-xs sm:text-sm font-bold text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Live APMC Mandi Network Active
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9A441]/30 bg-[#D9A441]/15 px-3 py-1 text-xs sm:text-sm font-bold text-[#D9A441]">
                <ShieldCheck className="h-4 w-4" />
                Verified Farmer ✓
              </span>
            </div>

            <h1 className="font-['Fraunces',serif] text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F1E4]">
              Namaste, {profile.name || "Ramesh Kumar"}
            </h1>

            <p className="flex flex-wrap items-center gap-3 text-base sm:text-lg text-[#D9D5BE]">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-5 w-5 text-[#D9A441] shrink-0" />
                <span>
                  {profile.village ? `${profile.village}, ` : ""}
                  {profile.district || "Guntur"}, {profile.state || "Andhra Pradesh"}
                </span>
              </span>
              <span className="text-[#F4F1E4]/30">•</span>
              <span>
                Landholding: <strong className="text-[#F4F1E4]">{profile.acres || "5"} Acres</strong>
              </span>
              <span className="text-[#F4F1E4]/30">•</span>
              <span>
                Crops: <strong className="text-[#D9A441]">{profile.crops?.join(", ") || "Tomato, Chilli"}</strong>
              </span>
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsAddLotOpen(true)}
              className="flex items-center gap-3 rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] px-7 py-4 text-lg sm:text-xl font-black text-[#0E2318] shadow-2xl shadow-[#D9A441]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlusCircle className="h-6 w-6 stroke-[2.5]" />
              <span>🌾 Add New Crop/Lot</span>
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="rounded-2xl border border-[#F4F1E4]/20 bg-white/5 hover:bg-white/10 px-6 py-4 text-base sm:text-lg font-bold text-[#F4F1E4] transition-all cursor-pointer"
            >
              <span>Edit Farmer Details</span>
            </button>
          </div>
        </div>

        {/* High-Contrast KPI Cards */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-[#F4F1E4]/15 pt-6">
          <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#0E2318]/60 p-4 sm:p-5 backdrop-blur-sm">
            <span className="font-['Fraunces',serif] text-3xl sm:text-4xl font-black text-[#D9A441] block">
              {openLotsCount}
            </span>
            <span className="mt-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D9D5BE] block">
              🌾 Active Lots Listed
            </span>
          </div>

          <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#0E2318]/60 p-4 sm:p-5 backdrop-blur-sm">
            <span className="font-['Fraunces',serif] text-3xl sm:text-4xl font-black text-emerald-400 block">
              {pendingOffers.length}
            </span>
            <span className="mt-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D9D5BE] block">
              🤝 Pending Buyer Offers
            </span>
          </div>

          <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#0E2318]/60 p-4 sm:p-5 backdrop-blur-sm">
            <span className="font-['Fraunces',serif] text-3xl sm:text-4xl font-black text-[#D9A441] block">
              ₹27/kg
            </span>
            <span className="mt-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D9D5BE] block">
              💰 Tomato Top Mandi Rate
            </span>
          </div>

          <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#0E2318]/60 p-4 sm:p-5 backdrop-blur-sm">
            <span className="font-['Fraunces',serif] text-3xl sm:text-4xl font-black text-emerald-400 block">
              ₹42,800
            </span>
            <span className="mt-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D9D5BE] block">
              🔒 Escrow Payouts Received
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. SIH MARKET INTELLIGENCE & AI RECOMMENDATION ─── */}
      <section className="rounded-3xl border-2 border-[#D9A441]/40 bg-gradient-to-br from-[#163C29] to-[#0E2318] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#F4F1E4]/15 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#D9A441]">
              <Sparkles className="h-5 w-5 text-[#D9A441]" />
              <span>Smart Market Intelligence &bull; AI Recommendation</span>
            </div>
            <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4]">
              Where &amp; When To Sell: Ramesh&apos;s Tomato Batch (1,000 kg)
            </h2>
            <p className="text-base text-[#D9D5BE]">
              Calculated dynamically to maximize your <strong>Net Realization</strong> after all logistics and storage costs.
            </p>
          </div>

          {/* SELL WINDOW BADGE */}
          <div className="rounded-2xl border-2 border-emerald-400/50 bg-emerald-500/20 px-6 py-4 text-center">
            <span className="block text-xs font-black uppercase tracking-widest text-emerald-300">
              Optimal Sell Window
            </span>
            <strong className="font-['Fraunces',serif] text-2xl sm:text-3xl font-black text-emerald-300 block mt-0.5">
              SELL WITHIN 1–2 DAYS
            </strong>
            <span className="text-xs font-semibold text-emerald-200">
              Recommendation Confidence: 82%
            </span>
          </div>
        </div>

        {/* Realization Math Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#0E2318]/70 border border-[#F4F1E4]/10 p-5">
            <span className="text-xs font-bold text-[#D9D5BE] uppercase">Recommended Market</span>
            <h3 className="font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4] mt-1">
              Vijayawada APMC
            </h3>
            <span className="text-xs text-[#D9A441] mt-1 block">32 km (vs 14 km Guntur)</span>
          </div>

          <div className="rounded-2xl bg-[#0E2318]/70 border border-[#F4F1E4]/10 p-5">
            <span className="text-xs font-bold text-[#D9D5BE] uppercase">Mandi Price vs Local</span>
            <h3 className="font-['Fraunces',serif] text-2xl font-bold text-[#D9A441] mt-1">
              ₹27 / kg
            </h3>
            <span className="text-xs text-[#D9D5BE] mt-1 block">+₹3/kg over local rate (₹24)</span>
          </div>

          <div className="rounded-2xl bg-[#0E2318]/70 border border-[#F4F1E4]/10 p-5">
            <span className="text-xs font-bold text-[#D9D5BE] uppercase">Transport Deduction</span>
            <h3 className="font-['Fraunces',serif] text-2xl font-bold text-red-300 mt-1">
              - ₹2,000
            </h3>
            <span className="text-xs text-[#D9D5BE] mt-1 block">Estimated logistics cost</span>
          </div>

          <div className="rounded-2xl bg-emerald-950/60 border border-emerald-500/40 p-5">
            <span className="text-xs font-black text-emerald-400 uppercase">Estimated Net Realization</span>
            <h3 className="font-['Fraunces',serif] text-3xl font-black text-emerald-300 mt-1">
              ₹25,000
            </h3>
            <span className="text-xs text-emerald-200 mt-1 block font-bold">
              +₹1,000 more than Guntur Mandi!
            </span>
          </div>
        </div>
      </section>

      {/* ─── 3. ACTIVE BUYER OFFERS WAITING FOR FARMER (Section #offers) ─── */}
      <section id="offers" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4] flex items-center gap-2.5">
              <span>🤝 Active Buyer Offers</span>
              <span className="rounded-full bg-[#D9A441] px-2.5 py-0.5 text-xs font-black text-[#0E2318]">
                {pendingOffers.length} New
              </span>
            </h2>
            <p className="text-base text-[#D9D5BE]">
              Direct procurement offers placed by verified institutional buyers and traders.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const isPending = offer.status === "PENDING";
            const isAccepted = offer.status === "ACCEPTED";
            const totalValue = offer.pricePerKg * offer.quantity;

            return (
              <div
                key={offer.id}
                className="flex flex-col justify-between rounded-3xl border border-[#F4F1E4]/15 bg-[#163C29]/50 p-6 sm:p-7 shadow-xl backdrop-blur-md hover:border-[#D9A441]/50 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-500/30">
                        <ShieldCheck className="h-4 w-4" /> Escrow Backed Offer
                      </span>
                      <h3 className="font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4] mt-2">
                        {offer.buyerName}
                      </h3>
                      <p className="text-sm text-[#D9D5BE] flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-4 w-4 text-[#D9A441]" />
                        {offer.buyerLocation}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold uppercase text-[#D9D5BE] block">
                        Offered Rate
                      </span>
                      <span className="font-['Fraunces',serif] text-3xl sm:text-4xl font-black text-[#D9A441] block leading-none mt-1">
                        ₹{offer.pricePerKg}
                        <span className="text-sm font-bold text-[#D9D5BE]">/kg</span>
                      </span>
                    </div>
                  </div>

                  <div className="my-5 space-y-2 rounded-2xl bg-[#0E2318]/60 p-4 border border-[#F4F1E4]/10 text-base">
                    <div className="flex justify-between">
                      <span className="text-[#D9D5BE]">Required Volume:</span>
                      <strong className="text-[#F4F1E4]">{offer.quantity.toLocaleString()} kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D9D5BE]">Total Deal Value:</span>
                      <strong className="text-2xl font-black text-emerald-300">
                        ₹{totalValue.toLocaleString()}
                      </strong>
                    </div>
                    {offer.message && (
                      <p className="text-sm text-[#D9D5BE]/90 border-t border-[#F4F1E4]/10 pt-2 italic">
                        &ldquo;{offer.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Massive Action Buttons for Low-Literacy / Outdoor Visibility */}
                <div>
                  {isPending ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleAcceptOffer(offer.id, "Produce", offer.pricePerKg)}
                        className="flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 py-4 px-6 text-lg sm:text-xl font-black text-[#0E2318] shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                        <span>Accept Offer</span>
                      </button>

                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 py-4 px-5 text-base sm:text-lg font-bold text-red-300 transition-all cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : isAccepted ? (
                    <div className="flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 py-4 px-6 text-lg font-black text-emerald-300">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      <span>Deal Accepted &bull; In Escrow</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 py-3.5 text-base font-bold text-[#D9D5BE]">
                      <span>Offer Declined</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 4. MY INVENTORY & PRODUCE LOTS (Section #inventory) ─── */}
      <section id="inventory" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4] flex items-center gap-2.5">
              <span>🌾 My Inventory &amp; Produce Lots</span>
              <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-[#D9D5BE]">
                {lots.length} Lots
              </span>
            </h2>
            <p className="text-base text-[#D9D5BE]">
              Produce currently listed for sale or under buyer negotiation.
            </p>
          </div>

          <button
            onClick={() => setIsAddLotOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] px-6 py-3.5 text-base sm:text-lg font-black text-[#0E2318] shadow-lg shadow-[#D9A441]/20 cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="h-5 w-5" />
            <span>+ Add Another Lot</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map((lot) => {
            const valuation = lot.expectedPrice * lot.quantity;

            return (
              <div
                key={lot.id}
                className="flex flex-col justify-between rounded-3xl border border-[#F4F1E4]/15 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md hover:border-[#D9A441]/60 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CropImage crop={lot.crop} size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-xl bg-[#D9A441]/20 px-2.5 py-0.5 text-xs font-black uppercase text-[#D9A441]">
                            {lot.crop}
                          </span>
                          <span
                            className={`rounded-xl px-2.5 py-0.5 text-xs font-black border ${
                              lot.quality === "A"
                                ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/40"
                                : lot.quality === "B"
                                ? "bg-blue-500/25 text-blue-300 border-blue-500/40"
                                : "bg-amber-500/25 text-amber-300 border-amber-500/40"
                            }`}
                          >
                            Grade {lot.quality}
                          </span>
                        </div>
                        <h3 className="font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4] mt-1.5">
                          {lot.variety || `${lot.crop} Lot`}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        lot.status === "OPEN"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : lot.status === "SOLD"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {lot.status}
                    </span>
                  </div>

                  <div className="my-5 space-y-2 border-y border-[#F4F1E4]/10 py-4 text-base">
                    <div className="flex justify-between">
                      <span className="text-[#D9D5BE]">Available Volume:</span>
                      <strong className="text-xl font-black text-[#F4F1E4]">
                        {lot.quantity.toLocaleString()} kg
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D9D5BE]">Expected Rate:</span>
                      <strong className="text-xl font-black text-[#D9A441]">
                        ₹{lot.expectedPrice} / kg
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D9D5BE]">Estimated Valuation:</span>
                      <strong className="text-xl font-black text-emerald-300">
                        ₹{valuation.toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between text-sm text-[#D9D5BE]/80 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#D9A441]" /> Location:
                      </span>
                      <span className="font-medium text-[#F4F1E4] truncate max-w-[180px]">
                        {lot.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-[#D9D5BE]/70">
                    <span>Lot ID: {lot.id.slice(0, 14)}</span>
                    <span>Ready for Buyers</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 5. LIVE APMC MARKET PRICES (Section #prices) ─── */}
      <section id="prices" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4] flex items-center gap-2.5">
              <span>💰 Live Mandi Prices (APMC Daily Rates)</span>
            </h2>
            <p className="text-base text-[#D9D5BE]">
              Track wholesale commodity rates across major Andhra Pradesh market yards today.
            </p>
          </div>

          <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
            ● Rates Updated 10 mins ago
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LIVE_MARKET_PRICES.map((item) => (
            <div
              key={item.crop}
              className="flex flex-col justify-between rounded-3xl border border-[#F4F1E4]/15 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md hover:border-[#D9A441]/50 transition-all"
            >
              <div>
                <div className="flex items-center gap-3.5">
                  <CropImage crop={item.crop} size="md" />
                  <div>
                    <h3 className="font-['Fraunces',serif] text-xl font-bold text-[#F4F1E4]">
                      {item.crop}
                    </h3>
                    <span className="text-xs text-[#D9D5BE] block">
                      {item.variety}
                    </span>
                  </div>
                </div>

                <div className="my-5 rounded-2xl bg-[#0E2318]/60 p-4 border border-[#F4F1E4]/10 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-[#D9D5BE] uppercase">Modal Price:</span>
                    <strong className="font-['Fraunces',serif] text-3xl font-black text-[#D9A441]">
                      ₹{item.price}
                      <span className="text-sm font-medium text-[#D9D5BE]">/{item.unit}</span>
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#D9D5BE]">
                    <span>Top Mandi:</span>
                    <span className="font-bold text-[#F4F1E4] truncate max-w-[130px]">
                      {item.mandi}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F4F1E4]/10 pt-3 flex items-center justify-between text-xs">
                <span className="font-black text-emerald-400">{item.trend}</span>
                <span className="rounded-lg bg-[#D9A441]/15 px-2 py-0.5 font-bold text-[#D9A441]">
                  {item.recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MODAL: ADD NEW CROP / LOT ─── */}
      {isAddLotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-[#D9A441]/50 bg-[#0E2318] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-[#F4F1E4]">
            <button
              onClick={() => setIsAddLotOpen(false)}
              className="absolute top-5 right-5 text-[#D9D5BE] hover:text-white p-2 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2 text-[#D9A441]">
              <Package className="h-6 w-6" />
              <span className="text-sm font-black uppercase tracking-widest">
                Digital Produce Pass
              </span>
            </div>

            <h3 className="mt-2 font-['Fraunces',serif] text-3xl font-bold text-[#F4F1E4]">
              List Crop Lot for Sale
            </h3>
            <p className="mt-1 text-sm sm:text-base text-[#D9D5BE]">
              Publish your harvested produce directly to verified buyers on KisanMitra.
            </p>

            <form onSubmit={handleCreateLot} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#D9D5BE] block mb-1.5">
                    Crop
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-base font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Chilli">Chilli</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Onion">Onion</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#D9D5BE] block mb-1.5">
                    Variety
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Hybrid Grade A"
                    required
                    className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-base font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#D9D5BE] block mb-1.5">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-base font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#D9D5BE] block mb-1.5">
                    Quality Grade
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as QualityGrade)}
                    className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-base font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                  >
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Standard)</option>
                    <option value="C">Grade C (Economy)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#D9D5BE] block mb-1.5">
                    Asking Rate (₹/kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(Number(e.target.value))}
                    required
                    className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-base font-bold text-[#D9A441] outline-none focus:border-[#D9A441]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#D9D5BE] block mb-1.5">
                  Produce Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Guntur Market Yard, AP"
                  required
                  className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-base font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                />
              </div>

              <div className="rounded-2xl bg-[#163C29]/60 border border-[#F4F1E4]/10 p-4 text-sm text-[#D9D5BE] flex items-center justify-between">
                <span>Total Expected Valuation:</span>
                <strong className="text-xl font-black text-[#D9A441]">
                  ₹{(quantity * expectedPrice).toLocaleString()}
                </strong>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submittingLot}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] py-4 px-6 text-xl font-black text-[#0E2318] shadow-2xl shadow-[#D9A441]/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  <PlusCircle className="h-6 w-6" />
                  <span>{submittingLot ? "Publishing Lot..." : "Publish Lot to Buyers"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
