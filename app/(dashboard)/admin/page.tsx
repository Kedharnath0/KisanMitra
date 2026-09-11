"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Package,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  Building,
} from "lucide-react";
import {
  MOCK_ADMIN_STATS,
  MOCK_ADMIN_RECENT_USERS,
  MOCK_GRIEVANCES,
} from "@/data/mock";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminDashboard() {
  const [users, setUsers] = useState(MOCK_ADMIN_RECENT_USERS);

  const toggleVerify = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verified: !u.verified } : u))
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
          System Administration & Oversight Console
        </h1>
        <p className="text-sm text-km-neutral-500 mt-1">
          Monitor platform transactions, verify farmer & buyer KYC credentials, and arbitrate trade disputes
        </p>
      </div>

      {/* ─── Metric Strip ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="km-card p-5 border-l-4 border-l-[#D9A441]">
          <span className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 block mb-1">
            Registered Network
          </span>
          <div className="font-fraunces text-3xl font-bold text-km-neutral-900">
            {formatNumber(MOCK_ADMIN_STATS.totalUsers)}
          </div>
          <span className="text-xs text-km-neutral-500 mt-1 block">
            {MOCK_ADMIN_STATS.totalFarmers} Farmers · {MOCK_ADMIN_STATS.totalBuyers} Buyers
          </span>
        </div>

        <div className="km-card p-5 border-l-4 border-l-emerald-600">
          <span className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 block mb-1">
            Total Trade Volume
          </span>
          <div className="font-fraunces text-3xl font-bold text-emerald-800">
            {formatCurrency(MOCK_ADMIN_STATS.totalTransactionValue)}
          </div>
          <span className="text-xs text-km-neutral-500 mt-1 block">
            {MOCK_ADMIN_STATS.totalTransactions} Completed Trades
          </span>
        </div>

        <div className="km-card p-5 border-l-4 border-l-blue-600">
          <span className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 block mb-1">
            Produce Listings
          </span>
          <div className="font-fraunces text-3xl font-bold text-km-neutral-900">
            {MOCK_ADMIN_STATS.totalLots}
          </div>
          <span className="text-xs text-km-neutral-500 mt-1 block">
            {MOCK_ADMIN_STATS.activeLots} Active on Marketplace
          </span>
        </div>

        <div className="km-card p-5 border-l-4 border-l-amber-600">
          <span className="text-xs font-bold uppercase tracking-wider text-km-neutral-400 block mb-1">
            Dispute Cases
          </span>
          <div className="font-fraunces text-3xl font-bold text-amber-900">
            {MOCK_ADMIN_STATS.openGrievances} Open
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            {MOCK_ADMIN_STATS.resolvedGrievances} Cases Resolved
          </span>
        </div>
      </div>

      {/* ─── User KYC Verification Queue ─── */}
      <div className="km-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-km-neutral-100 bg-gradient-to-r from-km-neutral-50 to-white flex items-center justify-between">
          <div>
            <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
              User Verification & KYC Queue
            </h3>
            <p className="text-xs text-km-neutral-500">
              Verify legal identities to award verified trust badges
            </p>
          </div>
          <span className="text-xs font-semibold text-km-neutral-500">
            {users.length} In Review
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-4">User Name / Org</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">District Hub</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Joined</th>
                <th className="py-3 px-5 text-right">KYC Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-amber-50/20">
                  <td className="py-3.5 px-4 font-bold text-km-neutral-900">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-km-neutral-600">
                    <span className="px-2 py-0.5 rounded-full bg-km-neutral-100">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-km-neutral-600">{u.location}</td>
                  <td className="py-3.5 px-4 text-center">
                    {u.verified ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-km-neutral-400">
                    {u.joinedAt}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => toggleVerify(u.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                        u.verified
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "btn-gold text-[11px]"
                      }`}
                    >
                      {u.verified ? "Revoke Verification" : "Approve KYC"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Platform Data Feeds ─── */}
      <div className="card-forest p-6 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#D9A441] text-[#0E2318] flex items-center justify-center font-bold">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-fraunces font-bold text-xl text-[#F4F1E4]">
              Andhra Pradesh e-NAM & APMC Sync Pipeline
            </h3>
            <p className="text-xs text-[#D9D5BE] mt-0.5">
              Sync status: Healthy · 5 Mandis connected (Guntur, Vijayawada, Tenali, Bapatla, Narasaraopet)
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7CB342]/20 text-[#7CB342] border border-[#7CB342]/30">
          Sync Interval: 15 Mins
        </span>
      </div>
    </div>
  );
}
