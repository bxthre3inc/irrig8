# BX3 Integration Architecture
> Last updated: 2026-04-16

## Overview

BX3 Inc runs on Zo Computer with a multi-platform integration stack. This doc is the canonical reference for how all integrations work, what their state is, and what the intended workflows are.

---

## Active Integrations

### GitHub
- **Account:** `bxthre3inc` (token: `GITHUB_TOKEN`, scopes: `gist, read:org, repo`)
- **PAT for Linear API:** `AGENTOS_GITHUBPAT` (used as Linear bearer token)
- **Webhook secret:** `GITHUB_WEBHOOK_SECRET` (HMAC-SHA256, set in Settings > Advanced)

**Webhook repos** (pull_request events → `https://brodiblanco.zo.space/api/github-webhook`):
- `bxthre3inc/agent-os`
- `bxthre3inc/bxthre3`
- `bxthre3inc/agentos-command-center`
- `bxthre3inc/Distributed-Execution-System`
- `bxthre3inc/CREDsWallet`

**Webhook flow:**
1. PR merged on any registered repo
2. GitHub POSTs to `/api/github-webhook`
3. Route validates HMAC signature against `GITHUB_WEBHOOK_SECRET`
4. Parses PR title + body for `BX3-N` identifier
5. If found → direct Linear GraphQL call to close matching issue
6. Logged to webhook debug log

**Poll agents** (fallback, every 6 hours):
- Check for missed webhook deliveries (stale open issues with merged PRs)

---

### Linear
- **Account:** `bxthre3inc@gmail.com`
- **Team ID:** `ffb6f386-e51a-4aa9-a686-e92e3e1c3e81`
- **User ID:** `be904814-6678-4b8d-8e62-c7acd880cef2`
- **Completed state ID:** `2ea4e15f-69c5-46d7-97c3-2495a070e796`
- **Canceled state ID:** `4e8b624e-f04f-4e9e-bf2c-37342eee442e`
- **API:** Linear GraphQL (`https://api.linear.app/graphql`), auth via `AGENTOS_GITHUBPAT`

**Issue naming convention:** `BX3-N` (e.g., `BX3-5`, `BX3-6`)

**Bridge agents:**
- `linear-to-gtasks` (15-min poll): Issues assigned to `be904814` → Google Tasks, routed by keyword
  - "agentic" / "Agentic" → BX3:Agentic
  - "irrig8" / "Irrig8" / "farm" → BX3:Irrig8
  - everything else → BX3:Today
- `gtasks-to-linear` (15-min poll): New Google Tasks in BX3:Today without `[BX3-` prefix → Linear issue

---

### Google Tasks
- **Account:** `getfarmsense@gmail.com`
- **No outbound webhooks** — polling only

**Task lists (created 2026-04-16):**
| List | ID | Purpose |
|------|----|---------|
| BX3:Today | `MjJ3TlRoU3pjT1c4X2pERw` | General / unclassified tasks |
| BX3:Agentic | `eG9wOUxObnpidmptczNRNA` | Agentic development |
| BX3:Irrig8 | `bGsxVXFOcmotNnRscWhKMQ` | Irrig8 farming OS |
| BX3:Projects | `WEozRDdoa1VrUFRjRnAzag` | All other projects |

**Automation rules:**
- INBOX routing → Google Tasks (via `INBOX_ROUTING.py`)
- `#action` items in work-log/INBOX → BX3:Today
- Log file: `Bxthre3/INBOX/foundry-queue/google-tasks-log.md`

**Daily agent:** `morning-brief` — 8am daily email summarizing all 4 task lists

---

### Airtable
- **Account:** `getfarmsense@gmail.com`
- **Bases in use:**
  - `appHg8lr1v409yKBc` — Agentic base (6 tables)
  - `app93dsGcEyPfkqaa` — Enterprise Command Center (8 tables, includes Organizations)

**Tables in Enterprise Command Center:**
- Organizations (primary)
- Team
- Integrations
- Products
- ... (see `airtable_oauth-list-tables` output for full schema)

**Airtable native automations** can POST to zo.space webhooks for event-driven flows.

---

### Notion
- **Account:** `getfarmsense@gmail.com`
- **Status:** Barely utilized — should be primary project documentation layer
- **Capabilities:** Full page/block CRUD, file uploads, comments, databases
- **Gap:** No Notion → workspace sync exists yet

---

### Google Workspace (Calendar, Drive, Gmail)
- **Account:** `getfarmsense@gmail.com`
- **Calendar:** Event creation from rules; no systematic meeting → task flow
- **Drive:** Connected; file upload/download available
- **Gmail:** Sending working; not tracking responses or creating follow-ups

---

## Rules (Active)

| Condition | Action |
|-----------|--------|
| New directory at workspace root | Enforce `Bxthre3/projects/` canonical structure |
| P1 entry in INBOX.md | SMS alert to brodiblanco |
| INBOX routing triggered | Google Task created in appropriate list |
| `#action` in work-log/INBOX | Google Task created in BX3:Today |
| Symbolic link created | Verify target exists, delete if broken |

---

## Agents (Active Scheduled)

| Agent | Schedule | Purpose |
|-------|---------|---------|
| `linear-to-gtasks` | Every 15 min | Linear issues → Google Tasks |
| `gtasks-to-linear` | Every 15 min | Google Tasks → Linear issues |
| `github-linear-fallback` | Every 6 hours | GitHub PR → Linear close (poll fallback) |
| `linear-hygiene` | Daily 9am | Audit stale Linear issues, email summary |
| `morning-brief` | Daily 8am | Email all Google Tasks across 4 lists |

---

## Canonical Project Structure

All active work lives under `Bxthre3/projects/`. Archive at `Bxthre3/_archive/`.

```
Bxthre3/
  projects/
    the-agentic-project/   ← Agentic core
    the-agentic-root/     ← AgentOS runtime + governance
    the-agentos-project/  ← Android native client
    irrig8/               ← Irrig8 farming OS
    credswallet/          ← CREDsWallet
    low-price-auto-glass/  ← Monte Vista auto glass app
    the-ard-project/       ← ARD project
    ...
  INBOX/
    agents/               ← Agent inboxes
    departments/           ← Department inboxes
    foundry-queue/        ← Processing queue + logs
  work-log/               ← Meeting + decision logs
  VAULT/                  ← IP, arxiv, investor materials
  vpc-decks/              ← Pitch decks
```

---

## Key Conventions

- **Issue IDs:** Always `BX3-N` format (e.g., `BX3-5`, not `BX3-005`)
- **Product names:** "Agentic" (not AgentOS), "Irrig8" (not FarmSense)
- **GitHub PAT for Linear:** `AGENTOS_GITHUBPAT` env var
- **Webhook secret:** `GITHUB_WEBHOOK_SECRET`
- **Sync state file:** `Bxthre3/INBOX/foundry-queue/linear-gtasks-sync-state.json`

---

## Known Gaps / TODO

- [ ] Notion → workspace project doc sync (bidirectional)
- [ ] Airtable → Linear issue creation on new records
- [ ] Google Calendar → meeting notes auto-extracted to INBOX
- [ ] Gmail → follow-up task creation on no-response
- [ ] Linear → Notion page auto-creation on new issues
- [ ] Agentic-specific Linear project (currently all issues in one team)
- [ ] GitHub Issues → Google Tasks for non-PR issue tracking
