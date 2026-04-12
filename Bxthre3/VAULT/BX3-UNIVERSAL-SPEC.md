# BX3 Universal Architecture Specification
## Master Technical Reference — v6.0

| Field | Value |
|-------|-------|
| **Spec ID** | BX3-GEN-2026-SPEC-V6.0 |
| **Supersedes** | BX3-GEN-2026-V5.0 |
| **Date** | April 12, 2026 |
| **Author** | Jeremy Beebe, Bxthre3 Inc. |
| **Status** | Final — Tier-1 Infrastructure Specification |
| **Audience** | Engineering teams, patent reviewers, strategic partners |

---

## 1. Overview

The BX3 Universal Architecture is a functional, actor-agnostic framework for governing high-stakes recursive autonomous systems. It defines the minimum required properties — **Purpose**, **Bounds Engine**, and **Fact Layer** — that any autonomous system must satisfy to remain stable, accountable, and deterministic regardless of which actor (Human or Machine) occupies each layer.

The architecture is technology-agnostic. It applies to: precision irrigation, autonomous vehicles, industrial robotics, clinical AI, and defense systems.

---

## 2. The BX3 Loop

The fundamental unit of the architecture. Every node in the system — from Human Root to field sensor — is a self-contained BX3 Loop.

```
┌─────────────────────────────────────────────────────┐
│                    BX3 LOOP                         │
│                                                     │
│  PURPOSE ────► BOUNDS ENGINE ────► FACT LAYER    │
│   ("Why")         ("How")             ("Action")    │
│     ▲                ▲                   ▲          │
│  Human          Limbless            Deterministic   │
│  Anchor         Proposer            Physical Brake  │
│                                                     │
│  [Interchangeability Framework:                     │
│   Human ↔ Machine actors swappable                 │
│   without loss of deterministic integrity]          │
└─────────────────────────────────────────────────────┘
```

### Layer Definitions

| Layer | Name | Actor | Role | Key Property |
|-------|------|-------|------|-------------|
| L1 | **Purpose** | Human Accountability Anchor | Sets SLOs, strategic goals, authorization boundaries | Must remain Human-anchored |
| L2 | **Bounds Engine** | Zo (Heuristic Engine) | Computes: Bayesian priors, Kriging trends, NDVI analysis; **proposes** only | Limbless — no physical execution permissions |
| L3 | **Fact Layer** | Oracle/Map Manager + Physical Substrate | Physical firewall. Executes only commands that satisfy pre-defined safety, regulatory, and physical constraints | 100% deterministic. Hard-blocks any violation |

### Interchangeability Framework

Purpose, Bounds Engine, and Fact are **functional properties**, not roles. Human and Machine actors can be swapped across these layers without loss of deterministic integrity — provided the functional property requirements are met. This is the basis for scalable human-machine teaming.

**Rule:** The Purpose layer must always be Human-anchored. This is non-negotiable and enforced at the architecture level.

---

## 3. The Five Pillars

### Pillar 1: Loop Isolation

**What it prevents:** Logic Collisions — reasoning and execution occupying the same functional plane, enabling un-vetted autonomous actions.

**Mechanism:** Purpose, Bounds Engine, and Fact Layer are strictly isolated into discrete planes. Each BX3 Loop is self-contained. Collisions are architecturally impossible because the Bounds Engine never shares a plane with the Fact Layer.

**Why it matters for patents:** Any system where a reasoning engine (LLM, ML model, rule engine) directly executes physical actions without a Fact Layer intermediary is structurally vulnerable to Logic Collision. Loop Isolation is the architectural remedy.

---

### Pillar 2: Recursive Spawning

**What it prevents:** Logic Rigidity — static firmware edge devices that cannot adapt to local conditions without a constant cloud heartbeat.

**Mechanism:** A Parent Node births a Child Loop by provisioning a **Worksheet** — a containerized, self-contained logic set delivered Over-the-Air (OTA) to the target node.

```
Human Root (Level 0)
    │ Spawns via Recursive Spawning (Worksheet OTA)
    ▼
Local BX3 Loop (Irrig8 Hub — Level N)
    │ Telemetry Chain
    ▼
Passive Sensors (Dumb Transmitters — Level N+1)
```

**Worksheet Properties:**
- Contains complete Bounds Engine + Fact Layer logic for the target environment
- Hard-coded pointer to Parent's Purpose layer — prevents autonomous drift
- Executable locally during cloud disconnection (**Local Survivability**)
- Updatable via subsequent Recursive Spawning events without replacing hardware

**Physical Telemetry Chain:**
1. **Passive Telemetry Nodes (Sensors):** High-frequency raw data, no local processing
2. **Encrypted Aggregators:** Package, compress, encrypt at source
3. **Local Execution Hubs:** Apply Worksheet logic to sensor data, transform signals into auditable actuations

**Why it matters for patents:** Any autonomous edge deployment where the edge device relies on cloud connectivity for core logic is vulnerable to Logic Rigidity. Recursive Spawning eliminates this dependency by making every edge node a self-contained BX3 Loop.

---

### Pillar 3: Spatial Firewall

**What it prevents:** Soft software permissions that can be bypassed, and the "Body" (Oracle) not physically protecting the "Mind" (Zo)'s IP.

**Mechanism:** Spatial resolution is treated as a **physical, hard-coded constraint** of the Fact Layer — not a software permission.

**Spatial Resolution Tiers:**

| Tier | Label | Resolution | Access Rule |
|------|-------|-----------|-------------|
| Tier 1 | Free | 50m | Public — no gate required |
| Tier 2 | Basic | 20m | Gate checks node provisioning |
| Tier 3 | Pro | 10m | Gate checks node provisioning + authorization |
| Tier 4 | Enterprise | 1m | Gate checks node provisioning + authorization + contract |

**Deterministic Funnel:** When a node requests resolution beyond its provisioned tier:
1. Fact Layer intercepts at database level
2. System triggers automated commercial upgrade workflow
3. Growth is an inherent system rule — not a sales task

**Why it matters for patents:** The distinction between software-permission-gated data access and physically-gated data access is the core of the IP protection model. Any competitor that gates access with code (software permissions) can be bypassed. Any competitor that gates access physically at the data layer cannot — regardless of how the requesting client is compromised.

---

### Pillar 4: Root Tunneling

**What it prevents:** Abstraction Leakage — organizational hierarchy collapse when a human logs into a sub-node, losing global context and breaking the recursive audit trail.

**Mechanism:** The **Root-Pipe Protocol** enables the Human Root to project authority into any node without collapsing the hierarchy.

**Root-Pipe Protocol Properties:**
- Hierarchy remains **non-collapsing** — node structure is tunneled, not flattened
- All telemetry, task queues, and Worksheet logs from target node redirect to Root Dashboard
- Human's Purpose becomes ground truth for that node's Bounds Engine
- Not a "login" — a dedicated I/O Pipe for authority projection

**Sandbox Gate (Pre-Deployment Validation):**
1. Zo models projected outcome in digital twin (e.g., simulate water-release cycle across 160-acre pivot)
2. Human reviews simulation
3. Human-in-the-Loop (HITL) approval unlocks Fact Layer for physical actuators

**Why it matters for patents:** The combination of non-collapsing hierarchy + sandbox simulation + HITL approval creates a human-machine governance interface that is structurally different from conventional "role-based access control." It is a Purpose-projection system, not a permission system.

---

### Pillar 5: Bailout Protocol

**What it prevents:** The "Black Box" problem — autonomous actions orphaned from human responsibility, creating legal and operational risk.

**Mechanism:** If a sub-node encounters a condition it cannot resolve, it propagates an exception asynchronously up the recursive tree, **bypassing all Machine actors**, until anchored by a Human Accountability Anchor.

**Three Trigger Conditions:**
1. **Capability Boundary** — Condition falls outside provisioned operational range
2. **Safety Envelope Violation (Predicted)** — Sandbox simulation shows proposed action would violate Safety Envelope
3. **Accountability Boundary** — Decision implications exceed node's legal/ethical authority

**Trigger Lifecycle:**
```
TRIGGER_FIRED → DELIVERING_TO_PARENT → PARENT_EVALUATING
    → [If parent can resolve] RESOLVED_LOCALLY → CLOSED
    → [If parent cannot resolve] ESCALATING_TO_PARENT → ...
    → [If Human Root reached] HUMAN_ROOT_REVIEWING → DIRECTIVE_ISSUED → CLOSED
```

**The Ledger:** Every event logged across three simultaneous planes:

| Plane | Records |
|-------|---------|
| Purpose | What was authorized |
| Bounds Engine | What Zo proposed |
| Fact Layer | What Oracle recorded as physical outcome |

**Why it matters for patents:** The combination of machine-actor-excluded propagation + mandatory human accountability anchoring + cryptographic sealing creates a legally defensible audit trail that no existing autonomous system provides.

---

## 4. 9-Plane Data Action Protocol (DAP)

Every BX3 Loop operates across 9 discrete planes. Each plane is independently logged, independently updatable, and independently auditable.

| Plane | Name | Data Type | Access Control |
|-------|------|-----------|----------------|
| P1 | Physical Actuator | Sensor raw reads, actuator states | Fact Layer only |
| P2 | Local Gateway | Zone aggregated data, edge events | Aggregator + Hub |
| P3 | Cloud Telemetry | Time-series, NDVI, weather | Zo + authorized nodes |
| P4 | Spatial Intelligence | Maps, resolution tiers, ZAI | Tier-gated per Spatial Firewall |
| P5 | Decision Engine | Bounds Engine proposals, sim results | Bounds Engine + Sandbox |
| P6 | Projection Sandbox | What-if simulations, scenario models | HITL-gated |
| P7 | Authorization Ledger | Purpose layer directives, trigger events | Human Root + Compliance |
| P8 | Financial Ledger | Water rights, input costs, yield economics | Human Root + Finance |
| P9 | IP Core | Workspaces, LLMs, Algorithms, Worksheets | Tier 4 / Enterprise only |

**Plane Isolation Rule:** Data on Plane N cannot be used to infer or reconstruct data on Plane N+1 or higher without going through the authorized cross-plane protocol. This is architecturally enforced by the Spatial Firewall.

---

## 5. Key Architectural Formulas

### 5.1 Moisture Stratification Index (MSI)
```
MSI = (VWC_surface / VWC_24in) × (root_density_weighted_average)
MSI > 1.4 = surface saturation relative to root zone → over-irrigation risk
MSI < 0.6 = root zone dry relative to surface → stratification drought risk
```

### 5.2 Root Zone Availability Index (RZAI)
```
RZAI = (water_reaching_root_zone) / (water_applied)
RZAI = 1.0 = perfect efficiency
RZAI < 0.6 = significant drainage or runoff loss
```

### 5.3 Resolution Pop Gate Check
```
IF requested_resolution > node.provisioned_resolution:
    FACT_LAYER.intercept()
    TRIGGER_DETERMINISTIC_COMMERCIAL_FUNNEL(node, requested_resolution)
    RETURN upgrade_prompt
ELSE:
    FACT_LAYER.serve(requested_resolution)
    RETURN data
```

---

## 6. Product Alignment

| BX3 Component | Maps To | Notes |
|---------------|---------|-------|
| Physical Substrate / Fact Layer | **Irrig8** | Deterministic farming OS |
| Bounds Engine | **Zo** | Bounded reasoning, simulation |
| Librarian / Fact Layer (data) | **Oracle / Map Manager** | Spatial data and resolution gating |
| Root Dashboard / Sandbox Gate | **Zo Space** | Operator interface |
| Worksheet Container | **AgentOS** | Containerized edge intelligence |

---

## 7. Definitive Glossary

| Term | Definition |
|------|-----------|
| **BX3 Loop** | Self-contained governance unit: Purpose + Bounds Engine + Fact Layer |
| **Purpose** | Layer 1 — Human accountability anchor, sets strategic goals and authorization boundaries |
| **Bounds Engine** | Layer 2 — Heuristic engine that proposes state transitions; limbless (no execution permissions) |
| **Fact Layer** | Layer 3 — Physical firewall that executes only commands satisfying hard-coded safety and regulatory constraints |
| **Interchangeability Framework** | Property enabling Human/Machine actors to swap roles without loss of deterministic integrity |
| **Logic Collision** | Failure mode where reasoning and execution occupy the same functional plane |
| **Loop Isolation** | Architectural separation of Purpose, Bounds Engine, and Fact Layer into discrete planes |
| **Worksheet** | Containerized BX3 Child Loop — encapsulated logic set generated by Bounds Engine and delivered OTA to a Hub |
| **Recursive Spawning** | Parent node births a Child Loop by provisioning a Worksheet via OTA delivery |
| **Local Survivability** | Hub's ability to execute last-known-good Worksheet during cloud disconnection |
| **Spatial Firewall** | Physical, hard-coded resolution gating at the Fact Layer — not software permissions |
| **Resolution Pop** | Discrete spatial resolution tier served by the Map Manager; access beyond provisioned tier triggers commercial funnel |
| **Deterministic Funnel** | Automated commercial upgrade triggered when a node requests resolution beyond its provisioned tier |
| **Root Tunneling** | Root-Pipe Protocol enabling Human Root to project authority into any node without collapsing hierarchy |
| **Sandbox Gate** | Pre-deployment validation sandbox — Zo simulates outcome before physical actuators unlock |
| **Bailout Protocol** | Exception escalation path bypassing all Machine actors and routing to Human Root |
| **Cascading Trigger** | Self-propogating exception event generated when a node encounters an unresolvable condition |
| **Confidence Score** | 0.0–1.0 score on every Trigger Package indicating node's certainty that human escalation is required |
| **Machine Actor Exclusion** | Property of exception propagation chain that excludes Machine Accountability Anchors from resolution path |
| **Ledger** | Cryptographically sealed forensic log across Purpose / Bounds Engine / Fact planes for every event |
| **Human Root Mandate** | Non-negotiable architecture rule: Purpose layer must always remain Human-anchored |
| **9-Plane DAP** | Complete operational state architecture — 9 independent planes, each independently loggable and auditable |
| **Z-Axis Index (ZAI)** | Continuously updated depth-stratified data structure representing vertical resource state of a field zone |
| **MSI** | Moisture Stratification Index — ratio of surface to deep soil moisture weighted by root density |
| **RZAI** | Root Zone Availability Index — fraction of applied water that reaches the active root zone |

---

*BX3 Inc. All rights reserved. Patent pending. Proprietary and Confidential.*
*Document ID: BX3-GEN-2026-SPEC-V6.0 | April 12, 2026*
