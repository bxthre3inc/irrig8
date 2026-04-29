# Localization — Department INBOX

> **Department:** Localization  
> **Lead:** Locale (Agent)  
> **Created:** 2026-04-17  
> **Reports to:** Brand (VP Marketing), Frame (UI/UX), Roadmap (VP Product)

---

## Mission

Own localization and internationalization across all Bxthre3 ventures. Adapt products, marketing, and support for different languages, cultures, and regulatory environments.

---

## Scope

| Venture | Primary Locale | Expansion Roadmap |
|---------|---------------|-------------------|
| **Irrig8** | English (US) | Spanish (farmworkers, Colorado SLV) → Mexican Spanish → Portuguese (Brazil) |
| **Valley Players Club** | English (US) | US only initially |
| **Starting 5** | English (US) | Global founder communities |
| **Zoe** | English | Global open-source community |
| **AgentOS** | English | Internal agent instructions only |

---

## Deliverables

- [x] Translation memory management — Basic structure established
- [x] Cultural adaptation guides — v1.0 foundation complete
- [ ] International SEO — Not started
- [ ] Locale-specific compliance — Not started
- [x] Voice and tone localization — v0.1 draft complete (es-MX)

---

## Active Projects

### Phase 1: Infrastructure (April 2026) — ✅ COMPLETE
- [x] `locale.md` agent INBOX established
- [x] Translation memory directory structure
- [x] Cultural adaptation guide v1.0
- [x] Locale routing rules for AgentOS

### Phase 2: Irrig8 Spanish (Q2 2026) — 🔲 IN PROGRESS (proceeding without Frame i18n)
- [x] Voice & tone guide v0.1 (`shared/localization/irrig8/es/voice-tone-es.md`)
- [ ] Spanish UI strings for farmworker-facing interfaces — initiating with v0.1 patterns
- [ ] Spanish field documentation
- [ ] Agricultural term glossary (EN↔ES) — foundation complete, `[VERIFY]` terms need domain expert validation

---

## Meeting Cadence

- **Daily standup:** 8:15 AM MT via Sync Agent

---

## Stakes

| Priority | Routing | SLA |
|---------|---------|-----|
| P0/P1 | brodiblanco via INBOX.md + SMS | Immediate |
| P2 | Department INBOX | Same day |
| P3/P4 | Agent INBOX | Weekly |

---

## External Sync Blockers (As of 2026-04-22)

| Sync Request | Owner | Last Sent | Days Stale |
|-------------|-------|----------|------------|
| Voice/tone + SEO priorities | Brand (Casey) | 2026-04-01 | **21 days** |
| i18n infra + UI patterns | Frame (UI/UX) | 2026-04-01 | **21 days** |
| Localization milestones | Roadmap (VP Product) | 2026-04-01 | **21 days** |

**Action (2026-04-22):** P2 escalation routed to brodiblanco INBOX. Phase 2 proceeding with best-available v0.1 voice/tone patterns — Frame i18n infrastructure not available.

---

## Locale Inventory

### Active
| Code | Language | Audience | Venture |
|------|---------|----------|---------|
| `en-US` | English (US) | All users | All |
| `es-MX` | Mexican Spanish | Farmworkers (Colorado SLV) | Irrig8 |

### Planned
| Code | Language | Target | Venture |
|------|---------|--------|---------|
| `pt-BR` | Portuguese (Brazil) | Brazil ag market | Irrig8 |
| `es-CO` | Colombian Spanish | Colombia ag market | Irrig8 |

---

## Last Updated

2026-04-20 — Phase 1 complete; Phase 2 blocked on external syncs

---

## Standup Log

### 2026-04-24 — 08:15 AM MT
- Phase 2: Irrig8 Spanish sensor UI strings — **IN PROGRESS**
  - Using v0.1 voice/tone patterns (es-MX tú informal, 6th-grade)
  - Proceeding without Frame i18n infrastructure — gap: **22 days**
- External sync blockers: Brand (voice/tone/SEO), Frame (i18n infra) — 22 days stale
- No P1/P2 escalations
- No resource needs
- Next: Complete sensor alert strings → navigation labels → confirmation dialogs

### 2026-04-23 — 09:05 AM MT
- Phase 2 proceeding: Irrig8 Spanish sensor UI strings in progress
- 22-day sync gap on Frame/Brand/Roadmap — ongoing
- No blockers, no escalations, no resource needs