# BX3 ARCHITECTURE DECISION RECORDS (ADRs)
## Why We Chose What We Chose

**Purpose:** Document rationale so decisions survive personnel change

---

## ADR-001: Agentic as Private Core (Not Open Source)

**Status:** Accepted  
**Date:** April 5, 2026  
**Context:** Pressure to open-source for credibility/funding

**Decision:** Keep Agentic strictly internal/proprietary despite open-source trends.

**Rationale:**
- Competitive moat is the deterministic shell + Truth Gate + cascading execution
- Open-sourcing would reveal 10 years of architectural innovation
- Funding should come from outcomes (products using Agentic), not code visibility

**Consequences:**
- Must prove value through working products (Investor Protector, Irrig8)
- Higher burden of proof for investors
- Complete control over evolution

**Alternative Rejected:** Apache 2.0 license — would commoditize our only advantage

---

## ADR-002: Zero-Budget Bootstrap vs. Fund-Then-Build

**Status:** Accepted  
**Date:** April 5, 2026  
**Context:** $0 capital, could seek pre-seed

**Decision:** Build Investor Protector on $0 budget to prove deterministic execution before taking capital.

**Rationale:**
- Proves the thesis: deterministic systems execute regardless of funding
- Demonstrates capital efficiency (infinite runway)
- Creates live product to show investors vs. pitch deck

**Consequences:**
- Slower initial velocity
- Kali node deferred to v1.1
- Forces creativity (Ghost Cloud, Android field nodes)

**Alternative Rejected:** $500K pre-seed — would spend money on infrastructure instead of proving the system works with constraints

---

## ADR-003: 2B2F Council = Blue Ocean Strategy Team

**Status:** Accepted  
**Date:** April 5, 2026  
**Context:** Need for strategic guidance across all OpCos

**Decision:** Position 2B2F Council as advisory body for "Global Dominance" (GDP capture) rather than operational management.

**Rationale:**
- Operational execution is Agentic's job (Layer 4: Strategy Manager)
- Human strategic insight needed for markets Agentic can't yet reason about
- "Advise only" preserves Sovereign authority (brodiblanco as final decision)

**Consequences:**
- Council produces strategies, Agentic executes
- Clear separation: humans decide WHAT, system decides HOW
- Council membership is external advisors + selected L2 agents

**Alternative Rejected:** Council as operational body — would create command conflicts with Agentic's L2/L3 hierarchy

---

## ADR-004: Investor Protector Self-Referential Proof

**Status:** Accepted  
**Date:** April 6, 2026  
**Context:** Need first proof-of-work for investors

**Decision:** Investor Protector tracks its own construction as the first proof, not external data (Irrig8 pilots).

**Rationale:**
- Self-referential proof is stronger than external proof
- Available immediately (no sensor deployment, no pilot delays)
- Demonstrates "deterministic view of one's own construction"
- Meta-proof: the system is eating itself recursively

**Consequences:**
- Investors see live dashboard of system building itself
- Fastest path to credible demonstration
- Establishes pattern: all future projects track themselves

**Alternative Rejected:** Wait for Irrig8 2025 data — 6-month delay, external dependency

---

## ADR-005: Meaningful Metrics Over Vanity

**Status:** Accepted  
**Date:** April 6, 2026  
**Context:** Dev proposed commit count as velocity

**Decision:** Define meaningful progress by deliverables completed, not activity (commits, lines, PRs).

**Rationale:**
- Commit count is vanity — can be gamed, doesn't indicate value
- Investors care about SPEC → PLAN → CODE → VALIDATION, not activity
- Task completion velocity is actual throughput
- Milestone achievement is value delivery

**Consequences:**
- All metrics must map to investor understanding
- Artifacts tracked: specs, plans, working code, validated outputs
- Activity metrics used for debugging, not reporting

**Alternative Rejected:** GitHub commit velocity — would incentivize noise over signal

---

## ADR-006: Four-Tier Hierarchy (L0-L3)

**Status:** Accepted  
**Date:** April 4, 2026  
**Context:** Need organizational structure for unified workforce

**Decision:** Implement four-tier hierarchy: L0 Edge, L1 Aggregator, L2 Orchestrator, L3 Root/Sovereign.

**Rationale:**
- Separates thinking (L2/L3) from doing (L0/L1)
- Matches physical reality: field devices (L0), hubs (L1), cloud compute (L2), strategy (L3)
- Human-as-plugin can slot into any tier appropriately
- Recursive: each tier can contain sub-tenants with same structure

**Consequences:**
- Clear authority boundaries: L3 sets goals, L2 plans, L1 validates, L0 executes
- Exception handling: unresolved L0 → L1 → L2 → L3 → Human
- Enables massive scale with consistent governance

**Alternative Rejected:** Flat agent swarm — would lack authority, cause chaos at scale

---

*All ADRs require Sovereign approval for modification*