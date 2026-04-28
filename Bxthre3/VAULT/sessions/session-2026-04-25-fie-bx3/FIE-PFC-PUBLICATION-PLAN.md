# FIE Publication Plan — Locked v1
**Project:** Fractal Intent Engine (FIE) as Prefrontal Cortex for LLMs
**Canonical Path:** `Bxthre3/VAULT/drafts/FIE-PFC-PUBLICATION-PLAN.md`
**Status:** Draft — awaiting approval
**Date:** 2026-04-24
**Owner:** brodiblanco

---

## 0. What We Know About FIE (from this conversation only)

FIE was shared by brodiblanco as a prototype specification with these components:

### Architecture (L0 / L1 / L2)
- **L0 Cortex** — holds persistent "Vibe" and "Hero Moment" across recursive loops
- **L1 Director** — translates abstract intent into technical constraints and directives
- **L2 Worker** — executes atomic tasks, generates raw data linked via Semantic Hashes

### Three Novel Mechanisms
1. **Intent Cascade** — top-down goal inheritance (L0→L1→L2)
2. **Semantic Hash** — H(Output + Trace + Constraints + Entropy) for cryptographic integrity
3. **Dynamic Aperture** — confidence-triggered recursive audit; aperture expands when confidence < threshold

### Condensation
- Lossy reduction of execution data into strategic narrative
- Preserves: Hero Moment, constraint violations, entropy estimates
- Discards: redundant reasoning traces, intermediate calculations

### FIE Sim Tool (HTML prototype)
- Visual 3-step simulation: Intent → Directive → Verified
- Aperture slider (RELAXED / STRICT)
- Aperture expansion overlay triggered at >75 aperture sensitivity
- Live audit mode when aperture expands

### [VERIFY] Unconfirmed Prior Work
- Brodiblanco may have prior FIE work in earlier sessions not visible to current agent
- Prior to proceeding, must inventory: workspace files, Supermemory, VAULT drafts for any FIE content from prior sessions

---

## 1. Core Thesis (as stated by brodiblanco)

> "FIE as the prefrontal cortex for LLMs"
> "Agentic Velocity = (Time for human to complete task) ÷ (Time for AI agent to complete same task)"
> "We need to assess FIE as Prefrontal Cortex in LLMs"

**Central Claim:** FIE provides the executive function that LLMs lack — persistent goal state, self-verification, bounded reasoning — making AI agents fast AND accountable simultaneously.

---

## 2. Publication: "FIE: A Prefrontal Cortex Architecture for LLMs"

### 2.1 Positioning
- **Primary audience:** AI researchers, ML engineers, enterprise AI architects
- **Novelty claim:** First paper to unify LLM agent memory, self-correction, and cryptographic verification into one coherent architecture with formal mechanisms
- **[VERIFY] Research gap:** Need to confirm what existing work covers vs what FIE uniquely contributes. Cannot claim "actively being written about" without citations.
- **Companion references:** BX3 Framework (existing published paper), AgentOS (existing codebase)

### 2.2 Paper Specifications
| Field | Value | Source |
|---|---|---|
| Working Title | FIE: A Prefrontal Cortex Architecture for Large Language Models | brodiblanco |
| Target | arXiv cs.AI | — |
| Pages | 25–35 | — |
| Primary Metric | Agentic Velocity | brodiblanco definition: Time_human ÷ Time_agent |
| Key Contribution | Semantic Hash, Dynamic Aperture, Condensation as formal mechanisms | FIE spec |
| Foundation | BX3 Framework (Purpose/Bounds/Fact layers map to L0/L1/L2) | BX3 Framework paper |

### 2.3 Paper Structure
```
1. Introduction (1 page)
   - Problem: LLMs are stateless, ungrounded, unverified
   - Solution: FIE as executive overlay for LLM inference
   - Contributions: three formal mechanisms (list)

2. Background (3 pages)
   - BX3 Framework summary (Purpose/Bounds/Fact → L0/L1/L2)
   - [VERIFY] Related work: must inventory existing papers before writing this section
     * LLM agents with memory — paper X, Y
     * Chain-of-thought verification — paper X, Y
     * Constitutional AI — paper X, Y
     * System 2 thinking — paper X, Y
   - Gap: no unified architecture with cryptographic intent binding

3. FIE Architecture (5 pages)
   - L0 Cortex: Hero Moment and Vibe persistence
   - L1 Director: constraint-filtered context generation
   - L2 Worker: Semantic Hash-verified output
   - Intent Cascade state machine (formal)
   - FIE-as-PFC wrapper diagram

4. Semantic Hash Protocol (5 pages)
   - Definition: H(Output + Trace + Constraints + Entropy)
   - [TODO] Specify: SHA-256 (recommended), input serialization format
   - Chain construction: sequential linking
   - [TODO] Define: entropy measurement methodology
   - [TODO] Define: Constraint Matrix JSON schema
   - Verification algorithm

5. Dynamic Aperture (4 pages)
   - [TODO] Define: confidence score formula (0.0–1.0)
   - Aperture expansion algorithm: L0→L2 zoom behavior
   - [TODO] Define: threshold selection (current UI uses >75)
   - Integration with Training Wheels Protocol (AgentOS existing work)

6. Condensation Algorithm (3 pages)
   - Retention criteria: Hero Moment, violations, entropy estimates
   - [TODO] Define: compression ratio (conservative: 50% vs aggressive: 90%)
   - [TODO] Define: what is discarded vs preserved
   - Correctness properties

7. Agentic Velocity: The Measurement Framework (3 pages)
   - Agentic Velocity definition and formula
   - [TODO] Design benchmark methodology: how to measure Time_human vs Time_agent
   - How FIE mechanisms improve Agentic Velocity
   - [TODO] Identify: target baseline tasks for benchmarking

8. Implementation: AgentOS Case Study (2 pages)
   - [TODO] Document: current AgentOS architecture
   - [TODO] Document: FIE integration plan (Semantic Hash in Dolt, etc)
   - [TODO] Report: any existing Agentic Velocity data if available

9. Limitations (2 pages)
   - [TODO] Identify: known limitations, open questions

10. Conclusion (1 page)
```

### 2.4 TODO Summary (What Must Be Defined Before Publication)
| # | Item | Status |
|---|---|---|
| T1 | Intent Cascade state machine (formal definition) | Must define |
| T2 | Semantic Hash function + encoding spec | Must define |
| T3 | Entropy measurement methodology | Must define |
| T4 | Constraint Matrix JSON schema | Must define |
| T5 | Confidence score formula | Must define |
| T6 | Aperture expansion algorithm | Must define |
| T7 | Condensation retention criteria + compression ratio | Must define |
| T8 | Agentic Velocity benchmark methodology | Must design |
| T9 | Related work inventory (prior papers on LLM agent memory, CoT, etc) | Must research |
| T10 | Hero Moment persistence model | Must define |

---

## 3. AgentOS FIE Integration Plan

### 3.1 Current AgentOS State
- AgentOS has: HITL queue, Training Wheels Protocol, Dolt deterministic logger
- AgentOS lacks: Semantic Hash, confidence scoring, condensation, intent persistence

### 3.2 FIE Integration for AgentOS
**File:** `Bxthre3/projects/agentic/docs/FIE-INTEGRATION.md`

**4-Phase Implementation (honest timeline: 4-6 weeks):**

| Phase | Deliverable | Timeline | Status |
|---|---|---|---|
| 1 | Dolt schema: add semantic_hash, entropy_bound, aperture_score, intent_id columns | 1 week | Not started |
| 2 | Semantic Hash generation in L2→L1 reporting path + HITL confidence scoring | 1.5 weeks | Not started |
| 3 | Dynamic Aperture: aperture expansion trigger + L0→L2 trace pull | 1.5 weeks | Not started |
| 4 | Condensation module + Intent Store (Hero Moment persistence) | 2 weeks | Not started |

### 3.3 Integration Changes
```
agentic/events/schema.sql (migration):
  - Add: semantic_hash TEXT
  - Add: entropy_bound REAL
  - Add: aperture_score REAL DEFAULT 1.0
  - Add: intent_id TEXT

agentic/execution/condensation.py (new):
  - Input: raw L2 outputs
  - Output: condensed L1 summary
  - Retention: Hero Moment, violations, entropy
  - Discard: redundant traces

agentic/execution/intent_store.py (new):
  - Stores active Hero Moment per session
  - Binds to Semantic Hash chain
  - Persists to Dolt (tamper-evident)
```

---

## 4. FIE-as-PFC: LLM Applications

### 4.1 Three Market Applications
| Application | How FIE-as-PFC Helps | Priority |
|---|---|---|
| **Irrig8** | Irrigation decisions need explainable, auditable reasoning — FIE gives LLM "why I chose this schedule" chain | P1 |
| **Agentic** | Multi-agent coordination needs each agent to hold intent across complex workflows | P1 |
| **SymphonyOS** (middleware) | License FIE-as-PFC as drop-in wrapper for any LLM — fast + accountable | P2 |

### 4.2 FIE-as-PFC: Open Questions (must answer before publication)
| Question | Why It Matters |
|---|---|
| How does L0 persist Hero Moment across stateless LLM API calls? | LLM API is stateless — L0 must be external (Redis or similar) |
| What does "constraint-filtered context" look like in practice? | How L1 translates L0 intent into improved LLM prompt |
| How do you hash a reasoning trace? | LLM outputs text — what exactly goes into the Semantic Hash? |
| Can Dynamic Aperture trigger LLM re-generation? | If aperture expands, does system ask LLM "think again"? |
| What are the benchmark tasks for Agentic Velocity? | Must have baseline tasks to prove FIE improves velocity |

---

## 5. Decisions Required Before Execution

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | **FIE publication branding** | (a) "FIE: A Prefrontal Cortex Architecture for LLMs" (b) "BX3-FIE" (c) other | **A — primary hook is FIE-as-PFC, not BX3 extension** |
| D2 | **Semantic Hash function** | SHA-256 vs SHA-3 vs BLAKE3 | **SHA-256** — FIPS-certified, familiar to reviewers |
| D3 | **Condensation aggressiveness** | Conservative (50% compression) vs Aggressive (90%) | **Conservative** — preserves audit trail for publication |
| D4 | **Agentic Velocity benchmark** | Design benchmark methodology before or during paper writing | **Before** — must have measurement framework defined before claiming velocity improvements |
| D5 | **Prior FIE work inventory** | Check all workspace files, Supermemory, prior session artifacts | **Required** — brodiblanco may have FIE content from prior sessions not visible to current agent |

---

## 6. Revised Publication Portfolio

### Current State (2026-04-24)
| Paper | Target | Status |
|---|---|---|
| BX3 Framework (v1.0) | arXiv cs.AI | Ready |
| Truth Gate | arXiv cs.AI | Ready |
| Sandbox Execution Model | arXiv cs.AI | Ready |
| Bailout Protocol | arXiv cs.AI | Draft |
| **FIE: A Prefrontal Cortex Architecture for LLMs** | arXiv cs.AI | **New — this plan** |

### Full 17+1 Portfolio
| # | Title | Target | Status |
|---|---|---|---|
| 01 | BX3 Framework | arXiv cs.AI | Ready |
| 02 | Truth Gate | arXiv cs.AI | Ready |
| 03 | Sandbox Execution Model | arXiv cs.AI | Ready |
| 04 | Bailout Protocol | arXiv cs.AI | Draft |
| 05 | Forensic Ledger | arXiv cs.SE | Draft |
| 06 | Reality Vector | arXiv cs.ET | Draft |
| 07 | Recursive Spawning | arXiv cs.MA | Draft |
| 08 | Self-Modification Engine | arXiv cs.AI | New |
| 09 | 10-Point Vector | arXiv cs.AI | New |
| 10 | Z-Axis Indexing | arXiv cs.ET | New |
| 11 | 4-Tier EAN | arXiv cs.CR | New |
| 12 | 9-Plane DAP | arXiv cs.SE | New |
| 13 | SHA-256 Forensic Sealing | arXiv cs.CR | New |
| 14 | Cascading Triggers | arXiv cs.MA | New |
| 15 | Role Definition Language | Zenodo | New |
| 16 | Enterprise Orchestration | arXiv cs.SE | New |
| 17 | AgentOS | arXiv cs.SE | New |
| **18** | **FIE: A Prefrontal Cortex Architecture for LLMs** | **arXiv cs.AI** | **New — this plan** |

---

## 7. Honest Timeline

| Phase | Deliverable | Honest Duration |
|---|---|---|
| P0 | Prior FIE work inventory + confirmation | 1-2 days |
| P1 | Define all 10 TODOs in FIE spec | 2-3 weeks |
| P2 | AgentOS FIE Integration Spec | 1 week |
| P3 | AgentOS FIE Phase 1-4 implementation | 4-6 weeks |
| P4 | FIE paper v1 draft | 3-4 weeks |
| P5 | Paper review, citations, figures | 1-2 weeks |
| P6 | Submit to arXiv | Week 10-12 |

**Total: ~12 weeks from approval to arXiv submission** (not 7 weeks as originally stated)

---

## 8. Immediate Next Steps (Upon Approval)

| # | Action | Deliverable |
|---|---|---|
| 1 | **Inventory all prior FIE work** — check workspace, Supermemory, any files from prior sessions | `Bxthre3/VAULT/drafts/FIE-PRIOR-WORK-INVENTORY.md` |
| 2 | **Define FIE mechanics** — work through all 10 TODOs with brodiblanco | `Bxthre3/VAULT/drafts/FIE-MECHANICS-DEFINITIONS.md` |
| 3 | **Design Agentic Velocity benchmark** — define methodology for measuring | `Bxthre3/VAULT/drafts/AGENTIC-VELOCITY-BENCHMARK.md` |
| 4 | **Write AgentOS FIE Integration Spec** | `Bxthre3/projects/agentic/docs/FIE-INTEGRATION.md` |
| 5 | **Begin FIE paper draft** — Sections 1-3 after mechanics defined | `Bxthre3/VAULT/papers/paper18-fie.tex` |

---

## 9. What We Cannot Claim Without Verification

The following statements are **NOT yet supported** and must be verified or removed:

| Claim | Status |
|---|---|
| "FIE is actively being written about in research" | ❌ Cannot cite — need research |
| "Agentic Velocity formula is from prior work" | ❌ Cannot cite — was inference |
| "Semantic Hash improves LLM verification over existing work" | ❌ Need comparison to related work |
| "FIE-as-PFC outperforms bare LLM on X benchmark" | ❌ No data yet |
| "BLAKE3 is faster than SHA-256 for this use case" | ❌ Not verified |

---

*Plan corrected and locked. Awaiting approval to proceed with P0-P1.*