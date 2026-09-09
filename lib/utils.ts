import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  LotStatus,
  OfferStatus,
  TransactionStatus,
  PaymentStatus,
  Recommendation,
  QualityGrade,
} from "@/types";
import { Timestamp } from "firebase/firestore";

// ============================================
// Class Name Utility
// ============================================

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// Currency & Number Formatting
// ============================================

/** Format number as Indian Rupee currency (₹1,000 or ₹25.50) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format price per unit (₹27/kg) */
export function formatPricePerKg(price: number): string {
  return `${formatCurrency(price)}/kg`;
}

/** Format quantity with unit (1,000 kg) */
export function formatQuantity(quantity: number, unit: string = "kg"): string {
  return `${new Intl.NumberFormat("en-IN").format(quantity)} ${unit}`;
}

/** Format a number with Indian locale grouping (1,00,000) */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

// ============================================
// Date Formatting
// ============================================

/** Format date string to locale-friendly display (07 Sep 2026) */

export function formatDate(date: string | Timestamp): string {
  const dateObject =
    date instanceof Timestamp ? date.toDate() : new Date(date);

  return dateObject.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Format date to relative time (2 days ago, just now) */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

// ============================================
// Status Color Mapping
// ============================================

export type StatusColorScheme = {
  bg: string;
  text: string;
  border: string;
  dot?: string;
};

/** Get color scheme for lot status */
export function getLotStatusColor(status: LotStatus): StatusColorScheme {
  const map: Record<LotStatus, StatusColorScheme> = {
    OPEN: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    OFFER_RECEIVED: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    SOLD: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    CANCELLED: {
      bg: "bg-neutral-100",
      text: "text-neutral-500",
      border: "border-neutral-200",
      dot: "bg-neutral-400",
    },
  };
  return map[status];
}

/** Get color scheme for offer status */
export function getOfferStatusColor(status: OfferStatus): StatusColorScheme {
  const map: Record<OfferStatus, StatusColorScheme> = {
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    ACCEPTED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    REJECTED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    EXPIRED: {
      bg: "bg-neutral-100",
      text: "text-neutral-500",
      border: "border-neutral-200",
      dot: "bg-neutral-400",
    },
  };
  return map[status];
}

/** Get color scheme for transaction status */
export function getTransactionStatusColor(
  status: TransactionStatus
): StatusColorScheme {
  const map: Record<TransactionStatus, StatusColorScheme> = {
    CONFIRMED: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    IN_TRANSIT: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    DELIVERED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-300",
      dot: "bg-emerald-600",
    },
  };
  return map[status];
}

/** Get color scheme for payment status */
export function getPaymentStatusColor(
  status: PaymentStatus
): StatusColorScheme {
  const map: Record<PaymentStatus, StatusColorScheme> = {
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    PROCESSING: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    PAID: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
  };
  return map[status];
}

// ============================================
// Recommendation Colors
// ============================================

/** Get color scheme for sell recommendation */
export function getRecommendationColor(
  rec: Recommendation
): StatusColorScheme {
  const map: Record<Recommendation, StatusColorScheme> = {
    SELL_NOW: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-300",
    },
    SELL_SOON: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-300",
    },
    WAIT: {
      bg: "bg-neutral-100",
      text: "text-neutral-600",
      border: "border-neutral-300",
    },
  };
  return map[rec];
}

// ============================================
// Quality & Reliability Colors
// ============================================

/** Get color for quality grade */
export function getQualityColor(grade: QualityGrade): StatusColorScheme {
  const map: Record<QualityGrade, StatusColorScheme> = {
    A: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    B: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    C: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  };
  return map[grade];
}

/** Get color class for reliability score (0-100) */
export function getReliabilityColor(score: number): {
  text: string;
  bg: string;
  fill: string;
} {
  if (score >= 80) return { text: "text-emerald-700", bg: "bg-emerald-100", fill: "bg-emerald-500" };
  if (score >= 50) return { text: "text-amber-700", bg: "bg-amber-100", fill: "bg-amber-500" };
  return { text: "text-red-700", bg: "bg-red-100", fill: "bg-red-500" };
}

/** Get color class for confidence percentage (0-100) */
export function getConfidenceColor(confidence: number): {
  text: string;
  bg: string;
  fill: string;
} {
  if (confidence >= 75) return { text: "text-emerald-700", bg: "bg-emerald-100", fill: "bg-emerald-500" };
  if (confidence >= 50) return { text: "text-amber-700", bg: "bg-amber-100", fill: "bg-amber-500" };
  return { text: "text-red-700", bg: "bg-red-100", fill: "bg-red-500" };
}
