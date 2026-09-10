import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  writeBatch,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  User,
  Market,
  MarketPrice,
  Buyer,
  Lot,
  LotStatus,
  Offer,
  OfferStatus,
  Transaction,
  TransactionStatus,
  PaymentStatus,
  Grievance,
  GrievanceStatus,
  Quality,
} from '@/types';

// ─── Collection References ─────────────────────────────────────────────

const COLLECTIONS = {
  users: 'users',
  markets: 'markets',
  marketPrices: 'market_prices',
  buyers: 'buyers',
  lots: 'lots',
  offers: 'offers',
  transactions: 'transactions',
  grievances: 'grievances',
} as const;

// ─── Helper: Document → Typed Object ───────────────────────────────────

/**
 * Converts a Firestore document snapshot to a typed object,
 * injecting the document ID as `id`.
 */
function docToTyped<T extends { id: string }>(
  docSnap: DocumentData
): T {
  return { id: docSnap.id, ...docSnap.data() } as T;
}

// ─── Validation Helpers ────────────────────────────────────────────────

function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }
}

function validatePositive(value: number, fieldName: string): void {
  if (typeof value !== 'number' || value <= 0) {
    throw new Error(`${fieldName} must be greater than 0`);
  }
}

function validateNonNegative(value: number, fieldName: string): void {
  if (typeof value !== 'number' || value < 0) {
    throw new Error(`${fieldName} must be greater than or equal to 0`);
  }
}

function validateQuality(value: string): void {
  if (!['A', 'B', 'C'].includes(value)) {
    throw new Error(`Quality must be 'A', 'B', or 'C'. Received: '${value}'`);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Fetch a user profile by their Firebase Auth UID.
 * Returns null if the user document does not exist.
 */
export async function getUserProfile(userId: string): Promise<User> {
  const userDoc = await getDoc(
    doc(db, COLLECTIONS.users, userId)
  );

  if (!userDoc.exists()) {
    throw new Error("User profile not found.");
  }

  return {
    id: userDoc.id,
    ...userDoc.data(),
  } as User;
}

/**
 * Create a new user profile in Firestore.
 * The document ID matches the Firebase Auth UID.
 */
export async function createUserProfile(
  userId: string,
  data: Omit<User, 'id' | 'createdAt'>
): Promise<void> {
  validateRequired(data.name, 'User name');
  validateRequired(data.phone, 'User phone');
  validateRequired(data.role, 'User role');
  validateRequired(data.location, 'User location');

  await setDoc(doc(db, COLLECTIONS.users, userId), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

/**
 * Update fields on an existing user profile.
 * Only the fields present in `data` are updated.
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.users, userId), data);
}

// ═══════════════════════════════════════════════════════════════════════
// MARKETS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Fetch all markets.
 */
export async function getMarkets(): Promise<Market[]> {
  const snap = await getDocs(collection(db, COLLECTIONS.markets));
  return snap.docs.map((d) => docToTyped<Market>(d));
}

/**
 * Fetch a single market by ID.
 * Returns null if the market does not exist.
 */
export async function getMarketById(marketId: string): Promise<Market | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.markets, marketId));
  if (!docSnap.exists()) return null;
  return docToTyped<Market>(docSnap);
}

// ═══════════════════════════════════════════════════════════════════════
// MARKET PRICES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Fetch market prices with optional filters.
 *
 * @param filters.crop — Filter by crop name (e.g. 'Tomato').
 * @param filters.marketId — Filter by market ID.
 */
export async function getMarketPrices(
  filters?: { crop?: string; marketId?: string }
): Promise<MarketPrice[]> {
  const constraints: QueryConstraint[] = [];

  if (filters?.crop) {
    constraints.push(where('crop', '==', filters.crop));
  }
  if (filters?.marketId) {
    constraints.push(where('marketId', '==', filters.marketId));
  }

  const q = query(collection(db, COLLECTIONS.marketPrices), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<MarketPrice>(d));
}

/**
 * Convenience: fetch all market prices for a specific crop.
 */
export async function getMarketPricesByCrop(
  crop: string
): Promise<MarketPrice[]> {
  return getMarketPrices({ crop });
}

// ═══════════════════════════════════════════════════════════════════════
// BUYERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Fetch buyers with optional filters.
 *
 * @param filters.crop — Filter by crop the buyer wants.
 * @param filters.verified — Filter by verification status.
 */
export async function getBuyers(
  filters?: { crop?: string; verified?: boolean }
): Promise<Buyer[]> {
  const constraints: QueryConstraint[] = [];

  if (filters?.crop) {
    constraints.push(where('crop', '==', filters.crop));
  }
  if (filters?.verified !== undefined) {
    constraints.push(where('verified', '==', filters.verified));
  }

  const q = query(collection(db, COLLECTIONS.buyers), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<Buyer>(d));
}

/**
 * Fetch a single buyer by ID.
 * Returns null if the buyer does not exist.
 */
export async function getBuyerById(buyerId: string): Promise<Buyer | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.buyers, buyerId));
  if (!docSnap.exists()) return null;
  return docToTyped<Buyer>(docSnap);
}

// ═══════════════════════════════════════════════════════════════════════
// LOTS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Create a new produce lot.
 *
 * Validates:
 * - quantity > 0
 * - expectedPrice >= 0
 * - crop is required
 * - location is required
 * - quality is 'A', 'B', or 'C'
 *
 * Sets status to 'OPEN' and createdAt to now.
 *
 * @returns The new lot's document ID.
 */
export async function createLot(
  data: Omit<Lot, 'id' | 'status' | 'createdAt'>
): Promise<string> {
  validateRequired(data.crop, 'Lot crop');
  validateRequired(data.location, 'Lot location');
  validateRequired(data.farmerId, 'Lot farmerId');
  validatePositive(data.quantity, 'Lot quantity');
  validateNonNegative(data.expectedPrice, 'Lot expectedPrice');
  validateQuality(data.quality);

  const docRef = await addDoc(collection(db, COLLECTIONS.lots), {
    farmerId: data.farmerId,
    crop: data.crop,
    variety: data.variety ?? null,
    quantity: data.quantity,
    quality: data.quality,
    harvestDate: data.harvestDate,
    expectedPrice: data.expectedPrice,
    location: data.location,
    status: 'OPEN' as LotStatus,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Fetch all lots created by a specific farmer.
 * Ordered by creation date, newest first.
 */
export async function getLotsByFarmer(farmerId: string): Promise<Lot[]> {
  const q = query(
    collection(db, COLLECTIONS.lots),
    where('farmerId', '==', farmerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<Lot>(d));
}

/**
 * Fetch a single lot by ID.
 * Returns null if the lot does not exist.
 */
export async function getLotById(lotId: string): Promise<Lot | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.lots, lotId));
  if (!docSnap.exists()) return null;
  return docToTyped<Lot>(docSnap);
}

/**
 * Fetch all lots with status 'OPEN' (available for buyer marketplace).
 * Ordered by creation date, newest first.
 */
export async function getOpenLots(): Promise<Lot[]> {
  const q = query(
    collection(db, COLLECTIONS.lots),
    where('status', '==', 'OPEN'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<Lot>(d));
}

/**
 * Update the status of a lot.
 */
export async function updateLotStatus(
  lotId: string,
  status: LotStatus
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.lots, lotId), { status });
}

// ═══════════════════════════════════════════════════════════════════════
// OFFERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Create a new offer on a lot.
 *
 * Validates:
 * - pricePerKg > 0
 * - quantity > 0
 *
 * Sets status to 'PENDING' and createdAt to now.
 *
 * @returns The new offer's document ID.
 */
export async function createOffer(
  data: Omit<Offer, 'id' | 'status' | 'createdAt'>
): Promise<string> {
  validateRequired(data.lotId, 'Offer lotId');
  validateRequired(data.buyerId, 'Offer buyerId');
  validateRequired(data.farmerId, 'Offer farmerId');
  validatePositive(data.pricePerKg, 'Offer pricePerKg');
  validatePositive(data.quantity, 'Offer quantity');

  const docRef = await addDoc(collection(db, COLLECTIONS.offers), {
    lotId: data.lotId,
    buyerId: data.buyerId,
    farmerId: data.farmerId,
    pricePerKg: data.pricePerKg,
    quantity: data.quantity,
    deliveryDate: data.deliveryDate ?? null,
    message: data.message ?? null,
    status: 'PENDING' as OfferStatus,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Fetch all offers for a specific lot.
 */
export async function getOffersByLot(lotId: string): Promise<Offer[]> {
  const q = query(
    collection(db, COLLECTIONS.offers),
    where('lotId', '==', lotId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<Offer>(d));
}

/**
 * Fetch all offers where the farmer is the recipient.
 */
export async function getOffersByFarmer(farmerId: string): Promise<Offer[]> {
  const q = query(
    collection(db, COLLECTIONS.offers),
    where('farmerId', '==', farmerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<Offer>(d));
}

/**
 * Fetch all offers made by a specific buyer.
 */
export async function getOffersByBuyer(buyerId: string): Promise<Offer[]> {
  const q = query(
    collection(db, COLLECTIONS.offers),
    where('buyerId', '==', buyerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<Offer>(d));
}

/**
 * Update the status of an offer.
 */
export async function updateOfferStatus(
  offerId: string,
  status: OfferStatus
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.offers, offerId), { status });
}

// ═══════════════════════════════════════════════════════════════════════
// TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Create a new transaction record.
 *
 * Typically called by `acceptOffer()` — not directly by UI code.
 *
 * @returns The new transaction's document ID.
 */
export async function createTransaction(
  data: Omit<Transaction, 'id' | 'createdAt'>
): Promise<string> {
  validateRequired(data.lotId, 'Transaction lotId');
  validateRequired(data.farmerId, 'Transaction farmerId');
  validateRequired(data.buyerId, 'Transaction buyerId');
  validatePositive(data.quantity, 'Transaction quantity');
  validatePositive(data.pricePerKg, 'Transaction pricePerKg');

  const totalAmount = data.pricePerKg * data.quantity;

  const docRef = await addDoc(collection(db, COLLECTIONS.transactions), {
    lotId: data.lotId,
    farmerId: data.farmerId,
    buyerId: data.buyerId,
    quantity: data.quantity,
    pricePerKg: data.pricePerKg,
    totalAmount,
    status: data.status,
    paymentStatus: data.paymentStatus,
    transportStatus: data.transportStatus ?? null,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Fetch all transactions where the user is either the farmer or the buyer.
 * Ordered by creation date, newest first.
 */
export async function getTransactionsByUser(
  userId: string
): Promise<Transaction[]> {
  // Firestore does not support OR queries across different fields directly.
  // We run two queries and merge results.
  const [farmerSnap, buyerSnap] = await Promise.all([
    getDocs(
      query(
        collection(db, COLLECTIONS.transactions),
        where('farmerId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    ),
    getDocs(
      query(
        collection(db, COLLECTIONS.transactions),
        where('buyerId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    ),
  ]);

  const txnMap = new Map<string, Transaction>();
  for (const d of farmerSnap.docs) {
    txnMap.set(d.id, docToTyped<Transaction>(d));
  }
  for (const d of buyerSnap.docs) {
    txnMap.set(d.id, docToTyped<Transaction>(d));
  }

  // Sort merged results by createdAt descending
  return Array.from(txnMap.values()).sort((a, b) => {
    return b.createdAt.seconds - a.createdAt.seconds;
  });
}

/**
 * Fetch a single transaction by ID.
 * Returns null if the transaction does not exist.
 */
export async function getTransactionById(
  transactionId: string
): Promise<Transaction | null> {
  const docSnap = await getDoc(
    doc(db, COLLECTIONS.transactions, transactionId)
  );
  if (!docSnap.exists()) return null;
  return docToTyped<Transaction>(docSnap);
}

/**
 * Update the status of a transaction.
 * Optionally update payment status at the same time.
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus,
  paymentStatus?: PaymentStatus
): Promise<void> {
  const updateData: Record<string, unknown> = { status };
  if (paymentStatus !== undefined) {
    updateData.paymentStatus = paymentStatus;
  }
  await updateDoc(
    doc(db, COLLECTIONS.transactions, transactionId),
    updateData
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ACCEPT OFFER — ATOMIC BATCH OPERATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Atomically accept an offer using a Firestore writeBatch:
 *
 *   1. offer.status → ACCEPTED
 *   2. All other PENDING offers on the same lot → REJECTED
 *   3. lot.status → SOLD
 *   4. Creates a new transaction (status: CONFIRMED, paymentStatus: PENDING)
 *
 * @param offerId — The ID of the offer to accept.
 * @returns The new transaction's document ID.
 * @throws Error if the offer or lot does not exist, or if the offer is not PENDING.
 */
export async function acceptOffer(offerId: string): Promise<string> {
  // 1. Read the offer
  const offerSnap = await getDoc(doc(db, COLLECTIONS.offers, offerId));
  if (!offerSnap.exists()) {
    throw new Error(`Offer ${offerId} not found`);
  }
  const offer = docToTyped<Offer>(offerSnap);

  if (offer.status !== 'PENDING') {
    throw new Error(
      `Offer ${offerId} is not PENDING (current status: ${offer.status})`
    );
  }

  // 2. Read the lot
  const lotSnap = await getDoc(doc(db, COLLECTIONS.lots, offer.lotId));
  if (!lotSnap.exists()) {
    throw new Error(`Lot ${offer.lotId} not found`);
  }
  const lot = docToTyped<Lot>(lotSnap);

  if (lot.status === 'SOLD' || lot.status === 'CANCELLED') {
    throw new Error(
      `Lot ${offer.lotId} is not available (current status: ${lot.status})`
    );
  }

  // 3. Find all other PENDING offers on this lot
  const otherOffersSnap = await getDocs(
    query(
      collection(db, COLLECTIONS.offers),
      where('lotId', '==', offer.lotId),
      where('status', '==', 'PENDING')
    )
  );

  // 4. Build the atomic batch
  const batch = writeBatch(db);

  // 4a. Accept this offer
  batch.update(doc(db, COLLECTIONS.offers, offerId), {
    status: 'ACCEPTED' as OfferStatus,
  });

  // 4b. Reject all other pending offers on the same lot
  for (const otherDoc of otherOffersSnap.docs) {
    if (otherDoc.id !== offerId) {
      batch.update(doc(db, COLLECTIONS.offers, otherDoc.id), {
        status: 'REJECTED' as OfferStatus,
      });
    }
  }

  // 4c. Mark the lot as SOLD
  batch.update(doc(db, COLLECTIONS.lots, offer.lotId), {
    status: 'SOLD' as LotStatus,
  });

  // 4d. Create the transaction
  const txnRef = doc(collection(db, COLLECTIONS.transactions));
  const totalAmount = offer.pricePerKg * offer.quantity;

  batch.set(txnRef, {
    lotId: offer.lotId,
    farmerId: offer.farmerId,
    buyerId: offer.buyerId,
    quantity: offer.quantity,
    pricePerKg: offer.pricePerKg,
    totalAmount,
    status: 'CONFIRMED' as TransactionStatus,
    paymentStatus: 'PENDING' as PaymentStatus,
    transportStatus: null,
    createdAt: Timestamp.now(),
  });

  // 5. Commit atomically
  await batch.commit();

  return txnRef.id;
}

// ═══════════════════════════════════════════════════════════════════════
// GRIEVANCES (P1 — Stub)
// ═══════════════════════════════════════════════════════════════════════

/**
 * File a grievance against a transaction.
 *
 * Sets status to 'OPEN' and createdAt to now.
 *
 * @returns The new grievance's document ID.
 */
export async function createGrievance(
  data: Omit<Grievance, 'id' | 'status' | 'createdAt'>
): Promise<string> {
  validateRequired(data.transactionId, 'Grievance transactionId');
  validateRequired(data.raisedBy, 'Grievance raisedBy');
  validateRequired(data.category, 'Grievance category');
  validateRequired(data.description, 'Grievance description');

  const docRef = await addDoc(collection(db, COLLECTIONS.grievances), {
    transactionId: data.transactionId,
    raisedBy: data.raisedBy,
    category: data.category,
    description: data.description,
    status: 'OPEN' as GrievanceStatus,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Fetch all grievances filed against a specific transaction.
 */
export async function getGrievancesByTransaction(
  transactionId: string
): Promise<Grievance[]> {
  const q = query(
    collection(db, COLLECTIONS.grievances),
    where('transactionId', '==', transactionId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTyped<Grievance>(d));
}
