"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Truck,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Package,
  X,
  ExternalLink,
} from "lucide-react";
import {
  MOCK_TRANSACTIONS,
  MockTransaction,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getPaymentStatusColor, getTransactionStatusColor } from "@/lib/utils";
import { TransactionTimeline } from "@/components/ui/TransactionTimeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PAYMENT_STATUS_LABELS, TRANSACTION_STATUS_LABELS } from "@/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<MockTransaction[]>(MOCK_TRANSACTIONS);
  const [receiptTxn, setReceiptTxn] = useState<MockTransaction | null>(null);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
            Transactions & Payment Tracking
          </h1>
          <p className="text-sm text-km-neutral-500 mt-1">
            Real-time milestone tracking from buyer pickup through verified escrow payment settlement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            100% Escrow Protected
          </span>
        </div>
      </div>

      {/* ─── Active Transactions (Live Steppers) ─── */}
      <div className="space-y-6">
        <h2 className="font-fraunces font-bold text-xl text-km-neutral-900">
          Active Settlements & Deliveries
        </h2>

        {transactions.map((txn) => {
          const paymentColor = getPaymentStatusColor(txn.paymentStatus);
          const txnColor = getTransactionStatusColor(txn.status);

          return (
            <div
              key={txn.id}
              className="km-card p-6 sm:p-7 shadow-md border-2 border-km-neutral-200/80 hover:border-[#D9A441] transition-all space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-km-neutral-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-km-neutral-400">
                      ID: {txn.id.toUpperCase()}
                    </span>
                    <StatusBadge
                      label={TRANSACTION_STATUS_LABELS[txn.status]}
                      colorScheme={txnColor}
                      pulse={txn.status === "IN_TRANSIT"}
                    />
                    <StatusBadge
                      label={PAYMENT_STATUS_LABELS[txn.paymentStatus]}
                      colorScheme={paymentColor}
                      pulse={txn.paymentStatus === "PROCESSING"}
                    />
                  </div>
                  <h3 className="font-fraunces font-bold text-2xl text-km-neutral-900">
                    {txn.crop} ({formatQuantity(txn.quantity)})
                  </h3>
                  <p className="text-xs text-km-neutral-500 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[#D9A441]" />
                    Buyer: <strong className="text-km-neutral-800">{txn.buyerName}</strong> · Contracted on {txn.createdAt}
                  </p>
                </div>

                {/* Amount Box */}
                <div className="bg-[#0E2318] text-[#F4F1E4] rounded-2xl px-5 py-3.5 text-left sm:text-right shadow-sm shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block">
                    Settlement Amount
                  </span>
                  <span className="font-fraunces text-2xl sm:text-3xl font-bold text-[#D9A441]">
                    {formatCurrency(txn.totalAmount)}
                  </span>
                  <span className="text-[11px] text-[#D9D5BE] block mt-0.5">
                    ₹{txn.pricePerKg}/kg × {txn.quantity} kg
                  </span>
                </div>
              </div>

              {/* Horizontal Steppers (Logistics & Payment) via TransactionTimeline */}
              <div>
                <TransactionTimeline
                  transactionStatus={txn.status}
                  paymentStatus={txn.paymentStatus}
                />
              </div>

              {/* Step-by-Step Milestones Log */}
              {txn.timeline && txn.timeline.length > 0 && (
                <div className="bg-km-neutral-50/80 rounded-xl p-4 border border-km-neutral-200/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-km-neutral-500 mb-3">
                    Transaction Log & Dispatch Updates
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {txn.timeline.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs ${
                          step.done
                            ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                            : "bg-white border-km-neutral-200 text-km-neutral-500 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {step.done ? (
                            <CheckCircle2 className="h-4 w-4 text-[#7CB342] shrink-0" />
                          ) : (
                            <Clock className="h-4 w-4 text-km-neutral-400 shrink-0" />
                          )}
                          <span>{step.label}</span>
                        </div>
                        <span className="text-[10px] text-km-neutral-400 block mb-1">
                          {step.date}
                        </span>
                        {step.description && (
                          <p className="text-[11px] leading-snug line-clamp-2">
                            {step.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-km-neutral-500">
                  <Truck className="h-4 w-4 text-km-neutral-400" />
                  <span>Logistics Carrier: <strong>AP AgroLogistics (Fleet #AP-16-TG-4421)</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/support"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-km-neutral-600 hover:bg-km-neutral-100 border border-km-neutral-200"
                  >
                    Raise Dispute / Grievance
                  </Link>
                  <button
                    onClick={() => setReceiptTxn(txn)}
                    className="btn-gold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View Official Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Transaction History Table ─── */}
      <div className="km-card overflow-hidden shadow-sm mt-8">
        <div className="p-5 border-b border-km-neutral-100 bg-gradient-to-r from-km-neutral-50 to-white flex items-center justify-between">
          <div>
            <h3 className="font-fraunces font-bold text-lg text-km-neutral-900">
              Complete Trade Settlement History
            </h3>
            <p className="text-xs text-km-neutral-500">
              Auditable digital contracts and payment reconciliation records
            </p>
          </div>
          <span className="text-xs font-bold text-km-neutral-500">
            {transactions.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-km-neutral-50/80 border-b border-km-neutral-200/60 text-[11px] font-bold text-km-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Reference</th>
                <th className="py-3.5 px-4">Buyer Company</th>
                <th className="py-3.5 px-4">Commodity</th>
                <th className="py-3.5 px-4 text-right">Quantity</th>
                <th className="py-3.5 px-4 text-right">Agreed Rate</th>
                <th className="py-3.5 px-4 text-right">Total Payout</th>
                <th className="py-3.5 px-4 text-center">Logistics</th>
                <th className="py-3.5 px-4 text-center">Payment</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-km-neutral-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-km-neutral-800">
                    {txn.id.toUpperCase()}
                  </td>
                  <td className="py-4 px-4 font-bold text-km-neutral-900">
                    {txn.buyerName}
                  </td>
                  <td className="py-4 px-4 text-km-neutral-700 font-medium">
                    {txn.crop}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-km-neutral-800">
                    {formatQuantity(txn.quantity)}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-km-neutral-900">
                    ₹{txn.pricePerKg}/kg
                  </td>
                  <td className="py-4 px-4 text-right font-black text-emerald-700 text-base">
                    {formatCurrency(txn.totalAmount)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusBadge
                      label={TRANSACTION_STATUS_LABELS[txn.status]}
                      colorScheme={getTransactionStatusColor(txn.status)}
                    />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusBadge
                      label={PAYMENT_STATUS_LABELS[txn.paymentStatus]}
                      colorScheme={getPaymentStatusColor(txn.paymentStatus)}
                    />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setReceiptTxn(txn)}
                      className="text-xs font-bold text-[#D9A441] hover:underline inline-flex items-center gap-1"
                    >
                      Receipt <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Printable / Downloadable Receipt Modal ─── */}
      {receiptTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-km-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReceiptTxn(null)}
              className="absolute right-5 top-5 text-km-neutral-400 hover:text-km-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-5 border-b border-km-neutral-200 space-y-1">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9A441] text-[#0E2318] font-fraunces font-bold text-xl mb-1">
                K
              </div>
              <h2 className="text-2xl font-bold font-fraunces text-km-neutral-900">
                KisanMitra Settlement Receipt
              </h2>
              <p className="text-xs text-km-neutral-400">
                Official Digital Trade Certificate · Smart India Hackathon 2026
              </p>
              <span className="inline-block mt-2 font-mono text-[11px] bg-km-neutral-100 text-km-neutral-700 px-3 py-1 rounded-full font-bold">
                REF: {receiptTxn.id.toUpperCase()}-IN-2026
              </span>
            </div>

            {/* Receipt Body */}
            <div className="py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-km-neutral-50 p-3 rounded-xl border border-km-neutral-200/60">
                <div>
                  <span className="text-km-neutral-400 font-semibold block">Seller (Farmer):</span>
                  <strong className="text-km-neutral-900 text-sm">Ramesh Kumar</strong>
                  <p className="text-km-neutral-500">Guntur, Andhra Pradesh</p>
                </div>
                <div>
                  <span className="text-km-neutral-400 font-semibold block">Buyer (Processor):</span>
                  <strong className="text-km-neutral-900 text-sm">{receiptTxn.buyerName}</strong>
                  <p className="text-km-neutral-500">Verified Institutional Partner</p>
                </div>
              </div>

              <div className="border border-km-neutral-200 rounded-xl overflow-hidden">
                <div className="bg-km-neutral-100 px-4 py-2 font-bold text-km-neutral-700 uppercase tracking-wider text-[10px]">
                  Produce Specifications
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-km-neutral-600">Commodity:</span>
                    <strong className="text-km-neutral-900">{receiptTxn.crop}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-km-neutral-600">Net Weight:</span>
                    <strong className="text-km-neutral-900">{formatQuantity(receiptTxn.quantity)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-km-neutral-600">Contract Rate:</span>
                    <strong className="text-km-neutral-900">₹{receiptTxn.pricePerKg}/kg</strong>
                  </div>
                </div>
              </div>

              {/* Payout Summary */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/80 space-y-2">
                <div className="flex justify-between text-amber-900 font-medium">
                  <span>Gross Produce Value:</span>
                  <span>{formatCurrency(receiptTxn.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-amber-900 font-medium">
                  <span>Platform Service Fee (SIH Demo):</span>
                  <span className="text-emerald-700 font-bold">Waived (₹0)</span>
                </div>
                <div className="pt-2 border-t border-amber-200 flex justify-between items-baseline">
                  <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                    Net Credited To Farmer Bank:
                  </span>
                  <span className="font-fraunces text-2xl font-bold text-amber-950">
                    {formatCurrency(receiptTxn.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Footer & Print Actions */}
            <div className="pt-4 border-t border-km-neutral-200 flex items-center justify-between">
              <span className="text-[10px] text-km-neutral-400">
                Timestamped: {receiptTxn.createdAt}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-km-neutral-700 bg-km-neutral-100 hover:bg-km-neutral-200 flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    alert("Receipt PDF downloaded to device.");
                    setReceiptTxn(null);
                  }}
                  className="btn-gold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
