// ============================================
// KisanMitra — Shared Types
// UI-display types (Agent 1) + Firestore document types (Agent 4).
// Firestore date fields use Firebase Timestamp.
// ============================================

import { Timestamp } from 'firebase/firestore';

// --- User & Role Types ---

export type UserRole = "FARMER" | "FPO" | "BUYER" | "ADMIN";

/**
 * Firestore document: users/{userId}
 * Full Firestore user record with Timestamp fields.
 * Used by Agent 4 (backend) and auth context.
 */
export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  location: string;
  district?: string;
  verified: boolean;
  createdAt: Timestamp;
}

/**
 * Lightweight user profile for UI rendering.
 * Used by Agent 1 (UI) components that don't need Firestore Timestamps.
 */
export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  role: UserRole;
  location?: string;
  district?: string;
  verified: boolean;
}

// --- Crop & Quality ---

export type QualityGrade = "A" | "B" | "C";

/** Alias for QualityGrade — used by Agent 4 backend code. */
export type Quality = QualityGrade;

export const QUALITY_LABELS: Record<QualityGrade, string> = {
  A: "Grade A — Premium",
  B: "Grade B — Standard",
  C: "Grade C — Economy",
};

export const SUPPORTED_CROPS = [
  "Tomato",
  "Chilli",
  "Rice",
  "Cotton",
  "Maize",
] as const;

export type CropName = (typeof SUPPORTED_CROPS)[number];

// --- Market Types ---

export interface Market {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  supportedCrops: string[];
}

export interface MarketPrice {
  id: string;
  marketId: string;
  marketName: string;
  crop: string;
  variety?: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number;
  date: Timestamp;
  source?: string;
}

// --- Lot Types ---

export type LotStatus = "OPEN" | "OFFER_RECEIVED" | "SOLD" | "CANCELLED";

export const LOT_STATUS_LABELS: Record<LotStatus, string> = {
  OPEN: "Open",
  OFFER_RECEIVED: "Offer Received",
  SOLD: "Sold",
  CANCELLED: "Cancelled",
};

export interface Lot {
  id: string;
  farmerId: string;
  crop: string;
  variety?: string;
  quantity: number;
  quality: QualityGrade;
  harvestDate: Timestamp;
  expectedPrice: number;
  location: string;
  status: LotStatus;
  createdAt: Timestamp;
  images?: string[];
}

// --- Buyer Types ---

export interface Buyer {
  id: string;
  companyName: string;
  crop: string;
  requiredQuantity: number;
  offeredPrice: number;
  qualityRequirement: QualityGrade;
  location: string;
  verified: boolean;
  reliabilityScore: number;
  rating?: number;
}

// --- Offer Types ---

export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  farmerId: string;
  pricePerKg: number;
  quantity: number;
  deliveryDate?: Timestamp;
  message?: string;
  status: OfferStatus;
  createdAt: Timestamp;
}

// --- Transaction Types ---

export type TransactionStatus =
  | "CONFIRMED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED";

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  CONFIRMED: "Confirmed",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
};

export type PaymentStatus = "PENDING" | "PROCESSING" | "PAID";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Payment Pending",
  PROCESSING: "Processing",
  PAID: "Paid",
};

export interface Transaction {
  id: string;
  lotId: string;
  farmerId: string;
  buyerId: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  status: TransactionStatus;
  paymentStatus: PaymentStatus;
  transportStatus?: string;
  createdAt: Timestamp;
}

// --- Grievance Types ---

export type GrievanceStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";

export interface Grievance {
  id: string;
  transactionId: string;
  raisedBy: string;
  category: string;
  description: string;
  status: GrievanceStatus;
  createdAt: Timestamp;
}

// --- Recommendation Types ---

export type Recommendation = "SELL_NOW" | "SELL_SOON" | "WAIT";

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  SELL_NOW: "Sell Now",
  SELL_SOON: "Sell Soon",
  WAIT: "Wait & Compare",
};

export interface MarketRecommendation {
  marketId: string;
  marketName: string;
  score: number;
  expectedPrice: number;
  expectedGross: number;
  estimatedTransport: number;
  estimatedStorage: number;
  expectedNetRealization: number;
  recommendation: Recommendation;
  confidence: number;
  reasons: string[];
}

// --- Buyer Match Types ---

export interface BuyerMatch {
  buyerId: string;
  companyName: string;
  matchScore: number;
  reasons: string[];
  verified: boolean;
  reliabilityScore: number;
}

// --- Navigation Types ---

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
