# AGENTS.md — KisanMitra

## Project
**Name:** KisanMitra  
**Hackathon:** Smart India Hackathon (SIH) 2026  
**Tagline:** Smart market intelligence from farm gate to buyer.

KisanMitra helps farmers/FPOs decide **where, when, and to whom to sell** using market prices, demand, quality, logistics, storage, and buyer reliability.

## Core demo
Farmer → crop + quantity + quality + location → market intelligence → best market + net realization + sell window → verified buyer → digital lot → offer → acceptance → logistics → payment tracking.

## MVP priorities
### P0 — Mandatory
- Farmer login/demo access
- Farmer dashboard
- Crop/quantity/location input
- Market price comparison
- Price trend chart
- Smart market recommendation
- Sell-window recommendation
- Produce lot creation
- Buyer marketplace
- Verified buyer indicator
- Buyer offer
- Accept/reject offer
- Transaction creation
- Payment status
- Transaction timeline

### P1 — Only after P0 works
Quality grading, transport estimate, maps, storage, arrival volume, reliability score, FPO aggregation, notifications, grievance flow.

### P2 — Future
Real payment gateway, full ML forecasting, advanced logistics optimization, voice assistant, IoT, blockchain, real-time GPS, complex personalization.

## Users
- **Farmer:** market intelligence, lots, offers, transactions, grievances.
- **FPO:** aggregation and larger lots; may reuse farmer flows.
- **Buyer:** demand listings, browse lots, offers, transactions.
- **Admin:** verification, monitoring, disputes, data management.

## Primary demo persona
Ramesh, Guntur, Tomato, 1,000 kg, Grade A.

Example prototype output:
- Reference price: ₹24/kg
- Recommended market: Vijayawada
- Market price: ₹27/kg
- Transport: ₹2,000
- Gross: ₹27,000
- Net: ₹25,000
- Recommendation: SELL WITHIN 1–2 DAYS
- Confidence: 82%

These are demo values. Never label fabricated data as live.

## Product principles
1. Optimize **net realization**, not headline price.
2. Explain every recommendation.
3. Make verification, reliability and payment status visible.
4. Keep the farmer UX simple and action-oriented.
5. Do not claim prototype rules are ML.

## Technology
- Next.js + TypeScript + React
- Tailwind CSS
- shadcn/ui where useful
- Lucide React
- Firebase Auth + Firestore
- Recharts
- Leaflet/OpenStreetMap if stable
- GitHub
- Vercel

## Repository
```text
kisanmitra/
├── AGENTS.md
├── AGENT-1-PRODUCT-UI.md
├── AGENT-2-FARMER.md
├── AGENT-3-BUYER.md
├── AGENT-4-BACKEND.md
├── AGENT-5-INTELLIGENCE.md
├── AGENT-6-QA-INTEGRATION.md
├── app/
├── components/
├── lib/
├── data/
├── types/
├── public/
├── docs/
└── tests/
```

## Firestore schema
### users/{userId}
`name, phone, role(FARMER|FPO|BUYER|ADMIN), location, district?, verified, createdAt`

### markets/{marketId}
`name, district, state, latitude, longitude, supportedCrops[]`

### market_prices/{priceId}
`marketId, marketName, crop, variety?, minPrice, maxPrice, modalPrice, arrivalQuantity, date, source?`

### buyers/{buyerId}
`companyName, crop, requiredQuantity, offeredPrice, qualityRequirement, location, verified, reliabilityScore, rating?`

### lots/{lotId}
`farmerId, crop, variety?, quantity, quality(A|B|C), harvestDate, expectedPrice, location, status(OPEN|OFFER_RECEIVED|SOLD|CANCELLED), createdAt`

### offers/{offerId}
`lotId, buyerId, farmerId, pricePerKg, quantity, deliveryDate?, message?, status(PENDING|ACCEPTED|REJECTED|EXPIRED), createdAt`

### transactions/{transactionId}
`lotId, farmerId, buyerId, quantity, pricePerKg, totalAmount, status(CONFIRMED|IN_TRANSIT|DELIVERED|COMPLETED), paymentStatus(PENDING|PROCESSING|PAID), transportStatus?, createdAt`

### grievances/{grievanceId}
`transactionId, raisedBy, category, description, status(OPEN|UNDER_REVIEW|RESOLVED), createdAt`

## Recommendation engine
Use an explainable weighted model:
- Price 40%
- Buyer demand 25%
- Distance 15%
- Quality match 10%
- Buyer reliability 10%

`score = price*0.40 + demand*0.25 + distance*0.15 + quality*0.10 + reliability*0.10`

All factors normalized 0–100.

`netRealization = expectedPricePerKg * quantity - transportCost - storageCost - otherCosts`

Return:
```ts
{
  marketId: string;
  marketName: string;
  score: number;
  expectedPrice: number;
  expectedGross: number;
  estimatedTransport: number;
  estimatedStorage: number;
  expectedNetRealization: number;
  recommendation: "SELL_NOW" | "SELL_SOON" | "WAIT";
  confidence: number;
  reasons: string[];
}
```

## Sell-window prototype
- High demand + falling arrivals + rising prices → SELL_SOON
- Strongly falling prices OR very high arrivals → SELL_NOW
- Stable prices + low demand → WAIT/COMPARE

This is not a guaranteed forecast.

## Buyer matching
Consider crop, quantity, quality, price, distance, reliability and verification. Use an explainable score and reasons.

## AI-agent rules
Every agent MUST:
1. Read this file first.
2. Read its assigned task file.
3. Inspect the repository before editing.
4. Stay within ownership.
5. Reuse existing components/types.
6. Avoid unnecessary dependencies.
7. Avoid unrelated changes.
8. Never delete working functionality without approval.
9. Never invent APIs, credentials or live data.
10. Handle loading/error/empty states.
11. Run relevant build/lint/type/test checks.
12. Report changed files, tests, assumptions and known issues.

## Ownership
- Agent 1: product/UI foundation
- Agent 2: farmer module
- Agent 3: buyer module
- Agent 4: Firebase/Auth/Firestore/security/data
- Agent 5: intelligence/recommendation/matching
- Agent 6: integration/QA/deployment/demo

## Git
Stable branch: `main`

Feature branches:
`feature/ui`, `feature/farmer`, `feature/buyer`, `feature/backend`, `feature/intelligence`, `feature/integration`

Never commit `.env.local`. Keep main deployable.

## Security
- Protect user-owned data.
- Restrict admin actions.
- Never expose service-account credentials.
- Store secrets in environment variables.
- Do not disable security merely to hide errors.
- Document prototype-only security simplifications.

## Validation
Reject zero/negative quantities, negative prices, missing required fields and invalid dates. Validate at UI and data layer where appropriate.

## Demo flow
Ramesh → Tomato 1,000 kg → compare markets → recommendation → create lot → verified buyer → offer → accept → transaction → logistics/payment timeline.

## 48-hour execution
0–2h: architecture, repo, Firebase, schema, agent assignment.  
2–8h: parallel UI/backend/farmer/buyer/intelligence/data.  
8–14h: integrate login → dashboard → market → recommendation.  
14–22h: integrate lot → buyer → offer → acceptance.  
22–28h: transactions/payment/quality/transport if P0 is stable.  
28–34h: integration freeze and bug fixing.  
34–40h: demo hardening.  
40–44h: PPT, architecture, demo script, backup.  
44–48h: feature freeze; bugs/deployment/demo only.

## Definition of Done
A feature is done only when it works with realistic data, validates inputs, handles errors, does not break existing flows, has been human-tested, and its agent reports changes and limitations.
