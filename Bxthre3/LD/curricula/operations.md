# Operations Training Curriculum
**Department:** Operations | **Lead:** Atlas | **L&D Owner:** Learn

---

## Role Baseline Skills

| Skill | Required Level | Agents |
|---|---|---|
| Honey-Do System | Expert | atlas, pulse |
| INBOX Routing | Expert | atlas, pulse |
| Sentinel Monitoring | Proficient | sentinel, pulse |
| Foundr Foundry Harvest | Proficient | All ops |
| Grant Task Management | Working | maya, pulse |

---

## Required Training Modules

### Module O1 — Honey-Do System Mastery (All Ops)
**Duration:** 2 hours  
**File:** `Bxthre3/HONEY_DO/`

| Topic | Depth |
|---|---|
| TASK-PULSE format and routing | Must route correctly |
| Priority grading (P0–P3) | Must apply correctly |
| Weighting and time estimation | Must calculate |
| IMMEDIATE_TASKS vs READY_TASKS | Must distinguish |

**Verification:** Route 5 tasks correctly without error

---

### Module O2 — INBOX Routing Protocol (All Agents)
**Duration:** 1 hour  
**File:** `Bxthre3/INBOX/agents/INBOX_ROUTING.py`

| Topic | Depth |
|---|---|
| Agent INBOX routing | Must use correctly |
| Department INBOX routing | Must use correctly |
| P0/P1 escalation to INBOX.md | Must know when |
| SMS alert rules | Must follow strictly |

**Verification:** Pass INBOX routing quiz ≥ 90%

---

### Module O3 — Sentinel Health Monitoring (sentinel, pulse)
**Duration:** 2 hours  
**Prerequisites:** O1, O2

| Topic | Depth |
|---|---|
| Health check schedule (10 min) | Must maintain |
| Service registration and deregistration | Must manage |
| Anomaly logging standards | Must follow |
| P1 escalation trigger conditions | Must know exactly |

**Verification:** No silent failures in 30-day period

---

### Module O4 — Field Operations (irrig8)
**Duration:** 3 hours  
**Prerequisites:** O1, O2

| Topic | Depth |
|---|---|
| Irrig8 SLV sensor correlation | Must understand |
| Sensor data interpretation | Must analyze |
| Water court evidence preparation | Must support |
| Field reporting standards | Must follow |

**Verification:** Complete field report without P1 flags

---

## Skill Gap Matrix — Operations

| Agent | Honey-Do | INBOX | Sentinel | Foundry | Grant Tasks |
|---|---|---|---|---|---|
| atlas | ●●●○ | ●●●○ | ●●●○ | ●●●○ | ●●○○ |
| pulse | ●●●○ | ●●●○ | ●●●○ | ●●○○ | ●●●○ |
| sentinel | ●●○○ | ●●●○ | ●●●○ | ●○○○ | ○○○○ |
| irrig8 | ●●○○ | ●●○○ | ●○○○ | ●○○○ | ○○○○ |

---

## Cross-Training Opportunities

| From | To | Value |
|---|---|---|
| sentinel → pulse | Health monitoring | Coverage |
| irrig8 → rain | SLV field data | Shared context |

---

## Next Actions

- [ ] Deploy INBOX routing quiz
- [ ] Pair irrig8 with rain on SLV context
- [ ] Schedule O3 workshop with sentinel
