"use client";

import React, { useState } from "react";
import {
  LifeBuoy,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  Phone,
  HelpCircle,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import {
  MOCK_GRIEVANCES,
  GRIEVANCE_CATEGORIES,
  MOCK_TRANSACTIONS,
  MockGrievance,
} from "@/data/mock";
import type { GrievanceStatus } from "@/types";

export default function SupportPage() {
  const [grievances, setGrievances] = useState<MockGrievance[]>(MOCK_GRIEVANCES);
  const [selectedTxn, setSelectedTxn] = useState<string>("txn_001");
  const [category, setCategory] = useState<string>("Delayed Payment");
  const [description, setDescription] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGrievance: MockGrievance = {
      id: `grv_${Date.now()}`,
      transactionId: selectedTxn,
      transactionRef: `TXN-${selectedTxn.toUpperCase()} · Ramesh Kumar`,
      raisedBy: "ramesh_001",
      category,
      description,
      status: "OPEN" as GrievanceStatus,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setGrievances([newGrievance, ...grievances]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription("");
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Grievances, Disputes & Farmer Support
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Fast resolution for payment delays, transport setbacks, and produce quality disputes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:18001234567"
            className="btn-gold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Toll-Free Helpline: 1800-123-4567</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Grievance Form */}
        <div className="lg:col-span-7 km-card p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-km-neutral-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="font-fraunces font-bold text-xl text-km-neutral-900">
              File a Dispute / Report Issue
            </h2>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="h-12 w-12 text-[#7CB342] mx-auto animate-bounce" />
              <h3 className="font-fraunces font-bold text-xl text-emerald-950">
                Grievance Lodged Successfully!
              </h3>
              <p className="text-xs text-emerald-800">
                Case Ticket registered. Platform administrator and dispute arbitrator will review within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                  Related Trade Transaction *
                </label>
                <select
                  value={selectedTxn}
                  onChange={(e) => setSelectedTxn(e.target.value)}
                  className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 bg-white focus:ring-2 focus:ring-[#D9A441] outline-none"
                >
                  {MOCK_TRANSACTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id.toUpperCase()} — {t.crop} ({t.quantity} kg) with {t.buyerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                  Dispute Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-km-neutral-200 p-2.5 text-sm font-semibold text-km-neutral-800 bg-white focus:ring-2 focus:ring-[#D9A441] outline-none"
                >
                  {GRIEVANCE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-km-neutral-600 block mb-1">
                  Description of Issue *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the issue: dates, delayed amounts, vehicle numbers, or quality disagreements..."
                  className="w-full rounded-xl border border-km-neutral-200 p-3 text-xs text-km-neutral-800 focus:ring-2 focus:ring-[#D9A441] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button type="submit" className="btn-gold text-xs shadow-md flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Grievance</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 5 Cols: FAQ & Helpline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-forest p-6 rounded-2xl space-y-3 shadow-md">
            <h3 className="font-fraunces font-bold text-xl text-[#F4F1E4] flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#D9A441]" />
              Kisan Escrow Guarantee
            </h3>
            <p className="text-xs text-[#D9D5BE] leading-relaxed">
              Every trade initiated through KisanMitra binds buyer capital in an escrow lock. Farmers are 100% safeguarded against unilateral price reductions upon delivery.
            </p>
            <div className="pt-2 border-t border-white/10 text-xs text-[#D9A441] font-semibold">
              Dispute Resolution SLA: Under 48 Hours
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="km-card p-6 space-y-3">
            <h3 className="font-fraunces font-bold text-base text-km-neutral-900 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#D9A441]" />
              Common Questions
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-km-neutral-50 rounded-lg border border-km-neutral-200/60">
                <strong className="text-km-neutral-900 block mb-1">
                  When does the buyer transfer my funds?
                </strong>
                <span className="text-km-neutral-600">
                  Buyers deposit funds into KisanMitra escrow upon offer acceptance. Payment releases to your bank account within 24–48 hours of dispatch receipt.
                </span>
              </div>

              <div className="p-3 bg-km-neutral-50 rounded-lg border border-km-neutral-200/60">
                <strong className="text-km-neutral-900 block mb-1">
                  Who arranges transportation?
                </strong>
                <span className="text-km-neutral-600">
                  Verified buyers typically arrange direct farm-gate pickup. You can inspect the vehicle number and driver credentials directly in the app.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Reported Grievances History ─── */}
      <div className="km-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-km-neutral-100 bg-gradient-to-r from-km-neutral-50 to-white flex items-center justify-between">
          <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
            My Grievance History & Case Status
          </h3>
          <span className="text-xs font-bold text-km-neutral-500">
            {grievances.length} Tickets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Related Trade</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Filed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {grievances.map((g) => (
                <tr key={g.id} className="hover:bg-amber-50/20">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-km-neutral-800">
                    {g.id.toUpperCase()}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-km-neutral-800">
                    {g.transactionRef}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-km-neutral-700">
                    {g.category}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-km-neutral-600 max-w-xs truncate">
                    {g.description}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        g.status === "RESOLVED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : g.status === "UNDER_REVIEW"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-km-neutral-400">
                    {g.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
