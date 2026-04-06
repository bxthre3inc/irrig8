# ThinkTank Draft — PASTURE

> **Status:** DRAFT — Budget-aware ideation  
> **Created:** 2026-04-05  
> **Last Updated:** 2026-04-05

---

## Budget Constraint

| Parameter | Value |
|-----------|-------|
| **Available capital** | ~$5K (per investor-relations standups) |
| **Runway philosophy** | Bootstrap / revenue-first |
| **Time to revenue target** | 30-60 days |

---

## Product Identity

| Field | Value |
|-------|-------|
| **product_id** | PASTURE |
| **canonical_name** | PasturePilot — Rotational Grazing Optimization |
| **status** | draft |
| **owner** | @brodiblanco |

---

## Product Definition

### Description
Satellite-based pasture rotation planning for livestock farmers. Uses free Sentinel-2 imagery to calculate forage availability, recommend rotation schedules, and estimate carrying capacity. No hardware, no sensors — just analysis + recommendations.

### Problem Statement
SLV livestock farmers (cattle, sheep) struggle with rotational grazing — either overgraze or underutilize pastures. Manual observation is time-consuming; expensive ranch management software is overkill for small operations.

### Solution Hypothesis
Tiered service: (1) Basic pasture assessment — $300/farm (one-time), (2) Rotation plan — $500/farm (one-time), (3) Ongoing monitoring — $150/month. Uses free satellite data + simple algorithm to recommend grazing schedules.

### Target Users
- Small-to-mid livestock farms in SLV (< 500 head)
- Ranchers exploring regenerative grazing practices
- Farmers wanting to optimize hay production

### Success Metrics
[TBD]
- Revenue: $2K/month by Q3 2026
- Farms served: 8 by EOD Q2

### Estimated Scope
[TBD]
- MVP: Launch in 3 weeks with 3 pilot farms
- Tool: Google Earth Engine (free tier) + custom spreadsheet

---

## Business Model

| Component | Detail |
|-----------|--------|
| **Tier 1: Assessment** | $300 one-time — current pasture condition report |
| **Tier 2: Plan** | $500 one-time — full rotation schedule for growing season |
| **Tier 3: Ongoing** | $150/month — quarterly satellite updates + plan adjustments |

### Unit Economics
- **Cost to serve:** $0 (free satellite data) + ~4 hrs labor per assessment
- **Margin:** ~90%
- **Break-even:** 2 assessments covers time investment

---

## Why This Fits $5K Budget

| Expense | Cost |
|---------|------|
| Google Earth Engine (free tier) | $0 |
| Landing page (Zo Space) | $0 |
| Marketing (direct outreach) | $0 |
| **Total startup cost** | **$0** |

---

## Synergies

| With | Synergy |
|------|---------|
| Irrig8 | Same farmer — water optimization + grazing optimization |
| SLVCONS | Cross-sell — consulting bundle for mixed farms |
| Carbon8 | Verified grazing practices → carbon credit eligibility |

---

## Required Decisions

1. `success_metrics` — Current: [TBD]
2. `estimated_scope` — Current: [TBD]
3. `pricing_tiers` — Current: [TBD — confirm $300-500 range]
4. `target_acquisition_channel` — Current: [TBD]

---

## Promotion Criteria

- [ ] All [TBD] fields resolved
- [ ] @brodiblanco approval phrase ("let's go", "make it official")

---

## Naming History

| Date | Event |
|------|-------|
| 2026-04-05 | Draft created by AmbientCapture (code: PASTURE) — budget-aware ideation |

