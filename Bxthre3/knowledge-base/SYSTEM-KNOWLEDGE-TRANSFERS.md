# BX3 SYSTEM KNOWLEDGE TRANSFERS
## If brodiblanco Unavailable, Start Here

**Purpose:** Ensure continuity if Sovereign incapacitated

---

## CONTINUITY-001: Agentic System (Layer 0-3)

**What It Is:**
BX3's internal AI operating system for orchestrating all ventures.

**Current State:**
- Version: 2.1-FINAL (April 5, 2026)
- Components: 10/10 operational on Zo, 0/10 on Kali (deferred)
- Status: Building Investor Protector as first proof

**How to Continue Development:**

1. **Find the source of truth:**
   - Core spec: `Bxthre3/projects/agentic/v2-import/docs/ARCHITECTURE_AGENTIC_ENTERPRISE.md`
   - Runtime code: `Bxthre3/projects/agentic/v2-import/src/`
   - Current tasks: Check `Bxthre3/INBOX/agents/iris.md` and `dev.md`

2. **Understand the hierarchy:**
   - L3 (Root): Strategy — YOU if Sovereign unavailable
   - L2 (Orchestrator): Lead_Ops — check `org.ts` for current assignee
   - L1 (Aggregator): Various hubs
   - L0 (Edge): Field devices, Android

3. **Key decisions awaiting Sovereign:**
   - Check `Bxthre3/INBOX.md` — P0/P1 items
   - All P0 require human decision; system queues rather than acts

4. **If system fails:**
   - Manual fallback: Direct access to Zo Space terminal
   - Recovery: `python3 Bxthre3/projects/agentic/recovery/restart_l3.py`

**Who to Contact:**
- Technical: Iris (Engineering Lead), Dev (Backend)
- Strategic: 2B2F Council members (if established)
- Legal/Equity: Raj (Legal & Compliance)

---

## CONTINUITY-002: Investor Protector (Current Priority)

**What It Is:**
Real-time dashboard proving BX3 velocity to investors. Self-referential proof.

**Current State:**
- Data sources: 4 scripts running (execution, artifacts, cost, audit)
- UI: In development (Iris building)
- API: In development (Dev building)
- Target live: April 14, 2026

**How to Continue:**

1. **Check status:**
   ```bash
   cd Bxthre3/projects/investor-protector/data
   cat execution_metrics.json | grep velocity_score
   ```

2. **If stalled:**
   - Review INBOX: `Bxthre3/INBOX/agents/iris.md`, `dev.md`
   - Check for blockers (missing tokens, etc.)
   - Unblock or reassign

3. **Key metric to maintain:**
   - Velocity Score: Must stay >90
   - If drops: Investigate P0/P1 backlog immediately

**What Investors Need to See:**
- Velocity Score (are we shipping?)
- Doc/Code Ratio (is knowledge institutionalized?)
- Burn Rate (are we capital efficient?)
- Milestone Progress (are we hitting targets?)

---

## CONTINUITY-003: OpCo Portfolio (15+ Projects)

**What They Are:**
Operating companies built on Agentic, each with equity structure.

**Priority Order (if resource constrained):**

| Priority | OpCo | Why | Immediate Action |
|----------|------|-----|------------------|
| 1 | **Investor Protector** | Funding enabler | Finish dashboard |
| 2 | **Build-A-Biz** | Revenue + proof | Get first paying customer |
| 3 | **Irrig8** | Funded ($250K), regulatory deadline | Water Court prep (June 29) |
| 4 | **VPC** | Active revenue | Maintain ops |
| 5 | **RAIN** | Intelligence advantage | Daily briefings |

**Deferred (post-funding):**
- Autodark Manufacturing (needs facility, hardware)
- Fleet (needs capital)
- Carbon8 (needs research)
- CORDS (seasonal — fall/winter)

**How to Continue:**
- Check `Bxthre3/projects/{opco}/impact.md` for status
- Check `Bxthre3/INBOX/agents/{opco-agent}.md` for active tasks
- Sovereign or Lead_Ops (assigned in org.ts) makes priority calls

---

## CONTINUITY-004: 2B2F Council / Blue Ocean Team

**What It Is:**
Advisory body for "Global Dominance" strategy (GDP capture).

**Current State:**
- Established: March 30, 2026
- Charter: `Bxthre3/RESEARCH/2B2F_OPEN/interlocker/CHARTER.md`
- Active research: 120-month plan

**How to Continue:**
- Monthly synthesis: `interlocker/monthlies/`
- Strategic direction: Council advises, Sovereign (or successor) decides
- If Sovereign unavailable: Council can advise Lead_Ops, but authority gaps must be filled

---

## CONTINUITY-005: Grants & Funding

**Active Applications:**
- Check `Bxthre3/grants/PIPELINE.md`
- Maya (Grant Strategist) manages this
- Critical: Follow up on all "Submitted" within 30 days

**Funding Status:**
- Current: $0 (bootstrap)
- Runway: Infinite (no burn)
- Target: $2M Year 1, $30M Year 2-3

**If Funding Urgent:**
- Activate Zoe (Chief of Staff) to prioritize revenue-generating projects
- Review Build-A-Biz pricing tiers — can we pre-sell?
- Consider SAFE with brodiblanco.fund backers

---

## EMERGENCY CONTACTS

| Role | Name/Agent | INBOX Location | Escalation |
|------|-----------|----------------|------------|
| CEO/Sovereign | brodiblanco | N/A (you're here) | — |
| Chief of Staff | Zoe | `INBOX/agents/zoe.md` | SMS: +1 719-490-9228 |
| COO | Atlas | `INBOX/agents/atlas.md` | Via Zoe |
| Engineering Lead | Iris | `INBOX/agents/iris.md` | Via Zoe |
| Legal | Raj | `INBOX/agents/raj.md` | Via Zoe |

**Note:** All agents are AI. In true emergency, all decisions default to:
1. Sovereign (if reachable)
2. Zoe as highest-ranking human-facing agent
3. Lead_Ops for technical operations

---

## KEY FILES TO PROTECT

**If evacuating/migrating systems, preserve in this order:**

1. `Bxthre3/SOUL.md` — Behavioral constitution
2. `Bxthre3/AGENTS.md` — Organization + INBOX routing
3. `Bxthre3/projects/agentic/` — Core IP (Agentic runtime)
4. `Bxthre3/VAULT/` — All IP, case studies, captured knowledge
5. `Bxthre3/RESEARCH/2B2F_OPEN/` — Strategic planning
6. `Bxthre3/grants/` — Funding pipeline
7. Individual OpCo charters and impact.md files

---

**Last Updated:** April 6, 2026  
**Next Review:** Monthly or on personnel change