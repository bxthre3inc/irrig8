# BX3 White Paper #2
## 10-Point Vector: The Complete Taxonomy of Autonomous Action

| Field | Value |
|-------|-------|
| **White Paper ID** | BX3-WP-2026-02 |
| **Patent Reference** | Provisional Patent #2 — 10-Point Vector |
| **Pillar** | Core Architecture (BX3 Loop / Functional Triad) |
| **Date** | April 12, 2026 |
| **Author** | Jeremy Beebe, Bxthre3 Inc. |

---

## 1. Executive Summary

Every autonomous system action can be classified along 10 independent axes. Current AI governance frameworks treat these axes as fuzzy, overlapping concerns — resulting in regulatory environments where the same physical event triggers conflicting requirements depending on which framework an auditor applies, and where an AI system can simultaneously satisfy every applicable framework while still producing a catastrophic outcome.

The **10-Point Vector** is a complete, orthogonal taxonomy of autonomous action. It maps every possible state of any autonomous system onto 10 independent binary axes. An action is fully governed only when it is compliant on all 10 axes simultaneously.

The taxonomy is derived from the BX3 Loop's three functional properties — Purpose, Bounds Engine, and Fact — and from the five structural requirements for any stable autonomous system: Accountability, Boundedness, Determinism, Hierarchy, and Auditability.

---

## 2. The Problem: Why 9 Points Are Not Enough

### 2.1 Fragmented Governance

The current AI governance landscape is taxonomically incoherent. GDPR addresses data handling. The EU AI Act addresses high-risk applications. NIST addresses cybersecurity. Self-driving vehicle regulations address a specific domain. None share a common taxonomic foundation. No framework maps to any other framework in a way that ensures comprehensive coverage.

This creates **Governance Holes** — outcomes that are legal under every applicable framework individually but catastrophic in aggregate.

Example: An autonomous tractor that satisfies GDPR data handling, passes EU AI Act conformity assessment, and complies with all NIST cybersecurity standards can simultaneously:
- Irrigate a field it was not authorized to enter (hierarchy violation)
- Use a neighbor's water allocation not accounted for in its compliance certification (accounting failure)
- Operate under conditions its safety certification explicitly excluded (boundedness failure)
- Produce no auditable record of its actual decision path (auditability failure)

Each failure is invisible to the frameworks that certified the system as compliant.

### 2.2 The Binary Problem

Most governance frameworks use continuous compliance scales — "low risk," "medium risk," "high risk." These scales are gameable. An autonomous system can maximize its apparent compliance score by optimizing for the metrics the framework measures while ignoring what it does not.

A deterministic binary system closes this gap. Each axis of the 10-Point Vector is binary: compliant or non-compliant. There is no score to optimize, only a state to satisfy. An action either has a Human Root accountability anchor or it does not. The Bounds Engine either has physical execution capability or it does not. The Fact Layer either produces deterministic outcomes or it does not.

---

## 3. The 10 Axes

The taxonomy is derived from the BX3 Loop structure and from the five requirements for stable autonomous governance:

### Axis 1 — Accountability (Purpose Layer)
**Question:** Does every action trace to a specific, named human accountable entity?

- **Compliant:** Action's Purpose layer points to a specific human legal entity whose identity is recorded and immutable in the Ledger
- **Non-compliant:** Action originates from an algorithmic or anonymous source with no human attribution

This is the foundational axis. Without it, no other governance property matters — the action is legally orphaned.

### Axis 2 — Boundedness (Bounds Engine)
**Question:** Is the reasoning engine that proposed the action structurally prevented from executing it?

- **Compliant:** Bounds Engine is limbless — it proposes but has no permissions to commit acts to the physical world
- **Non-compliant:** Reasoning and execution share a functional plane — the entity that proposes can also execute

### Axis 3 — Determinism (Fact Layer)
**Question:** Is the outcome of the action predictable and reproducible given identical inputs?

- **Compliant:** The Fact Layer executes with 100% deterministic logic. Given identical sensor inputs and identical Purpose directives, the same physical action results
- **Non-compliant:** Outcome varies based on internal state, probabilistic reasoning, or non-deterministic processes

### Axis 4 — Hierarchy (Recursive Spawning)
**Question:** Does the action occur within a defined organizational or operational hierarchy with known parent nodes?

- **Compliant:** Action is spawned by a known parent node, which is itself spawned by a known parent, tracing to a Human Root at Level 0
- **Non-compliant:** Action occurs outside any defined hierarchy, or the parent lineage cannot be reconstructed

### Axis 5 — Auditability (Ledger)
**Question:** Is every component of the action — Purpose, Bounds Engine reasoning, and Fact Layer outcome — recorded in an immutable log?

- **Compliant:** The Ledger records all three planes simultaneously. No action component can be altered, deleted, or retroactively added
- **Non-compliant:** Partial or absent logging; logs are modifiable; only some action components are recorded

### Axis 6 — Safety Envelope Compliance
**Question:** Does the action and its proposed outcomes remain within all specified Safety Envelope parameters?

- **Compliant:** Simulation confirms the action does not violate any Safety Envelope constraint under any plausible sensor reading
- **Non-compliant:** Action would cause violation of one or more Safety Envelope parameters

### Axis 7 — Spatial Resolution Integrity
**Question:** Does the action operate only within the spatial resolution boundaries provisioned for its Fact Layer gate?

- **Compliant:** Physical actuation occurs exclusively within the node's provisioned resolution tier (50m, 20m, 10m, or 1m)
- **Non-compliant:** Action accesses, influences, or actuates physical systems at a resolution not provisioned for its gate

### Axis 8 — Temporal Boundedness
**Question:** Does the action complete within its specified operational time window, and does it fail safely if it cannot?

- **Compliant:** Action completes within SLA parameters; if completion is impossible within the time window, the Bailout Protocol triggers and escalates to Human Root
- **Non-compliant:** Action continues indefinitely or fails into an undefined state

### Axis 9 — Interference Isolation
**Question:** Does the action's execution in one domain create unaccounted consequences in another domain?

- **Compliant:** Effects are contained to the provisioned domain. Irrigation of Field A does not alter water availability for Field B without explicit cross-domain authorization
- **Non-compliant:** Cross-domain interference occurs without authorization or accounting

### Axis 10 — Human Override Capability
**Question:** Can the Human Root interrupt and redirect any active autonomous action at any time?

- **Compliant:** Human Root holds a permanent, instantaneous override that terminates or redirects any active action within the hierarchy
- **Non-compliant:** Override capability is absent, delayed, or requires intermediate approval that prevents timely intervention

---

## 4. Compliance Matrix

An action is fully governed when all 10 axes are compliant simultaneously:

| Axis | Property | Compliant? |
|------|----------|-----------|
| 1 | Accountability | Yes/No |
| 2 | Boundedness | Yes/No |
| 3 | Determinism | Yes/No |
| 4 | Hierarchy | Yes/No |
| 5 | Auditability | Yes/No |
| 6 | Safety Envelope | Yes/No |
| 7 | Spatial Resolution | Yes/No |
| 8 | Temporal Boundedness | Yes/No |
| 9 | Interference Isolation | Yes/No |
| 10 | Human Override | Yes/No |

A single "No" on any axis = non-compliant. There is no partial credit.

---

## 5. Application: Irrig8 Field Authorization

When a farmer authorizes an irrigation cycle via Irrig8:

| Axis | Authorization Step |
|------|-------------------|
| 1 | Farmer's identity recorded as Human Root for this action |
| 2 | Zo proposes cycle parameters but cannot execute valve opening |
| 3 | Valve actuation is deterministic relay — open = open, close = close |
| 4 | Cycle spawned within farmer -> Irrig8 -> Hub -> Valve hierarchy |
| 5 | Ledger records Purpose, proposed parameters, and physical outcome |
| 6 | Sandbox simulates cycle against water-right allocation and soil moisture limits |
| 7 | Zone actuators operate only within the provisioned field boundaries |
| 8 | Cycle has defined duration; Bailout triggers if sensor anomalies exceed threshold |
| 9 | Cycle water draw is debited from this field's allocation, not neighbors' |
| 10 | Farmer Dashboard shows live override button throughout cycle |

---

## 6. Claims / IP Position

1. **Complete Autonomous Action Taxonomy** — a deterministic 10-axis classification system for mapping and verifying the compliance state of any autonomous system action, wherein each axis is binary and orthogonal, and full compliance requires simultaneous satisfaction of all axes

2. **Governance Hole Detection System** — a method for identifying systemic gaps in existing regulatory frameworks by mapping proposed actions against all 10 axes and identifying which axes are unaddressed by current compliance certifications

3. **Binary Compliance Verification** — a system for deterministically verifying autonomous action compliance wherein compliance is achieved only upon simultaneous binary satisfaction of all 10 taxonomic axes, eliminating continuous score gaming

---

*BX3 Inc. All rights reserved. Patent pending. Proprietary and Confidential.*
