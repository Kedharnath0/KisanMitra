"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Building, ArrowRight, MapPin, Tag, PlusCircle } from "lucide-react";
import { MOCK_MARKET_PRICES } from "@/data/mock";
import { CropImage } from "@/components/ui/CropImage";

interface MarketGroup {
  marketId: string;
  marketName: string;
  district: string;
  distance: string;
  crops: {
    crop: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    arrivalQuantity: number;
    trend: "up" | "down" | "stable";
    trendPct: number;
    status: string;
  }[];
}

// Build market groups from market prices data
const ALL_MARKETS: MarketGroup[] = [
  {
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    district: "Krishna District",
    distance: "35 km away",
    crops: [
      {
        crop: "Tomato",
        modalPrice: 27,
        minPrice: 20,
        maxPrice: 32,
        arrivalQuantity: 12000,
        trend: "up",
        trendPct: 8,
        status: "High Buyer Demand",
      },
      {
        crop: "Chilli",
        modalPrice: 195,
        minPrice: 160,
        maxPrice: 220,
        arrivalQuantity: 8500,
        trend: "up",
        trendPct: 6,
        status: "Heavy Trading",
      },
      {
        crop: "Onion",
        modalPrice: 32,
        minPrice: 25,
        maxPrice: 38,
        arrivalQuantity: 14000,
        trend: "stable",
        trendPct: 0,
        status: "Normal Inflow",
      },
      {
        crop: "Rice",
        modalPrice: 42,
        minPrice: 36,
        maxPrice: 48,
        arrivalQuantity: 22000,
        trend: "up",
        trendPct: 3,
        status: "Active Sourcing",
      },
    ],
  },
  {
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    district: "Guntur District",
    distance: "12 km away",
    crops: [
      {
        crop: "Chilli",
        modalPrice: 210,
        minPrice: 175,
        maxPrice: 235,
        arrivalQuantity: 32000,
        trend: "up",
        trendPct: 14,
        status: "Asia's Largest Chilli Mandi",
      },
      {
        crop: "Cotton",
        modalPrice: 76,
        minPrice: 65,
        maxPrice: 84,
        arrivalQuantity: 18000,
        trend: "up",
        trendPct: 5,
        status: "High Mill Demand",
      },
      {
        crop: "Tomato",
        modalPrice: 24,
        minPrice: 18,
        maxPrice: 30,
        arrivalQuantity: 15000,
        trend: "up",
        trendPct: 4,
        status: "Heavy Arrivals",
      },
      {
        crop: "Turmeric",
        modalPrice: 145,
        minPrice: 120,
        maxPrice: 165,
        arrivalQuantity: 7000,
        trend: "up",
        trendPct: 7,
        status: "Good Demand",
      },
    ],
  },
  {
    marketId: "tenali",
    marketName: "Tenali Market Yard",
    district: "Guntur District",
    distance: "22 km away",
    crops: [
      {
        crop: "Onion",
        modalPrice: 35,
        minPrice: 28,
        maxPrice: 40,
        arrivalQuantity: 9500,
        trend: "up",
        trendPct: 8,
        status: "High Retail Demand",
      },
      {
        crop: "Tomato",
        modalPrice: 22,
        minPrice: 17,
        maxPrice: 28,
        arrivalQuantity: 8000,
        trend: "stable",
        trendPct: 0,
        status: "Steady Demand",
      },
      {
        crop: "Maize",
        modalPrice: 26,
        minPrice: 22,
        maxPrice: 30,
        arrivalQuantity: 11000,
        trend: "up",
        trendPct: 2,
        status: "Moderate Inflow",
      },
    ],
  },
  {
    marketId: "bapatla",
    marketName: "Bapatla Market Yard",
    district: "Bapatla District",
    distance: "40 km away",
    crops: [
      {
        crop: "Rice",
        modalPrice: 44,
        minPrice: 38,
        maxPrice: 50,
        arrivalQuantity: 19000,
        trend: "up",
        trendPct: 4,
        status: "Top Paddy Market",
      },
      {
        crop: "Tomato",
        modalPrice: 21,
        minPrice: 16,
        maxPrice: 26,
        arrivalQuantity: 6000,
        trend: "down",
        trendPct: -3,
        status: "Moderate Demand",
      },
      {
        crop: "Potato",
        modalPrice: 28,
        minPrice: 22,
        maxPrice: 34,
        arrivalQuantity: 7500,
        trend: "stable",
        trendPct: 0,
        status: "Regular Trading",
      },
    ],
  },
  {
    marketId: "narasaraopet",
    marketName: "Narasaraopet Market Yard",
    district: "Palnadu District",
    distance: "48 km away",
    crops: [
      {
        crop: "Cotton",
        modalPrice: 78,
        minPrice: 68,
        maxPrice: 86,
        arrivalQuantity: 16000,
        trend: "up",
        trendPct: 6,
        status: "Heavy Ginning Demand",
      },
      {
        crop: "Chilli",
        modalPrice: 190,
        minPrice: 155,
        maxPrice: 215,
        arrivalQuantity: 9000,
        trend: "stable",
        trendPct: 1,
        status: "Steady Volume",
      },
      {
        crop: "Wheat",
        modalPrice: 32,
        minPrice: 26,
        maxPrice: 38,
        arrivalQuantity: 8000,
        trend: "up",
        trendPct: 3,
        status: "Active Sourcing",
      },
    ],
  },
];

export default function MarketPricesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMarkets = ALL_MARKETS.filter((market) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const matchName = market.marketName.toLowerCase().includes(query);
    const matchDistrict = market.district.toLowerCase().includes(query);
    const matchCrop = market.crops.some((c) => c.crop.toLowerCase().includes(query));
    return matchName || matchDistrict || matchCrop;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
          Market Prices
        </h1>
        <p className="text-sm text-km-neutral-500 mt-1">
          Search markets and view the list of crops currently available for selling in each mandi
        </p>
      </div>

      {/* ─── Search Bar to filter markets ─── */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-km-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search market by name or district (e.g., Vijayawada, Guntur, Tenali)..."
          className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white border border-km-neutral-200/90 shadow-sm text-sm font-semibold text-km-neutral-900 placeholder:text-km-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-3 text-xs font-bold text-km-neutral-400 hover:text-km-neutral-700 p-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* ─── Markets List ─── */}
      {filteredMarkets.length === 0 ? (
        <div className="km-card p-12 text-center rounded-3xl">
          <Building className="h-12 w-12 text-km-neutral-300 mx-auto mb-3" />
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-800">
            No markets found
          </h3>
          <p className="text-sm text-km-neutral-500 mt-1 mb-4">
            Try searching for another market name, district, or crop
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 text-xs font-bold bg-km-neutral-100 hover:bg-km-neutral-200 rounded-xl text-km-neutral-700"
          >
            Show All Markets
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMarkets.map((market) => (
            <div
              key={market.marketId}
              className="km-card p-6 sm:p-7 rounded-3xl border border-km-neutral-200/90 shadow-xs hover:shadow-md transition-all"
            >
              {/* Market Name Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-km-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100/60 flex items-center justify-center text-[#D9A441] shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-fraunces font-bold text-2xl text-km-neutral-900 tracking-tight">
                      {market.marketName}
                    </h2>
                    <p className="text-xs text-km-neutral-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>{market.district}</span>
                      <span className="text-km-neutral-300">·</span>
                      <span>{market.distance}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-km-neutral-600 bg-km-neutral-100 px-3 py-1.5 rounded-xl border border-km-neutral-200">
                    {market.crops.length} Crops Available for Selling
                  </span>
                </div>
              </div>

              {/* Crops Currently Available for Selling in this Market */}
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Crops Available for Selling</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {market.crops.map((c) => (
                    <div
                      key={c.crop}
                      className="p-4 rounded-2xl border border-km-neutral-200/80 bg-km-neutral-50/40 hover:bg-white hover:border-[#D9A441] transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <CropImage crop={c.crop} size="md" />
                          <div>
                            <h4 className="font-bold text-base text-km-neutral-900">
                              {c.crop}
                            </h4>
                            <span className="text-[11px] font-semibold text-emerald-700">
                              {c.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-km-neutral-100 space-y-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-km-neutral-500">Today&apos;s Price:</span>
                            <strong className="text-lg font-black text-km-neutral-900">
                              ₹{c.modalPrice}/kg
                            </strong>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-km-neutral-500">
                            <span>Range:</span>
                            <span>₹{c.minPrice} - ₹{c.maxPrice}/kg</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/farmer/lots?action=create&crop=${encodeURIComponent(c.crop)}`}
                        className="w-full text-center py-2 px-3 rounded-xl text-xs font-bold bg-[#D9A441] text-[#0E2318] hover:bg-[#C08A2E] transition-colors shadow-2xs flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Sell {c.crop} Here</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
