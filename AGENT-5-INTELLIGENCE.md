# Agent 5 — Market Intelligence & Matching

**Read `AGENTS.md` first.**

## Mission
Build the explainable intelligence layer.

## Own
`lib/recommendation.ts`, `lib/matching.ts`, scoring utilities, sell-window logic and explanation generation.

## Terminology
Call it a **Market Intelligence / Recommendation Engine**. It is not a trained ML model.

## Market score
Price 40%, demand 25%, distance 15%, quality 10%, reliability 10%.

`score = price*0.40 + demand*0.25 + distance*0.15 + quality*0.10 + reliability*0.10`

Normalize factors 0–100.

## Net realization
`grossValue = expectedPricePerKg * quantity`
`netRealization = grossValue - transportCost - storageCost - otherEstimatedCosts`

## Output
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

## Sell window
High demand + falling arrivals + rising prices → SELL_SOON.
Strongly falling prices OR very high arrivals → SELL_NOW.
Stable prices + low demand → WAIT/COMPARE.
Conflicting signals should produce a conservative explainable result.

## Buyer matching
Crop 25%, quantity 15%, quality 20%, price 20%, distance 10%, reliability 10%.
Return buyerId, matchScore and reasons.

## Testing
Test normalization, price effect, transport effect, quality mismatch, reliability, net realization, sell-window rules and buyer matching with deterministic data.

## Do not
Call it ML, use random scores, fabricate live prices, hard-code the demo result or build frontend pages.

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