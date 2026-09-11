"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  FileText,
  Building,
} from "lucide-react";
import {
  MOCK_TRANSACTIONS,
  MockTransaction,
} from "@/data/mock";
import { formatCurrency, formatQuantity, getPaymentStatusColor, getTransactionStatusColor } from "@/lib/utils";
import { TransactionTimeline } from "@/components/ui/TransactionTimeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PAYMENT_STATUS_LABELS, TRANSACTION_STATUS_LABELS } from "@/types";

export default function BuyerTransactionsPage() {
  const [transactions] = useState<MockTransaction[]>(MOCK_TRANSACTIONS);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold font-fraunces text-km-neutral-900 tracking-tight">
          Procurement Contracts & Settlements
        </h1>
        <p className="text-sm text-km-neutral-500 mt-1">
          Monitor dispatch logistics, warehouse arrival receipts, and escrow payouts to farmers
        </p>
      </div>

      <div className="space-y-6">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="km-card p-6 sm:p-7 shadow-md border-2 border-km-neutral-200/80 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-km-neutral-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-km-neutral-400">
                    TXN: {txn.id.toUpperCase()}
                  </span>
                  <StatusBadge
                    label={TRANSACTION_STATUS_LABELS[txn.status]}
                    colorScheme={getTransactionStatusColor(txn.status)}
                    pulse={txn.status === "IN_TRANSIT"}
                  />
                  <StatusBadge
                    label={PAYMENT_STATUS_LABELS[txn.paymentStatus]}
                    colorScheme={getPaymentStatusColor(txn.paymentStatus)}
                  />
                </div>
                <h3 className="font-fraunces font-bold text-2xl text-km-neutral-900">
                  {txn.crop} ({formatQuantity(txn.quantity)})
                </h3>
                <p className="text-xs text-km-neutral-500 mt-0.5">
                  Farmer Seller: <strong>Ramesh Kumar</strong> · Guntur District
                </p>
              </div>

              <div className="bg-[#0E2318] text-[#F4F1E4] rounded-2xl px-5 py-3.5 text-left sm:text-right shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block">
                  Total Payable
                </span>
                <span className="font-fraunces text-2xl font-bold text-[#D9A441]">
                  {formatCurrency(txn.totalAmount)}
                </span>
                <span className="text-[10px] text-[#D9D5BE] block">
                  Escrow Verified
                </span>
              </div>
            </div>

            <TransactionTimeline
              transactionStatus={txn.status}
              paymentStatus={txn.paymentStatus}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
