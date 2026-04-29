# SFF Speculation Grant Application — BX3 Framework
**Applicant:** Jeremy Beebe (BX3 / brodiblanco) — Independent Researcher
**Submitted via:** https://docs.google.com/forms/d/e/1FAIpQLSd447GiP5BkyvHAKrybC-4jRcmIH2kHH2n86o4ruJb1TSfmKQ/viewform
**Prepared:** 2026-04-25

---

## Name
Jeremy Beebe

---

## Email
bxthre3inc@gmail.com

---

## Tell us about your project

### Project Title
**BX3 Framework: A Deterministic Architecture for Human Accountability in Recursive Autonomous Systems**

---

### What problem are you working on?

Existing AI governance frameworks address single failure modes — permissions, safety constraints, transparency — but none address the structural failure that occurs when AI systems recursively spawn sub-agents, delegate authority, and operate in cloud-disconnected environments. When a parent AI spawns a child agent that inherits its authority, and that child operates at the edge without a cloud connection, the human accountability chain breaks structurally. Not because of a policy failure, but because the architecture itself has no mechanism to preserve human authority across delegation and disconnection.

This is not a future problem. It is a daily operational reality in:
- Autonomous vehicles delegating decisions to sub-systems
- IoT edge devices operating on stale cloud instructions
- Multi-agent AI systems where one agent spawns another to handle a sub-task
- Precision agriculture systems (center-pivot irrigation) making water allocation decisions autonomously

The problem is architectural. Policy cannot enforce what architecture does not support.

---

### What are you doing?

I built the **BX3 Framework** — a functional, actor-agnostic architecture that defines the minimum required properties any autonomous system must satisfy to keep human accountability structurally intact across recursion, delegation, and disconnection.

The framework has three core layers (the BX3 Loop):
1. **Purpose** (Human Accountability Anchor) — Sets strategic goals and authorization boundaries; must always remain human-anchored
2. **Bounds Engine** (Zo / Heuristic Engine) — Computes proposals using Bayesian priors, NDVI analysis, Kriging trends; limbless — proposes only, never executes
3. **Fact Layer** (Physical Substrate) — Physical firewall that executes only commands satisfying pre-defined safety, regulatory, and physical constraints

Five Pillars enforce the architecture:
- **Loop Isolation** — Reasoning and execution occupy separate planes; a machine actor cannot simultaneously propose and execute
- **Recursive Spawning** — Parent nodes birth self-contained Child Loops via Worksheet (OTA containerized logic); children have hard-coded pointers to parent Purpose, preventing autonomous drift; execute during cloud disconnection
- **Spatial Firewall** — Physical, hard-coded resolution gating at the Fact Layer (not software permissions); access beyond provisioned resolution tier triggers deterministic commercial funnel
- **Root Tunneling** — Human Root projects authority into any node without collapsing hierarchy; dedicated I/O Pipe, not a login
- **Bailout Protocol** — When a sub-node encounters an unresolvable condition, it generates a Cascading Trigger that bypasses all Machine actors and routes to a Human Accountability Anchor

The 9-Plane DAP (Deterministic Architecture Plane) defines 9 independent operational planes, each independently auditable, preventing cross-plane inference attacks.

**Training Wheels Protocol** — A layered accountability model with three modes (HITL Active default, Shadow Mode, Full Autonomy earned after 30+ consecutive approved actions). Automatically downgrades on any rejection or error.

---

### Why will your actions help?

The BX3 Framework's contribution to AI safety is architectural, not policy-based. Policy frameworks specify what AI should not do. BX3 specifies how AI systems must be structured so that what they should not do is **physically impossible** — enforced at the Fact Layer, not the policy layer.

The Bailout Protocol specifically addresses the "black box" problem: autonomous actions orphaned from human responsibility. BX3 makes human accountability structurally indestructible — it survives recursion, delegation, and network disconnection.

This matters because:
1. **AI systems are being deployed into physical-world high-stakes roles** with no governing architecture ensuring accountability survives the operational realities of edge deployment
2. **Recursive agent spawning is already happening** in production systems — the architecture must catch up to the operational reality
3. **The framework is validated** through live deployment in two production systems (Irrig8 precision agriculture OS, Agentic AI workforce orchestration platform) and 7 published Zenodo papers with formal specifications

---

### What have you done so far?

**Architecture:** Complete. BX3-UNIVERSAL-SPEC.md (50+ pages), BX3-UNIVERSAL-ARCHITECTURE.md, 5-pillar framework fully specified.

**Publications:**
- BX3 Framework White Paper — published on Zenodo (DOI: 10.5281/zenodo.19728052)
- 7 additional papers published on Zenodo covering: Truth Gate, Sandbox Execution Model, Bailout Protocol, Forensic Ledger, Reality Vector, Recursive Spawning, Self-Modification Engine
- 17-paper publication pipeline in active execution

**IP:**
- 7 provisional patents filed: Self-Modification Engine, 10-Point Vector, Z-Axis Indexing, 4-Tier EAN, 9-Plane DAP, SHA-256 Forensic Sealing, Cascading Triggers
- Additional patents in preparation for Spatial Firewall and Root Tunneling

**Live Deployments:**
- **Irrig8** (precision agriculture OS, San Luis Valley CO): BX3 Loop operating on center-pivot irrigation — satellite + sensor data → Bounds Engine proposals → Fact Layer deterministic execution of water allocation
- **Agentic** (AI workforce orchestration platform): BX3 Loop managing 18 AI agents with Training Wheels Protocol enforcing HITL accountability across all outbound actions

**Community:**
- GitHub: github.com/bxthre3inc
- Zenodo community: active, 7 published papers

---

### How will you use the grant?

**Proposed budget: $30,000**

| Category | Amount |
|----------|--------|
| Patent filing (2 additional provisional patents: Spatial Firewall, Root Tunneling) | $5,000 |
| arXiv submission fees and publication costs (3 papers: Bailout Protocol, AgentOS, Enterprise Orchestration) | $3,000 |
| Compute / LLM API costs (simulation validation of 9-Plane DAP) | $5,000 |
| Technical illustration and diagram production | $4,000 |
| Researcher stipend (6 months part-time) | $10,000 |
| Travel / conference attendance (1 relevant AI safety conference) | $3,000 |
| **Total** | **$30,000** |

---

### What are you planning to do next?

1. Complete and submit 3 remaining strong papers to arXiv (Bailout Protocol, AgentOS, Enterprise Orchestration) — targeted within 90 days of funding
2. File 2 additional provisional patents (Spatial Firewall, Root Tunneling)
3. Produce publication-quality technical diagrams for Zenodo/arXiv papers
4. Present at one relevant AI safety or governance conference (EA Global, FHI, or similar)
5. Begin structured engagement with AI governance researchers and institutions

The grant closes the critical path between "architectural framework complete and deployed" and "publicly citable, peer-reviewed, formally IP-protected research."

---

### Is there anything else you'd like to add?

The BX3 Framework was designed from the ground up to be **technology-agnostic** — it applies to precision irrigation, autonomous vehicles, industrial robotics, clinical AI, and defense systems. The architecture is not tied to any specific LLM, hardware platform, or application domain.

It was also designed to be **immediately useful** — not a theoretical contribution, but an operational architecture that has been running in production since 2026, governing real-world autonomous decisions with real human accountability chains.

I am an independent researcher (BX3 / brodiblanco) with no university affiliation, operating through Bxthre3 Inc. I have a track record of building and shipping functional AI systems (Agentic, Irrig8) and publishing rigorous architectural research (7 Zenodo papers). The SFF Speculation Grant would be the primary funding source enabling me to complete the formal publication and IP protection of the BX3 Framework.

---

*Contact: brodiblanco@zo.computer | GitHub: github.com/bxthre3inc*
