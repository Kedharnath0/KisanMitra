"use client";

import React, { useState } from "react";
import {
  ArrowUpDown,
  Filter,
  Building,
  SlidersHorizontal,
} from "lucide-react";
import {
  MOCK_MARKET_PRICES,
  CROPS,
  MockMarketPrice,
} from "@/data/mock";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function MarketPricesPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const [selectedMarketFilter, setSelectedMarketFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"modalPrice" | "arrivalQuantity">("modalPrice");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered prices
  const filteredPrices = MOCK_MARKET_PRICES.filter((item) => {
    const matchCrop = item.crop === selectedCrop;
    const matchMarket = selectedMarketFilter === "all" || item.marketId === selectedMarketFilter;
    return matchCrop && matchMarket;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const currentAvgPrice =
    filteredPrices.length > 0
      ? Math.round(
          filteredPrices.reduce((acc, curr) => acc + curr.modalPrice, 0) /
            filteredPrices.length
        )
      : 0;

  // Comparison logic for Compare Markets tool
  const [compareQty, setCompareQty] = useState<number>(1000);
  const [compareDistance, setCompareDistance] = useState<number>(35);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Market Intelligence & Live Mandi Prices
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Real-time price discovery and arrival volume tracking across Andhra Pradesh yards
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            320+ Mandis Monitored
          </span>
        </div>
      </div>

      {/* ─── Filter Bar: Crop Selector & Market Filter ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-km-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-km-neutral-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Crop:
          </span>
          {CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCrop === crop
                  ? "bg-[#D9A441] text-[#0E2318] shadow-sm ring-2 ring-[#D9A441]/30"
                  : "bg-km-neutral-100 text-km-neutral-600 hover:bg-km-neutral-200"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-xs font-bold text-km-neutral-700 bg-km-neutral-100 px-3 py-1.5 rounded-lg border border-km-neutral-200">
            Avg Rate: <strong className="text-km-neutral-900">₹{currentAvgPrice}/kg</strong>
          </span>
          <label className="text-km-neutral-500 font-medium hidden sm:inline">Filter Market:</label>
          <select
            value={selectedMarketFilter}
            onChange={(e) => setSelectedMarketFilter(e.target.value)}
            className="rounded-lg border border-km-neutral-200 px-3 py-1.5 bg-white text-xs font-semibold text-km-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
          >
            <option value="all">All Markets</option>
            <option value="vijayawada">Vijayawada</option>
            <option value="guntur">Guntur</option>
            <option value="tenali">Tenali</option>
            <option value="bapatla">Bapatla</option>
            <option value="narasaraopet">Narasaraopet</option>
          </select>
        </div>
      </div>

      {/* ─── Live Mandi Prices Table ─── */}
      <div className="km-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-km-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-km-neutral-50/50 to-white">
          <div>
            <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
              Live Mandi Price Comparison ({selectedCrop})
            </h3>
            <p className="text-xs text-km-neutral-500">
              Sorted by highest modal rate — reference prices for farm-gate negotiations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (sortField === "modalPrice") setSortAsc(!sortAsc);
                else {
                  setSortField("modalPrice");
                  setSortAsc(false);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                sortField === "modalPrice"
                  ? "bg-[#D9A441]/10 text-amber-900 border-[#D9A441]"
                  : "bg-white text-km-neutral-600 border-km-neutral-200"
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort by Price
            </button>
            <button
              onClick={() => {
                if (sortField === "arrivalQuantity") setSortAsc(!sortAsc);
                else {
                  setSortField("arrivalQuantity");
                  setSortAsc(false);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                sortField === "arrivalQuantity"
                  ? "bg-[#D9A441]/10 text-amber-900 border-[#D9A441]"
                  : "bg-white text-km-neutral-600 border-km-neutral-200"
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort by Arrivals
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Market Yard</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4 text-right">Min Rate</th>
                <th className="py-3.5 px-4 text-right">Max Rate</th>
                <th className="py-3.5 px-4 text-right">Modal (Avg) Rate</th>
                <th className="py-3.5 px-4 text-right">Daily Arrival Volume</th>
                <th className="py-3.5 px-4 text-center">Trend (3D)</th>
                <th className="py-3.5 px-5 text-center">Demand Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {filteredPrices.map((item) => {
                const isBest = item.marketId === "vijayawada" && selectedCrop === "Tomato";
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-amber-50/20 transition-colors ${
                      isBest ? "bg-[#D9A441]/5 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-[#D9A441]" />
                        <span className="font-bold text-km-neutral-900">
                          {item.marketName}
                        </span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D9A441] text-[#0E2318]">
                            TOP PICK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-km-neutral-600">{item.district}</td>
                    <td className="py-4 px-4 text-right font-medium text-km-neutral-600">
                      ₹{item.minPrice}/kg
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-km-neutral-600">
                      ₹{item.maxPrice}/kg
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-base font-black text-km-neutral-900">
                        ₹{item.modalPrice}
                      </span>
                      <span className="text-xs text-km-neutral-400">/kg</span>
                    </td>
                    <td className="py-4 px-4 text-right text-km-neutral-800 font-semibold">
                      {formatNumber(item.arrivalQuantity)} kg
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.trend === "up"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.trend === "down"
                            ? "bg-red-50 text-red-700"
                            : "bg-km-neutral-100 text-km-neutral-600"
                        }`}
                      >
                        {item.trend === "up" ? "▲ +" : item.trend === "down" ? "▼ " : "● "}
                        {item.trendPct}%
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          item.arrivalQuantity > 13000
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : item.arrivalQuantity > 8000
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {item.arrivalQuantity > 13000
                          ? "Heavy Inflow"
                          : item.arrivalQuantity > 8000
                          ? "High Demand"
                          : "Moderate"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Compare Markets Tool ─── */}
      <div className="card-forest p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <SlidersHorizontal className="h-5 w-5 text-[#D9A441]" />
          <h2 className="text-xl sm:text-2xl font-bold font-fraunces text-[#F4F1E4]">
            Side-by-Side Mandi Comparison & Logistics Simulation
          </h2>
        </div>
        <p className="text-sm text-[#D9D5BE] mb-6">
          Calculate actual in-hand return for your specific quantity after factoring transport and handling
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#D9A441] block mb-1.5">
              Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 p-2.5 text-sm text-[#F4F1E4] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
            >
              {CROPS.map((c) => (
                <option key={c} value={c} className="text-neutral-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#D9A441] block mb-1.5">
              Produce Quantity (kg)
            </label>
            <input
              type="number"
              value={compareQty}
              onChange={(e) => setCompareQty(Math.max(100, Number(e.target.value)))}
              className="w-full rounded-xl bg-white/10 border border-white/20 p-2.5 text-sm text-[#F4F1E4] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#D9A441] block mb-1.5">
              Farmer Origin Point
            </label>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F4F1E4] font-medium">
              Guntur Rural (Farm gate)
            </div>
          </div>
        </div>

        {/* Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPrices.slice(0, 3).map((market, idx) => {
            const distance = idx === 0 ? 35 : idx === 1 ? 12 : 25; // simulated distance from Guntur
            const transportRatePerKm = 2.5; // ₹2.5 / km / quintal approx
            const quintals = compareQty / 100;
            const transportCost = Math.round(distance * transportRatePerKm * quintals * 15);
            const gross = market.modalPrice * compareQty;
            const net = gross - transportCost;
            const isTop = idx === 0;

            return (
              <div
                key={market.id}
                className={`rounded-2xl p-5 border transition-all ${
                  isTop
                    ? "bg-white/15 border-[#D9A441] ring-1 ring-[#D9A441]"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-fraunces font-bold text-lg text-[#F4F1E4]">
                      {market.marketName.replace(" Market Yard", "")}
                    </h4>
                    <p className="text-xs text-[#D9D5BE]">{distance} km from your farm</p>
                  </div>
                  {isTop && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9A441] text-[#0E2318]">
                      HIGHEST NET
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-xs border-t border-white/10 pt-3 text-[#D9D5BE]">
                  <div className="flex justify-between">
                    <span>Mandi Rate:</span>
                    <strong className="text-white">₹{market.modalPrice}/kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Value ({compareQty} kg):</span>
                    <span className="text-white">{formatCurrency(gross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Transport Cost:</span>
                    <span className="text-red-400 font-semibold">-{formatCurrency(transportCost)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block">
                    Expected Net In-Hand
                  </span>
                  <span className="font-fraunces text-2xl font-bold text-[#D9A441]">
                    {formatCurrency(net)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
