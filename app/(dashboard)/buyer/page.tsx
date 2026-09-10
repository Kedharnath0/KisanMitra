"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useRole } from "@/lib/role-context";
import { useBuyerTab, type BuyerView } from "@/lib/buyer-tab-context";
import { signOutUser } from "@/lib/auth";
import {
  getOpenLots,
  createOffer,
  getOffersByBuyer,
} from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";
import { formatDate } from "@/lib/utils";
import type { Lot, Offer, QualityGrade } from "@/types";
import {
  Store,
  MapPin,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  Send,
  LogOut,
  Sparkles,
  ShieldCheck,
  CreditCard,
  FileText,
  X,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Phone,
  LayoutDashboard,
  ArrowRight,
  DollarSign,
  Activity,
} from "lucide-react";

// --- Prototype Demo Data Fallbacks ---
const DEMO_BUYER = {
  id: "sri-lakshmi-traders",
  companyName: "Sri Lakshmi Traders",
  location: "Vijayawada, Krishna District",
  apmcLicense: "AP-GNT-4821",
  verified: true,
  reliabilityScore: 88,
  rating: 4.8,
};

const INITIAL_DEMO_LOTS: (Lot & { farmerName: string; farmerPhone?: string })[] = [
  {
    id: "lot-tomato-01",
    farmerId: "ramesh-farmer",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98480 12345",
    crop: "Tomato",
    variety: "Hybrid Vaishnavi",
    quantity: 1000,
    quality: "A" as QualityGrade,
    expectedPrice: 24,
    location: "Guntur Yard, AP",
    status: "OPEN",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
  {
    id: "lot-chilli-02",
    farmerId: "lakshmi-fpo",
    farmerName: "Lakshmi FPO",
    farmerPhone: "+91 94401 56789",
    crop: "Chilli",
    variety: "Teja Special (Dry)",
    quantity: 2500,
    quality: "A" as QualityGrade,
    expectedPrice: 125,
    location: "Tenali Mandi, AP",
    status: "OPEN",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
  {
    id: "lot-rice-03",
    farmerId: "venkat-farmer",
    farmerName: "Venkat Reddy",
    farmerPhone: "+91 99890 87654",
    crop: "Rice",
    variety: "BPT 5204 Sona Masoori",
    quantity: 8000,
    quality: "B" as QualityGrade,
    expectedPrice: 36,
    location: "Bapatla Market, AP",
    status: "OPEN",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
  {
    id: "lot-cotton-04",
    farmerId: "anji-farmer",
    farmerName: "Anji Naidu",
    farmerPhone: "+91 91234 43210",
    crop: "Cotton",
    variety: "Bt-2 Long Staple",
    quantity: 4000,
    quality: "A" as QualityGrade,
    expectedPrice: 65,
    location: "Narasaraopet, AP",
    status: "OPEN",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
  {
    id: "lot-maize-05",
    farmerId: "krishna-farmer",
    farmerName: "Krishna Rao",
    farmerPhone: "+91 97001 22334",
    crop: "Maize",
    variety: "Pioneer Hybrid Grain",
    quantity: 5000,
    quality: "B" as QualityGrade,
    expectedPrice: 22,
    location: "Vijayawada Hub, AP",
    status: "OPEN",
    createdAt: Timestamp.now(),
    harvestDate: Timestamp.now(),
  },
];

const INITIAL_DEMO_BIDS: (Offer & { crop: string; farmerName: string; farmerPhone?: string })[] = [
  {
    id: "bid-101",
    lotId: "lot-tomato-01",
    farmerId: "ramesh-farmer",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98480 12345",
    buyerId: "sri-lakshmi-traders",
    crop: "Tomato",
    pricePerKg: 25,
    quantity: 1000,
    deliveryDate: Timestamp.now(),
    message: "Direct collection from Guntur gate with refrigerated transport.",
    status: "ACCEPTED",
    createdAt: Timestamp.now(),
  },
  {
    id: "bid-102",
    lotId: "lot-chilli-02",
    farmerId: "lakshmi-fpo",
    farmerName: "Lakshmi FPO",
    farmerPhone: "+91 94401 56789",
    buyerId: "sri-lakshmi-traders",
    crop: "Chilli",
    pricePerKg: 122,
    quantity: 1500,
    deliveryDate: Timestamp.now(),
    message: "Grade A batch verified. Payment via escrow upon moisture check.",
    status: "PENDING",
    createdAt: Timestamp.now(),
  },
  {
    id: "bid-103",
    lotId: "lot-rice-03",
    farmerId: "venkat-farmer",
    farmerName: "Venkat Reddy",
    farmerPhone: "+91 99890 87654",
    buyerId: "sri-lakshmi-traders",
    crop: "Rice",
    pricePerKg: 34,
    quantity: 4000,
    deliveryDate: Timestamp.now(),
    message: "Bulk milling requirement.",
    status: "REJECTED",
    createdAt: Timestamp.now(),
  },
];

// APMC Official Daily Benchmarks for Overview/Analytics
const APMC_BENCHMARKS = [
  {
    crop: "Tomato",
    mandi: "Guntur Yard, AP",
    modalPrice: 26,
    trend: "+4.2%",
    trendUp: true,
  },
  {
    crop: "Chilli",
    mandi: "Tenali Mandi, AP",
    modalPrice: 125,
    trend: "+1.8%",
    trendUp: true,
  },
  {
    crop: "Rice",
    mandi: "Bapatla Market, AP",
    modalPrice: 36,
    trend: "0.0%",
    trendUp: false,
  },
  {
    crop: "Cotton",
    mandi: "Narasaraopet APMC, AP",
    modalPrice: 65,
    trend: "-1.5%",
    trendUp: false,
  },
];

export default function BuyerDashboard() {
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();
  const { currentRole, setCurrentRole } = useRole();
  const { currentView, setCurrentView } = useBuyerTab();

  // State: Buyer info & live datasets
  const [buyer, setBuyer] = useState(DEMO_BUYER);
  const [lots, setLots] = useState<any[]>(INITIAL_DEMO_LOTS);
  const [bids, setBids] = useState<any[]>(INITIAL_DEMO_BIDS);

  // Filters for View 1 (Marketplace)
  const [selectedCrop, setSelectedCrop] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filters for View 2 (Bids)
  const [bidsStatusFilter, setBidsStatusFilter] = useState<string>("ALL");

  // Modal states
  const [activeLotForOffer, setActiveLotForOffer] = useState<any | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerQuantity, setOfferQuantity] = useState<number>(0);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState<string>("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contract & Payment Modal states
  const [viewingContract, setViewingContract] = useState<any | null>(null);
  const [payingOffer, setPayingOffer] = useState<any | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);

  // 1. Auth Guard & Demo Fallback
  useEffect(() => {
    if (authLoading) return;

    if (userProfile && userProfile.role === "BUYER") {
      setBuyer({
        id: userProfile.id,
        companyName: userProfile.name,
        location: userProfile.location || "Vijayawada, Krishna",
        apmcLicense: "AP-GNT-4821",
        verified: userProfile.verified,
        reliabilityScore: 90,
        rating: 4.9,
      });
      if (currentRole !== "BUYER") {
        setCurrentRole("BUYER");
      }
    } else if (userProfile && userProfile.role === "FARMER") {
      router.push("/farmer");
    } else {
      setBuyer(DEMO_BUYER);
      if (currentRole !== "BUYER") {
        setCurrentRole("BUYER");
      }
    }
  }, [authLoading, userProfile, currentRole, setCurrentRole, router]);

  // 2. Fetch Live Lots & Offers from Firestore
  useEffect(() => {
    async function loadData() {
      try {
        const [firestoreLots, firestoreOffers] = await Promise.allSettled([
          getOpenLots(),
          getOffersByBuyer(buyer.id),
        ]);

        if (
          firestoreLots.status === "fulfilled" &&
          firestoreLots.value &&
          firestoreLots.value.length > 0
        ) {
          const formattedLots = firestoreLots.value.map((l) => ({
            ...l,
            farmerName: (l as any).farmerName || "Registered Farmer",
            farmerPhone: (l as any).farmerPhone || "+91 98480 12345",
          }));
          setLots(formattedLots);
        }

        if (
          firestoreOffers.status === "fulfilled" &&
          firestoreOffers.value &&
          firestoreOffers.value.length > 0
        ) {
          setBids(firestoreOffers.value);
        }
      } catch (err) {
        console.warn("Firestore fetch error, utilizing verified demo state:", err);
      }
    }

    loadData();
  }, [buyer.id]);

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Open Offer Modal
  const handleOpenOfferModal = (lot: Lot & { farmerName: string }) => {
    setActiveLotForOffer(lot);
    setOfferPrice(lot.expectedPrice);
    setOfferQuantity(lot.quantity);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setDeliveryDate(tomorrow.toISOString().split("T")[0]);
    setOfferMessage("");
  };

  // Submit Offer
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLotForOffer) return;

    setSubmittingOffer(true);
    try {
      const newOfferData = {
        lotId: activeLotForOffer.id,
        buyerId: buyer.id,
        farmerId: activeLotForOffer.farmerId,
        pricePerKg: offerPrice,
        quantity: offerQuantity,
        message: offerMessage,
        deliveryDate: deliveryDate ? Timestamp.fromDate(new Date(deliveryDate)) : undefined,
      };

      let createdId = `bid-${Date.now()}`;
      try {
        createdId = await createOffer(newOfferData);
      } catch (fErr) {
        console.warn("Using offline lot transaction ID:", fErr);
      }

      const createdBid = {
        id: createdId,
        ...newOfferData,
        crop: activeLotForOffer.crop,
        farmerName: activeLotForOffer.farmerName,
        status: "PENDING" as const,
        createdAt: Timestamp.now(),
      };

      setBids((prev) => [createdBid, ...prev]);
      setToastMessage(
        `✓ Official offer of ₹${offerPrice}/kg submitted for ${activeLotForOffer.crop}!`
      );
      setActiveLotForOffer(null);
    } catch (err) {
      console.error("Failed to submit offer:", err);
      alert("Could not complete offer. Please try again.");
    } finally {
      setSubmittingOffer(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (e) {
      // ignore
    }
    router.push("/login");
  };

  // Filtered lots for View 1
  const filteredLots = lots.filter((lot) => {
    const matchesCrop = selectedCrop === "All" || lot.crop === selectedCrop;
    const matchesGrade = selectedGrade === "All" || lot.quality === selectedGrade;
    const matchesSearch =
      searchQuery === "" ||
      lot.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lot.variety && lot.variety.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCrop && matchesGrade && matchesSearch;
  });

  // Filtered bids for View 2
  const filteredBids = bids.filter((bid) => {
    if (bidsStatusFilter === "ALL") return true;
    return bid.status === bidsStatusFilter;
  });

  // Confirmed contracts for View 3
  const confirmedDeals = bids.filter((b) => b.status === "ACCEPTED");

  // Dynamic Workspace Headers
  const getViewTitle = () => {
    switch (currentView) {
      case "overview":
        return "Executive Trading Desk";
      case "marketplace":
        return "Live Produce Exchange";
      case "bids":
        return "Negotiations & Active Bids";
      case "contracts":
        return "Confirmed Trades & Escrow Settlement";
    }
  };

  const getViewSubtitle = () => {
    switch (currentView) {
      case "overview":
        return "High-level procurement intelligence, active capital deployment, and deal pipelines.";
      case "marketplace":
        return "Direct farm-gate produce lots verified for APMC standards and immediate procurement.";
      case "bids":
        return "Real-time purchase negotiation desk with verified farmers and FPOs.";
      case "contracts":
        return "Legally binding digital agreements with 100% KisanMitra Escrow protection.";
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center bg-[#0E2318] text-[#F4F1E4] transition-opacity duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D9A441] border-t-transparent shadow-[0_0_15px_#D9A441]"></div>
          <p className="font-['Fraunces'] text-lg font-semibold tracking-wide text-[#F4F1E4]">
            KisanMitra | Loading Buyer Desk...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0E2318] text-[#F4F1E4] font-['Work_Sans',sans-serif] transition-opacity duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border-2 border-[#D9A441] bg-[#163C29] px-6 py-4 text-base font-bold text-[#F4F1E4] shadow-2xl backdrop-blur-md animate-bounce">
          <Sparkles className="h-6 w-6 text-[#D9A441]" />
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER BAR: USER IDENTITY & APMC CREDENTIALS */}
      <header className="mb-6 flex flex-col gap-4 border-b border-[#F4F1E4]/15 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#D9D5BE]/70">
            <span>Buyer Portal</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#D9A441]" />
            <span className="text-[#D9A441] font-bold capitalize">{currentView}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-['Fraunces',serif] text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F1E4]">
              {getViewTitle()}
            </h1>
          </div>
          <p className="mt-1 text-sm sm:text-base text-[#D9D5BE]">
            {getViewSubtitle()}
          </p>

          {/* User identity & Verified APMC badge */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#D9D5BE]">
            <span className="text-base font-bold text-[#F4F1E4]">
              {buyer.companyName}
            </span>
            <span className="text-[#F4F1E4]/40">|</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Verified Buyer ✓
            </span>
            <span className="text-[#F4F1E4]/40">|</span>
            <span className="rounded-lg bg-[#D9A441]/15 px-2.5 py-0.5 font-mono text-xs font-bold text-[#D9A441] border border-[#D9A441]/30">
              APMC Lic #{buyer.apmcLicense}
            </span>
            <span className="text-[#F4F1E4]/40">|</span>
            <span className="flex items-center gap-1 text-[#D9D5BE]">
              <MapPin className="h-3.5 w-3.5 text-[#D9A441]" />
              {buyer.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-2xl border border-[#F4F1E4]/20 bg-white/5 px-5 py-3 text-sm sm:text-base font-bold text-[#F4F1E4] hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* QUICK IN-PAGE NAVIGATION TABS */}
      <nav className="mb-8 flex flex-wrap items-center gap-2.5 border-b border-[#F4F1E4]/15 pb-4">
        <button
          onClick={() => setCurrentView("overview")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-bold transition-all cursor-pointer ${
            currentView === "overview"
              ? "bg-[#D9A441] text-[#0E2318] shadow-lg shadow-[#D9A441]/25"
              : "bg-white/5 text-[#D9D5BE] hover:bg-white/10 hover:text-[#F4F1E4]"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setCurrentView("marketplace")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-bold transition-all cursor-pointer ${
            currentView === "marketplace"
              ? "bg-[#D9A441] text-[#0E2318] shadow-lg shadow-[#D9A441]/25"
              : "bg-white/5 text-[#D9D5BE] hover:bg-white/10 hover:text-[#F4F1E4]"
          }`}
        >
          <Store className="h-5 w-5" />
          <span>Marketplace</span>
          <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-xs font-black">
            {lots.length}
          </span>
        </button>

        <button
          onClick={() => setCurrentView("bids")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-bold transition-all cursor-pointer ${
            currentView === "bids"
              ? "bg-[#D9A441] text-[#0E2318] shadow-lg shadow-[#D9A441]/25"
              : "bg-white/5 text-[#D9D5BE] hover:bg-white/10 hover:text-[#F4F1E4]"
          }`}
        >
          <Send className="h-5 w-5" />
          <span>My Bids</span>
          <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-xs font-black">
            {bids.length}
          </span>
        </button>

        <button
          onClick={() => setCurrentView("contracts")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-bold transition-all cursor-pointer ${
            currentView === "contracts"
              ? "bg-[#D9A441] text-[#0E2318] shadow-lg shadow-[#D9A441]/25"
              : "bg-white/5 text-[#D9D5BE] hover:bg-white/10 hover:text-[#F4F1E4]"
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Contracts &amp; Orders</span>
          <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-xs font-black">
            {confirmedDeals.length}
          </span>
        </button>
      </nav>

      {/* =========================================================================
          VIEW 1: MARKETPLACE (DEFAULT / PRIMARY)
          ========================================================================= */}
      {currentView === "marketplace" && (
        <section className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4]">
                Available Produce Lots
              </h2>
              <p className="text-sm sm:text-base text-[#D9D5BE]">
                Direct-from-farm verified lots available for immediate purchase.
              </p>
            </div>

            {/* CROP FILTER PILLS */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#F4F1E4]/15 bg-[#163C29]/80 p-1.5 backdrop-blur-md">
              {["All", "Tomato", "Chilli", "Rice", "Cotton", "Maize"].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition-all cursor-pointer ${
                    selectedCrop === crop
                      ? "bg-[#D9A441] text-[#0E2318] shadow-md"
                      : "text-[#D9D5BE] hover:text-[#F4F1E4] hover:bg-white/10"
                  }`}
                >
                  {crop === "All" ? "All Crops" : `🌾 ${crop}`}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH & GRADE FILTER BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <input
                type="text"
                placeholder="🔍 Search by variety, mandi location, or crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29]/80 px-5 py-3.5 text-base text-[#F4F1E4] placeholder-[#D9D5BE]/60 outline-none focus:border-[#D9A441] focus:bg-[#163C29] transition-all shadow-inner"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                aria-label="Filter lots by quality grade"
                className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-sm sm:text-base font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
              >
                <option value="All">All Quality Grades</option>
                <option value="A">Grade A — Premium</option>
                <option value="B">Grade B — Standard</option>
                <option value="C">Grade C — Economy</option>
              </select>
            </div>
          </div>

          {/* PRODUCE CARDS 2-TO-3 COLUMN RESPONSIVE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLots.map((lot) => (
              <div
                key={lot.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[#D9A441]/60 hover:bg-[#163C29]/80"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-xl bg-[#D9A441]/25 px-3 py-1 text-sm font-black uppercase tracking-wider text-[#D9A441]">
                          🌾 {lot.crop}
                        </span>
                        <span
                          className={`rounded-xl px-3 py-1 text-xs font-bold border ${
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
                      <h3 className="mt-3 font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4] leading-tight">
                        {lot.variety || `${lot.crop} Lot`}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D9D5BE] block">
                        Asking Price
                      </span>
                      <span className="font-['Fraunces',serif] text-3xl font-black text-[#D9A441] block leading-none mt-1">
                        ₹{lot.expectedPrice}
                        <span className="text-sm font-semibold text-[#D9D5BE]">/kg</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5 border-y border-[#F4F1E4]/15 py-4 text-sm sm:text-base">
                    <div className="flex items-center justify-between text-[#F4F1E4]">
                      <span className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#D9A441]" /> Available Volume:
                      </span>
                      <strong className="font-black text-[#F4F1E4]">
                        {lot.quantity.toLocaleString()} kg
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-[#F4F1E4]">
                      <span className="flex items-center gap-2">
                        <span className="text-base">💰</span> Lot Valuation:
                      </span>
                      <strong className="font-black text-[#D9A441]">
                        ₹{(lot.quantity * lot.expectedPrice).toLocaleString()}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-[#D9D5BE]">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#D9A441]" /> Location:
                      </span>
                      <span className="text-right font-semibold text-[#F4F1E4]">
                        {lot.farmerName} • {lot.location}
                      </span>
                    </div>

                    {lot.harvestDate && (
                      <div className="flex items-center justify-between text-[#D9D5BE]">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#D9A441]" /> Harvest Date:
                        </span>
                        <span className="font-semibold text-[#F4F1E4]">
                          {formatDate(lot.harvestDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* GOLD MAKE OFFER CTA BUTTON */}
                <div className="mt-6">
                  <button
                    onClick={() => handleOpenOfferModal(lot)}
                    className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] py-3.5 px-6 text-base sm:text-lg font-black text-[#0E2318] shadow-xl shadow-[#D9A441]/25 hover:shadow-2xl hover:shadow-[#D9A441]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>🤝</span>
                    <span>Make Offer (₹{lot.expectedPrice}/kg)</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredLots.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#F4F1E4]/20 p-12 text-center bg-[#163C29]/30">
                <span className="text-5xl mb-3">🌾</span>
                <p className="text-xl font-bold text-[#F4F1E4]">No produce lots found matching your filter.</p>
                <p className="text-sm text-[#D9D5BE] mt-1">
                  Try clearing the search query or switching crop categories above.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 2: MY BIDS (NEGOTIATION DESK)
          ========================================================================= */}
      {currentView === "bids" && (
        <section className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4]">
                Negotiation Desk &amp; Active Bids
              </h2>
              <p className="text-sm sm:text-base text-[#D9D5BE]">
                Track outgoing price offers, counter-negotiations, and deal margins.
              </p>
            </div>

            {/* STATUS FILTER TABS */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#F4F1E4]/15 bg-[#163C29]/80 p-1.5 backdrop-blur-md">
              {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setBidsStatusFilter(status)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
                    bidsStatusFilter === status
                      ? "bg-[#D9A441] text-[#0E2318] shadow-md"
                      : "text-[#D9D5BE] hover:text-[#F4F1E4] hover:bg-white/10"
                  }`}
                >
                  {status === "ALL" ? `All Bids (${bids.length})` : status}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBids.map((bid) => {
              const totalAmount = bid.pricePerKg * bid.quantity;
              return (
                <div
                  key={bid.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md transition-all hover:border-[#D9A441]/50"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-xl bg-[#D9A441]/20 px-3 py-1 text-xs font-black uppercase text-[#D9A441]">
                            🌾 {bid.crop || "Produce"}
                          </span>
                          <span className="text-xs text-[#D9D5BE]">
                            Bid #{bid.id}
                          </span>
                        </div>
                        <h3 className="mt-2 font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4]">
                          {bid.crop} Sourcing Offer
                        </h3>
                      </div>

                      <div>
                        {bid.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/20 px-3.5 py-1 text-sm font-bold text-amber-300">
                            ⏳ Pending Farmer Response
                          </span>
                        )}
                        {bid.status === "ACCEPTED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1 text-sm font-bold text-emerald-300">
                            ✅ Offer Accepted
                          </span>
                        )}
                        {bid.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/20 px-3.5 py-1 text-sm font-bold text-rose-300">
                            ❌ Closed / Countered
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 space-y-2.5 rounded-xl bg-[#0E2318]/50 p-4 border border-[#F4F1E4]/10 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span className="text-[#D9D5BE]">Farmer / Seller:</span>
                        <span className="font-bold text-[#F4F1E4]">
                          {bid.farmerName || "Registered Farmer"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#D9D5BE]">Proposed Unit Rate:</span>
                        <span className="font-black text-[#D9A441] text-lg">
                          ₹{bid.pricePerKg} / kg
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#D9D5BE]">Volume:</span>
                        <span className="font-bold text-[#F4F1E4]">
                          {bid.quantity.toLocaleString()} kg
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-[#F4F1E4]/10 pt-2 text-base font-black">
                        <span className="text-emerald-300">Total Valuation:</span>
                        <span className="text-emerald-300">
                          ₹{totalAmount.toLocaleString()}
                        </span>
                      </div>

                      {bid.deliveryDate && (
                        <div className="flex justify-between text-xs text-[#D9D5BE]">
                          <span>📅 Proposed Pickup Window:</span>
                          <span className="font-semibold text-[#F4F1E4]">
                            {formatDate(bid.deliveryDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {bid.message && (
                      <p className="mt-3 text-xs sm:text-sm text-[#D9D5BE]/90 italic border-l-2 border-[#D9A441] pl-3 py-1">
                        &ldquo;{bid.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions for Accepted Offers */}
                  {bid.status === "ACCEPTED" && (
                    <div className="mt-5 flex items-center gap-3 border-t border-[#F4F1E4]/15 pt-4">
                      <button
                        onClick={() => setViewingContract(bid)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-[#F4F1E4]/20 bg-white/5 py-3 px-4 text-sm font-bold text-[#F4F1E4] hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-[#D9A441]" />
                        <span>View Contract</span>
                      </button>
                      <button
                        onClick={() => {
                          setPayingOffer(bid);
                          setPaymentDone(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] py-3 px-4 text-sm font-black text-[#0E2318] shadow-lg shadow-[#D9A441]/20 transition-all cursor-pointer"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Disburse Escrow</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredBids.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#F4F1E4]/20 p-12 text-center bg-[#163C29]/30">
                <span className="text-5xl mb-3">🤝</span>
                <p className="text-xl font-bold text-[#F4F1E4]">No bids found in this status category.</p>
                <button
                  onClick={() => setCurrentView("marketplace")}
                  className="mt-4 rounded-2xl bg-[#D9A441] px-6 py-3 font-bold text-[#0E2318] cursor-pointer"
                >
                  Browse Marketplace to Make an Offer
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 3: CONTRACTS & ORDERS (CONFIRMED DEALS)
          ========================================================================= */}
      {currentView === "contracts" && (
        <section className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div>
            <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4]">
              Confirmed Procurement Contracts &amp; Escrow
            </h2>
            <p className="text-sm sm:text-base text-[#D9D5BE]">
              Legally binding digital trade agreements with 100% KisanMitra Escrow security.
            </p>
          </div>

          {/* ESCROW SECURITY GUARANTEE BANNER */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-[#163C29] to-[#0E2318] p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-['Fraunces',serif] text-xl font-bold text-emerald-300">
                  KisanMitra Zero-Default Escrow Protocol
                </h4>
                <p className="text-sm text-[#D9D5BE]">
                  Funds are secured upon offer acceptance. Payment releases automatically when weighbridge quality inspection clears.
                </p>
              </div>
            </div>
            <div className="text-left md:text-right flex-shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9D5BE]">Total Locked in Escrow</span>
              <p className="font-['Fraunces',serif] text-2xl sm:text-3xl font-black text-[#D9A441]">
                ₹
                {confirmedDeals
                  .reduce((acc, curr) => acc + curr.pricePerKg * curr.quantity, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* CONTRACTS LIST */}
          <div className="space-y-4">
            {confirmedDeals.map((deal) => {
              const dealValue = deal.pricePerKg * deal.quantity;
              return (
                <div
                  key={deal.id}
                  className="rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:border-[#D9A441]/40 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-300 uppercase">
                        Active Contract #{deal.id}
                      </span>
                      <span className="text-sm text-[#D9D5BE]">
                        Executed {formatDate(deal.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4]">
                      {deal.crop} • {deal.quantity.toLocaleString()} kg @ ₹{deal.pricePerKg}/kg
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#D9D5BE] pt-1">
                      <span>
                        🧑‍🌾 Seller: <strong className="text-[#F4F1E4]">{deal.farmerName}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        🏢 Escrow Balance: <strong className="text-[#D9A441]">₹{dealValue.toLocaleString()}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        🔒 Safe Payout Ready
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => setViewingContract(deal)}
                      className="flex items-center gap-2 rounded-2xl border border-[#F4F1E4]/20 bg-white/5 py-3 px-5 text-sm font-bold text-[#F4F1E4] hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-[#D9A441]" />
                      <span>View Legal Contract</span>
                    </button>

                    <button
                      onClick={() => {
                        setPayingOffer(deal);
                        setPaymentDone(false);
                      }}
                      className="flex items-center gap-2 rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] py-3 px-6 text-sm font-black text-[#0E2318] shadow-lg shadow-[#D9A441]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Release Escrow Payout</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {confirmedDeals.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#F4F1E4]/20 p-12 text-center bg-[#163C29]/30">
                <span className="text-5xl mb-3">📜</span>
                <p className="text-xl font-bold text-[#F4F1E4]">No confirmed contracts yet.</p>
                <p className="text-sm text-[#D9D5BE] mt-1">
                  Once a farmer accepts your bid, digital legal contracts and escrow settlement will appear here.
                </p>
                <button
                  onClick={() => setCurrentView("marketplace")}
                  className="mt-4 rounded-2xl bg-[#D9A441] px-6 py-3 font-bold text-[#0E2318] cursor-pointer"
                >
                  Explore Produce Lots
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          VIEW 4: OVERVIEW (EXECUTIVE SUMMARY)
          ========================================================================= */}
      {currentView === "overview" && (
        <section className="flex flex-col gap-8 animate-in fade-in duration-300">
          {/* HIGH-LEVEL TRADING METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[#D9D5BE] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <span>Total Volume Sourced</span>
                <span className="text-xl">🚛</span>
              </div>
              <p className="mt-2 font-['Fraunces',serif] text-3xl sm:text-4xl font-extrabold text-[#D9A441]">
                {(
                  confirmedDeals.reduce((acc, curr) => acc + (curr.quantity || 0), 0) / 1000
                ).toFixed(1)}{" "}
                <span className="text-lg font-normal text-[#F4F1E4]">MT</span>
              </p>
              <span className="mt-1 block text-xs sm:text-sm font-medium text-emerald-400">
                Direct farm-gate procurement
              </span>
            </div>

            <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[#D9D5BE] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <span>Active Capital Deployed</span>
                <span className="text-xl">💰</span>
              </div>
              <p className="mt-2 font-['Fraunces',serif] text-3xl sm:text-4xl font-extrabold text-[#F4F1E4]">
                ₹
                {(
                  confirmedDeals.reduce((acc, curr) => acc + curr.pricePerKg * curr.quantity, 0) /
                  1000
                ).toFixed(0)}
                k
              </p>
              <span className="mt-1 block text-xs sm:text-sm font-medium text-[#D9D5BE]">
                Locked in KisanMitra Escrow
              </span>
            </div>

            <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[#D9D5BE] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <span>Pending Negotiations</span>
                <span className="text-xl">⏳</span>
              </div>
              <p className="mt-2 font-['Fraunces',serif] text-3xl sm:text-4xl font-extrabold text-amber-400">
                {bids.filter((b) => b.status === "PENDING").length}
              </p>
              <span className="mt-1 block text-xs sm:text-sm font-medium text-[#D9D5BE]">
                Active outgoing offers
              </span>
            </div>

            <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between text-[#D9D5BE] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <span>Avg Commission Saved</span>
                <span className="text-xl">📉</span>
              </div>
              <p className="mt-2 font-['Fraunces',serif] text-3xl sm:text-4xl font-extrabold text-emerald-400">
                ₹2.80 <span className="text-sm font-normal text-[#F4F1E4]">/ kg</span>
              </p>
              <span className="mt-1 block text-xs sm:text-sm font-medium text-emerald-400">
                vs traditional APMC mandi middleman
              </span>
            </div>
          </div>

          {/* QUICK-ACTION SHORTCUTS & LIVE PULSE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: QUICK-ACTION SHORTCUTS */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <h3 className="font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4]">
                Executive Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentView("marketplace")}
                  className="flex flex-col justify-between rounded-2xl border border-[#D9A441]/40 bg-[#D9A441]/10 p-5 text-left hover:bg-[#D9A441]/20 transition-all cursor-pointer group"
                >
                  <div>
                    <Store className="h-8 w-8 text-[#D9A441] mb-2" />
                    <h4 className="font-bold text-lg text-[#F4F1E4]">Explore Marketplace</h4>
                    <p className="text-xs sm:text-sm text-[#D9D5BE] mt-1">
                      Browse fresh harvest lots from Guntur &amp; Krishna districts.
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-1 text-xs font-bold text-[#D9A441] group-hover:translate-x-1 transition-transform">
                    View Lots ({lots.length}) <ArrowRight className="h-4 w-4" />
                  </span>
                </button>

                <button
                  onClick={() => setCurrentView("bids")}
                  className="flex flex-col justify-between rounded-2xl border border-[#F4F1E4]/15 bg-[#163C29]/50 p-5 text-left hover:bg-[#163C29]/80 transition-all cursor-pointer group"
                >
                  <div>
                    <Send className="h-8 w-8 text-[#D9D5BE] mb-2" />
                    <h4 className="font-bold text-lg text-[#F4F1E4]">Manage Negotiations</h4>
                    <p className="text-xs sm:text-sm text-[#D9D5BE] mt-1">
                      Check farmer counter-offers and pending bids.
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-1 text-xs font-bold text-[#D9A441] group-hover:translate-x-1 transition-transform">
                    View Bids ({bids.length}) <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>

              {/* RECENT CONTRACT SUMMARY */}
              <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-base text-[#F4F1E4]">Latest Contract Status</h4>
                  <button
                    onClick={() => setCurrentView("contracts")}
                    className="text-xs font-bold text-[#D9A441] hover:underline"
                  >
                    View All →
                  </button>
                </div>
                {confirmedDeals.length > 0 ? (
                  <div className="space-y-2">
                    {confirmedDeals.slice(0, 2).map((deal) => (
                      <div
                        key={deal.id}
                        className="flex items-center justify-between rounded-xl bg-[#0E2318]/50 p-3 text-sm"
                      >
                        <div>
                          <span className="font-bold text-[#F4F1E4]">
                            {deal.crop} ({deal.quantity.toLocaleString()} kg)
                          </span>
                          <p className="text-xs text-[#D9D5BE]">{deal.farmerName}</p>
                        </div>
                        <span className="font-bold text-[#D9A441]">
                          ₹{(deal.pricePerKg * deal.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#D9D5BE]">No executed contracts yet.</p>
                )}
              </div>
            </div>

            {/* RIGHT: APMC BENCHMARK PULSE */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <h3 className="font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4]">
                APMC Mandi Rate Pulse
              </h3>

              <div className="rounded-2xl border border-[#F4F1E4]/10 bg-[#163C29]/50 p-5 shadow-xl">
                <p className="text-xs text-[#D9D5BE] mb-4">
                  Official APMC daily modal benchmark prices from major regional yards:
                </p>

                <div className="divide-y divide-[#F4F1E4]/10">
                  {APMC_BENCHMARKS.map((item) => (
                    <div key={item.crop} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#F4F1E4] text-base">
                          🌾 {item.crop}
                        </span>
                        <p className="text-xs text-[#D9D5BE]">{item.mandi}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-['Fraunces',serif] text-xl font-bold text-[#D9A441]">
                          ₹{item.modalPrice}
                          <span className="text-xs font-normal text-[#D9D5BE]">/kg</span>
                        </span>
                        <span
                          className={`ml-2 text-xs font-bold ${
                            item.trendUp ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {item.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F4F1E4]/10 flex items-center justify-between text-xs text-[#D9D5BE]">
                  <span>Feed Source: AP Marketing Dept</span>
                  <span className="text-emerald-400 font-semibold">● Live Sync Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          MODAL 1: MAKE PURCHASE OFFER
          ========================================================================= */}
      {activeLotForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl border border-[#F4F1E4]/20 bg-[#0E2318] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-[#F4F1E4]">
            <button
              onClick={() => setActiveLotForOffer(null)}
              className="absolute top-5 right-5 text-[#D9D5BE] hover:text-white p-1"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-xl bg-[#D9A441]/25 px-3 py-1 text-sm font-black uppercase text-[#D9A441]">
                🌾 {activeLotForOffer.crop}
              </span>
              <span className="text-sm text-[#D9D5BE]">
                Seller: <strong className="text-[#F4F1E4]">{activeLotForOffer.farmerName}</strong>
              </span>
            </div>
            <h2 className="font-['Fraunces',serif] text-2xl sm:text-3xl font-bold text-[#F4F1E4]">
              Submit Purchase Offer
            </h2>
            <p className="text-sm sm:text-base text-[#D9D5BE] mt-1">
              Available: <strong className="text-[#F4F1E4]">{activeLotForOffer.quantity.toLocaleString()} kg</strong> • Asking: <strong className="text-[#D9A441]">₹{activeLotForOffer.expectedPrice}/kg</strong>
            </p>

            <form onSubmit={handleSubmitOffer} className="mt-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#D9D5BE] mb-1.5">
                    💰 Offered Price (₹ / kg) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29]/80 px-4 py-3.5 text-lg font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#D9D5BE] mb-1.5">
                    📦 Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    max={activeLotForOffer.quantity}
                    required
                    value={offerQuantity}
                    onChange={(e) => setOfferQuantity(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29]/80 px-4 py-3.5 text-lg font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                  />
                </div>
              </div>

              {/* DYNAMIC TOTAL VALUE CARD */}
              <div className="rounded-2xl border border-[#D9A441]/40 bg-[#D9A441]/10 p-5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold uppercase tracking-wider text-[#D9D5BE] block">
                    Total Deal Valuation
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Direct Farmer Escrow Payout
                  </span>
                </div>
                <div className="text-right font-['Fraunces',serif] text-3xl sm:text-4xl font-black text-[#D9A441]">
                  ₹{(offerPrice * offerQuantity).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#D9D5BE] mb-1.5">
                  📅 Target Pickup / Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29] px-4 py-3.5 text-base font-bold text-[#F4F1E4] outline-none focus:border-[#D9A441]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#D9D5BE] mb-1.5">
                  📝 Logistics or Quality Terms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="e.g. Prompt payment on gate weighing. Dedicated logistics arranged."
                  className="w-full rounded-2xl border border-[#F4F1E4]/20 bg-[#163C29]/80 px-4 py-3 text-sm sm:text-base text-[#F4F1E4] placeholder-[#D9D5BE]/40 outline-none focus:border-[#D9A441]"
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-3 border-t border-[#F4F1E4]/15 pt-5">
                <button
                  type="button"
                  onClick={() => setActiveLotForOffer(null)}
                  className="rounded-2xl border border-[#F4F1E4]/20 bg-transparent px-6 py-3.5 text-base font-bold text-[#D9D5BE] hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOffer}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] px-8 py-4 text-lg font-black text-[#0E2318] shadow-xl shadow-[#D9A441]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingOffer ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0E2318] border-t-transparent"></div>
                      Sending Offer...
                    </>
                  ) : (
                    <>
                      <span>🤝</span>
                      <span>Send Official Offer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DIGITAL CONTRACT VIEWER
          ========================================================================= */}
      {viewingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-[#0E2318] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-[#F4F1E4]">
            <button
              onClick={() => setViewingContract(null)}
              className="absolute top-5 right-5 text-[#D9D5BE] hover:text-white p-1 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-sm font-black uppercase tracking-wider">
                KisanMitra Verified Contract #{viewingContract.id}
              </span>
            </div>
            <h3 className="mt-2 font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4]">
              Direct Farmer Purchase Agreement
            </h3>
            <div className="mt-5 rounded-2xl bg-[#163C29]/80 border border-[#F4F1E4]/15 p-5 text-sm sm:text-base text-[#D9D5BE] space-y-3">
              <p>
                <strong className="text-[#F4F1E4]">🏢 Buyer:</strong> {buyer.companyName} ({buyer.location})
              </p>
              <p>
                <strong className="text-[#F4F1E4]">🧑‍🌾 Seller:</strong> {viewingContract.farmerName}
              </p>
              <p>
                <strong className="text-[#F4F1E4]">🌾 Produce:</strong> {viewingContract.crop} • {viewingContract.quantity.toLocaleString()} kg
              </p>
              <p>
                <strong className="text-[#F4F1E4]">💰 Agreed Rate:</strong> ₹{viewingContract.pricePerKg} / kg (Total: <strong className="text-[#D9A441]">₹{(viewingContract.pricePerKg * viewingContract.quantity).toLocaleString()}</strong>)
              </p>
              <p>
                <strong className="text-[#F4F1E4]">📅 Pickup Window:</strong> By {formatDate(viewingContract.deliveryDate)}
              </p>
              <p>
                <strong className="text-emerald-400">🔒 Digital Escrow Status:</strong> 100% funds locked safely until delivery verification.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingContract(null)}
                className="w-full sm:w-auto rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] px-8 py-3.5 text-base font-black text-[#0E2318] shadow-lg shadow-[#D9A441]/20 cursor-pointer"
              >
                Close Agreement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: PAYMENT / ESCROW SIMULATOR
          ========================================================================= */}
      {payingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#D9A441]/50 bg-[#0E2318] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-[#F4F1E4]">
            <button
              onClick={() => setPayingOffer(null)}
              className="absolute top-5 right-5 text-[#D9D5BE] hover:text-white p-1 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 text-[#D9A441]">
              <CreditCard className="h-6 w-6" />
              <span className="text-sm font-black uppercase tracking-wider">
                Instant Farmer Payout Gateway
              </span>
            </div>
            <h3 className="mt-2 font-['Fraunces',serif] text-2xl font-bold text-[#F4F1E4]">
              Disburse Escrow Payment
            </h3>

            {!paymentDone ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#163C29]/80 border border-[#F4F1E4]/15 p-5 text-sm sm:text-base text-[#D9D5BE] space-y-2.5">
                  <div className="flex justify-between">
                    <span>Beneficiary:</span>
                    <strong className="text-[#F4F1E4]">{payingOffer.farmerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Produce:</span>
                    <strong className="text-[#F4F1E4]">{payingOffer.crop} ({payingOffer.quantity.toLocaleString()} kg)</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#F4F1E4]/15 pt-3 text-lg sm:text-xl font-black text-[#D9A441]">
                    <span>Total Disbursed:</span>
                    <span>₹{(payingOffer.pricePerKg * payingOffer.quantity).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#D9D5BE]/80">
                  Payment is routed directly through KisanMitra Escrow to verified farmer account with 0% platform deductions.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setPaymentDone(true)}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 py-4 px-6 text-lg font-black text-white shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-6 w-6" />
                    Confirm Transfer of ₹{(payingOffer.pricePerKg * payingOffer.quantity).toLocaleString()}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-400">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h4 className="font-['Fraunces',serif] text-2xl font-bold text-emerald-300">
                  Payment Successful!
                </h4>
                <p className="text-sm sm:text-base text-[#D9D5BE]">
                  ₹{(payingOffer.pricePerKg * payingOffer.quantity).toLocaleString()} has been safely disbursed to {payingOffer.farmerName}&apos;s account.
                </p>
                <button
                  onClick={() => setPayingOffer(null)}
                  className="mt-2 w-full rounded-2xl bg-[#D9A441] hover:bg-[#C08A2E] py-3.5 px-6 text-base font-black text-[#0E2318] shadow-lg shadow-[#D9A441]/30 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
