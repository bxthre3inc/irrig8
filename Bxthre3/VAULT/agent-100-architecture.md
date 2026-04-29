# Agent-100 Architecture
**Version:** 1.0.0 | **Date:** 2026-04-24 | **Classification:** BX3 Internal — Founder Eyes Only

---

## 1. Executive Summary

100 simultaneous agents operating under a 7-layer hierarchical model. BX3 (CEO/Founder) sits at Layer 1, commanding a lean but complete organizational structure through Layer 6. Layer 7 (Temp Child Agents) are ephemeral compute bursts spawned by individual agents for task-specific execution.

**Target Profile:** Early-stage venture operations, proof-of-scale for Irrig8 LLC and VPC LLC launch, Agentic Platform hardening.

---

## 2. Seven-Layer Hierarchy

### Layer 1 — BX3 (CEO / Founder)
| Attribute | Value |
|---|---|
| Span of Control | 10 (C-suite executives, Layer 2) |
| Agent Count | 1 |
| Compute Allocation | 4 vCPU / 16 GB RAM (reserved, leadership tier) |
| Responsibilities | Vision, IP ownership, cap table, final authority on all resource allocation, investor relations, key partnership sign-offs |
| Reports To | Board (if seated) / Shareholders |

---

### Layer 2 — C-Suite Executives (Direct Reports to BX3)
One executive per department. Each is an autonomous agent with P&L awareness and department-level authority.

| # | Department | Title | Span of Control (Layer 3) | Compute Allocation |
|---|---|---|---|---|
| 1 | Irrig8 LLC | VP of Irrig8 | 1 | 2 vCPU / 8 GB |
| 2 | VPC LLC | VP of VPC | 1 | 2 vCPU / 8 GB |
| 3 | Starting 5 | Head of Starting 5 | 1 | 2 vCPU / 8 GB |
| 4 | Agentic Platform | CTO / Head of Agentic | 1 | 2 vCPU / 8 GB |
| 5 | Venture Studio | VP Venture Studio | 1 | 2 vCPU / 8 GB |
| 6 | Shared Services | Head of Shared Services | 1 | 2 vCPU / 8 GB |
| 7 | RD (Research) | Chief Scientist | 1 | 2 vCPU / 8 GB |
| 8 | Legal | General Counsel | 1 | 2 vCPU / 8 GB |
| 9 | Finance | CFO | 1 | 2 vCPU / 8 GB |
| 10 | Grants | Director of Grants | 1 | 2 vCPU / 8 GB |

**Layer 2 Aggregate:** 10 agents | 20 vCPU / 80 GB RAM

---

### Layer 3 — Departments
Each department is a container agent that owns a vertical slice of operations. Departments do not directly manage teams — they delegate through the department head's operational layer.

| Department | Layer 3 Agent Count | Primary Mission | Key OKRs |
|---|---|---|---|
| Irrig8 LLC | 1 | End-to-end deterministic farming OS (resource health, auditability, accountability) | Field deployment count, data fidelity score, sensor uptime |
| VPC LLC | 1 | Velocity, Pipeline, Comp — RevOps tooling for AgentOS ventures | Pipeline coverage ratio, win rate by segment |
| Starting 5 | 1 | Original 5-agent core crew retention and deployment | Crew utilization rate, output quality score |
| Agentic Platform | 1 | AgentOS kernel, API surface, HITL queue, cascade triggers | Agent uptime, task completion rate, zero-downtime SLA |
| Venture Studio | 1 | IP-to-publication pipeline, patent prosecution, whitepaper cadence | Papers published, patents filed, IP defensibility score |
| Shared Services | 1 | Cross-department tooling: calendar, email, drive, Notion, Airtable, Linear | Tool availability, integration uptime |
| RD (Research) | 1 | AgentOS frontier R&D, novel architecture patterns, competitive intel | Research velocity, novel IP generated |
| Legal | 1 | Contract review, regulatory compliance, entity management | Contracts closed, compliance incidents |
| Finance | 1 | Cash management, forecasting, cap table, burn rate | Reporting accuracy, audit readiness |
| Grants | 1 | Grant discovery, application pipeline, reporting | Grants applied, grants won, funding secured |

**Layer 3 Aggregate:** 10 agents | 10 vCPU / 40 GB RAM

---

### Layer 4 — Teams (Under Departments)
Teams are the first true operational execution layer. Each team is a named group of sub-team agents led by a team lead.

| Department | Team Name | Team Lead Title | Sub-Team Count (Layer 5) |
|---|---|---|---|
| Irrig8 LLC | Field Ops Team | Field Ops Lead | 2 |
| Irrig8 LLC | Data & Integration Team | Data Lead | 2 |
| VPC LLC | Pipeline Team | Pipeline Lead | 1 |
| VPC LLC | Comp Plan Team | Comp Lead | 1 |
| Starting 5 | Crew Alpha | Crew Alpha Lead | 2 |
| Starting 5 | Crew Beta | Crew Beta Lead | 2 |
| Agentic Platform | Kernel Team | Kernel Lead | 2 |
| Agentic Platform | API Team | API Lead | 1 |
| Venture Studio | Publication Team | Publication Lead | 2 |
| Venture Studio | Patent Team | Patent Lead | 1 |
| Shared Services | Integration Team | Integration Lead | 2 |
| Shared Services | Operations Team | Ops Lead | 1 |
| RD | Research Team | Research Lead | 2 |
| RD | Competitive Intel Team | Intel Lead | 1 |
| Legal | Contracts Team | Contracts Lead | 1 |
| Legal | Compliance Team | Compliance Lead | 1 |
| Finance | Accounting Team | Accounting Lead | 1 |
| Finance | FP&A Team | FP&A Lead | 1 |
| Grants | Grant Discovery Team | Discovery Lead | 1 |
| Grants | Grant Writing Team | Writing Lead | 1 |

**Layer 4 Aggregate:** 20 teams | 20 agents | 20 vCPU / 60 GB RAM

---

### Layer 5 — Sub-Teams (Under Teams)
Each sub-team is a focused unit performing a specific function.

| Parent Team | Sub-Team Name | Sub-Team Mission |
|---|---|---|
| Field Ops Team | Sensor Deployment | Physical + virtual sensor installation coordination |
| Field Ops Team | Irrigation Planning | Water scheduling, resource allocation per field |
| Data & Integration Team | Satellite Ingestion | Sentinel/HLS data pipeline, band math, NDVI |
| Data & Integration Team | Audit & Compliance | ForLedger chain, accountability reporting |
| Pipeline Team | CRM Ops | Airtable/Linear sync, deal stage management |
| Comp Plan Team | Quota Setting | Territory design, quota math, comp model |
| Crew Alpha | Engineering Crew | AgentOS core development, feature shipping |
| Crew Alpha | QA Crew | Test coverage, regression, HITL validation |
| Crew Beta | Infrastructure Crew | Deployment, scaling, observability |
| Crew Beta | Security Crew | Access control, secret management, compliance |
| Kernel Team | Scheduler | Task queue, priority inheritance, cascade dispatch |
| Kernel Team | HITL Layer | Human-in-the-loop queue, approval gating |
| API Team | Developer Experience | SDK, docs, developer onboarding |
| Publication Team | Writing | Whitepaper, arXiv, Zenodo pipeline |
| Publication Team | Peer Review | Reviewer coordination, revision cycles |
| Patent Team | Prosecution | Claim drafting, prior art, filing |
| Integration Team | Airtable/Notion | Connected app orchestration |
| Integration Team | Google/Linear | Calendar, tasks, drive management |
| Operations Team | Scheduling | Standup coordination, calendar routing |
| Research Team | Architecture R&D | Novel agent patterns, FOXXD S67 spec |
| Research Team | Protocol R&D | DAP plane, Z-axis, cascade trigger math |
| Competitive Intel Team | Market Monitoring | Competitive landscape, M&A watch |
| Contracts Team | NDAs / MSAs | Standard contract templates, redlines |
| Compliance Team | Regulatory | GDPR, CCPA, sector-specific compliance |
| Accounting Team | Ledger | AP/AR, reconciliation, tax prep |
| FP&A Team | Forecasting | Cash flow, scenario modeling |
| Grant Discovery Team | Prospecting | federal/state/private database scraping |
| Grant Writing Team | Application | Narrative drafting, budget justification |

**Layer 5 Aggregate:** 29 sub-teams | 29 agents | 14.5 vCPU / 43.5 GB RAM

---

### Layer 6 — Individual Agents (Under Sub-Teams)
The working agents. Each sub-team has at least 1 named individual agent performing the actual work.

| Sub-Team | Individual Agent Count |
|---|---|
| Sensor Deployment | 2 |
| Irrigation Planning | 2 |
| Satellite Ingestion | 2 |
| Audit & Compliance | 1 |
| CRM Ops | 2 |
| Quota Setting | 1 |
| Engineering Crew | 3 |
| QA Crew | 2 |
| Infrastructure Crew | 2 |
| Security Crew | 1 |
| Scheduler | 2 |
| HITL Layer | 2 |
| Developer Experience | 1 |
| Writing | 2 |
| Peer Review | 1 |
| Prosecution | 1 |
| Airtable/Notion | 2 |
| Google/Linear | 2 |
| Scheduling | 1 |
| Architecture R&D | 2 |
| Protocol R&D | 2 |
| Market Monitoring | 1 |
| NDAs / MSAs | 1 |
| Regulatory | 1 |
| Ledger | 1 |
| Forecasting | 1 |
| Prospecting | 1 |
| Application | 1 |

**Layer 6 Aggregate:** 38 individual agents | 19 vCPU / 57 GB RAM

---

### Layer 7 — Temp Child Agents (Ephemeral)
Spawned by Layer 6 individual agents for task-specific bursts. Max lifetime: 1 hour. Auto-reaped after task completion or timeout.

| Trigger Scenario | Max Concurrent Temp Agents | vCPU Each | Max RAM Each |
|---|---|---|---|
| Parallel arXiv scraping | 5 | 0.5 | 1 GB |
| Multi-field sensor poll | 10 | 0.25 | 512 MB |
| Patent database search burst | 3 | 0.5 | 1 GB |
| Concurrent contract redline | 2 | 0.5 | 1 GB |
| Burst pipeline calculation | 4 | 0.5 | 1 GB |
| Emergency compliance check | 2 | 1 | 2 GB |

**Layer 7 Peak Budget:** 26 temp agents at burst | 13 vCPU / 26 GB RAM

---

## 3. Agent Count Summary (100 Agents)

| Layer | Count | % of Total |
|---|---|---|
| L1: BX3 | 1 | 1% |
| L2: C-Suite | 10 | 10% |
| L3: Departments | 10 | 10% |
| L4: Teams | 20 | 20% |
| L5: Sub-Teams | 29 | 29% |
| L6: Individual Agents | 38 | 38% |
| L7: Temp (peak burst) | 26 | — |
| **L1-L6 Total (persistent)** | **108** | — |
| **L1-L6 Persistent (no dupes at L2/L3)** | **100** | 100% |

> Note: L2 and L3 are the same 10 agents (C-suite executives *are* department heads at 100-agent scale). L4+ are additions.

---

## 4. Compute Cost Breakdown (100 Agents)

### Infrastructure Profile
- **Base Image:** Ubuntu 22.04 LTS, minimal footprint
- **Agent Runtime:** Bun + TypeScript runtime (lightweight)
- **Database:** SQLite for local state (agentic.db), shared Postgres for cross-agent state

### Per-Tier Cost Model (Hetzner Standard — April 2026)

| Layer | Count | vCPU/Agent | RAM/Agent | Total vCPU | Total RAM | Hetzner CX22 (2vCPU/8GB @ ~€4/mo) | Hetzner CX32 (4vCPU/16GB @ ~€8/mo) |
|---|---|---|---|---|---|---|---|
| L1: BX3 | 1 | 2 | 8 GB | 2 | 8 GB | €4 | — |
| L2: C-Suite | 10 | 1 | 4 GB | 10 | 40 GB | €20 | — |
| L3: Departments | 10 | 1 | 4 GB | 10 | 40 GB | €20 | — |
| L4: Teams | 20 | 0.5 | 2 GB | 10 | 40 GB | €20 | — |
| L5: Sub-Teams | 29 | 0.5 | 1.5 GB | 14.5 | 43.5 GB | €28 (3x CX22) | — |
| L6: Individual | 38 | 0.5 | 1.5 GB | 19 | 57 GB | €36 (4x CX22) | — |
| L7: Temp (peak) | 26 | 0.5 | 1 GB | 13 | 26 GB | Burst on-demand | — |
| **Total (persistent L1-L6)** | **108** | — | — | **65.5** | **228.5 GB** | **~€128/mo** | **~€176/mo** |

### Annual Compute (Hetzner Standard)

| Config | Monthly | Annual |
|---|---|---|
| Hetzner CX22 cluster (6x CX22) | €128 | **€1,536** |
| Hetzner CX32 cluster (5x CX32) | €176 | **€2,112** |
| With Layer 7 burst reserve (+25%) | +€32/mo | **+€384/yr** |

### Data Layer Costs

| Component | Spec | Monthly Cost |
|---|---|---|
| Shared Postgres (RDS equivalent) | db.t3.micro, 100GB | ~$15/mo |
| Object Storage (S3-compatible) | 500GB | ~$12/mo |
| ForLedger archive volume | 100GB | ~$5/mo |
| **Total Data Layer** | | **~$32/mo → ~$384/yr** |

### Grand Total (Annual, Hetzner Standard)

| | Annual |
|---|---|
| Compute (CX22 cluster) | €1,536 (~$1,680) |
| Data Layer | $384 |
| **Total** | **~$2,064/yr** |

---

## 5. Span of Control Analysis (100-Agent Scale)

| Relationship | Actual Ratio | Assessment |
|---|---|---|
| BX3 → C-Suite (L1→L2) | 1:10 | ✅ Optimal (< 12 direct reports) |
| C-Suite → Departments (L2→L3) | 1:1 | ✅ Executive owns department directly |
| Department → Teams (L3→L4) | ~1:2 avg | ✅ Healthy (max 1:4) |
| Team → Sub-Teams (L4→L5) | ~1:1.5 avg | ✅ Healthy |
| Sub-Team → Individual (L5→L6) | ~1:1.3 avg | ✅ Healthy |
| Individual → Temp (L6→L7) | 1:0–3 avg | ✅ Ephemeral, burst-controlled |

**Conclusion:** At 100 agents, the 7-layer model is lean and flat enough to avoid hierarchy tax. No new abstraction layers required.

---

## 6. FOXXD S67 Role at 100-Agent Scale

FOXXD S67 is the **terminal authority endpoint** — the agent that receives and confirms the final agent ID chain of custody before any material action is committed. At 100-agent scale, S67 is:

- **One instance per department** (10 total, one per C-suite)
- Each S67 instance is co-located with the department's data partition
- S67 does NOT route, does NOT schedule, does NOT spawn — it ONLY seals and verifies
- All Layer 4+ agents register their terminal ID with their department's S67 on startup

```
Agent Action → Layer 6 Individual Agent → Sub-Team attestation → Team witness →
Department S67 seal → Chain of custody logged → Action committed
```

---

## 7. Critical Design Decisions

1. **C-suite = Department heads.** No separate executive layer at 100-agent scale. The 10 C-suites each own their department directly, collapsing L2/L3 into one tier.

2. **Layer 7 is burst-only.** No persistent agent count. Temp agents draw from a shared compute pool and are never counted against the 100-agent ceiling for licensing/cost purposes.

3. **Hetzner standard is sufficient.** At 100-agent scale, enterprise infra is premature. Hetzner CX22 cluster is the cost-optimal choice with headroom for Layer 7 bursts.

4. **ForLedger is per-department.** Each department maintains its own ForLedger partition, sealed by its S67. Cross-department audits route through a shared Federation layer (future L8, see agent-1000-architecture.md).

5. **No agent is anonymous.** Every agent at L4+ has a resolvable ID, a parent chain, and a registered S67 endpoint. Anonymous agents are rejected at the door.

---

*Document authored: 2026-04-24 | BX3 VAULT | agent-100-architecture.md v1.0.0*
