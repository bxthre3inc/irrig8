# Agentic Architecture Assessment — Foundation Fix
**Date:** 2026-04-25 | **Classification:** BX3 Internal

## Executive Summary

Agentic has THREE separate agent systems running simultaneously — none of them fully wired together. Before building 81 more agents, the foundation needs to be fixed. This document maps what exists, what it needs, and the three paths to get there.

---

## What We Have (Right Now)

### System 1 — Python Prototype (port 5182) — LIVE
- **Status:** Running on `http://localhost:5182`
- **Agents:** 19 hardcoded Python classes (`base_agent.py`, `engineering_agent.py`, `legal_agent.py`, etc.)
- **Capabilities:** Task execution, Truth Gate auditing, event bus, self-modification engine, DAP evaluation, ForLedger chain
- **Persistence:** In-memory only (resets on restart)
- **Supermemory:** Adapter exists (`Bxthre3/agentic/integrations/supermemory-adapter.ts`) but NOT actively used by agents
- **Problem:** No dynamic agent creation — agents are static Python objects
- **Source:** `Bxthre3/projects/agentic/src/agents/`

### System 2 — Rust Binary (production) — NOT BUILT
- **Status:** Source code exists, binary does not. Local Rust toolchain too old (1.63, Cargo 1.65). Requires Rust 1.75.
- **Lines of code:** 3,505 across 20 modules
- **Core modules:** agent_registry, dap_engine, task_queue, truth_gate, self_mod, shell (deterministic execution), rollback/cascade, event_bus, inference
- **Database:** SQLite schema defined in `db/schema.sql` — not yet connected
- **Problem:** Agent registry is hardcoded in `types.rs` (`canonical_roster()`). No `create_agent` API. No dynamic insertion.
- **Source:** `Bxthre3/agentic/src/`

### System 3 — zo.space API route (`/api/agents/create`) — FAKE
- **Status:** Route exists and responds with HTTP 201, but returns a static stub JSON: `{"id":"create", "name":"...", "status":"active", ...}`
- **What it actually does:** Nothing. No database write. No agent registry update.
- **Why it shows 19 agents via `/api/agentic/agents`:** That endpoint hits the Python prototype's in-memory state, not the route handler
- **Source:** `brodiblanco.zo.space/api/agents/create` (zo.space route)

### System 4 — Zo Automations — REAL BUT SEPARATE
- **Status:** PaperPulse, Ambient Capture, and others ARE running as scheduled AI agents
- **How they work:** Zo's built-in automation system with instructions + rrule schedule
- **Managed by:** Zo platform, not Agentic
- **Problem:** These are "Zo agents" not "Agentic agents" — two separate systems that don't share state

---

## What We Want

For Agentic to genuinely support 100 simultaneously operating agents:

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| Dynamic agent creation | ❌ Hardcoded roster | Must be able to POST /agents and create a new agent |
| Persistent storage | ❌ In-memory only | SQLite must survive restarts |
| Agent lifecycle | ⚠️ Partial | Create ✅, Activate ✅, Task ⚠️, Deactivate ❌ |
| Supermemory per agent | ⚠️ Adapter exists | Not actively used; needs real bucket per agent |
| 100-agent scale | ⚠️ 19 works | Not tested at 100; task queue may need work |
| Shared state (multi-agent) | ❌ Per-agent only | Agents don't share context without Supermemory |
| HITL / Training Wheels | ✅ Working | Outbound actions queue for human review |
| Cascade triggers | ⚠️ Fixed (typo) | /api/agentic/cascade/tri working again |

---

## Three Paths Forward

### Path A — Build Rust Binary + Add create_agent API
**What:** Complete the Rust binary. Add a proper `POST /api/agentic/agents` endpoint with SQLite-backed dynamic agent creation.

**Steps:**
1. Set up GitHub Actions with Rust 1.75+ to build the binary (or use a Rust upgrader)
2. Add `create_agent` handler to `api/mod.rs` that:
   - Parses `name, role, department, parent_id` from JSON
   - Generates a UUID
   - Inserts into SQLite `agents` table
   - Registers in `AgentRegistry`
3. Wire Supermemory adapter into each agent's lifecycle
4. Build and deploy to a server (Hetzner, ~€9/mo)

**Pros:** Production-quality, compiled performance, single source of truth, proper architecture
**Cons:** 2-3 days of development. Rust debugging. GitHub Actions setup.
**Timeline:** Medium

### Path B — Add Dynamic Agent Creation to Python Prototype
**What:** Extend the Python prototype's `api_server.py` with a real `POST /create` endpoint backed by SQLite.

**Steps:**
1. Add SQLite table `agents` to the Python prototype
2. Add `POST /create` handler to `api_server.py`
3. Replace static `AGENTS` dict with database reads
4. Wire Supermemory adapter
5. Add `GET /agents` that reads from SQLite

**Pros:** Faster to implement (1 day). Familiar codebase. Works on current machine.
**Cons:** Two codebases (Python + Rust) still need reconciliation. Technical debt.
**Timeline:** Fastest to working

### Path C — Use Zo Automations AS Agentic Agents
**What:** Treat Zo automations as the agent execution layer. Build Agentic as a meta-layer that orchestrates them.

**Steps:**
1. Keep Python prototype running (port 5182) as the Agentic kernel
2. Treat each Zo automation as an "external agent" with:
   - Its own Supermemory bucket
   - Its own role/department
   - Task assignments routed via API calls
3. Create a wrapper API route that bridges Agentic → Zo automations
4. Agentic becomes the orchestration + audit layer, Zo handles execution

**Pros:** Running TODAY. Zero additional development to get real agents executing. SMS + scheduling built in.
**Cons:** Two systems. Zo owns the agent lifecycle, not Agentic. Conceptually messy.
**Timeline:** Immediate

---

## Recommended Path

**Start with Path C immediately** (today) + **Path B as the bridge** (1-2 days) + **Path A as the destination** (production, 1-2 weeks).

The practical reason: BX3 needs 100 agents working now for his business operations. Path C gives us real agents executing tasks today. Path B fixes the Python prototype so we have a working system during the Rust development window. Path A is the production target.

---

## Immediate Actions

1. **Stop creating fake agents** via `/api/agents/create` — it's wasting time
2. **Stand up Path C immediately** — convert Zo automations into named, role-assigned Agentic agents with Supermemory buckets
3. **Fix Python prototype with Path B** — add SQLite-backed agent creation so the 19 existing agents and new ones actually persist
4. **Build Rust binary via GitHub Actions** — proper production system, properly engineered

---

## Agent Roster After Foundation Fix

Once the foundation is solid, the roster will be:

| Layer | Agents | Source |
|-------|--------|---------|
| L1: CEO | 1 | brodiblanco |
| L2: C-Suite | 13 | 10 from Wave 1 + zoe + atlas + vance |
| L3: Dept Heads | 13 | Wave 2 (3 new) + existing (iris, dev, sam, theo, etc.) |
| L4: Team Leads | 20 | Wave 2 created (kernel, route, grade, etc.) |
| L5: Sub-Team | 29 | Pending Wave 3 |
| L6: Individual | 30 | Pending Wave 4 |
| **Total** | **100** | |

*Document: Bxthre3/VAULT/agentic-foundation-assessment.md | 2026-04-25*
