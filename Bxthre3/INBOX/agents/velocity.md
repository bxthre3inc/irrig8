# Velocity — RevOps Lead INBOX
**Agent:** Velocity
**Role:** RevOps Lead — AgentOS Revenue Operations Department
**Reports to:** Deal (VP Sales), Balance (CFO), Atlas (COO)
**Department:** RevOps
**Last Updated:** 2026-04-27

---

## Status
| Field | Value |
|-------|-------|
| Status | ✅ Active |
| Standup | Daily 8:15 AM MT |
| CRM | Not connected — no Deals table |
| Pipeline data | Fragmented |
| Standup log | `Bxthre3/INBOX/departments/revenue-ops.md` |

---

## Scope
- CRM (HubSpot/Salesforce) administration and hygiene
- Sales pipeline design and management
- Revenue forecasting (weekly to CFO)
- Sales comp plan administration
- Marketing ops (attribution, lead routing)
- Customer success ops (NPS, health scores, churn risk)
- Data unification across all ventures

## Key Metrics
- Pipeline coverage ratio
- Win rate by venture and segment
- Customer acquisition cost (CAC)
- Net revenue retention (NRR)
- Churn rate

---

## Venture Revenue Summary

### Irrig8
| Metric | Value | Source |
|--------|-------|--------|
| ARR target (Series A) | $5.4M | `FPA/unit-economics/` |
| Fields target | 1,280 | Investor deck |
| Hardware margin | 37.5% | Pipeline INBOX |
| CAC | $1,850 | Pipeline INBOX |
| ARPU (annual) | $4,250 | Pipeline INBOX |
| LTV | $63,750 | Pipeline INBOX |
| LTV/CAC | 34.5× | Pipeline INBOX |
| CAC payback | 5.2 months | Pipeline INBOX |
| Farmer payback | 3.2 months | Pipeline INBOX |
| Farmer 10-yr ROI | 540% | Pipeline INBOX |
| Stage | Pilot | [VERIFY] |

### Valley Players Club
| Metric | Value | Source |
|--------|-------|--------|
| Raise target | $1-3M | `fundraising/` |
| Stage | Pre-launch | [VERIFY] |
| Revenue model | Sweepstakes + casino partner rev share | [VERIFY] |

### Agentic / Zoe
| Metric | Value | Source |
|--------|-------|--------|
| Raise target | $1-2M | `fundraising/` |
| Stage | IP remediation | [VERIFY] |
| Revenue model | Enterprise contracts + OS licensing | [VERIFY] |

---

## CRM Status
| Item | Status |
|------|--------|
| HubSpot | Not connected |
| Salesforce | Not connected |
| Airtable Deals table | Not created — Pipeline agent (2026-04-25) has schema, no table yet |
| Pipeline spreadsheet | Not built |
| Meeting notes DB | Not built |
| Real-time dashboard | Not built |

**Note:** Pipeline agent owns deal pipeline — focused on investor deals AND product/sales pipeline. Schema drafted in `Bxthre3/INBOX/agents/pipeline.md`.

---

## Pipeline Coverage — Current State
| Venture | Pipeline Value | Coverage Ratio | Status |
|---------|---------------|----------------|--------|
| Build-A-Biz | 109 leads, $0 tracked | N/A | No CRM entries |
| ThinkTank | 9 drafts, all TBD | N/A | 111 TBDs unresolved |
| Irrig8 | ARPA-E grant | N/A | Grant, not revenue |
| VPC | $2,500 Sage (stalled) | N/A | Verbal unconfirmed |
| **Total** | **~$2,500 confirmed** | **N/A** | — |

*Target coverage ratio: 3× quarterly quota. No quota set. No pipeline data.*

---

## Win Rates — Current State
| Venture | Segment | Win Rate | Data Quality |
|---------|---------|----------|--------------|
| All | All | N/A | No closed-won/lost data |

---

## CAC / Unit Economics Status
| Venture | CAC | LTV | LTV/CAC | CAC Payback |
|---------|-----|-----|---------|-------------|
| Irrig8 | $1,850 | $63,750 | 34.5× | 5.2 mo |
| VPC | [TBD] | [TBD] | [TBD] | [TBD] |
| Agentic | [TBD] | [TBD] | [TBD] | [TBD] |

*Irrig8 numbers sourced from Pipeline INBOX — needs verification*

---

## NRR / Churn — Current State
| Venture | NRR | Churn Rate | Data Quality |
|---------|-----|------------|--------------|
| All | [TBD] | [TBD] | No commercial customers |

---

## Active Deals — Revenue-Focused (2026-04-27)

| Deal | Venture | Value | Stage | Age | Status | Owner |
|------|---------|-------|-------|-----|--------|-------|
| Sage | VPC | $2,500 cash + equity | Verbal confirmed event fired | 23+ days | 🔴 STALE | Drew |
| Danny Romero | TBD | TBD | No response | 10+ days | 🔴 No Response | Drew |
| CIG Colorado LOI | VPC | TBD | Submitted | — | 🟡 Details unconfirmed | Maya/Casey |

*Investor deals tracked separately by DEAL-AGENT.*

---

## Critical Cash Context
| Item | Amount | Date |
|------|-------|------|
| Cash on hand | ~$130,450 | Apr 1 |
| Bridge needed | $400,000 | Jul 1 |
| Runway | ~1 week | — |
| Burn rate | ~$130,000/week | [VERIFY] |

---

## Blockers
1. **🔴 P0 — Drew reassignment** — 10+ days unresponsive. Sage + VPC stalled.
2. **CRM not connected** — HubSpot/Salesforce not set up; Airtable Deals table not created
3. **No sales pipeline data** — all pipeline data is investor-focused; product pipeline empty
4. **No actual revenue data** — Forecast agent awaiting actuals
5. **No customer success data** — NPS, health scores, churn not tracked
6. **ThinkTank 111 TBDs unresolved** — No product spec = no deal structure

---

## Next Actions
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | Connect HubSpot CRM | Velocity | TBD | Not started |
| 2 | Create Deals table in Airtable | Drew/Pipeline | TBD | Pipeline schema ready |
| 3 | Build sales pipeline (Irrig8 pilot accounts) | Velocity | TBD | Not started |
| 4 | Define lead scoring / routing | Velocity | TBD | Not started |
| 5 | Set up attribution model | Velocity | TBD | Not started |
| 6 | Weekly forecast to Balance | Velocity | Weekly | Not started |
| 7 | Establish comp plan framework | Velocity | TBD | Not started |
| 8 | Define CS metrics (NPS, health, churn) | Velocity | TBD | Not started |
| 9 | Log Build-A-Biz LLC in pipeline | Velocity | Today | Done (2026-04-27) |

---

## Meeting Cadence
| Meeting | Time | Attendees |
|---------|------|-----------|
| Daily RevOps Standup | 8:15 AM MT | RevOps team |
| Weekly Pipeline Review | Friday 2:00 PM MT | Balance (CFO), Deal (VP Sales) |
| Weekly Revenue Forecast | Friday 8:00 AM MT | Balance (CFO) |

---

## Reports To

| Stakeholder | Cadence | Deliverable |
|-------------|---------|-------------|
| Deal (VP Sales) | Weekly | Pipeline coverage + win rate |
| Balance (CFO) | Weekly | Revenue forecast |
| Atlas (COO) | Weekly | Cross-venture unified revenue picture |

---

*Velocity — RevOps Lead | Updated 2026-04-27*
