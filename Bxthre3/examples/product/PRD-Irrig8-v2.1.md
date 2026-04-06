# PRD-Irrig8-v2.1 — Product Requirements Document
**Status:** APPROVED  
**Owner:** brodiblanco  
**Created:** 2026-01-15  
**Updated:** 2026-04-02

---

## 1. Problem Statement

Colorado farmers in San Luis Valley lose $10M+ annually to over-irrigation. Center-pivot systems run on timers, not data.

**Source:** research/SLV-water-crisis.md

---

## 2. Solution Hypothesis

Irrig8 = End-to-end deterministic farming OS using satellite + sensor data to automate irrigation.

**Value:** Reduce water use 30% while maintaining yield.

---

## 3. Target Users

**Primary:** Commercial farmers (500+ acres, center-pivot)
**Secondary:** Agricultural consultants

**Source:** research/farmer-interviews-2026Q1.md

---

## 4. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-01 | Monitor soil moisture | P0 | ±5% accuracy, 15-min |
| FR-02 | Satellite integration | P0 | 3+ providers, daily |
| FR-03 | Valve control | P0 | 99.5% uptime |
| FR-04 | Yield prediction | P1 | ±10% accuracy |
| FR-05 | Mobile dashboard | P1 | iOS + Android |

---

## 5. Non-Functional Requirements

| Category | Requirement | Metric |
|----------|-------------|--------|
| Performance | Data latency | < 5 min |
| Security | Encryption | AES-256 |
| Reliability | Uptime | 99.9% |
| Scalability | Pivots/gateway | 10 max |

---

## 6. MVP Scope

**In:** 1 pilot farm, 2 pivots, 1 gateway, manual calibration
**Out:** Multi-farm automation, AI predictions

---

*[APPROVED]* — brodiblanco  
**Next Review:** 2026-05-02
