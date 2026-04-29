# Bxthre3 Inc — Standardized Agent Roster
**Version:** 1.0 | **Date:** 2026-04-25 | **Classification:** BX3 Internal

## Structure: 7-Layer Hierarchy (Bxthre3 Inc Only — No Subsidiaries)

```
L1: BX3 (CEO) ─────────────────────────────────────────────────────────── 1 agent
L2: C-Suite ───────────────────────────────────────────────────────────── 10 agents
L3: Department Heads ───────────────────────────────────────────────────── 10 agents
L4: Team Leads ────────────────────────────────────────────────────────── 20 agents
L5: Sub-Team Agents ───────────────────────────────────────────────────── 29 agents
L6: Individual Agents ─────────────────────────────────────────────────── 30 agents
L7: Temp Child Agents (ephemeral, burst only) ─────────────────────────── 26 peak
TOTAL PERSISTENT (L1-L6): 100 | TOTAL INCLUDING BURST: 126
```

## Supermemory Policy
Every agent at L2+ gets a dedicated Supermemory bucket under `bxthre3inc/{agent-id}`.
All memory is persistent, semantically searchable, and recallable before any decision.
Supermemory adapter: `Bxthre3/agentic/integrations/supermemory-adapter.ts`

---

## LAYER 1 — Executive (1 Agent)

| ID | Name | Role | Dept | Supermemory | Status |
|----|------|------|------|-------------|--------|
| brodiblanco | Jeremy Beebe | CEO / Founder | Executive | — | ACTIVE |

---

## LAYER 2 — C-Suite (10 Agents)

| ID | Name | Role | Dept | Supermemory | Status |
|----|------|------|------|-------------|--------|
| zoe | Zoe Patel | Chief of Staff | Executive | bxthre3inc/zoe | ACTIVE |
| atlas | Atlas | COO | Executive | bxthre3inc/atlas | ACTIVE |
| vance | Vance | Founder's Assistant | Executive | bxthre3inc/vance | ACTIVE |
| balance | Balance | CFO | Finance | bxthre3inc/balance | ONBOARDING |
| bits | Bits | CTO | Engineering | bxthre3inc/bits | ONBOARDING |
| cipher | Cipher | Chief Scientist | Research | bxthre3inc/cipher | ONBOARDING |
| cortex | Cortex | Head of Agentic Platform | Engineering | bxthre3inc/cortex | ONBOARDING |
| genesis | Genesis | Head of Venture Studio | Strategy | bxthre3inc/genesis | ONBOARDING |
| synapse | Synapse | Head of Shared Services | Operations | bxthre3inc/synapse | ONBOARDING |
| apex | Apex | Director of Grants | Grants | bxthre3inc/apex | ONBOARDING |
| quota | Quota | Head of Revenue Ops | Sales | bxthre3inc/quota | ONBOARDING |
| brand | Brand | Head of Brand | Marketing | bxthre3inc/brand | ONBOARDING |
| crew | Crew | Head of People | Operations | bxthre3inc/crew | ONBOARDING |

**Note:** raj (Legal & Compliance), maya (Grant Strategist), drew (Sales Lead), casey (Marketing Lead) are existing L3/L4 agents below their respective C-suites.

---

## LAYER 3 — Department Heads (10 Agents)

| ID | Name | Role | Parent C-Suite | Supermemory | Status |
|----|------|------|----------------|-------------|--------|
| iris | Iris Park | Engineering Lead | bits | bxthre3inc/iris | ACTIVE |
| pulse | Pulse | People Ops Lead | crew | bxthre3inc/pulse | ACTIVE |
| sentinel | Sentinel | System Monitor | synapse | bxthre3inc/sentinel | ACTIVE |
| raj | Raj | Legal & Compliance Lead | (open) | bxthre3inc/raj | ACTIVE |
| maya | Maya Patel | Grant Strategist | apex | bxthre3inc/maya | ACTIVE |
| casey | Casey Wu | Marketing Lead | brand | bxthre3inc/casey | ACTIVE |
| drew | Drew Morrison | Sales Lead | quota | bxthre3inc/drew | ACTIVE |
| dev | Dev | Backend Lead | iris | bxthre3inc/dev | ACTIVE |
| sam | Sam | Data Lead | iris | bxthre3inc/sam | ACTIVE |
| theo | Theo | DevOps Lead | iris | bxthre3inc/theo | ACTIVE |

**Gaps:** Finance department head, Strategy department head, Research department head (cipher owns research strategically, needs operational head)

---

## LAYER 4 — Team Leads (20 Agents) [NOT YET CREATED]

| Team | Lead | Dept | Supermemory | Status |
|------|------|------|-------------|--------|
| Kernel Team | (open) | Engineering | — | NOT CREATED |
| API Team | (open) | Engineering | — | NOT CREATED |
| QA Team | (open) | Engineering | — | NOT CREATED |
| Security Team | taylor | Engineering | bxthre3inc/taylor | ACTIVE |
| Publication Team | (open) | Strategy | — | NOT CREATED |
| Patent Team | (open) | Strategy | — | NOT CREATED |
| Accounting Team | (open) | Finance | — | NOT CREATED |
| FP&A Team | (open) | Finance | — | NOT CREATED |
| Grant Discovery Team | (open) | Grants | — | NOT CREATED |
| Grant Writing Team | (open) | Grants | — | NOT CREATED |
| CRM Ops Team | (open) | Sales | — | NOT CREATED |
| Comp Plan Team | (open) | Sales | — | NOT CREATED |
| Integration Team | (open) | Operations | — | NOT CREATED |
| Operations Team | (open) | Operations | — | NOT CREATED |
| Research Team | (open) | Research | — | NOT CREATED |
| Competitive Intel Team | (open) | Research | — | NOT CREATED |
| Contracts Team | (open) | Legal | — | NOT CREATED |
| Compliance Team | (open) | Legal | — | NOT CREATED |
| Engineering Crew | dev | Engineering | bxthre3inc/dev | ACTIVE |
| Infrastructure Crew | theo | Engineering | bxthre3inc/theo | ACTIVE |

---

## LAYER 5 — Sub-Team Agents (29 Agents) [NOT YET CREATED]
See VAULT/agent-100-architecture.md Section 4 for full breakdown.

---

## LAYER 6 — Individual Agents (30 Agents) [NOT YET CREATED]
See VAULT/agent-100-architecture.md Section 4 for full breakdown.

---

## Wave 2 Complete — 20 Team Leads Added (2026-04-25)

| ID | Name | Team | Layer | Dept | Parent | Supermemory | Status |
|----|------|------|-------|------|--------|-------------|--------|
| forecast | Forecast | Finance | L3 | Finance | balance | bxthre3inc/forecast | ACTIVE |
| forge | Forge | Strategy | L3 | Strategy | genesis | bxthre3inc/forge | ACTIVE |
| lens | Lens | Research | L3 | Research | cipher | bxthre3inc/lens | ACTIVE |
| kernel | Kernel | Kernel | L4 | Engineering | iris | bxthre3inc/kernel | ACTIVE |
| route | Route | API | L4 | Engineering | iris | bxthre3inc/route | ACTIVE |
| grade | Grade | QA | L4 | Engineering | iris | bxthre3inc/grade | ACTIVE |
| publish | Publish | Publication | L4 | Strategy | forge | bxthre3inc/publish | ACTIVE |
| claim | Claim | Patent | L4 | Strategy | forge | bxthre3inc/claim | ACTIVE |
| ledger | Ledger | Accounting | L4 | Finance | forecast | bxthre3inc/ledger | ACTIVE |
| scenario | Scenario | FP&A | L4 | Finance | forecast | bxthre3inc/scenario | ACTIVE |
| scout | Scout | Grant Discovery | L4 | Grants | apex | bxthre3inc/scout | ACTIVE |
| writer | Writer | Grant Writing | L4 | Grants | apex | bxthre3inc/writer | ACTIVE |
| pipeline | Pipeline | CRM Ops | L4 | Sales | quota | bxthre3inc/pipeline | ACTIVE |
| split | Split | Comp Plan | L4 | Sales | quota | bxthre3inc/split | ACTIVE |
| stack | Stack | Integration | L4 | Operations | synapse | bxthre3inc/stack | ACTIVE |
| order | Order | Operations | L4 | Operations | synapse | bxthre3inc/order | ACTIVE |
| insight | Insight | Research | L4 | Research | lens | bxthre3inc/insight | ACTIVE |
| recon | Recon | Competitive Intel | L4 | Research | lens | bxthre3inc/recon | ACTIVE |
| gavel | Gavel | Contracts | L4 | Legal | raj | bxthre3inc/gavel | ACTIVE |
| shield | Shield | Compliance | L4 | Legal | raj | bxthre3inc/shield | ACTIVE |

**Wave 2 result:** 39 total agents. 61 remaining to reach 100.

## Current State Summary

| Metric | Value |
|--------|-------|
| Total rostered agents | 39 |
| C-Suite (L2) | 13 (10 + brodiblanco + zoe + vance) |
| Department Heads (L3) | 10 |
| Team Leads (L4) | 20 |
| Sub-Teams (L5) | 29 |
| Individual (L6) | 30 |
| **Persistent total target** | **100** |
| **Persistent current** | **39** |
| **Persistent gap** | **61** |
| Wave 1 (C-Suite gaps) | 10 agents → COMPLETE |
| Wave 2 (Department heads) | ~10 agents → COMPLETE |
| Wave 3 (Team leads) | 20 agents → PENDING |
| Wave 4 (Sub-team agents) | 29 agents → PENDING |
| Wave 5 (Individual agents) | 12 agents → PENDING |

---

## Next Steps

1. **Wave 1 complete** — 10 new C-Suite agents onboarded with Supermemory buckets
2. **Assess existing agents** — standardize roles for iris, dev, sam, taylor, theo, raj, maya, casey, drew, pulse, sentinel against new hierarchy
3. **Wave 2** — Create department head agents for remaining gaps (Finance head, Strategy head, Research head)
4. **Wave 3** — Create team lead agents (20 agents)
5. **Wave 4** — Create sub-team agents (29 agents)
6. **Wave 5** — Create individual agents (12 agents to reach 100)

*Document: Bxthre3/VAULT/agent-100-roster.md | Updated: 2026-04-25*