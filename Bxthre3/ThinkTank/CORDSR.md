# ThinkTank Draft — CORDSR

> **Status:** DRAFT — Pending validation & promotion to specs/  
> **Detected By:** AmbientCapture Agent  
> **Created:** 2026-04-02  
> **Last Updated:** 2026-04-02

---

## Product Identity

| Field | Value |
|-------|-------|
| **product_id** | CORDSR |
| **canonical_name** | Cords — Firewood Marketplace |
| **status** | draft |
| **owner** | @brodiblanco |

---

## Product Definition

### Description
Local firewood marketplace connecting suppliers with buyers in Colorado — "Uber for firewood." Suppliers list cordwood, buyers search by zip code and wood type, schedule delivery, and pay via Stripe Connect.

### Problem Statement
[TBD]
Rural and semi-rural households in Colorado need reliable access to affordable firewood for heating, but finding suppliers, comparing prices, and arranging delivery is fragmented and inconvenient. [TBD — refine problem statement]

### Solution Hypothesis
[TBD]
A two-sided marketplace with supplier profiles (wood types, pricing, delivery radius), buyer search/filter by zip + wood type (oak, pine, mixed), scheduled delivery windows, stripe payments, and review systems will reduce friction in firewood commerce. [TBD — validate solution hypothesis]

### Target Users
[TBD]
- Rural/semi-rural homeowners in Colorado needing firewood
- Firewood suppliers (loggers, tree services, landowners with excess wood)
- Seasonal buyers (fall/winter prep)

### Success Metrics
[TBD]
- [TBD — Define success metrics]

### Estimated Scope
[TBD]
- [TBD — Define estimated scope (MVP vs full launch)]

---

## MVP Features

### Suppliers
- [TBD] Sign up with location + service radius
- [TBD] List wood types + pricing per cord/face cord
- [TBD] Set availability calendar
- [TBD] Receive orders via SMS/app
- [TBD] Mark deliveries complete

### Buyers
- [TBD] Search by zip + radius
- [TBD] Filter by wood type + delivery date
- [TBD] View supplier profiles + reviews
- [TBD] Place order with delivery instructions
- [TBD] Track delivery status

### Platform
- [TBD] Stripe Connect for payments
- [TBD] 10% platform fee structure
- [TBD] SMS notifications (Twilio)
- [TBD] Google Maps API for radius search

---

## Brand & Design

| Element | Value |
|---------|-------|
| **Primary** | #5D4037 (dark wood brown) |
| **Secondary** | #8D6E63 (medium wood) |
| **Accent** | #FF5722 (fire orange) |
| **Background** | #FFF8E1 (light wood/cream) |

### Tech Stack
[TBD]
- React + TypeScript
- Tailwind CSS
- Stripe Connect
- Google Maps API
- Twilio SMS

---

## Business Model

| Component | Detail |
|-----------|--------|
| **Revenue Model** | 10% platform fee on transactions [TBD — confirm fee structure] |
| **Supplier Onboarding** | [TBD — define onboarding flow] |
| **Buyer Acquisition** | [TBD — define acquisition strategy] |

---

## Required Decisions

The following fields require decisions before promotion to active status:

1. `problem_statement` — Current: [TBD]
2. `solution_hypothesis` — Current: [TBD]
3. `target_users` — Current: [TBD]
4. `success_metrics` — Current: [TBD]
5. `estimated_scope` — Current: [TBD]
6. `business_model.supplier_onboarding` — Current: [TBD]
7. `business_model.buyer_acquisition` — Current: [TBD]
8. `technical_requirements.mvp_timeline` — Current: [TBD]

---

## Notes & Context

- **Project Location:** `/home/workspace/Bxthre3/projects/cords/`
- **Spec File:** `CORDS_SPEC.md` exists with MVP scope defined
- **IP Risk:** Low — marketplace model, execution-dependent
- **Dependencies:** Stripe Connect, Twilio, Google Maps API

---

## Promotion Criteria

To promote this draft to specs/, the following must be complete:
- [ ] All [TBD] fields resolved
- [ ] Problem statement validated
- [ ] Solution hypothesis defined
- [ ] Target users specified
- [ ] Success metrics defined
- [ ] Estimated scope defined
- [ ] Business model confirmed
- [ ] @brodiblanco approval phrase detected ("let's go", "make it official", "promote to spec")

---

## Naming History

| Date | Event |
|------|-------|
| 2026-04-02 | Draft created by AmbientCapture (code: CORDSR) |

---

## Git Commits

| Hash | Timestamp | Message |
|------|-----------|---------|
| [PENDING] | 2026-04-02 | Initial ThinkTank draft creation |
