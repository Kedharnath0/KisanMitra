# KisanMitra
## Team Member + AI Agent Working Instructions

**Hackathon:** Smart India Hackathon 2026  
**Team Size:** 6 members  
**Development Time:** 48 hours  
**Development Model:** Human + AI Agent collaboration

---

# 1. How We Are Going to Work

We are **not six people manually coding everything**.

We are using AI coding agents to accelerate development.

The workflow is:

```text
Human Team Member
       ↓
Understand assigned responsibility
       ↓
Give instructions to AI Agent
       ↓
AI Agent analyzes repository
       ↓
AI Agent implements
       ↓
Human reviews the changes
       ↓
Human tests the feature
       ↓
Fix issues with AI Agent
       ↓
Commit to Git
       ↓
Integration
```

### Important principle

> **The AI agent writes code. The team member owns the result.**

If an AI agent creates broken code, the responsibility is still with the team member who approved it.

---

# 2. Golden Rules for Every Team Member

Every team member MUST follow these rules.

## Rule 1 — Read the documentation first

Before asking your AI agent to code:

```text
Read:
AGENTS.md
AND
your assigned AGENT-X-*.md
```

Do not start coding before understanding your responsibility.

---

## Rule 2 — Never tell the AI "build everything"

Bad:

```text
Build the farmer module.
```

Better:

```text
Read AGENTS.md and AGENT-2-FARMER.md.

Inspect the existing repository first.

Implement only the farmer dashboard portion described in the task document.

Do not modify unrelated modules.

Before coding, tell me:
1. What files you plan to change.
2. What existing components you will reuse.
3. What backend interfaces you need.

Wait for my approval before making large architectural changes.
```

---

# 3. How to Give Tasks to an AI Agent

Use this sequence.

## Step 1 — Give context

Tell the agent:

```text
You are working on KisanMitra, our SIH 2026 project.

Read AGENTS.md first.

Then read your assigned task file.
```

---

## Step 2 — Tell it to inspect before coding

Always ask:

```text
Inspect the current repository before making changes.

Do not assume files, APIs, components or database structures exist.
```

This prevents agents from hallucinating the project structure.

---

## Step 3 — Give one small task

Do not give the agent 20 tasks simultaneously.

For example:

```text
Implement the farmer dashboard first.
Do not implement lot creation yet.
```

After that works:

```text
Now implement lot creation.
```

This makes debugging much easier.

---

## Step 4 — Ask for a plan

Before major changes:

```text
Explain your implementation plan and list the files you will modify.
```

The human team member should check the plan.

---

## Step 5 — Let the agent implement

Once the plan is reasonable:

```text
Proceed with the implementation.
```

---

## Step 6 — Ask the agent to test

After implementation:

```text
Run the relevant tests, type checks, lint and production build.

Fix any errors you find.

Do not stop at the first error.
```

---

## Step 7 — Human testing

Never trust:

```text
Build successful.
```

The team member must manually test the feature.

For example:

```text
Open the website.

Login as farmer.

Create a tomato lot.

Enter:
Quantity = 1000 kg
Price = ₹25

Submit.

Verify that the lot appears in My Lots.
```

---

# 4. What NOT to Do With AI Agents

## ❌ Don't blindly accept generated code

AI can:

- hallucinate APIs
- create duplicate components
- introduce bugs
- overwrite existing functionality
- create insecure Firebase rules
- use deprecated packages
- misunderstand business requirements

Always review.

---

## ❌ Don't let two agents modify the same feature simultaneously

For example:

```text
Agent 2 → Farmer dashboard
Agent 3 → Buyer dashboard
```

Good.

But:

```text
Agent 2 → Farmer dashboard
Agent 6 → Farmer dashboard
```

Bad.

Agent 6 should integrate/test it, not independently rebuild it.

---

## ❌ Don't allow agents to rewrite the entire project

If an agent says:

```text
I recommend restructuring the entire application...
```

Stop it unless the team lead approves.

We only have 48 hours.

---

## ❌ Don't add unnecessary technology

If the agent suggests:

```text
MongoDB
PostgreSQL
Redis
Python backend
Docker
Kubernetes
Blockchain
Microservices
```

Do not add them unless there is a real requirement.

Our MVP should remain simple.

---

# 5. Git Rules

Each member works on their own branch.

```text
main
│
├── feature/ui
├── feature/farmer
├── feature/buyer
├── feature/backend
├── feature/intelligence
└── feature/integration
```

### Before starting

```bash
git pull
```

### After completing a logical task

```bash
git status
git add .
git commit -m "feat: add farmer dashboard"
git push
```

Never use:

```bash
git push --force
```

on shared branches.

---

# 6. Team Member 1 — Product & UI Lead

## Assigned Agent

```text
AGENT-1-PRODUCT-UI.md
```

## Human responsibility

You are responsible for the **overall visual quality and user experience**.

Your AI agent is responsible for implementing the UI.

You are responsible for deciding whether the UI is actually good.

---

## Your main tasks

### Phase 1

Build:

- Landing page
- Navbar
- Sidebar
- Layout
- Design system
- Shared buttons
- Cards
- Forms
- Badges
- Loading states
- Error states
- Empty states

### Phase 2

Help Farmer and Buyer agents reuse:

```text
MarketCard
LotCard
OfferCard
RecommendationCard
PriceChart
TransactionTimeline
```

---

## Your AI agent workflow

Tell the agent:

```text
Read AGENTS.md and AGENT-1-PRODUCT-UI.md.

Inspect the existing repository.

First identify the current UI structure.

Do not rewrite the project.

Implement the shared application shell and design system.

Before coding, show me your plan.
```

After completion:

```text
Now run the production build and fix all UI/type errors.
```

---

## Human testing checklist

Check:

```text
[ ] Desktop
[ ] Tablet
[ ] Mobile
[ ] Navigation
[ ] Buttons
[ ] Forms
[ ] Cards
[ ] Charts
[ ] Loading states
[ ] Error states
[ ] Empty states
```

---

## Your final responsibility

Before the demo, you are the person who says:

> "The application looks professional enough for judges."

---

# 7. Team Member 2 — Farmer Module Lead

## Assigned Agent

```text
AGENT-2-FARMER.md
```

## Human responsibility

You own the complete farmer journey.

Your target is:

```text
Farmer
 ↓
Dashboard
 ↓
Market Intelligence
 ↓
Recommendation
 ↓
Create Lot
 ↓
Receive Offer
 ↓
Accept Offer
 ↓
Transaction
```

---

## Main tasks

Build:

- Farmer dashboard
- Market intelligence page
- Recommendation page
- Create lot
- My lots
- Offers
- Farmer transactions

---

## AI workflow

Start with:

```text
Read AGENTS.md and AGENT-2-FARMER.md.

Inspect the current project.

Do not implement everything at once.

Start with the Farmer Dashboard.

Tell me:
1. Files to modify
2. Components to reuse
3. Data required
4. Backend functions required
```

Then implement.

After that:

```text
Now implement Create Lot.
```

Then:

```text
Now implement Farmer Offers.
```

---

## Human testing

Test:

```text
Crop = Tomato
Quantity = 1000
Quality = Grade A
Location = Guntur
```

Verify:

```text
[ ] Dashboard works
[ ] Market data appears
[ ] Recommendation appears
[ ] Lot can be created
[ ] Lot appears in My Lots
[ ] Buyer offer appears
[ ] Accept works
[ ] Transaction appears
```

---

## Important

Never hard-code:

```text
Ramesh
1000
Tomato
₹27
```

inside the application logic.

Demo data should come from the agreed data layer.

---

# 8. Team Member 3 — Buyer Module Lead

## Assigned Agent

```text
AGENT-3-BUYER.md
```

## Human responsibility

You own the buyer side.

Your main flow:

```text
Buyer
 ↓
Dashboard
 ↓
Demand
 ↓
Available Lots
 ↓
Select Lot
 ↓
Make Offer
 ↓
Farmer Accepts
 ↓
Transaction
```

---

## Main tasks

Build:

- Buyer dashboard
- Buyer demand
- Available lots
- Filters
- Buyer matching display
- Offer creation
- Offer history
- Buyer transactions

---

## AI workflow

Start:

```text
Read AGENTS.md and AGENT-3-BUYER.md.

Inspect the existing repository.

Implement only the buyer dashboard first.

Do not change Firebase configuration.

Do not implement recommendation logic.

Show me your plan before coding.
```

Then build each feature sequentially.

---

## Human testing

Verify:

```text
[ ] Buyer login
[ ] Dashboard
[ ] Demand creation
[ ] Farmer lots visible
[ ] Filters work
[ ] Match score displays
[ ] Offer can be created
[ ] Farmer receives offer
[ ] Offer status updates
[ ] Transaction appears
```

---

# 9. Team Member 4 — Backend/Firebase Lead

## Assigned Agent

```text
AGENT-4-BACKEND.md
```

## Human responsibility

You are responsible for **data integrity and backend reliability**.

This is one of the most important roles.

---

## Main tasks

Build:

- Firebase initialization
- Authentication
- Firestore
- Data models
- Data access functions
- Security rules
- Seed data

---

## Your priority

The other agents depend on you.

Therefore establish the contracts early.

For example:

```text
createLot()
getLots()
createOffer()
getOffers()
acceptOffer()
createTransaction()
getTransactions()
```

---

## AI workflow

Start with:

```text
Read AGENTS.md and AGENT-4-BACKEND.md.

Inspect the repository.

Do not create UI.

First establish Firebase configuration and TypeScript data types.

Then create the data access layer.

Show me the proposed schema before making major changes.
```

---

## Critical test

Test the complete data transition:

```text
OPEN LOT
    ↓
OFFER CREATED
    ↓
OFFER ACCEPTED
    ↓
LOT SOLD
    ↓
TRANSACTION CREATED
```

These states must remain consistent.

---

## Security

You must verify:

```text
[ ] No service account key committed
[ ] No .env.local committed
[ ] Firestore rules exist
[ ] Users cannot casually edit other users' data
[ ] Admin operations are restricted
```

---

## Final responsibility

You are the person who says:

> "Our application data is reliable and our backend is not the thing that will fail during the demo."

---

# 10. Team Member 5 — Intelligence Lead

## Assigned Agent

```text
AGENT-5-INTELLIGENCE.md
```

## Human responsibility

You own the **brain of KisanMitra**.

Your goal is not to build a complicated AI model.

Your goal is to produce a believable, explainable recommendation.

---

## Main tasks

Implement:

```text
Market scoring
Net realization
Sell-window recommendation
Buyer matching
Recommendation explanations
```

---

## Core model

```text
Price              40%
Demand             25%
Distance           15%
Quality            10%
Reliability        10%
```

---

## AI workflow

Tell your agent:

```text
Read AGENTS.md and AGENT-5-INTELLIGENCE.md.

Inspect the repository.

Build the recommendation engine as pure, testable TypeScript functions.

Do not build UI.

Do not use random scores.

Do not claim this is machine learning.

Show the input/output interfaces before implementation.
```

---

## Human responsibility

You must understand the formula.

If judges ask:

> "How did you decide Vijayawada is the best market?"

You should be able to explain:

```text
We don't simply select the highest price.

We consider:

price
+ demand
+ distance
+ quality compatibility
+ buyer reliability

Then we estimate net realization after logistics/storage costs.
```

---

## Test examples

Test at least:

### Case 1

```text
High price
Low transport
High demand
```

Should score well.

### Case 2

```text
Very high price
Very high transport
```

Should not automatically win.

### Case 3

```text
Low price
High buyer demand
Very close market
```

Should produce a competitive result.

---

## Final responsibility

You should be able to explain every number shown by the recommendation engine.

---

# 11. Team Member 6 — QA, Integration & Deployment Lead

## Assigned Agent

```text
AGENT-6-QA-INTEGRATION.md
```

## Human responsibility

You are the **final gatekeeper**.

Your job is not to build everything.

Your job is to make sure everything works together.

---

## Main tasks

- Integration
- Bug fixing
- E2E testing
- Deployment
- Responsive testing
- Final demo preparation

---

## When should you start?

Do not wait until hour 40.

Start testing partial flows as soon as modules become available.

---

## AI workflow

Tell your agent:

```text
Read AGENTS.md and AGENT-6-QA-INTEGRATION.md.

Inspect the current repository.

Do not rewrite working modules.

First identify integration points between:
Farmer
Buyer
Backend
Intelligence
UI

Create an integration test plan.
```

---

## Primary test

Run the complete story:

```text
Ramesh
 ↓
Guntur
 ↓
Tomato
 ↓
1000 kg
 ↓
Grade A
 ↓
Market recommendation
 ↓
Create lot
 ↓
Buyer sees lot
 ↓
Buyer offers
 ↓
Farmer accepts
 ↓
Transaction
 ↓
Payment status
```

---

## Bug priority

### P0 — Fix immediately

- App doesn't start
- Login broken
- Farmer flow broken
- Buyer flow broken
- Offer cannot be created
- Acceptance doesn't create transaction
- Firebase failure
- Deployment failure

### P1 — Fix if time allows

- Minor UI bugs
- Mobile spacing
- Chart formatting
- Small validation issues

### P2 — Ignore during final hours

- Tiny animations
- Cosmetic details
- Nice-to-have features
- New features

---

# 12. Team Lead / Coordination Rule

Even though six people have six agents, **one person must act as the final coordinator**.

The coordinator does not need to code everything.

Their job is to maintain:

```text
Scope
Architecture
Git
Deadlines
Integration order
Demo story
```

The coordinator should ask every member:

```text
What are you building?
What files are you changing?
What does your module depend on?
Is it working?
What is blocking you?
```

---

# 13. Communication Between Team Members

Use a simple format.

Whenever an agent finishes a task, the human member posts:

```text
[AGENT 2 UPDATE]

Completed:
- Farmer dashboard
- Market page

Files changed:
- app/farmer/page.tsx
- app/farmer/markets/page.tsx

Dependencies:
- getMarkets()
- getMarketPrices()

Test:
- npm run build ✅

Known issue:
- Recommendation API not connected yet
```

This prevents confusion.

---

# 14. Before Merging Any Agent's Work

The human owner must verify:

```text
[ ] I understand what changed.
[ ] The feature actually works.
[ ] No unrelated files changed.
[ ] No secrets were added.
[ ] No duplicate architecture was created.
[ ] Build passes.
[ ] Existing features still work.
```

Only then merge.

---

# 15. Two-Agent Conflict Protocol

If two agents need the same file:

### Example

Agent 2 needs:

```text
components/MarketCard.tsx
```

Agent 1 also owns it.

Do NOT let both agents edit it independently.

Instead:

```text
Agent 2 → tells Agent 1 what interface is required
Agent 1 → implements shared component
Agent 2 → consumes component
```

Ownership always wins.

---

# 16. Dependency Order

The recommended order is:

```text
                    ┌──────────────┐
                    │   Agent 1    │
                    │ UI Foundation│
                    └──────┬───────┘
                           │
                           ↓
┌──────────────┐    ┌──────────────┐
│   Agent 4    │───→│   Agent 2    │
│   Backend    │    │   Farmer     │
└──────┬───────┘    └──────┬───────┘
       │                   │
       │            ┌──────▼───────┐
       └───────────→│   Agent 3    │
                    │    Buyer     │
                    └──────┬───────┘
                           │
                    ┌──────▼────────┐
                    │   Agent 5     │
                    │ Intelligence  │
                    └──────┬────────┘
                           │
                    ┌──────▼────────┐
                    │   Agent 6     │
                    │ QA/Integration│
                    └───────────────┘
```

However, most implementation can happen in parallel.

---

# 17. Parallel Work Strategy

## Hour 0–2

Everyone:

```text
Read documentation
Clone repository
Install dependencies
Understand ownership
```

Agent 4 establishes Firebase/schema.

Agent 1 establishes UI foundation.

---

## Hour 2–8

Parallel:

```text
Agent 1 → UI
Agent 2 → Farmer
Agent 3 → Buyer
Agent 4 → Backend
Agent 5 → Intelligence
Agent 6 → Test infrastructure + integration planning
```

---

## Hour 8–14

Start integration:

```text
Login
 ↓
Farmer Dashboard
 ↓
Market Intelligence
 ↓
Recommendation
```

---

## Hour 14–22

Build the transaction loop:

```text
Lot
 ↓
Buyer
 ↓
Offer
 ↓
Accept
 ↓
Transaction
```

---

## Hour 22–28

Only if P0 works:

```text
Quality
Transport
Storage
Charts
FPO
Grievance
```

---

## Hour 28+

Feature freeze.

Focus on:

```text
Bug fixing
Testing
Deployment
Demo
```

---

# 18. How to Talk to Your AI Agent

## Good prompt structure

```text
CONTEXT:
You are working on KisanMitra SIH 2026.

DOCUMENTATION:
Read AGENTS.md.
Read AGENT-X-XXXX.md.

CURRENT STATE:
[Explain what is already implemented.]

TASK:
[One specific task.]

CONSTRAINTS:
[What the agent must not change.]

BEFORE CODING:
Inspect the repository and show your plan.

IMPLEMENTATION:
Implement the task.

VALIDATION:
Run tests/typecheck/lint/build.

FINAL REPORT:
Tell me:
- files changed
- functionality added
- tests run
- errors fixed
- known limitations
```

---

# 19. Example Prompt for Any Agent

```text
You are an AI coding agent working on KisanMitra for SIH 2026.

First read:
1. AGENTS.md
2. Your assigned AGENT task file.

Inspect the current repository before changing anything.

Do not assume that a file, API, component, Firebase collection or function exists.

My current task is:

[WRITE ONE TASK HERE]

Before coding:
1. Explain what you found.
2. Explain your implementation plan.
3. List files you expect to change.
4. Mention any dependencies on other agents.

Do not modify unrelated modules.

After implementation:
1. Run the relevant tests.
2. Run TypeScript/type checking.
3. Run lint if available.
4. Run the production build.
5. Fix errors caused by your changes.

Finally report:
- What was implemented
- Files changed
- Tests performed
- Remaining issues
- Anything another agent needs to know
```

---

# 20. What Each Human Should Know for the Final Presentation

Every member should understand the **whole product**, even though they own one module.

Everyone must know:

```text
What problem are we solving?
Why does the farmer need this?
How does KisanMitra make money?
Where does market data come from?
How is the recommendation calculated?
How are buyers verified?
How does the transaction work?
What is AI and what is rule-based?
What is prototype vs production?
```

Do not say:

> "That's Agent 5's part. I don't know."

Judges may ask anyone anything.

---

# 21. Final Team Responsibility Matrix

| Member | Owns | Must Understand |
|---|---|---|
| 1 | UI/UX | Entire user journey |
| 2 | Farmer | Farmer + recommendation |
| 3 | Buyer | Buyer + offers |
| 4 | Backend | Entire data flow |
| 5 | Intelligence | Recommendation + matching |
| 6 | QA/Integration | Entire application |

---

# 22. Final Rule

We have only **48 hours**.

Therefore:

> **Working MVP > Huge feature list**

Our goal is not to build a complete agricultural marketplace.

Our goal is to demonstrate one powerful, believable workflow:

```text
"What should I do with my produce?"

            ↓

"Where should I sell?"

            ↓

"When should I sell?"

            ↓

"Who is a reliable buyer?"

            ↓

"What price can I realistically get?"

            ↓

"Can I transact transparently?"

            ↓

KisanMitra
```

If this workflow works smoothly, the project is strong.

If 50 features exist but this workflow breaks, the project is weak.

---

# 23. Team Motto

> **Don't ask AI to build the project.**
>
> **Ask AI to build your part of the project.**
>
> **Understand what it built.**
>
> **Test what it built.**
>
> **Own the result.**