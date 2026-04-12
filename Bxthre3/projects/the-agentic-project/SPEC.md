# AgentOS Product Specification
## Built on the BX3 Universal Architecture — v1.0

| Field | Value |
|-------|-------|
| **Spec ID** | AGENTOS-BX3-2026-V1.0 |
| **Framework** | BX3 Universal Architecture v6.0 |
| **Date** | April 12, 2026 |
| **Author** | Jeremy Beebe, Bxthre3 Inc. |
| **Status** | Draft — Pending Engineering Review |
| **Supersedes** | All prior AgentOS specs |

---

## 1. Product Overview

**AgentOS** is an AI workforce orchestration platform built on the BX3 Universal Architecture. Where every other AI workforce tool is a collection of agents with no governance structure, AgentOS enforces the BX3 Loop at the architectural level — every agent, every task, every execution is a bounded BX3 Loop.

**Who it's for:** Businesses that need AI workforces they can trust with high-stakes operations. Regulated industries, critical infrastructure, financial operations, legal, healthcare.

**What it does:** Provides a complete workforce orchestration platform where every AI agent operates inside a Purpose → Bounds Engine → Fact Layer loop. No agent can propose and execute. No agent can act without a human accountability anchor. Every action is on the Ledger.

**Why it's different:** Every competitor in AI workforce orchestration has the same structural problem — their agents reason and act on the same plane. When something goes wrong, accountability disappears into the model. AgentOS is structurally different. The BX3 three-property separation is the runtime architecture, not a policy.

---

## 2. The BX3 Loop as Product Architecture

Every AgentOS agent is a BX3 Loop. This is not a policy — it is the runtime architecture.

```
┌─────────────────────────────────────────────────────────┐
│                    AGENTOS LOOP                         │
│                                                         │
│  PURPOSE ────► BOUNDS ENGINE ────► FACT LAYER         │
│   ("Why")         ("How")             ("Action")       │
│                                                         │
│  ┌─────────┐      ┌─────────────┐      ┌───────────┐  │
│  │ Human   │      │ Zo / AI     │      │ AgentOS   │  │
│  │ Anchor  │ ───► │ Reasoning   │ ───► │ Executor  │  │
│  │ (Owner) │      │ (Proposer)  │      │ (Hard     │  │
│  │         │      │             │      │  Gate)    │  │
│  └─────────┘      └─────────────┘      └───────────┘  │
│                                                         │
│  OWNER sets goals  →  AI proposes  →  Executor checks  │
│  and constraints       options           and acts      │
└─────────────────────────────────────────────────────────┘
```

### 2.1 Purpose Layer (Owner Interface)

**Actor:** Human owner or designated Human Accountability Anchor.

**What it does:**
- Sets strategic goals for the agent (what outcome is this agent responsible for)
- Defines authorization boundaries (what this agent is NOT permitted to do)
- Establishes escalation thresholds (when to throw to the Bailout Protocol)
- Reviews the Ledger for accountability

**In the product:** This is the **Owner Dashboard** — web + mobile. The human sees:
- What goals are set for each agent
- What the agent has proposed and executed (Ledger view)
- What exceptions have fired
- What authorization boundaries are active

**Key constraint:** The Purpose layer MUST remain Human-anchored. An agent cannot set its own Purpose. This is architecturally enforced in the Fact Layer.

### 2.2 Bounds Engine (Agent Reasoning)

**Actor:** Zo — the heuristic reasoning engine that powers AgentOS agents.

**What it does:**
- Performs all complex reasoning: task decomposition, planning, prioritization, risk assessment
- Models outcomes in the Sandbox before proposing
- Generates proposals — never executes
- Operates in a sandboxed cognitive environment with no physical execution permissions

**In the product:** This is the **Agent Reasoning Interface**. The human sees:
- What the agent is thinking (proposal explanations)
- What simulations were run in the Sandbox
- What confidence levels exist on each proposal
- What the bounds are (what it is NOT permitted to propose)

**Key constraint:** The Bounds Engine is LIMBLESS. It can propose state transitions and recommendations. It CANNOT directly commit acts to external systems, execute financial transactions, send messages, or modify records outside its sandbox without passing through the Fact Layer.

### 2.3 Fact Layer (AgentOS Executor)

**Actor:** The AgentOS execution engine — the deterministic gate between proposal and action.

**What it does:**
- Receives proposals from the Bounds Engine
- Validates each proposal against: (a) the owner's authorization boundaries, (b) hard-coded safety constraints, (c) regulatory rules
- Executes ONLY approved actions
- Logs every event to the Ledger with SHA-256 forensic sealing
- Triggers the Bailout Protocol if a condition falls outside provisioned bounds

**In the product:** This is the **Execution Firewall**. The human sees:
- What actions the agent has taken
- What was blocked and why
- The complete forensic audit trail

**Key constraint:** The Fact Layer is 100% deterministic. If a proposal violates a constraint, it is blocked. No override from the Bounds Engine is possible. The only override is from the Purpose Layer (human owner).

---

## 3. The Five Pillars as Product Features

### Pillar 1: Loop Isolation — Task Isolation Mode

**Feature name:** Task Isolation Mode

Every task an agent performs is a self-contained BX3 sub-loop. The agent's Bounds Engine works inside the task. The Fact Layer gates task outputs. The Purpose Layer provides task context.

**Product behavior:**
- Tasks cannot share state without going through the Fact Layer
- A compromised Bounds Engine in one task cannot bleed into another task's execution
- Task outputs are gated by the Fact Layer before being passed to the next task
- Agents that call other agents must route through the Fact Layer — no direct agent-to-agent execution

**User benefit:** Enterprise customers can prove to regulators that agent reasoning and agent execution are on separate planes. Audit the task, not the model.

---

### Pillar 2: Recursive Spawning — Child Agents

**Feature name:** Child Agent Spawning

A parent agent can birth a child agent by provisioning a Worksheet — a containerized, self-contained logic set tailored to a specific context.

**Product behavior:**
- Parent agent identifies a sub-task context
- Parent provisions a child agent Worksheet via OTA delivery
- Child agent has its own BX3 loop with hard-coded pointer to parent's Purpose
- Child agent operates independently during cloud disconnection (Local Survivability)
- Child agent's telemetry and execution logs route to parent's Ledger view

**Child Agent properties:**
- Inherits parent's Purpose boundaries (cannot expand beyond parent authorization)
- Has independent Bounds Engine and Fact Layer
- Can be revoked at any time by parent or human owner
- Cannot spawn its own children without explicit parent authorization

**User benefit:** A sales agent can spawn a research child agent for a specific account. The child agent operates within the parent's strategic context. Revoke when the deal closes.

---

### Pillar 3: Spatial Firewall — Tiered Data Access

**Feature name:** Data Tier Gates

AgentOS enforces data access through resolution tiers, analogous to the Spatial Firewall in irrigation. Different agent capability tiers get access to different data planes.

**Agent Capability Tiers:**

| Tier | Label | Data Access | Execution Permissions |
|------|-------|-------------|----------------------|
| Tier 1 | Observer | Aggregated summaries only | Read-only |
| Tier 2 | Analyst | Time-series data, reports | Generate insights, no external calls |
| Tier 3 | Operator | Full data plane, integrations | Execute within authorization boundaries |
| Tier 4 | Admin | All planes, all integrations | Execute with HITL approval for high-stakes |

**Product behavior:**
- Each agent is provisioned with a tier
- The Fact Layer checks tier before serving data or allowing execution
- A Tier 1 agent cannot retrieve raw customer PII even if the Bounds Engine proposes it
- Tier upgrade requires human owner approval via the Purpose Layer

**User benefit:** Enterprise RBAC is replaced by architecturally enforced data planes. A compromised agent at Tier 1 cannot exfiltrate data it was never provisioned to access.

---

### Pillar 4: Root Tunneling — Owner Override

**Feature name:** Owner Override (Root-Pipe)

The human owner can project their Purpose into any agent or task without disrupting the hierarchy. This is NOT a "login as agent" — it is a dedicated I/O pipe.

**Product behavior:**
- Owner selects any agent and enters Root-Pipe mode
- Owner's context becomes the ground truth for that agent's Bounds Engine
- All telemetry, proposals, and executions from that agent redirect to owner's dashboard
- Hierarchy remains intact — owner is tunneling, not taking over
- When Root-Pipe is closed, agent returns to normal operation with full context of the override

**Sandbox Gate (Pre-Execution Simulation):**
- Before any high-stakes execution, AgentOS runs a Sandbox simulation
- Owner reviews the projected outcome
- Owner must explicitly approve via HITL before the Fact Layer unlocks execution
- High-stakes threshold is configurable per owner (e.g., any external API call, any financial transaction, any data deletion)

**User benefit:** The CEO can project into any agent's context for a specific crisis without disrupting operations. See exactly what the agent sees, approve or block, then exit cleanly.

---

### Pillar 5: Bailout Protocol — Exception Escalation

**Feature name:** Exception Escalation

If an agent's Bounds Engine encounters a condition it cannot resolve, it fires a **Bailout Trigger** — an async signal that propagates up the agent hierarchy, bypassing all Machine actors, until it reaches a Human Accountability Anchor.

**Three Trigger Conditions:**
1. **Capability Boundary** — Task falls outside agent's provisioned capability
2. **Safety Envelope Violation** — Sandbox shows proposed action would violate safety constraints
3. **Authorization Gap** — Decision implications exceed agent's authorization authority

**Trigger Lifecycle (visible to owner):**
```
TRIGGER_FIRED → ESCALATING_TO_PARENT → PARENT_EVALUATING
    → [Parent can resolve] → RESOLVED → logged to Ledger
    → [Parent cannot resolve] → ESCALATING_TO_ROOT → HUMAN_REVIEWING
    → Human issues directive → DIRECTIVE_EXECUTING → CLOSED
```

**The Ledger (Forensic Audit):**
Every event is logged across three simultaneous planes:

| Plane | What it Records |
|-------|----------------|
| Purpose | What the owner authorized |
| Bounds Engine | What the AI proposed and why |
| Fact Layer | What actually executed and the physical outcome |

Logs are SHA-256 sealed per event. Cannot be altered retroactively.

**User benefit:** When regulators ask "what happened and who is responsible," the Ledger is the answer. Not a chat transcript — a forensic record with cryptographic integrity.

---

## 4. Product Architecture

### 4.1 AgentOS Stack

```
┌────────────────────────────────────────────────────────────┐
│  PURPOSE LAYER (Owner Dashboard / Web + Mobile App)       │
│  • Goal setting    • Authorization boundaries             │
│  • Ledger review   • Exception review & directives        │
└────────────────────────────┬───────────────────────────────┘
                             │  Proposals / Approvals / Directives
┌────────────────────────────▼───────────────────────────────┐
│  BOUNDS ENGINE (Zo Reasoning Layer)                       │
│  • Task decomposition    • Risk modeling                   │
│  • Sandbox simulation   • Proposal generation              │
│  • Learning from feedback (within immutable core)         │
└────────────────────────────┬───────────────────────────────┘
                             │  Approved actions / Blocked events
┌────────────────────────────▼───────────────────────────────┐
│  FACT LAYER (AgentOS Executor)                            │
│  • Authorization gate    • Constraint validation           │
│  • Execution engine     • SHA-256 Ledger sealing          │
│  • Bailout trigger      • Tiered data access              │
└────────────────────────────┬───────────────────────────────┘
                             │  External systems / Physical world
┌────────────────────────────▼───────────────────────────────┐
│  EXTERNAL SYSTEMS                                         │
│  • Email    • Calendar    • CRM (Linear, Notion, Airtable)│
│  • Database • APIs        • File systems                   │
│  • IoT devices (Irrig8)                                    │
└───────────────────────────────────────────────────────────┘
```

### 4.2 Agent Hierarchy

```
Human Owner (Root Accountability)
    │
    ├── Agent A (Tier 3: Operator)
    │       ├── Task Loop A1 (isolated)
    │       ├── Task Loop A2 (isolated)
    │       └── Child Agent A1 (Spawned) → Task Loop A1a
    │
    └── Agent B (Tier 2: Analyst)
            ├── Task Loop B1
            └── Task Loop B2
```

### 4.3 9-Plane Data Model (AgentOS)

| Plane | Name | AgentOS Data |
|-------|------|-------------|
| P1 | Physical Actuator | Device state, sensor reads, webhook triggers |
| P2 | Local Gateway | Task queue state, agent heartbeat |
| P3 | Communication | Email drafts, calendar events, messages |
| P4 | Contextual Intel | Customer records, account data, CRM state |
| P5 | Reasoning | Proposals, simulations, confidence scores |
| P6 | Sandbox | What-if models, scenario outputs |
| P7 | Authorization | Owner directives, capability tiers, boundaries |
| P8 | Financial Ledger | Costs, credits, ROI per agent/task |
| P9 | IP Core | Agent prompts, Worksheets, proprietary logic |

---

## 5. AgentOS vs. Competitors

| Dimension | AgentOS | CrewAI | AutoGen | n8n |
|-----------|---------|--------|---------|-----|
| **Governance model** | BX3 Loop (architectural) | Policy (optional) | Policy (optional) | Workflow (no governance) |
| **Reasoning ↔ Execution separation** | Hard architectural | Soft / configurable | Soft / configurable | None |
| **Human accountability anchor** | Required (Purpose Layer) | Optional | Optional | None |
| **Deterministic execution gate** | Fact Layer (enforced) | None | None | None |
| **Tiered data access** | Spatial Firewall (architectural) | RBAC (policy) | RBAC (policy) | RBAC (policy) |
| **Exception escalation** | Bailout Protocol (architectural) | Error handling | Error handling | Error handling |
| **Forensic audit trail** | SHA-256 Ledger (every event) | Chat logs | Chat logs | Run logs |
| **Child agent spawning** | Recursive Spawning (Worksheet) | None | None | Sub-workflows |
| **Owner override** | Root-Pipe (non-collapsing) | Impersonate | Impersonate | Manual takeover |
| **Licensable** | Yes — BX3 IP | Open source | Open source | Open source |

---

## 6. Feature Roadmap

### v1.0 (Current / Near-term)
- [ ] Agent roster with Purpose/Bounds/Fact layer per agent
- [ ] Owner Dashboard with goal-setting and boundary configuration
- [ ] Task Isolation Mode (Pillar 1)
- [ ] Tiered data access (Pillar 3 — Tier 1-2 initially)
- [ ] Basic Ledger view (Pillar 5)
- [ ] Bailout Trigger alerts (Pillar 5)

### v1.5 (Mid-term)
- [ ] Child Agent Spawning (Pillar 2)
- [ ] Sandbox Gate simulation previews (Pillar 4)
- [ ] Owner Root-Pipe override (Pillar 4)
- [ ] Full 9-Plane data model
- [ ] Tier 3-4 data access

### v2.0 (Full BX3)
- [ ] SHA-256 forensic sealing on Ledger entries
- [ ] Full Bailout Protocol with escalation chain
- [ ] BX3 Interchangeability Framework (Human ↔ Machine role swap)
- [ ] Third-party licensing of BX3 AgentOS

---

## 7. Glossary (AgentOS-Specific)

| Term | Definition |
|------|-----------|
| **AgentOS Loop** | A self-contained BX3 Loop inside the AgentOS product — Purpose + Bounds Engine + Fact Layer for each agent |
| **Owner** | Human Accountability Anchor — the human responsible for a given agent's Purpose layer |
| **Task Loop** | A self-contained BX3 sub-loop for a specific task, isolated from other tasks per Pillar 1 |
| **Child Agent** | An agent spawned by a parent agent via Recursive Spawning, with its own BX3 Loop and Worksheet |
| **Worksheet** | Containerized logic set delivered to a Child Agent, containing Bounds Engine + Fact Layer configuration |
| **Tier Gate** | The Fact Layer enforcement point that checks agent capability tier before serving data or allowing execution |
| **Root-Pipe** | The Owner Override mechanism — human projects into agent context without collapsing hierarchy |
| **Bailout Trigger** | Exception event fired by Bounds Engine when a condition exceeds provisioned capability, safety envelope, or authorization |
| **Ledger** | SHA-256 sealed forensic log — records Purpose authorization, Bounds Engine proposal, and Fact Layer execution for every event |

---

## 8. Reference

This document is the product implementation of: `file 'Bxthre3/VAULT/BX3-UNIVERSAL-SPEC.md'` (BX3-GEN-2026-SPEC-V6.0)

*BX3 Inc. All rights reserved. Patent pending. Proprietary and Confidential.*