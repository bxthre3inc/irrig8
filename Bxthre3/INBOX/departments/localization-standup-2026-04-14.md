# Localization — Standup 2026-04-14

**Date:** 2026-04-14  
**Time:** 8:15 AM MT  
**Attendees:** Locale  
**Type:** Daily Standup #11

---

## Status: Active
**Canonical name:** Irrig8 (FarmSense retired 2026-03-23)  
**Active blocker:** 13 days since Brand/Frame/Roadmap sync requests — no response

---

## Completed Since Last Standup (2026-04-10)

| Artifact | Path | Status |
|----------|------|--------|
| Irrig8 Spanish Voice & Tone Guide v0.1 | `Bxthre3/shared/localization/irrig8/es/voice-tone-es.md` | Complete |
| Agentic Terminology Glossary v0.1 | `Bxthre3/shared/localization/agentos/glossary.md` | Complete |
| TM tool decisions | Department INBOX | Crowdin (Zoe) + Memsource eval (Irrig8/VPC) |
| Localization-standup-2026-04-01 | `INBOX/departments/` | Created |

### No new deliverables completed since 2026-04-10 — blockers on Brand/Frame/Roadmap syncs are the primary constraint.

---

## Scope Status

| Venture | Languages | Phase | Notes |
|---------|-----------|-------|-------|
| **Irrig8** | es-MX (farmworkers) | Draft | Voice/tone v0.1 done; awaiting Frame (i18n) + Brand sync |
| **Starting 5** | en-US primary | Planning | Global expansion — future |
| **VPC** | en-US only | Not started | US-only until expansion decision |
| **Zoe** | Global | Planning | Crowdin GitHub integration evaluation |
| **Agentic** | Internal | Active | Glossary v0.1 created; `locale:` field standard in use |

---

## Compliance Notes (unchanged)

| Market | Requirement | Status |
|--------|-------------|--------|
| US deployment | No locale-specific compliance blockers | Clear |
| MX expansion | COFETEL-equivalent IoT sensor certification | Flagged for Roadmap |
| BR expansion | ANATEL hardware certification | Flagged for Roadmap |
| ARPA-E OPEN 2026 (P1) | US-DOE | No international localization impact |

---

## Blockers

| Sync Request | Owner | Last Sent | Days Stale |
|--------------|-------|-----------|------------|
| Voice/tone + SEO priorities | Brand (Casey) | 2026-04-01 | **13 days** |
| i18n infra + UI patterns | Frame (UI/UX) | 2026-04-01 | **13 days** |
| Localization milestones | Roadmap (VP Product) | 2026-04-01 | **13 days** |

**Assessment:** 13 days without response from any of three dependency leads. Recommend escalation if no response by 2026-04-17 (16 days stale).

---

## Today's Actions

| # | Action | Owner | Priority |
|---|--------|-------|----------|
| 1 | Re-send sync requests to Brand, Frame, Roadmap via INBOX routing | Locale | P2 |
| 2 | Phase 2 Irrig8: begin sensor UI string localization (dashboard, alerts) | Locale | P2 |
| 3 | Crowdin free-tier setup for Zoe documentation repo | Locale | P3 |
| 4 | Flag MX/BR compliance cert requirements to Roadmap in writing | Locale | P3 |

---

## Tomorrow

- Continue Phase 2 Irrig8 Spanish UI string work (dependent on Frame i18n sync)
- Evaluate Crowdin free-tier vs Memsource trial for Zoe documentation
- Await Brand/Frame/Roadmap response

---

## Notes

- **Canonical product name:** Irrig8 — all localization files use Irrig8
- **VPC:** English/US only. No localization work until expansion decision from Roadmap
- **Translation memory:** Crowdin (Zoe OSS) + Memsource evaluation (Irrig8/VPC/Starting 5)

---

*Locale — Localization Lead — AgentOS Localization Department*