/**
 * ══════════════════════════════════════════════════════════════════════
 * KISANMITRA — PROTOTYPE / SIMULATED MOCK DATA
 * ══════════════════════════════════════════════════════════════════════
 *
 * ALL data in this file is PROTOTYPE / SIMULATED data created for
 * demonstration purposes only. Used for local demo when Firebase
 * is not configured or as fallback data.
 *
 * ══════════════════════════════════════════════════════════════════════
 */

import type {
  MarketRecommendation,
  LotStatus,
  OfferStatus,
  TransactionStatus,
  PaymentStatus,
  QualityGrade,
  GrievanceStatus,
} from "@/types";

// ─── Demo Farmer Profile ────────────────────────────────────────────
export const MOCK_FARMER = {
  id: "ramesh_001",
  name: "Ramesh Kumar",
  phone: "9876543210",
  role: "FARMER" as const,
  location: "Guntur",
  district: "Guntur",
  verified: true,
  activeCrops: ["Tomato", "Chilli"],
  landArea: "4.5 acres",
};

// ─── Market Prices ──────────────────────────────────────────────────
export interface MockMarketPrice {
  id: string;
  marketId: string;
  marketName: string;
  district: string;
  crop: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number;
  trend: "up" | "down" | "stable";
  trendPct: number;
  date: string;
}

export const MOCK_MARKET_PRICES: MockMarketPrice[] = [
  // Tomato
  {
    id: "mp_1",
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    district: "Krishna",
    crop: "Tomato",
    minPrice: 20,
    maxPrice: 32,
    modalPrice: 27,
    arrivalQuantity: 12000,
    trend: "up",
    trendPct: 8,
    date: "2026-09-09",
  },
  {
    id: "mp_2",
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    district: "Guntur",
    crop: "Tomato",
    minPrice: 18,
    maxPrice: 30,
    modalPrice: 24,
    arrivalQuantity: 15000,
    trend: "up",
    trendPct: 4,
    date: "2026-09-09",
  },
  {
    id: "mp_3",
    marketId: "tenali",
    marketName: "Tenali Market Yard",
    district: "Guntur",
    crop: "Tomato",
    minPrice: 17,
    maxPrice: 28,
    modalPrice: 22,
    arrivalQuantity: 8000,
    trend: "stable",
    trendPct: 0,
    date: "2026-09-09",
  },
  {
    id: "mp_4",
    marketId: "bapatla",
    marketName: "Bapatla Market Yard",
    district: "Bapatla",
    crop: "Tomato",
    minPrice: 16,
    maxPrice: 26,
    modalPrice: 21,
    arrivalQuantity: 6000,
    trend: "down",
    trendPct: -3,
    date: "2026-09-09",
  },
  // Chilli
  {
    id: "mp_5",
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    district: "Guntur",
    crop: "Chilli",
    minPrice: 90,
    maxPrice: 150,
    modalPrice: 120,
    arrivalQuantity: 8000,
    trend: "up",
    trendPct: 6,
    date: "2026-09-09",
  },
  {
    id: "mp_6",
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    district: "Krishna",
    crop: "Chilli",
    minPrice: 95,
    maxPrice: 155,
    modalPrice: 125,
    arrivalQuantity: 6000,
    trend: "up",
    trendPct: 5,
    date: "2026-09-09",
  },
  {
    id: "mp_7",
    marketId: "tenali",
    marketName: "Tenali Market Yard",
    district: "Guntur",
    crop: "Chilli",
    minPrice: 88,
    maxPrice: 145,
    modalPrice: 115,
    arrivalQuantity: 5000,
    trend: "stable",
    trendPct: 1,
    date: "2026-09-09",
  },
  // Rice
  {
    id: "mp_8",
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    district: "Krishna",
    crop: "Rice",
    minPrice: 32,
    maxPrice: 44,
    modalPrice: 38,
    arrivalQuantity: 20000,
    trend: "stable",
    trendPct: 1,
    date: "2026-09-09",
  },
  {
    id: "mp_9",
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    district: "Guntur",
    crop: "Rice",
    minPrice: 30,
    maxPrice: 42,
    modalPrice: 36,
    arrivalQuantity: 25000,
    trend: "stable",
    trendPct: 0,
    date: "2026-09-09",
  },
  {
    id: "mp_10",
    marketId: "bapatla",
    marketName: "Bapatla Market Yard",
    district: "Bapatla",
    crop: "Rice",
    minPrice: 31,
    maxPrice: 43,
    modalPrice: 37,
    arrivalQuantity: 22000,
    trend: "up",
    trendPct: 3,
    date: "2026-09-09",
  },
  {
    id: "mp_11",
    marketId: "narasaraopet",
    marketName: "Narasaraopet Market Yard",
    district: "Palnadu",
    crop: "Rice",
    minPrice: 28,
    maxPrice: 39,
    modalPrice: 33,
    arrivalQuantity: 15000,
    trend: "down",
    trendPct: -2,
    date: "2026-09-09",
  },
  // Cotton
  {
    id: "mp_12",
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    district: "Krishna",
    crop: "Cotton",
    minPrice: 58,
    maxPrice: 72,
    modalPrice: 65,
    arrivalQuantity: 9000,
    trend: "up",
    trendPct: 4,
    date: "2026-09-09",
  },
  {
    id: "mp_13",
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    district: "Guntur",
    crop: "Cotton",
    minPrice: 55,
    maxPrice: 70,
    modalPrice: 62,
    arrivalQuantity: 12000,
    trend: "up",
    trendPct: 2,
    date: "2026-09-09",
  },
  {
    id: "mp_14",
    marketId: "narasaraopet",
    marketName: "Narasaraopet Market Yard",
    district: "Palnadu",
    crop: "Cotton",
    minPrice: 52,
    maxPrice: 68,
    modalPrice: 60,
    arrivalQuantity: 14000,
    trend: "stable",
    trendPct: 1,
    date: "2026-09-09",
  },
  // Maize
  {
    id: "mp_15",
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    district: "Guntur",
    crop: "Maize",
    minPrice: 18,
    maxPrice: 25,
    modalPrice: 21,
    arrivalQuantity: 10000,
    trend: "down",
    trendPct: -4,
    date: "2026-09-09",
  },
  {
    id: "mp_16",
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    district: "Krishna",
    crop: "Maize",
    minPrice: 19,
    maxPrice: 26,
    modalPrice: 22,
    arrivalQuantity: 8000,
    trend: "down",
    trendPct: -3,
    date: "2026-09-09",
  },
  // Onion
  {
    id: "mp_17",
    marketId: "tenali",
    marketName: "Tenali Mandi",
    district: "Guntur",
    crop: "Onion",
    minPrice: 28,
    maxPrice: 40,
    modalPrice: 35,
    arrivalQuantity: 14000,
    trend: "up",
    trendPct: 8,
    date: "2026-09-09",
  },
  {
    id: "mp_18",
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    district: "Krishna",
    crop: "Onion",
    minPrice: 30,
    maxPrice: 42,
    modalPrice: 38,
    arrivalQuantity: 18000,
    trend: "up",
    trendPct: 6,
    date: "2026-09-09",
  },
  {
    id: "mp_19",
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    district: "Guntur",
    crop: "Onion",
    minPrice: 26,
    maxPrice: 38,
    modalPrice: 33,
    arrivalQuantity: 11000,
    trend: "stable",
    trendPct: 1,
    date: "2026-09-09",
  },
];

// ─── Price History (14-day series for trend charts) ─────────────────
export interface PriceHistoryPoint {
  date: string;
  price: number;
  arrival: number;
}

function daysAgo(n: number): string {
  const d = new Date("2026-09-09");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const MOCK_PRICE_HISTORY: Record<string, PriceHistoryPoint[]> = {
  Tomato: [
    { date: daysAgo(13), price: 18, arrival: 14000 },
    { date: daysAgo(12), price: 19, arrival: 13500 },
    { date: daysAgo(11), price: 20, arrival: 13000 },
    { date: daysAgo(10), price: 21, arrival: 12800 },
    { date: daysAgo(9), price: 22, arrival: 12500 },
    { date: daysAgo(8), price: 22, arrival: 13000 },
    { date: daysAgo(7), price: 23, arrival: 12200 },
    { date: daysAgo(6), price: 24, arrival: 11800 },
    { date: daysAgo(5), price: 24, arrival: 11500 },
    { date: daysAgo(4), price: 25, arrival: 11200 },
    { date: daysAgo(3), price: 26, arrival: 11000 },
    { date: daysAgo(2), price: 25, arrival: 12000 },
    { date: daysAgo(1), price: 26, arrival: 11800 },
    { date: daysAgo(0), price: 27, arrival: 12000 },
  ],
  Chilli: [
    { date: daysAgo(13), price: 105, arrival: 7000 },
    { date: daysAgo(12), price: 108, arrival: 6800 },
    { date: daysAgo(11), price: 110, arrival: 6500 },
    { date: daysAgo(10), price: 112, arrival: 6300 },
    { date: daysAgo(9), price: 115, arrival: 6100 },
    { date: daysAgo(8), price: 113, arrival: 6500 },
    { date: daysAgo(7), price: 116, arrival: 6200 },
    { date: daysAgo(6), price: 118, arrival: 6000 },
    { date: daysAgo(5), price: 120, arrival: 5800 },
    { date: daysAgo(4), price: 122, arrival: 5700 },
    { date: daysAgo(3), price: 121, arrival: 6000 },
    { date: daysAgo(2), price: 123, arrival: 5900 },
    { date: daysAgo(1), price: 124, arrival: 5800 },
    { date: daysAgo(0), price: 125, arrival: 6000 },
  ],
  Rice: [
    { date: daysAgo(13), price: 35, arrival: 22000 },
    { date: daysAgo(12), price: 35, arrival: 21500 },
    { date: daysAgo(11), price: 36, arrival: 21000 },
    { date: daysAgo(10), price: 36, arrival: 20800 },
    { date: daysAgo(9), price: 37, arrival: 20500 },
    { date: daysAgo(8), price: 37, arrival: 21000 },
    { date: daysAgo(7), price: 37, arrival: 20200 },
    { date: daysAgo(6), price: 38, arrival: 20000 },
    { date: daysAgo(5), price: 38, arrival: 20000 },
    { date: daysAgo(4), price: 38, arrival: 19800 },
    { date: daysAgo(3), price: 38, arrival: 20000 },
    { date: daysAgo(2), price: 38, arrival: 20000 },
    { date: daysAgo(1), price: 38, arrival: 20000 },
    { date: daysAgo(0), price: 38, arrival: 20000 },
  ],
  Cotton: [
    { date: daysAgo(13), price: 58, arrival: 11000 },
    { date: daysAgo(12), price: 59, arrival: 10800 },
    { date: daysAgo(11), price: 60, arrival: 10500 },
    { date: daysAgo(10), price: 61, arrival: 10200 },
    { date: daysAgo(9), price: 62, arrival: 10000 },
    { date: daysAgo(8), price: 62, arrival: 10300 },
    { date: daysAgo(7), price: 63, arrival: 10100 },
    { date: daysAgo(6), price: 63, arrival: 9900 },
    { date: daysAgo(5), price: 64, arrival: 9700 },
    { date: daysAgo(4), price: 64, arrival: 9500 },
    { date: daysAgo(3), price: 65, arrival: 9400 },
    { date: daysAgo(2), price: 65, arrival: 9400 },
    { date: daysAgo(1), price: 65, arrival: 9500 },
    { date: daysAgo(0), price: 65, arrival: 9000 },
  ],
  Maize: [
    { date: daysAgo(13), price: 24, arrival: 9000 },
    { date: daysAgo(12), price: 24, arrival: 9200 },
    { date: daysAgo(11), price: 23, arrival: 9500 },
    { date: daysAgo(10), price: 23, arrival: 9800 },
    { date: daysAgo(9), price: 22, arrival: 10000 },
    { date: daysAgo(8), price: 22, arrival: 10200 },
    { date: daysAgo(7), price: 22, arrival: 10500 },
    { date: daysAgo(6), price: 21, arrival: 10800 },
    { date: daysAgo(5), price: 21, arrival: 11000 },
    { date: daysAgo(4), price: 21, arrival: 11200 },
    { date: daysAgo(3), price: 21, arrival: 11500 },
    { date: daysAgo(2), price: 21, arrival: 11800 },
    { date: daysAgo(1), price: 21, arrival: 12000 },
    { date: daysAgo(0), price: 21, arrival: 10000 },
  ],
};

// ─── Market Recommendations ─────────────────────────────────────────
export const MOCK_RECOMMENDATIONS: MarketRecommendation[] = [
  {
    marketId: "vijayawada",
    marketName: "Vijayawada Market Yard",
    score: 87,
    expectedPrice: 27,
    expectedGross: 27000,
    estimatedTransport: 2000,
    estimatedStorage: 0,
    expectedNetRealization: 25000,
    recommendation: "SELL_SOON",
    confidence: 82,
    reasons: [
      "Highest modal price (₹27/kg) across all nearby mandis",
      "Strong institutional buyer demand — 3 active buyers for Tomato Grade A",
      "Arrivals falling 12% this week — prices likely to hold or rise 2–3 days",
      "FreshFoods Pvt Ltd (verified, 88 reliability) actively sourcing 5,000 kg",
    ],
  },
  {
    marketId: "guntur",
    marketName: "Guntur Market Yard",
    score: 74,
    expectedPrice: 24,
    expectedGross: 24000,
    estimatedTransport: 800,
    estimatedStorage: 0,
    expectedNetRealization: 23200,
    recommendation: "SELL_NOW",
    confidence: 71,
    reasons: [
      "Closest market — lowest transport cost (₹800)",
      "Modal price ₹24/kg, below Vijayawada by ₹3/kg",
      "High arrival volume (15,000 kg) may pressure prices in coming days",
      "Good for quick sale if liquidity needed",
    ],
  },
  {
    marketId: "tenali",
    marketName: "Tenali Market Yard",
    score: 61,
    expectedPrice: 22,
    expectedGross: 22000,
    estimatedTransport: 1200,
    estimatedStorage: 0,
    expectedNetRealization: 20800,
    recommendation: "WAIT",
    confidence: 55,
    reasons: [
      "Modal price ₹22/kg — ₹5/kg lower than Vijayawada",
      "No verified buyers currently active for Tomato Grade A",
      "Stable arrival volume — no strong signal to sell urgently",
      "Consider only if Vijayawada/Guntur buyers are unavailable",
    ],
  },
  {
    marketId: "bapatla",
    marketName: "Bapatla Market Yard",
    score: 48,
    expectedPrice: 21,
    expectedGross: 21000,
    estimatedTransport: 1800,
    estimatedStorage: 0,
    expectedNetRealization: 19200,
    recommendation: "WAIT",
    confidence: 45,
    reasons: [
      "Lowest net return (₹19,200) after transport costs",
      "Price trending down (−3%) past 3 days",
      "High arrival volume reducing price discovery",
      "Not recommended unless surplus storage is unavailable",
    ],
  },
];

// ─── Produce Lots ───────────────────────────────────────────────────
export interface MockLot {
  id: string;
  farmerId: string;
  crop: string;
  variety?: string;
  quantity: number;
  quality: QualityGrade;
  harvestDate: string;
  expectedPrice: number;
  location: string;
  status: LotStatus;
  createdAt: string;
  offerCount?: number;
  images?: string[];
}

export const MOCK_LOTS: MockLot[] = [
  {
    id: "lot_001",
    farmerId: "ramesh_001",
    crop: "Tomato",
    variety: "Hybrid F1",
    quantity: 1000,
    quality: "A",
    harvestDate: "2026-09-07",
    expectedPrice: 25,
    location: "Guntur",
    status: "OFFER_RECEIVED",
    createdAt: "2026-09-08",
    offerCount: 2,
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546470427-227c7369a689?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "lot_002",
    farmerId: "ramesh_001",
    crop: "Chilli",
    variety: "Teja",
    quantity: 500,
    quality: "A",
    harvestDate: "2026-09-05",
    expectedPrice: 120,
    location: "Guntur",
    status: "OPEN",
    createdAt: "2026-09-06",
    offerCount: 0,
    images: [
      "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "lot_003",
    farmerId: "ramesh_001",
    crop: "Tomato",
    variety: "Hybrid F1",
    quantity: 800,
    quality: "B",
    harvestDate: "2026-08-25",
    expectedPrice: 20,
    location: "Guntur",
    status: "SOLD",
    createdAt: "2026-08-26",
    offerCount: 3,
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "lot_004",
    farmerId: "ramesh_001",
    crop: "Maize",
    quantity: 2000,
    quality: "B",
    harvestDate: "2026-08-15",
    expectedPrice: 22,
    location: "Guntur",
    status: "CANCELLED",
    createdAt: "2026-08-16",
    offerCount: 0,
    images: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
    ],
  },
];

// ─── Offers ─────────────────────────────────────────────────────────
export interface MockOffer {
  id: string;
  lotId: string;
  lotCrop: string;
  lotQuantity: number;
  buyer: {
    id: string;
    companyName: string;
    location: string;
    verified: boolean;
    reliabilityScore: number;
    rating: number;
  };
  pricePerKg: number;
  quantity: number;
  totalAmount: number;
  deliveryDate: string;
  message: string;
  status: OfferStatus;
  createdAt: string;
}

export const MOCK_OFFERS: MockOffer[] = [
  {
    id: "offer_001",
    lotId: "lot_001",
    lotCrop: "Tomato",
    lotQuantity: 1000,
    buyer: {
      id: "buyer_freshfoods",
      companyName: "FreshFoods Pvt Ltd",
      location: "Vijayawada",
      verified: true,
      reliabilityScore: 88,
      rating: 4.5,
    },
    pricePerKg: 26,
    quantity: 1000,
    totalAmount: 26000,
    deliveryDate: "2026-09-11",
    message:
      "We are interested in your Grade A Tomato lot. Can arrange pickup from your farm. Payment within 48 hours of delivery.",
    status: "PENDING",
    createdAt: "2026-09-09",
  },
  {
    id: "offer_002",
    lotId: "lot_001",
    lotCrop: "Tomato",
    lotQuantity: 1000,
    buyer: {
      id: "buyer_retailfresh",
      companyName: "RetailFresh",
      location: "Tenali",
      verified: false,
      reliabilityScore: 65,
      rating: 3.5,
    },
    pricePerKg: 24,
    quantity: 800,
    totalAmount: 19200,
    deliveryDate: "2026-09-12",
    message: "We can take 800 kg at ₹24/kg. Flexible on delivery date.",
    status: "PENDING",
    createdAt: "2026-09-08",
  },
  {
    id: "offer_003",
    lotId: "lot_003",
    lotCrop: "Tomato",
    lotQuantity: 800,
    buyer: {
      id: "buyer_foodchain",
      companyName: "FoodChain India",
      location: "Hyderabad",
      verified: true,
      reliabilityScore: 92,
      rating: 4.8,
    },
    pricePerKg: 21,
    quantity: 800,
    totalAmount: 16800,
    deliveryDate: "2026-08-28",
    message: "Standard B-grade purchase. Payment on delivery.",
    status: "ACCEPTED",
    createdAt: "2026-08-27",
  },
];

// ─── Transactions ────────────────────────────────────────────────────
export interface MockTransaction {
  id: string;
  lotId: string;
  crop: string;
  farmerId: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  status: TransactionStatus;
  paymentStatus: PaymentStatus;
  transportStatus: string;
  createdAt: string;
  timeline: {
    label: string;
    date: string;
    done: boolean;
    description?: string;
  }[];
}

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: "txn_001",
    lotId: "lot_001",
    crop: "Tomato",
    farmerId: "ramesh_001",
    buyerId: "buyer_freshfoods",
    buyerName: "FreshFoods Pvt Ltd",
    quantity: 1000,
    pricePerKg: 26,
    totalAmount: 26000,
    status: "IN_TRANSIT",
    paymentStatus: "PROCESSING",
    transportStatus: "In Transit",
    createdAt: "2026-09-09",
    timeline: [
      {
        label: "Offer Accepted",
        date: "09 Sep 2026",
        done: true,
        description: "You accepted FreshFoods' offer of ₹26/kg",
      },
      {
        label: "Pickup Scheduled",
        date: "10 Sep 2026",
        done: true,
        description: "Vehicle dispatched from Vijayawada",
      },
      {
        label: "In Transit",
        date: "10 Sep 2026",
        done: true,
        description: "Truck en route to Vijayawada cold storage",
      },
      {
        label: "Delivered",
        date: "11 Sep 2026",
        done: false,
        description: "Expected delivery at FreshFoods Pvt Ltd",
      },
      {
        label: "Payment Received",
        date: "12 Sep 2026",
        done: false,
        description: "₹26,000 to your bank account",
      },
    ],
  },
  {
    id: "txn_002",
    lotId: "lot_003",
    crop: "Tomato",
    farmerId: "ramesh_001",
    buyerId: "buyer_foodchain",
    buyerName: "FoodChain India",
    quantity: 800,
    pricePerKg: 21,
    totalAmount: 16800,
    status: "COMPLETED",
    paymentStatus: "PAID",
    transportStatus: "Delivered",
    createdAt: "2026-08-27",
    timeline: [
      {
        label: "Offer Accepted",
        date: "27 Aug 2026",
        done: true,
        description: "Accepted FoodChain India's offer",
      },
      {
        label: "Pickup Scheduled",
        date: "28 Aug 2026",
        done: true,
        description: "Pickup arranged at Guntur farm",
      },
      {
        label: "In Transit",
        date: "28 Aug 2026",
        done: true,
        description: "Transported to Hyderabad",
      },
      {
        label: "Delivered",
        date: "29 Aug 2026",
        done: true,
        description: "Delivered to FoodChain India warehouse",
      },
      {
        label: "Payment Received",
        date: "30 Aug 2026",
        done: true,
        description: "₹16,800 credited to bank",
      },
    ],
  },
];

// ─── Buyers (Marketplace) ────────────────────────────────────────────
export interface MockBuyer {
  id: string;
  companyName: string;
  crop: string;
  requiredQuantity: number;
  offeredPrice: number;
  qualityRequirement: QualityGrade;
  location: string;
  verified: boolean;
  reliabilityScore: number;
  rating: number;
  description: string;
  activeListingsSince: string;
}

export const MOCK_BUYERS: MockBuyer[] = [
  {
    id: "buyer_freshfoods",
    companyName: "FreshFoods Pvt Ltd",
    crop: "Tomato",
    requiredQuantity: 5000,
    offeredPrice: 26,
    qualityRequirement: "A",
    location: "Vijayawada",
    verified: true,
    reliabilityScore: 88,
    rating: 4.5,
    description:
      "Fresh produce processor supplying modern retail chains. Pays within 48 hours.",
    activeListingsSince: "2026-09-01",
  },
  {
    id: "buyer_agromart",
    companyName: "AgroMart",
    crop: "Chilli",
    requiredQuantity: 3000,
    offeredPrice: 120,
    qualityRequirement: "A",
    location: "Guntur",
    verified: true,
    reliabilityScore: 75,
    rating: 4.0,
    description:
      "Spice exporter sourcing premium chilli. Payment within 7 days of delivery.",
    activeListingsSince: "2026-09-03",
  },
  {
    id: "buyer_foodchain",
    companyName: "FoodChain India",
    crop: "Rice",
    requiredQuantity: 10000,
    offeredPrice: 38,
    qualityRequirement: "B",
    location: "Hyderabad",
    verified: true,
    reliabilityScore: 92,
    rating: 4.8,
    description:
      "Large food processing company. Reliable payments, high volume purchase.",
    activeListingsSince: "2026-08-20",
  },
  {
    id: "buyer_retailfresh",
    companyName: "RetailFresh",
    crop: "Tomato",
    requiredQuantity: 2000,
    offeredPrice: 24,
    qualityRequirement: "B",
    location: "Tenali",
    verified: false,
    reliabilityScore: 65,
    rating: 3.5,
    description:
      "Small retail distributor. Verification pending. Payment terms negotiable.",
    activeListingsSince: "2026-09-05",
  },
];

// ─── Buyer Demand (for buyer dashboard) ─────────────────────────────
export interface MockDemandListing {
  id: string;
  buyerId: string;
  crop: string;
  variety?: string;
  quantity: number;
  offeredPrice: number;
  qualityRequirement: QualityGrade;
  location: string;
  deadline: string;
  status: "ACTIVE" | "FULFILLED" | "CLOSED";
}

export const MOCK_DEMAND_LISTINGS: MockDemandListing[] = [
  {
    id: "demand_001",
    buyerId: "buyer_freshfoods",
    crop: "Tomato",
    variety: "Any Grade A",
    quantity: 5000,
    offeredPrice: 26,
    qualityRequirement: "A",
    location: "Vijayawada",
    deadline: "2026-09-15",
    status: "ACTIVE",
  },
];

// ─── Buyer Offers Made ───────────────────────────────────────────────
export interface MockBuyerOffer {
  id: string;
  lotId: string;
  farmerName: string;
  crop: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  status: OfferStatus;
  sentAt: string;
  deliveryDate?: string;
}

export const MOCK_BUYER_OFFERS: MockBuyerOffer[] = [
  {
    id: "boffer_001",
    lotId: "lot_001",
    farmerName: "Ramesh Kumar",
    crop: "Tomato",
    quantity: 1000,
    pricePerKg: 26,
    totalAmount: 26000,
    status: "PENDING",
    sentAt: "2026-09-09",
    deliveryDate: "2026-09-12",
  },
  {
    id: "boffer_002",
    lotId: "lot_003",
    farmerName: "Ramesh Kumar",
    crop: "Tomato",
    quantity: 800,
    pricePerKg: 21,
    totalAmount: 16800,
    status: "ACCEPTED",
    sentAt: "2026-08-27",
    deliveryDate: "2026-09-02",
  },
  {
    id: "boffer_003",
    lotId: "lot_002",
    farmerName: "Ramesh Kumar",
    crop: "Chilli",
    quantity: 500,
    pricePerKg: 110,
    totalAmount: 55000,
    status: "REJECTED",
    sentAt: "2026-08-20",
    deliveryDate: "2026-08-25",
  },
];

// ─── Grievances ──────────────────────────────────────────────────────
export interface MockGrievance {
  id: string;
  transactionId: string;
  transactionRef: string;
  raisedBy: string;
  category: string;
  description: string;
  status: GrievanceStatus;
  createdAt: string;
  resolvedAt?: string;
}

export const MOCK_GRIEVANCES: MockGrievance[] = [
  {
    id: "grv_001",
    transactionId: "txn_002",
    transactionRef: "TXN-002 · FoodChain India · ₹16,800",
    raisedBy: "ramesh_001",
    category: "Delayed Payment",
    description:
      "Payment was supposed to be credited within 48 hours of delivery but was delayed by 2 days.",
    status: "RESOLVED",
    createdAt: "2026-09-01",
    resolvedAt: "2026-09-03",
  },
];

// ─── Available Lots (for buyer marketplace) ──────────────────────────
export interface MockAvailableLot {
  id: string;
  farmerName: string;
  farmerLocation: string;
  farmerVerified: boolean;
  crop: string;
  variety?: string;
  quantity: number;
  quality: QualityGrade;
  harvestDate: string;
  expectedPrice: number;
  postedAt: string;
  distanceKm?: number;
  images?: string[];
}

export const MOCK_AVAILABLE_LOTS: MockAvailableLot[] = [
  {
    id: "lot_001",
    farmerName: "Ramesh Kumar",
    farmerLocation: "Guntur",
    farmerVerified: true,
    crop: "Tomato",
    variety: "Hybrid F1",
    quantity: 1000,
    quality: "A",
    harvestDate: "2026-09-07",
    expectedPrice: 25,
    postedAt: "2026-09-08",
    distanceKm: 35,
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546470427-227c7369a689?w=600&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "avlot_002",
    farmerName: "Subbaiah Rao",
    farmerLocation: "Tenali",
    farmerVerified: true,
    crop: "Tomato",
    variety: "Naati",
    quantity: 600,
    quality: "B",
    harvestDate: "2026-09-06",
    expectedPrice: 21,
    postedAt: "2026-09-07",
    distanceKm: 52,
  },
  {
    id: "avlot_003",
    farmerName: "Padmavathi Devi",
    farmerLocation: "Bapatla",
    farmerVerified: false,
    crop: "Rice",
    variety: "Sona Masuri",
    quantity: 5000,
    quality: "A",
    harvestDate: "2026-09-04",
    expectedPrice: 38,
    postedAt: "2026-09-05",
    distanceKm: 75,
  },
  {
    id: "avlot_004",
    farmerName: "Venkata Rao",
    farmerLocation: "Narasaraopet",
    farmerVerified: true,
    crop: "Cotton",
    variety: "Bt Cotton",
    quantity: 3000,
    quality: "A",
    harvestDate: "2026-09-01",
    expectedPrice: 65,
    postedAt: "2026-09-02",
    distanceKm: 90,
  },
  {
    id: "avlot_005",
    farmerName: "Lakshmaiah",
    farmerLocation: "Guntur",
    farmerVerified: true,
    crop: "Chilli",
    variety: "Teja",
    quantity: 400,
    quality: "A",
    harvestDate: "2026-09-08",
    expectedPrice: 122,
    postedAt: "2026-09-09",
    distanceKm: 28,
  },
];

// ─── Admin Stats ─────────────────────────────────────────────────────
export const MOCK_ADMIN_STATS = {
  totalUsers: 1247,
  totalFarmers: 1089,
  totalBuyers: 142,
  totalFPOs: 16,
  totalLots: 384,
  activeLots: 92,
  totalTransactions: 218,
  totalTransactionValue: 4820000,
  openGrievances: 7,
  resolvedGrievances: 43,
  marketsTracked: 320,
  verifiedBuyers: 1200,
};

export const MOCK_ADMIN_RECENT_USERS = [
  { id: "u1", name: "Anand Krishnan", role: "FARMER", location: "Guntur", joinedAt: "2026-09-09", verified: true },
  { id: "u2", name: "GlobalGrain Ltd", role: "BUYER", location: "Chennai", joinedAt: "2026-09-08", verified: false },
  { id: "u3", name: "Parvathi FPO", role: "FPO", location: "Tenali", joinedAt: "2026-09-08", verified: true },
  { id: "u4", name: "Ravi Shankar", role: "FARMER", location: "Bapatla", joinedAt: "2026-09-07", verified: false },
  { id: "u5", name: "SpiceTrade Co", role: "BUYER", location: "Vijayawada", joinedAt: "2026-09-07", verified: true },
];

// ─── CROPS and QUALITY lists (for form dropdowns) ────────────────────
export const CROPS = ["Tomato", "Chilli", "Rice", "Cotton", "Maize", "Onion"] as const;
export const QUALITY_OPTIONS: { value: QualityGrade; label: string }[] = [
  { value: "A", label: "Grade A — Premium" },
  { value: "B", label: "Grade B — Standard" },
  { value: "C", label: "Grade C — Economy" },
];
export const GRIEVANCE_CATEGORIES = [
  "Delayed Payment",
  "Quality Dispute",
  "Transport Delay",
  "Quantity Mismatch",
  "Buyer Non-Compliance",
  "Other",
];
