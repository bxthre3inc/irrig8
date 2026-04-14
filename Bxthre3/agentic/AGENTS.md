# AGENTS.md — Agentic Session State

## Session Snapshot — 2026-04-14T02:20 UTC

### What Exists

**API Routes (zo.space — live):**
- `/api/agentic/status` ✅ operational
- `/api/agentic/agents` ✅ 19 agents
- `/api/agentic/tasks` ✅ 15 tasks
- `/api/agentic/org` ✅
- `/api/agentic/starting5` ✅ 4 archetypes
- `/api/agentic/integrations` ✅ 10 integrations
- `/api/agentic/events/ingest` ✅
- `/api/agentic/dap/evaluate` ✅
- `/api/agentic/agents/register` ✅
- `/api/agentic/android/agents/:id/:action` ✅
- `/api/agentic/workforce/metrics` ✅
- `/api/agentic/projects` ✅
- `/api/agentic/route` ✅ IER router
- `/api/agentic/feedback/stats` ✅
- `/api/agentic/phase` ✅
- `/api/agentic/forensic/trace` ✅
- `/api/agentic/events/stream` ✅ SSE
- `/api/agentic/onboarding/scan` ⚠️ broken (zo-agent import)
- `/api/agentic` ❌ broken (TS module errors)
- `/api/agentic/projects` ❌ broken
- `/api/agentic/workforce/metrics` ❌ broken
- `/api/agentic/depts` ❌ broken
- `/api/agentic/escalations` ❌ broken
- `/api/agentic/escalations/notify` ❌ broken

**Broken Routes (need fixing):**
- `/api/agentic` — default export missing
- `/api/agentic/projects` — zo-agent module not found
- `/api/agentic/workforce/metrics` — better-sqlite3 path issue
- `/api/agentic/depts` — module not found
- `/api/agentic/escalations` — module not found
- `/api/agentic/escalations/notify` — same
- `/api/agentic/onboarding/scan` — zo-agent not installed

**Web Routes:**
- `/agentic` ✅ Chairman Interface (basic) — needs redesign as all-in-one
- `/` ✅ Marketing page (live)
- `/roadmap` ✅

**SQLite DBs:**
- `/data/agentic/agentic.db` ✅ 19 agents, 15 tasks, seeded
- `/home/workspace/Bxthre3/agentic/store/ier_router.db` ✅ Thompson sampling IER

**Rust Binary:** `/home/workspace/Bxthre3/agentic/target/release/agentic` ✅ 5.3MB

---

## Session Log — What Was Built Today

### Fixed
- 6 broken routes (agents, android/agents, status, tasks, org, starting5) — wired to agenticapi.js
- 9/10 integrations stub routes
- Built Rust binary ✅ compile, run, test
- Seeded SQLite agentic.db with canonical 19 agents + 15 tasks
- IER Router Thompson sampling ✅ Thompson exploration vs exploit
- DAP 9-plane evaluation ✅
- Phase gates ✅
- FTE (FTE) ✅
- Feedback loop ✅
- `/agentic` Chairman Interface (basic React page) ✅

### Broken (needs fixing)
- `/api/agentic` — `agentOSApi` module not found (zo-agent package)
- `/api/agentic/projects` — same
- `/api/agentic/workforce/metrics` — better-sqlite3 path mismatch
- `/api/agentic/onboarding/scan` — zo-agent package not installed
- All routes using `better-sqlite3` — Node.js modules on Bun runtime
- Rust binary can't connect to zo.space (uses 127.0.0.1 instead of workspace DB path)

---

## The All-in-One Vision

**Name:** Agentic
**URL:** `/agentic`
**Purpose:** Single dashboard to manage ALL of Bxthre3 Inc from one place

**What it must show:**
- Subsidiary overview (Irrig8, VPC, RAIN, Trenchbabys, ARD, Build-A-Biz)
- Agent workforce status (19 agents)
- Active tasks and escalations
- Grants pipeline (CIG Colorado, USDA SBIR, ARPA-E OPEN)
- Event stream / cascade live
- Quick actions: broadcast intent, approve/block agent proposals, view reasoning traces
- Financials: runway, cash, burn rate
- Integrations status

**NOT just a dev dashboard. A real business cockpit.**

---

## Workspace Corruption Issues

- `better-sqlite3` Node.js module used in Bun/zo.space context → crashes
- Rust binary hardcodes `/tmp/agentic.db` instead of workspace path
- zo-agent npm package not installed
- Some routes have corrupted exports (TS syntax in JS)
- Git index has orphaned entries from deleted files

**Resolution: Fresh session. Rebuild broken routes with Bun-compatible SQLite (Jork, sql.js, or file-based JSON. Do NOT mix Node.js modules in zo.space.**

---

## Rules Going Forward

1. zo.space runs Bun — use Bun-compatible patterns only
2. All business data persists via zo.space API routes + filesystem (JSON files in workspace)
3. Rust binary runs standalone on port 3098 or similar
4. Don't mix Node.js and Bun module systems
5. Keep `/agentic` page simple — no complex SSR
6. Commit working state before structural changes
