# WIN: Grant-to-Task Automation (Hybrid Mode)

**DATE:** 2026-03-29  
**SHIP TIME:** 19 minutes  
**OPTION:** D (Hybrid)

---

## What Shipped

### 1. Auto-Task Creator Script
- **Path:** `Skills/grants-hq/scripts/auto-task-creator.py`
- Scans pipeline.csv for deadlines within 45 days
- Creates P0/P1/P2 tasks based on urgency + LOI/P0 flags
- Outputs to JSON + INBOX markdown

### 2. Daily Automation Agent
- **Name:** Grants-HQ Agent
- **Schedule:** Daily 8am UTC
- **Action:** Run script + escalate P0s to brodiblanco

### 3. Captured P0 Task
- **Grant:** FED-US-003 CIG Colorado (Irrig8)
- **Deadline:** 2026-04-30 (32 days)
- **Priority:** P2 → P0 escalated (LOI flagged)
- **Action:** Contact NRCS CO state office
- **Assigned:** @casey

---

## Immediate Value

| Before | After |
|--------|-------|
| Manual grant checking | Daily automated scanning |
| Missed deadlines | Automatic P0 escalation |
| No task tracking | INBOX integration + Agent assignment |

---

## Next Automations (Queue)

1. **Investor portal lead triage** (hourly)
2. **Daily standup digest** (8:15am MT)
3. **Water Court evidence bundle** (weekly)

---

*Shipped fast. Iterating next.*
