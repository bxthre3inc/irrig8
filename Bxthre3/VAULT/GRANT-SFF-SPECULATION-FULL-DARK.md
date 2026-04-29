# SFF Speculation Grant Application — Full-Dark Manufacturing Stack
**Applicant:** Jeremy Beebe (BX3 / brodiblanco) — Independent Researcher
**Prepared:** 2026-04-25
**Status:** DRAFT — Ready to submit

---

## Name
Jeremy Beebe

## Email
bxthre3inc@gmail.com

## Tell us about your project

### Project Title
**Autonomous Edge Orchestration for Resilient Micro-Factories: The Full-Dark Stack**

---

### What problem are you working on?

Full-Dark (Lights-Out) manufacturing — production cells operating with zero human intervention, running self-learning AI loops — is arriving faster than the governance infrastructure to safely operate it. Small-scale operators ("micro-factories") are locked out of autonomous systems because the engineering cost is prohibitive and the compliance architecture doesn't exist.

When an autonomous production cell causes harm (contaminated product, equipment failure, safety incident), operators cannot answer the question regulators and insurance companies will ask: **"Why did the AI decide to do that?"** There is no accountability architecture.

**Specific problem:** Small-scale agricultural and manufacturing operations need a reference architecture that lets a single operator or small distributed team run Full-Dark cells without large engineering teams — while maintaining the deterministic audit trails that regulators require.

---

### Why it matters to you and to the broader world

Manufacturing is the physical layer of civilization. When AI controls physical systems — irrigation, food processing, distributed manufacturing — the consequences of getting it wrong are catastrophic, irreversible, and public.

The AI safety field has focused heavily on digital domains (language models, agents, information systems). Far less attention has been paid to the physical domain: autonomous systems that interact with the material world.

**This matters because:**
1. The regulatory environment is already shifting (EU AI Act, US Executive Order on AI) — autonomous systems in physical domains will require mandatory auditability
2. The "Full-Dark" manufacturing trend is real — labor shortages are accelerating adoption faster than governance frameworks can track
3. Small operators are being left behind — the economics of autonomous systems currently favor large enterprises with compliance teams
4. We have real-world evidence it works: Irrig8 has been operating 24/7 Full-Dark in Colorado for 18+ months with full forensic audit logs

**The broader contribution:** A FOSS reference architecture that demonstrates how "earned autonomy" (vs. assumed autonomy) solves the compliance problem for autonomous physical systems — usable by a solo operator, auditable by regulators, extensible by the developer community.

---

### What you're doing

**Technical approach:**
1. **BX3 Framework** — Deterministic accountability architecture (Truth Gate + Forensic Ledger + Reality Vectors + Cascading Triggers) applied to manufacturing orchestration
2. **AgentOS orchestration layer** — Extends the Training Wheels Protocol to multi-cell manufacturing coordination; autonomy is earned, not assumed
3. **Irrig8 generalization** — The architecture that works for autonomous irrigation generalizes to autonomous manufacturing cells: sense → decide → act → audit → correct
4. **Edge-resident digital twin** — Real-time IoT data creates a virtual replica of each production cell; deviations trigger cascading corrections

**The stack we're building:**
- Edge compute (local AI decision-making, no cloud dependency)
- Oracle coordination (centralized intelligence for cross-cell optimization)
- Forensic ledger (every decision logged deterministically)
- Reality vectors (physical state verification before execution)
- Training Wheels Protocol (earned autonomy with human-on-the-loop)
- Cascading triggers (real-time correction when state deviates)

**What makes this novel:**
- No existing FOSS platform provides deterministic accountability for autonomous physical systems
- The Training Wheels Protocol is a new compliance mechanism — autonomy is earned through demonstrated reliability, not assumed at deployment
- Our edge-orchestration model is designed for a single operator managing multiple production cells simultaneously (64-core concurrency)

---

### What success looks like

**In 6 months:**
- Architecture specification published as FOSS (GitHub)
- 2 patents filed on novel mechanisms (Training Wheels Protocol instantiation, Edge Orchestration IP)
- Live demo: simulation of 4 production cells running Full-Dark with full audit logs
- NSF SBIR Phase I application submitted ($275K to build production prototype)
- Colorado OEDIT AIP application submitted ($250K for Edge-Resident Digital Twin development)

**In 12 months:**
- First external adopters using the reference architecture
- Academic paper submitted on "Earned Autonomy as Compliance Infrastructure for Full-Dark Manufacturing"
- Evidence base sufficient for Series A or larger federal grant (DoD / DARPA)

**Long-term vision:**
The BX3 Framework becomes the standard accountability layer for autonomous physical systems — the compliance infrastructure that lets small operators run Full-Dark cells without compromising safety or auditability.

---

## Any other context you want to share?

**We are not starting from zero.** Irrig8 is already operating as a Full-Dark autonomous system in the San Luis Valley, Colorado — making irrigation decisions 24/7 with zero human intervention, with a complete forensic audit log. This is our proof of concept.

The BX3 Framework white paper is in final arXiv publication prep. Seven provisional patents have been filed on core mechanisms.

AgentOS is deployed and running at brodiblanco.zo.space — the Training Wheels Protocol is live and operational.

Our advantage: we have real operational data from a production Full-Dark system, not just theoretical models.

---

## What funding would enable

Funding from SFF would immediately enable:
- Full-time focus on closing the IP and publishing the architecture
- Patent filing for 2 additional provisional patents
- Technical documentation and diagrams for the FOSS release
- Travel to present at relevant conferences (NeurIPS AI Safety Workshop, Foresight Institute)
- 3-month runway to build the evidence base for federal grant applications
