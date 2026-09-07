import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  SEED_MARKETS,
  SEED_BUYERS,
  SEED_USERS,
  getSeedMarketPrices,
} from '@/data/seed';

/**
 * ══════════════════════════════════════════════════════════════════════
 * SEED DATABASE — Prototype / Demo Data Writer
 * ══════════════════════════════════════════════════════════════════════
 *
 * Writes prototype seed data to Firestore for development and demo use.
 *
 * - Idempotent: checks whether each document already exists before writing.
 * - All data is marked as PROTOTYPE / SIMULATED.
 * - Not auto-executed. Must be explicitly called from a dev page or admin action.
 * - Does NOT create Firebase Auth users — only Firestore user profile documents.
 *   Auth users must be created separately (e.g. via signUpWithEmail or Firebase Console).
 *
 * ══════════════════════════════════════════════════════════════════════
 */

/**
 * Check whether seed data already exists in Firestore.
 * Uses the first market ('guntur') as a sentinel.
 */
export async function isSeedDataPresent(): Promise<boolean> {
  const sentinel = await getDoc(doc(db, 'markets', 'guntur'));
  return sentinel.exists();
}

/**
 * Write all prototype seed data to Firestore.
 *
 * Collections seeded:
 * - markets (5 records)
 * - market_prices (~17 records — only supported crop/market combinations)
 * - buyers (4 records)
 * - users (4 demo user profiles — Firestore docs only, not Auth users)
 *
 * Idempotent: skips documents that already exist.
 * Logs progress to the console.
 *
 * @returns Summary of what was written.
 */
export async function seedDatabase(): Promise<{
  marketsWritten: number;
  pricesWritten: number;
  buyersWritten: number;
  usersWritten: number;
  skipped: number;
}> {
  let marketsWritten = 0;
  let pricesWritten = 0;
  let buyersWritten = 0;
  let usersWritten = 0;
  let skipped = 0;

  console.log('[SEED] ══════════════════════════════════════════════');
  console.log('[SEED] Writing PROTOTYPE / SIMULATED data to Firestore');
  console.log('[SEED] This data is for demonstration purposes only.');
  console.log('[SEED] ══════════════════════════════════════════════');

  // ── Markets ────────────────────────────────────────────────────
  console.log('[SEED] Seeding markets...');
  for (const market of SEED_MARKETS) {
    const ref = doc(db, 'markets', market.seedId);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      skipped++;
      continue;
    }

    const { seedId, isPrototypeData, ...marketData } = market;
    await setDoc(ref, {
      ...marketData,
      isPrototypeData: true,
    });
    marketsWritten++;
  }
  console.log(`[SEED]   Markets: ${marketsWritten} written, ${skipped} skipped`);

  // ── Market Prices ──────────────────────────────────────────────
  console.log('[SEED] Seeding market prices...');
  const prices = getSeedMarketPrices();
  let pricesSkipped = 0;
  for (const price of prices) {
    const ref = doc(db, 'market_prices', price.seedId);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      pricesSkipped++;
      skipped++;
      continue;
    }

    const { seedId, isPrototypeData, ...priceData } = price;
    await setDoc(ref, {
      ...priceData,
      date: Timestamp.now(),
      isPrototypeData: true,
    });
    pricesWritten++;
  }
  console.log(`[SEED]   Market prices: ${pricesWritten} written, ${pricesSkipped} skipped`);

  // ── Buyers ─────────────────────────────────────────────────────
  console.log('[SEED] Seeding buyers...');
  let buyersSkipped = 0;
  for (const buyer of SEED_BUYERS) {
    const ref = doc(db, 'buyers', buyer.seedId);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      buyersSkipped++;
      skipped++;
      continue;
    }

    const { seedId, isPrototypeData, ...buyerData } = buyer;
    await setDoc(ref, {
      ...buyerData,
      isPrototypeData: true,
    });
    buyersWritten++;
  }
  console.log(`[SEED]   Buyers: ${buyersWritten} written, ${buyersSkipped} skipped`);

  // ── Demo Users (Firestore profiles only) ───────────────────────
  console.log('[SEED] Seeding demo user profiles...');
  let usersSkipped = 0;
  for (const user of SEED_USERS) {
    const ref = doc(db, 'users', user.seedId);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      usersSkipped++;
      skipped++;
      continue;
    }

    const { seedId, email, isPrototypeData, ...userData } = user;
    await setDoc(ref, {
      ...userData,
      createdAt: Timestamp.now(),
      isPrototypeData: true,
    });
    usersWritten++;
  }
  console.log(`[SEED]   Users: ${usersWritten} written, ${usersSkipped} skipped`);

  // ── Summary ────────────────────────────────────────────────────
  console.log('[SEED] ══════════════════════════════════════════════');
  console.log(`[SEED] Done. Written: ${marketsWritten + pricesWritten + buyersWritten + usersWritten}, Skipped: ${skipped}`);
  console.log('[SEED] ══════════════════════════════════════════════');

  return { marketsWritten, pricesWritten, buyersWritten, usersWritten, skipped };
}
