# Agent 6 — QA, Integration, Deployment & Demo

**Read `AGENTS.md` first.**

## Mission
Make the complete KisanMitra workflow reliable.

## Own
Cross-module integration, E2E testing, regression, bug fixing, deployment, demo hardening and final smoke tests.

## Primary E2E scenario
Ramesh, Guntur, Tomato, 1,000 kg, Grade A.

Flow:
Login → Farmer Dashboard → Market Intelligence → Recommendation → Create Lot → Buyer Dashboard → Buyer sees Lot → Buyer offer → Farmer sees offer → Farmer accepts → Transaction → logistics/payment timeline.

## Integration checks
### Auth
Correct role routing, invalid session handling, no unintended admin access.

### Market
Market list, prices, chart, empty state.

### Recommendation
Inputs reach engine; output renders; net realization correct; reasons visible; no NaN/undefined.

### Lots
Valid lot saves; invalid values rejected; farmer sees lot; buyer can see eligible lot.

### Offers
Buyer creates offer; farmer sees it; accept/reject works; status changes.

### Transactions
After acceptance:
`offer = ACCEPTED`, `lot = SOLD`, `transaction = CREATED`.

### Payment
Use explicit states PENDING, PROCESSING, PAID. Do not imply real payment unless actually integrated.

## Negative tests
Zero/negative quantity, negative price, missing fields, invalid dates, duplicate submit, refresh during form, empty DB, network failure.

## UI regression
Desktop, tablet, mobile, navigation, cards, forms, charts, modals, long text and async states.

## Security
Check no `.env.local` committed, no secrets in client code, Firestore rules are not accidentally unrestricted.

## Deployment
Run production build and available lint/type/test commands. Deploy to Vercel or agreed platform. Manually verify deployed app.

## Demo hardening
Prefer stable controlled demo data over fragile external APIs.

## Feature freeze
Once P0 works, no major new features. Only fix bugs, integration, deployment and demo blockers.

## Final output
Report E2E results, bugs found/fixed, remaining issues, deployment URL if available and demo readiness.

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