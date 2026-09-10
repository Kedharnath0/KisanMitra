"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { useFarmerProfile } from "@/lib/farmer-profile-context";
import { CropImage } from "@/components/ui/CropImage";

export default function FarmerDashboard() {
  const { profile, setIsProfileOpen } = useFarmerProfile();

  // Highlight crops with high prices today
  const topSoldCrops = [
    {
      crop: "Chilli",
      variety: "Teja Super",
      price: 210,
      unit: "kg",
      mandi: "Guntur Market Yard",
      trend: "▲ +14% high demand",
      status: "Very High Demand",
      tagColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      crop: "Tomato",
      variety: "Hybrid Grade A",
      price: 27,
      unit: "kg",
      mandi: "Vijayawada Yard",
      trend: "▲ +12% rising rate",
      status: "Top Buyer Demand",
      tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      crop: "Cotton",
      variety: "Bunny Medium Staple",
      price: 78,
      unit: "kg",
      mandi: "Narasaraopet Yard",
      trend: "▲ +5% stable gain",
      status: "Heavy Inflow",
      tagColor: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      crop: "Onion",
      variety: "Red Quality",
      price: 35,
      unit: "kg",
      mandi: "Tenali Mandi",
      trend: "▲ +8% quick sale",
      status: "High Trading",
      tagColor: "bg-purple-50 text-purple-800 border-purple-200",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ─── 1. Welcome Section ─── */}
      <div className="card-forest p-6 sm:p-8 relative overflow-hidden shadow-xl rounded-3xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D9A441]/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4E8F5E]/20 text-[#7CB342] border border-[#4E8F5E]/30">
                <span className="h-2 w-2 rounded-full bg-[#7CB342] animate-pulse" />
                Live Mandi Prices Active
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#D9D5BE] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#7CB342]" />
                Verified Farmer
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-fraunces text-[#F4F1E4] tracking-tight">
              Namaste, {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-[#D9D5BE] flex flex-wrap items-center gap-2">
              <MapPin className="h-4 w-4 text-[#D9A441] shrink-0" />
              <span>
                {profile.village ? `${profile.village}, ` : ""}{profile.district}, {profile.state}
              </span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span>Farm Area: <strong className="text-[#F4F1E4]">{profile.acres} Acres</strong></span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span>Crops: <strong className="text-[#D9A441]">{profile.crops.join(", ")}</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="btn-gold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
            >
              <span>Edit Farmer Details</span>
            </button>
            <Link
              href="/farmer/lots?action=create"
              className="btn-ghost-dark text-xs sm:text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Sell Crop</span>
            </Link>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">{profile.acres} Acres</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">No. of Acres</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">{profile.crops.length}</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">Total Crops</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">₹27/kg</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">Tomato Top Rate</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-xs">
            <span className="stat-gold-num text-2xl sm:text-3xl block">₹42,800</span>
            <span className="text-xs text-[#D9D5BE] uppercase tracking-wider font-medium">Total Money Earned</span>
          </div>
        </div>
      </div>

      {/* ─── 2. Action Buttons: Check Market Prices & Sell Your Crop ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          href="/farmer/markets"
          className="flex items-center justify-center gap-3 px-6 py-4.5 sm:py-5 rounded-2xl bg-[#0E2318] text-[#F4F1E4] hover:bg-[#1B3B2B] text-lg sm:text-xl font-bold font-fraunces shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99] border border-[#0E2318] text-center"
        >
          <span>Check Market Prices</span>
          <ArrowRight className="h-5 w-5 text-[#D9A441]" />
        </Link>

        <Link
          href="/farmer/lots"
          className="flex items-center justify-center gap-3 px-6 py-4.5 sm:py-5 rounded-2xl bg-[#D9A441] text-[#0E2318] hover:bg-[#C08A2E] text-lg sm:text-xl font-bold font-fraunces shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99] border border-[#D9A441] text-center"
        >
          <span>Sell Your Crop</span>
          <ArrowRight className="h-5 w-5 text-[#0E2318]" />
        </Link>
      </div>

      {/* ─── 3. New Section: Card c: Today's Top Sold Crops with High Prices ─── */}
      <div className="km-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-km-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/60 flex items-center justify-center text-[#D9A441]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-fraunces font-bold text-xl text-km-neutral-900">
                Today&apos;s Top Sold Crops with High Prices
              </h3>
              <p className="text-xs text-km-neutral-500 mt-0.5">
                Crops with the highest buyer demand and top rates in Andhra Pradesh today
              </p>
            </div>
          </div>

          <Link
            href="/farmer/markets"
            className="text-xs font-bold text-[#D9A441] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Compare all crop rates</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Top crops grid with crop images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {topSoldCrops.map((item) => (
            <div
              key={item.crop}
              className="p-4 rounded-2xl border border-km-neutral-200/80 bg-white hover:border-[#D9A441] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CropImage crop={item.crop} size="md" />
                  <div>
                    <h4 className="font-bold text-base text-km-neutral-900">
                      {item.crop}
                    </h4>
                    <span className="text-xs text-km-neutral-500 block">
                      {item.variety}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-km-neutral-50/70 border border-km-neutral-100 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-km-neutral-500">Today&apos;s Rate:</span>
                    <strong className="text-xl font-black text-km-neutral-900">
                      ₹{item.price}/{item.unit}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-km-neutral-500">Top Mandi:</span>
                    <span className="font-semibold text-km-neutral-800 truncate max-w-[120px]">
                      {item.mandi}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-km-neutral-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700">
                  {item.trend}
                </span>
                <Link
                  href={`/farmer/markets`}
                  className="font-bold text-[#D9A441] hover:underline text-[11px]"
                >
                  View Mandi →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
