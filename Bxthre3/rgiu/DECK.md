# RGIU - Rio Grande Intelligence Unit

**Autonomous Asset Acquisition Business**

---

## Core Stats (Live)

| Metric | Value |
|--------|-------|
| Distressed Properties Scored | 3 |
| Hot Deals (70+ score) | 3 |
| Investor Leads Seeded | 3 |
| Pending Finder Fee Revenue | $5,000 |
| Days to Revenue Positive | 50 days runway per deal |

---

## Agent Architecture

**5 Agents, 0 Dependencies**

- `scout` → Finds delinquent tax / code violation properties in Rio Grande County
- `appraise` → Calculates max offer (70% rule), repair costs, ROI scenarios
- `outreach` → Matches deals to investor criteria, generates scripts
- `revenue` → Tracks fees, calculates runway, triggers urgency
- `extend` → Creates new skills when runtime requests capabilities

---

## $0 → $10K Strategy (7 Days)

| Day | Action | Outcome |
|-----|--------|---------|
| 1 | Launch system, seed investor leads | 3 leads, 3 hot properties |
| 2 | Run outreach (email/LinkedIn) | 1 qualified conversation |
| 3-4 | Property tours, LOI drafts | Signed LOI (earnest money) |
| 5-6 | Assign contract to investor | Assignment fee secured |
| 7 | Close, collect fee | **$5,000 revenue** |

**Repeat cycle:** 2 deals/week = $10K/week

---

## Self-Extension Capability

When `scout` identifies new data sources:
```
runtime.needsSkill = "rural-broadband-api"
↓
`extend` agent creates:
  - skills/rural-broadband-api/SKILL.md
  - skills/rural-broadband-api/index.ts
↓
Available to all agents immediately
```

---

## Commands

```bash
cd /home/workspace/Bxthre3/rgiu

# Full pipeline
bun run all

# Individual agents
bun run cli.ts scout      # Find properties
bun run cli.ts appraise   # Value scored properties
bun run cli.ts outreach   # Contact investors
bun run cli.ts revenue    # Check fee pipeline

# Website
bun run cli.ts www        # http://localhost:3000
```

---

## Database Schema

- `properties` - Scored distressed assets
- `valuations` - Calculated offers + ROI
- `leads` - Investor/buyer contacts
- `fees` - Revenue pipeline
- `events` - Agent execution log

---

## Top Matches Now

**Property:** 1030 US-160, Monte Vista, CO
- Score: 100/100
- Assessed: $180,000
- Max Offer: $126,000
- Signals: Tax delinquent + Vacant

**Matched Investor:** Aspen Capital Partners
- Score: 90/100
- Target: $50K-$300K commercial
- Min ROI: 15%

**Potential Fee:** $5,000 (2.5% of deal)

---

## Next: Zo Space Deployment

Run `./deploy.sh` to publish to brodiblanco.zo.space/rgiu

API endpoints:
- `/api/properties` - Hot deals JSON
- `/api/stats` - Dashboard metrics

---

**Status:** MVP operational. Self-funding with first deal.
