# Locale — Agent INBOX

> **Agent:** Locale  
> **Role:** Localization Lead — AgentOS Localization Department  
> **Department:** Localization  
> **Created:** 2026-04-17

---

## Status

Active — Daily standup at 8:15 AM MT

---

## Current Sprint

### 2026-04-24: Phase 2 — Sensor UI Strings In Progress

**Completed:**
- Phase 1 infrastructure: COMPLETE ✅
- Agentic Terminology Glossary v0.1
- Irrig8 Spanish Voice & Tone Guide v0.1
- Spatial Agriculture Glossary foundation
- UI strings translation memory template

**In Progress:**
- Phase 2 Irrig8 Spanish sensor UI strings — active
  - Dashboard alerts (water level, soil moisture)
  - Navigation labels
  - Using v0.1 voice/tone patterns (es-MX tú informal, 6th-grade)
  - Proceeding without Frame i18n sync — gap: **22 days**

**Blockers:**
- Frame (UI/UX): i18n infrastructure requirements + locale-specific UI patterns — 22 days stale
- Brand (VP Marketing): voice/tone localization priorities + international SEO guidance — 22 days stale

---

## Phase 2: Irrig8 Spanish UI Strings

Proceeding without Frame i18n sync. Using v0.1 voice/tone guide patterns.

Sensor UI string categories to localize:
1. Dashboard alerts (water level, soil moisture)
2. Navigation labels
3. Confirmation dialogs
4. Error messages
5. Tooltips and help text

Target: es-MX informal tú register, 6th-grade reading level, agricultural domain vocabulary.

---

## Deliverable Status

| Deliverable | Status | Notes |
|------------|--------|-------|
| Translation Memory | ✅ Basic structure | Crowdin (Zoe) + Memsource eval (Irrig8/VPC) |
| Cultural Adaptation Guide | ✅ v1.0 foundation | Farmworker-specific for SLV |
| International SEO | 🔲 Not started | Awaiting Brand priorities |
| Locale Compliance | 🔲 Not started | Colorado water law context |
| Voice/Tone Localization | ✅ v0.1 draft | es-MX tú informal, 6th-grade level |

---

## Locale Inventory

### Primary Languages
| Code | Language | Ventures | Priority |
|------|---------|---------|----------|
| `en-US` | English (US) | All | Primary |
| `es-US` | Spanish (US/Mexico) | Irrig8 | P1 |
| `pt-BR` | Portuguese (Brazil) | Irrig8 | P2 |

### Secondary Languages
| Code | Language | Ventures | Priority |
|------|---------|---------|----------|
| `es-MX` | Mexican Spanish | Irrig8 | P1 (active) |
| `es-CO` | Colombian Spanish | Irrig8 | Future |

---

## Key Files

| File | Purpose |
|------|---------|
| `Bxthre3/INBOX/departments/localization.md` | Department INBOX |
| `Bxthre3/INBOX/agents/locale.md` | Agent INBOX |
| `Bxthre3/shared/localization/irrig8/es/voice-tone-es.md` | Voice/tone v0.1 |
| `Bxthre3/shared/localization/agentos/glossary.md` | Agentic glossary v0.1 |
| `Bxthre3/projects/the-irrig8-project/docs/LOCALIZATION/spatial-agriculture-glossary.md` | EN↔ES ag terms |
| `Bxthre3/projects/the-irrig8-project/docs/LOCALIZATION/cultural-adaptation-guide.md` | Cultural notes |

---

## Escalation History

| Date | Issue | Route | Resolution |
|------|-------|-------|------------|
| 2026-04-01 | Initial sync requests to Brand/Frame/Roadmap | INBOX routing | No response |
| 2026-04-14 | Re-send sync requests | INBOX routing | No response |
| 2026-04-20 | Re-route via Vance | INBOX routing | Pending |
| 2026-04-22 | 21-day escalation to brodiblanco | INBOX routing | P2, no SMS — pending |

---

## Notes

- FarmSense was retired 2026-03-23 — canonical product name is **Irrig8**
- Spanish localization for Irrig8 is farmworker-facing (Colorado SLV) — requires agricultural domain vocabulary
- AgentOS internal communications remain English-only unless explicitly expanded
- Glossary terms tagged `[VERIFY]` — require agronomist/bilingual ag specialist validation

---

## Last Updated

2026-04-24 — 08:15 AM MT standup logged
