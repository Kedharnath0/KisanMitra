import { Timestamp } from 'firebase/firestore';

// ─── Role & Status Type Aliases ────────────────────────────────────────

/** User roles in the KisanMitra platform. */
export type UserRole = 'FARMER' | 'FPO' | 'BUYER' | 'ADMIN';

/** Produce quality grade. */
export type Quality = 'A' | 'B' | 'C';

/** Lifecycle status of a produce lot. */
export type LotStatus = 'OPEN' | 'OFFER_RECEIVED' | 'SOLD' | 'CANCELLED';

/** Lifecycle status of a buyer's offer on a lot. */
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

/** Lifecycle status of a completed transaction. */
export type TransactionStatus = 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED';

/** Payment status within a transaction. */
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID';

/** Status of a grievance filed against a transaction. */
export type GrievanceStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';

// ─── Core Interfaces ───────────────────────────────────────────────────
// All Firestore date fields use Firebase Timestamp consistently.
// The `id` field is the Firestore document ID, populated during reads.

/** Firestore: users/{userId} */
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

/** Firestore: markets/{marketId} */
export interface Market {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  supportedCrops: string[];
}

/**
 * Firestore: market_prices/{priceId}
 *
 * Prototype seed data includes `source: 'PROTOTYPE_SIMULATED'`
 * to distinguish from real mandi price feeds.
 */
export interface MarketPrice {
  id: string;
  marketId: string;
  marketName: string;
  crop: string;
  variety?: string;
  minPrice: number;         // ₹/kg
  maxPrice: number;         // ₹/kg
  modalPrice: number;       // ₹/kg
  arrivalQuantity: number;  // kg
  date: Timestamp;
  source?: string;          // e.g. 'PROTOTYPE_SIMULATED'
}

/**
 * Firestore: buyers/{buyerId}
 *
 * Represents a buyer's demand listing — what they want to purchase.
 */
export interface Buyer {
  id: string;
  companyName: string;
  crop: string;
  requiredQuantity: number;   // kg
  offeredPrice: number;       // ₹/kg
  qualityRequirement: Quality;
  location: string;
  verified: boolean;
  reliabilityScore: number;   // 0–100
  rating?: number;            // 1–5
}

/** Firestore: lots/{lotId} */
export interface Lot {
  id: string;
  farmerId: string;
  crop: string;
  variety?: string;
  quantity: number;           // kg
  quality: Quality;
  harvestDate: Timestamp;
  expectedPrice: number;      // ₹/kg
  location: string;
  status: LotStatus;
  createdAt: Timestamp;
}

/** Firestore: offers/{offerId} */
export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  farmerId: string;
  pricePerKg: number;        // ₹/kg
  quantity: number;           // kg
  deliveryDate?: Timestamp;
  message?: string;
  status: OfferStatus;
  createdAt: Timestamp;
}

/** Firestore: transactions/{transactionId} */
export interface Transaction {
  id: string;
  lotId: string;
  farmerId: string;
  buyerId: string;
  quantity: number;           // kg
  pricePerKg: number;        // ₹/kg
  totalAmount: number;        // ₹
  status: TransactionStatus;
  paymentStatus: PaymentStatus;
  transportStatus?: string;
  createdAt: Timestamp;
}

/** Firestore: grievances/{grievanceId} */
export interface Grievance {
  id: string;
  transactionId: string;
  raisedBy: string;           // userId
  category: string;
  description: string;
  status: GrievanceStatus;
  createdAt: Timestamp;
}

// ─── Recommendation Output ────────────────────────────────────────────
// Type defined here (Agent 4) for cross-agent sharing.
// Logic owned by Agent 5 (lib/recommendation.ts, lib/matching.ts).

/**
 * Output of the market recommendation engine.
 * Agent 5 produces these; Agent 2 displays them.
 */
export interface MarketRecommendation {
  marketId: string;
  marketName: string;
  score: number;              // 0–100 composite score
  expectedPrice: number;      // ₹/kg
  expectedGross: number;      // ₹
  estimatedTransport: number; // ₹
  estimatedStorage: number;   // ₹
  expectedNetRealization: number; // ₹
  recommendation: 'SELL_NOW' | 'SELL_SOON' | 'WAIT';
  confidence: number;         // 0–100
  reasons: string[];
}

/**
 * Output of the buyer matching engine.
 * Agent 5 produces these; Agent 2 displays them.
 */
export interface BuyerMatch {
  buyerId: string;
  companyName: string;
  matchScore: number;         // 0–100
  reasons: string[];
}
