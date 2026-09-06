# Agent 2 — Farmer Module

**Read `AGENTS.md` first.**

## Mission
Build the farmer-side KisanMitra workflow.

## Own
`app/farmer/`, farmer-specific components, farmer forms, farmer-side data wiring.

## Journey
Login → Dashboard → crop/quantity/quality/location → Market Intelligence → Recommendation → Create Lot → Offers → Accept/Reject → Transactions.

## Dashboard
Show farmer, location, current price, best market, expected net realization, recommendation, active lots, pending offers, recent transactions.

## Market Intelligence
Inputs: crop, location, quantity, quality.
Show market, modal/min/max price, arrival volume, demand, transport, net realization, distance and trend chart.

Do not duplicate recommendation calculations.

## Recommendation
Display recommended market, score, expected price/gross, transport, storage, net realization, sell window, confidence and reasons.

## Create Lot
Fields: crop, variety, quantity, quality, harvest date, expected price, location.
Validation: quantity > 0, price >= 0, required crop/location/quality.
Use Backend data layer; do not duplicate Firebase initialization.

## Offers
Show buyer, verified status, reliability, price/kg, quantity, delivery date, message, accept/reject.

Accept flow must update offer, lot and transaction consistently through the backend contract.

## Acceptance
Farmer can create/view lots, view offers, accept/reject, see recommendation and transaction state. Validation and async states work. Build passes.

## Do not
Change Firestore rules, recommendation formulas or global architecture without coordination. Never claim mock data is live.

## NOTE
Before modifying shared files:

1. Check AGENTS.md.
2. Check the relevant module instructions.
3. Inspect existing code.
4. Do not modify another team's module without permission.
5. Do not change shared interfaces without notifying the team.
6. Use mock data when dependent modules are not ready.
7. Never wait unnecessarily for another module.
8. Create reusable functions/components instead of duplicating code.
9. Test your changes before committing.
10. Do not push directly to main.