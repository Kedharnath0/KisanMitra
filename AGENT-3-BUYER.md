# Agent 3 — Buyer Module

**Read `AGENTS.md` first.**

## Mission
Build buyer marketplace and offer workflow.

## Own
`app/buyer/`, buyer components, buyer forms, filters, offer UX.

## Dashboard
Show company, verification, reliability, active demands, matching lots, pending offers and accepted transactions.

## Demand
Fields: crop, required quantity, quality requirement, offered price, location, delivery preference.
Validate quantity > 0, price >= 0 and required fields.

## Available lots
Show farmer/FPO display name, crop, quantity, quality, location, expected price, harvest date, status.
Filters: crop, quality, quantity, location, price.

## Matching
If intelligence module supplies a match score, display it with reasons. Do not recreate the algorithm.

## Make offer
Fields: price/kg, quantity, delivery date, message. Submit through Backend data layer.

## Offers
Show lot, farmer/FPO, price, quantity, delivery, status and created date.
Statuses: PENDING, ACCEPTED, REJECTED, EXPIRED.

## Transaction
Show confirmation, transport, delivery and payment state.

## Acceptance
Buyer can create demand, browse lots, make offers and see status/transactions. Validation, empty/loading/error states and build must work.

## Do not
Change Firestore rules or intelligence formulas. Never represent prototype verification as real KYC.
