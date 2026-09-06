# Agent 1 — Product & UI Foundation

**Read `AGENTS.md` first.**

## Mission
Build KisanMitra's visual foundation and shared UX.

## Own
- Global layout
- Navbar/sidebar
- Shared components
- Landing page
- Login/demo-role UI if needed
- Design consistency
- Responsive behavior
- Shared loading/error/empty states

## Do not own
Firebase, Firestore, recommendation calculations, buyer matching, farmer CRUD, buyer CRUD.

## Components
Create reusable components where useful:
`Navbar`, `Sidebar`, `PageHeader`, `MetricCard`, `StatusBadge`, `MarketCard`, `BuyerCard`, `LotCard`, `OfferCard`, `RecommendationCard`, `PriceChart`, `TransactionTimeline`, `LoadingState`, `EmptyState`, `ErrorState`.

Avoid unnecessary abstraction.

## Design
Professional agricultural + financial dashboard. Clean neutral background, restrained green accent, strong price/recommendation hierarchy, clear status badges, simple icons.

## Landing
Hero, problem, how it works, market intelligence, verified buyers, transparent transactions, CTA.

Core message: **Know where to sell. Know when to sell. Find reliable buyers.**

## Navigation
Farmer: Dashboard, Market Intelligence, Recommendation, My Lots, Offers, Transactions.  
Buyer: Dashboard, Demand, Available Lots, Offers, Transactions.

## Acceptance
- Consistent responsive UI
- Reusable shared components
- No broken routes
- Async states handled
- No secrets
- Build passes

## Output
Report files, routes/components, dependencies, build/test result, limita##tions.

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