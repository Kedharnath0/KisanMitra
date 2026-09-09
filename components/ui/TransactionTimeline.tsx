"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Truck, PackageCheck, FileText, CreditCard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionStatus, PaymentStatus } from "@/types";

interface TransactionTimelineProps {
  transactionStatus: TransactionStatus;
  paymentStatus: PaymentStatus;
  className?: string;
}

export function TransactionTimeline({
  transactionStatus,
  paymentStatus,
  className,
}: TransactionTimelineProps) {
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);

  // Define logistics steps
  const logisticsSteps = [
    { id: "CONFIRMED", label: "Order Confirmed", icon: FileText },
    { id: "IN_TRANSIT", label: "In Transit", icon: Truck },
    { id: "DELIVERED", label: "Delivered", icon: PackageCheck },
    { id: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  ];

  // Define payment steps
  const paymentSteps = [
    { id: "PENDING", label: "Payment Pending", icon: Clock },
    { id: "PROCESSING", label: "Payment Processing", icon: CreditCard },
    { id: "PAID", label: "Payment Completed", icon: CheckCircle2 },
  ];

  // Helper to determine step states
  const getLogisticsState = (stepId: string) => {
    const statuses = ["CONFIRMED", "IN_TRANSIT", "DELIVERED", "COMPLETED"];
    const currentIndex = statuses.indexOf(transactionStatus);
    const stepIndex = statuses.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  const getPaymentState = (stepId: string) => {
    const statuses = ["PENDING", "PROCESSING", "PAID"];
    const currentIndex = statuses.indexOf(paymentStatus);
    const stepIndex = statuses.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  // Payment summary for collapsed view
  const paymentSummary = {
    PENDING: { label: "Payment Pending", emoji: "🟡", color: "text-amber-700 bg-amber-50 border-amber-200" },
    PROCESSING: { label: "Processing", emoji: "🔵", color: "text-blue-700 bg-blue-50 border-blue-200" },
    PAID: { label: "Payment Completed", emoji: "🟢", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  };

  const currentPaymentSummary = paymentSummary[paymentStatus];

  return (
    <div className={cn("km-card overflow-hidden", className)}>
      <h3 className="text-base font-bold text-km-neutral-900 px-5 pt-5 pb-4 border-b border-km-neutral-100/80">
        Transaction Tracking
      </h3>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* Logistics Timeline — always expanded (simple linear progress) */}
          <div>
            <h4 className="text-[10px] font-bold text-km-neutral-400 uppercase tracking-widest mb-4">
              Logistics Status
            </h4>
            <div className="relative space-y-5 pl-6">
              {/* Vertical connector line */}
              <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gradient-to-b from-km-primary-200 via-km-neutral-200 to-km-neutral-100 rounded-full" />

              {logisticsSteps.map((step) => {
                const state = getLogisticsState(step.id);
                const Icon = step.icon;
                return (
                  <div key={step.id} className="relative flex items-center gap-3.5">
                    <div
                      className={cn(
                        "absolute -left-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                        state === "completed"
                          ? "bg-gradient-to-br from-[#16A34A] to-[#10B981] border-transparent text-white shadow-sm shadow-green-500/20"
                          : state === "current"
                          ? "bg-white border-[#16A34A] text-[#16A34A] shadow-[0_0_10px_rgba(22,163,74,0.2)]"
                          : "bg-white border-km-neutral-200 text-km-neutral-300"
                      )}
                    >
                      <Icon className={cn("h-3 w-3", state === "current" && "animate-pulse")} />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-bold",
                          state === "upcoming" ? "text-km-neutral-400" : "text-km-neutral-900"
                        )}
                      >
                        {step.label}
                      </p>
                      {state === "current" && (
                        <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">In Progress</p>
                      )}
                      {state === "completed" && (
                        <p className="text-[11px] text-km-neutral-400 font-medium mt-0.5">Done</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Timeline — Progressive Disclosure: summary visible, steps collapsed */}
          <div>
            <h4 className="text-[10px] font-bold text-km-neutral-400 uppercase tracking-widest mb-4">
              Payment Status
            </h4>

            {/* Payment summary badge — always visible */}
            <div className={cn("rounded-xl border px-4 py-3 flex items-center gap-3 mb-3", currentPaymentSummary.color)}>
              <span className="text-xl">{currentPaymentSummary.emoji}</span>
              <span className="text-sm font-bold">{currentPaymentSummary.label}</span>
            </div>

            {/* Expand toggle for full payment timeline */}
            <button
              onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
              aria-expanded={isPaymentExpanded}
              className="km-disclosure-toggle mb-3"
            >
              <span>{isPaymentExpanded ? "Hide Steps" : "View Payment Steps"}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isPaymentExpanded && "rotate-180")} />
            </button>

            {isPaymentExpanded && (
              <div className="relative space-y-5 pl-6 km-animate-expand">
                {/* Vertical connector line */}
                <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gradient-to-b from-emerald-200 via-km-neutral-200 to-km-neutral-100 rounded-full" />

                {paymentSteps.map((step) => {
                  const state = getPaymentState(step.id);
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="relative flex items-center gap-3.5">
                      <div
                        className={cn(
                          "absolute -left-6 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                          state === "completed"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-transparent text-white shadow-sm shadow-emerald-500/20"
                            : state === "current"
                            ? "bg-white border-emerald-500 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            : "bg-white border-km-neutral-200 text-km-neutral-300"
                        )}
                      >
                        <Icon className={cn("h-3 w-3", state === "current" && "animate-pulse")} />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-bold",
                            state === "upcoming" ? "text-km-neutral-400" : "text-km-neutral-900"
                          )}
                        >
                          {step.label}
                        </p>
                        {state === "current" && (
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Processing</p>
                        )}
                        {state === "completed" && (
                          <p className="text-[11px] text-km-neutral-400 font-medium mt-0.5">Done</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
