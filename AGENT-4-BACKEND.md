# Agent 4 — Firebase, Firestore & Authentication

**Read `AGENTS.md` first.**

## Mission
Build the KisanMitra backend/data foundation.

## Own
`lib/firebase.ts`, data-access utilities, authentication, Firestore integration, security rules, seed/demo data and backend types.

## Firebase
Use environment variables. Never commit service-account keys or `.env.local`.

## Roles
FARMER, FPO, BUYER, ADMIN.
If full auth becomes a blocker, controlled demo access is acceptable for the hackathon.

## Collections
Implement the schema in `AGENTS.md`: users, markets, market_prices, buyers, lots, offers, transactions, grievances.

## Data layer
Prefer reusable functions such as:
`getCurrentUser`, `getMarkets`, `getMarketPrices`, `getBuyers`, `getLots`, `createLot`, `getOffers`, `createOffer`, `updateOffer`, `createTransaction`, `getTransactions`.

Use TypeScript types. Avoid raw Firestore calls scattered across UI.

## Acceptance consistency
When an offer is accepted:
`offer.status = ACCEPTED`, `lot.status = SOLD`, transaction created.
Use batch/transaction writes where practical.

## Security
Protect user-owned records and admin actions. Prototype simplifications must be documented.

## Seed data
Crops: Tomato, Chilli, Rice, Cotton, Maize.
Markets: Guntur, Vijayawada, Tenali, Narasaraopet, Bapatla.
Buyers: FreshFoods Pvt Ltd, AgroMart, FoodChain India, RetailFresh.
Mark it as prototype data.

## Acceptance
Firebase initializes, auth/demo flow works, CRUD works, schema/types exist, security rules exist, seed data works, no secrets are committed, build passes.

## Do not
Build UI-heavy features, implement recommendation formulas, invent government APIs or label seed data as live.
