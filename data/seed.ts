import { Timestamp } from 'firebase/firestore';
import type {
  User,
  Market,
  MarketPrice,
  Buyer,
  Quality,
  UserRole,
} from '@/types';

/**
 * ══════════════════════════════════════════════════════════════════════
 * KISANMITRA — PROTOTYPE / SIMULATED SEED DATA
 * ══════════════════════════════════════════════════════════════════════
 *
 * ALL data in this file is PROTOTYPE / SIMULATED data created for
 * demonstration purposes only.
 *
 * - Market prices are illustrative and DO NOT represent real-time
 *   mandi data from any government or private data feed.
 * - Buyer profiles are fictional companies for demo purposes.
 * - User profiles are fictional personas for demo purposes.
 *
 * Every MarketPrice record includes:
 *   source: 'PROTOTYPE_SIMULATED'
 *
 * Every record includes:
 *   isPrototypeData: true
 *
 * ══════════════════════════════════════════════════════════════════════
 */

// ─── Markets ───────────────────────────────────────────────────────────

export interface SeedMarket extends Omit<Market, 'id'> {
  /** Stable ID used as the Firestore document ID for idempotent seeding. */
  seedId: string;
  isPrototypeData: true;
}

export const SEED_MARKETS: SeedMarket[] = [
  {
    seedId: 'guntur',
    name: 'Guntur Market Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    latitude: 16.3067,
    longitude: 80.4365,
    supportedCrops: ['Tomato', 'Chilli', 'Rice', 'Cotton', 'Maize'],
    isPrototypeData: true,
  },
  {
    seedId: 'vijayawada',
    name: 'Vijayawada Market Yard',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    latitude: 16.5062,
    longitude: 80.6480,
    supportedCrops: ['Tomato', 'Chilli', 'Rice', 'Cotton', 'Maize'],
    isPrototypeData: true,
  },
  {
    seedId: 'tenali',
    name: 'Tenali Market Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    latitude: 16.2381,
    longitude: 80.6400,
    supportedCrops: ['Tomato', 'Rice', 'Chilli'],
    isPrototypeData: true,
  },
  {
    seedId: 'narasaraopet',
    name: 'Narasaraopet Market Yard',
    district: 'Palnadu',
    state: 'Andhra Pradesh',
    latitude: 16.2346,
    longitude: 80.0488,
    supportedCrops: ['Cotton', 'Maize', 'Rice'],
    isPrototypeData: true,
  },
  {
    seedId: 'bapatla',
    name: 'Bapatla Market Yard',
    district: 'Bapatla',
    state: 'Andhra Pradesh',
    latitude: 15.9047,
    longitude: 80.4678,
    supportedCrops: ['Rice', 'Maize', 'Tomato'],
    isPrototypeData: true,
  },
];

// ─── Market Prices (5 markets × 5 crops = 25 records) ──────────────────

export interface SeedMarketPrice extends Omit<MarketPrice, 'id' | 'date'> {
  seedId: string;
  isPrototypeData: true;
}

/**
 * Generates all 25 seed market price records.
 * Prices are realistic-looking AP mandi ranges for illustration only.
 * The `date` field is set at seeding time via Timestamp.now().
 */
export function getSeedMarketPrices(): SeedMarketPrice[] {
  // price data: [crop, market, seedId, min, max, modal, arrivalQty]
  const data: [string, string, string, number, number, number, number][] = [
    // Guntur
    ['Tomato',  'guntur', 'guntur_tomato',   18, 30, 24, 15000],
    ['Chilli',  'guntur', 'guntur_chilli',   90, 150, 120, 8000],
    ['Rice',    'guntur', 'guntur_rice',     30, 42, 36, 25000],
    ['Cotton',  'guntur', 'guntur_cotton',   55, 70, 62, 12000],
    ['Maize',   'guntur', 'guntur_maize',    18, 25, 21, 10000],
    // Vijayawada
    ['Tomato',  'vijayawada', 'vijayawada_tomato',   20, 32, 27, 12000],
    ['Chilli',  'vijayawada', 'vijayawada_chilli',   95, 155, 125, 6000],
    ['Rice',    'vijayawada', 'vijayawada_rice',     32, 44, 38, 20000],
    ['Cotton',  'vijayawada', 'vijayawada_cotton',   58, 72, 65, 9000],
    ['Maize',   'vijayawada', 'vijayawada_maize',    19, 26, 22, 8000],
    // Tenali
    ['Tomato',  'tenali', 'tenali_tomato',   17, 28, 22, 8000],
    ['Chilli',  'tenali', 'tenali_chilli',   88, 145, 115, 5000],
    ['Rice',    'tenali', 'tenali_rice',     29, 40, 34, 18000],
    ['Cotton',  'tenali', 'tenali_cotton',   0, 0, 0, 0],       // not supported at Tenali
    ['Maize',   'tenali', 'tenali_maize',    0, 0, 0, 0],       // not supported at Tenali
    // Narasaraopet
    ['Tomato',  'narasaraopet', 'narasaraopet_tomato', 0, 0, 0, 0],  // not supported
    ['Chilli',  'narasaraopet', 'narasaraopet_chilli', 0, 0, 0, 0],  // not supported
    ['Rice',    'narasaraopet', 'narasaraopet_rice',   28, 39, 33, 15000],
    ['Cotton',  'narasaraopet', 'narasaraopet_cotton', 52, 68, 60, 14000],
    ['Maize',   'narasaraopet', 'narasaraopet_maize',  17, 24, 20, 11000],
    // Bapatla
    ['Tomato',  'bapatla', 'bapatla_tomato',   16, 26, 21, 6000],
    ['Chilli',  'bapatla', 'bapatla_chilli',   0, 0, 0, 0],     // not supported
    ['Rice',    'bapatla', 'bapatla_rice',     31, 43, 37, 22000],
    ['Maize',   'bapatla', 'bapatla_maize',    18, 25, 21, 9000],
    ['Cotton',  'bapatla', 'bapatla_cotton',   0, 0, 0, 0],     // not supported
  ];

  // Filter out unsupported crops (zero prices)
  return data
    .filter(([, , , min]) => min > 0)
    .map(([crop, marketId, seedId, minPrice, maxPrice, modalPrice, arrivalQuantity]) => {
      const market = SEED_MARKETS.find((m) => m.seedId === marketId);
      return {
        seedId,
        marketId,
        marketName: market?.name ?? marketId,
        crop,
        minPrice,
        maxPrice,
        modalPrice,
        arrivalQuantity,
        source: 'PROTOTYPE_SIMULATED',
        isPrototypeData: true as const,
      };
    });
}

// ─── Buyers ────────────────────────────────────────────────────────────

export interface SeedBuyer extends Omit<Buyer, 'id'> {
  seedId: string;
  isPrototypeData: true;
}

export const SEED_BUYERS: SeedBuyer[] = [
  {
    seedId: 'freshfoods',
    companyName: 'FreshFoods Pvt Ltd',
    crop: 'Tomato',
    requiredQuantity: 5000,    // kg
    offeredPrice: 26,          // ₹/kg
    qualityRequirement: 'A' as Quality,
    location: 'Vijayawada',
    verified: true,
    reliabilityScore: 88,
    rating: 4.5,
    isPrototypeData: true,
  },
  {
    seedId: 'agromart',
    companyName: 'AgroMart',
    crop: 'Chilli',
    requiredQuantity: 3000,
    offeredPrice: 120,
    qualityRequirement: 'A' as Quality,
    location: 'Guntur',
    verified: true,
    reliabilityScore: 75,
    rating: 4.0,
    isPrototypeData: true,
  },
  {
    seedId: 'foodchain',
    companyName: 'FoodChain India',
    crop: 'Rice',
    requiredQuantity: 10000,
    offeredPrice: 38,
    qualityRequirement: 'B' as Quality,
    location: 'Hyderabad',
    verified: true,
    reliabilityScore: 92,
    rating: 4.8,
    isPrototypeData: true,
  },
  {
    seedId: 'retailfresh',
    companyName: 'RetailFresh',
    crop: 'Tomato',
    requiredQuantity: 2000,
    offeredPrice: 24,
    qualityRequirement: 'B' as Quality,
    location: 'Tenali',
    verified: false,
    reliabilityScore: 65,
    rating: 3.5,
    isPrototypeData: true,
  },
];

// ─── Demo Users ────────────────────────────────────────────────────────

export interface SeedUser extends Omit<User, 'id' | 'createdAt'> {
  seedId: string;
  /** Placeholder email for Firebase Auth registration during seeding. */
  email: string;
  isPrototypeData: true;
}

export const SEED_USERS: SeedUser[] = [
  {
    seedId: 'ramesh',
    email: 'ramesh@kisanmitra.demo',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    role: 'FARMER' as UserRole,
    location: 'Guntur',
    district: 'Guntur',
    verified: true,
    isPrototypeData: true,
  },
  {
    seedId: 'lakshmi_fpo',
    email: 'lakshmi@kisanmitra.demo',
    name: 'Lakshmi FPO',
    phone: '9876543211',
    role: 'FPO' as UserRole,
    location: 'Tenali',
    district: 'Guntur',
    verified: true,
    isPrototypeData: true,
  },
  {
    seedId: 'suresh_buyer',
    email: 'suresh@kisanmitra.demo',
    name: 'Suresh Trader',
    phone: '9876543212',
    role: 'BUYER' as UserRole,
    location: 'Vijayawada',
    district: 'Krishna',
    verified: true,
    isPrototypeData: true,
  },
  {
    seedId: 'admin',
    email: 'admin@kisanmitra.demo',
    name: 'Admin User',
    phone: '9876543213',
    role: 'ADMIN' as UserRole,
    location: 'Hyderabad',
    district: 'Hyderabad',
    verified: true,
    isPrototypeData: true,
  },
];
