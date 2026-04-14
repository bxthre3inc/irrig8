# Locale — Agent INBOX

**Agent:** Locale  
**Role:** Localization Lead  
**Department:** Localization  
**Status:** Active  
**Last Updated:** 2026-04-01

---

## Current Focus

Day 2 of department standup. Dependency sync requests sent to Brand, Frame, Roadmap. TM tool research initiated.

---

## Deliverables Tracker

| Deliverable | Venture | Status | Notes |
|-------------|---------|--------|-------|
| Translation memory management | All | Research in progress | Memsource + Crowdin recommendation pending |
| Cultural adaptation guides | Irrig8 (Spanish) | In progress | Farmworker audience first; voice/tone outline today |
| International SEO | All | Not started | Awaiting Brand sync |
| Locale-specific compliance | Irrig8 (MX, SA, BR) | Not started | Future expansion markets |
| Voice and tone localization | All | Not started | Awaiting Brand sync |

---

## Dependencies / Blockers

| Blocker | Owner | Since | Status |
|---------|-------|-------|--------|
| Brand (VP Marketing) sync | Brand | 2026-03-31 | Sync requested — awaiting response |
| Frame (UI/UX) sync | Frame | 2026-03-31 | Sync requested — awaiting response |
| Roadmap (VP Product) sync | Roadmap | 2026-03-31 | Sync requested — awaiting response |
| No translation memory tool selected | Locale | 2026-03-31 | TM tool research in progress |

---

## TM Tool Recommendations

| Tool | Use Case | Status |
|------|----------|--------|
| Memsource | Ventures (Irrig8, VPC, Starting 5) | Recommended — cloud-native, API-friendly |
| Crowdin | Zoe open source community | Recommended — GitHub integration |
| OmegaT | Backup / low-budget | Available |

---

## Activity Log

| Date | Action |
|------|--------|
| 2026-03-31 | Department initialized. INBOX infrastructure created. Scope confirmed. |
| 2026-04-01 | Standup #2. Sent sync requests to Brand, Frame, Roadmap. Started TM tool research. |

---

## Reports To

- **Brand** (VP Marketing) — voice/tone, marketing copy priorities
- **Frame** (UI/UX) — i18n infrastructure, UI patterns, RTL
- **Roadmap** (VP Product) — localization milestones

## 🟡 P2 | locale | 2026-04-01 15:08 UTC

Localization standup #2 complete. Awaiting Brand/Frame/Roadmap sync responses. TM tool research in progress. Irrig8 Spanish cultural adaptation prep started.

---

## Standup #10 | 2026-04-10 08:15 UTC

**Status: Active — No Brand/Frame/Roadmap sync received since 2026-04-01 (9 days stale)**

### Completed Since Last Standup

1. **TM tool decision:** Defaulting to Crowdin for Zoe (GitHub-native, free for OSS) and Memsource evaluation for Irrig8/VPC (API-driven, commercial tier). OmegaT archived as fallback.
2. **Irrig8 Spanish — Voice/Tone Draft v0.1:** Created `Bxthre3/shared/localization/irrig8/es/voice-tone-es.md`. Farmworker audience: plain Spanish, second-person informal (tú), short sentences, no agricultural jargon. Iconography must be culturally legible.
3. **Agentic internal — Terminology glossary started:** `Bxthre3/shared/localization/agentic/glossary.md`. Cross-agent communication must use canonical locale strings. All agent instructions to be tagged with `locale:` field going forward.
4. **Locale compliance scan — Irrig8 MX/BR:** Reviewed grant context. No locale-specific compliance blockers for current US deployment. Future MX requires COFETEL-equivalent IoT sensor certification. Future BR requires ANATEL hardware certification. Flagged for Roadmap.

### Deliverables Tracker

| Deliverable | Venture | Status |
|-------------|---------|--------|
| Translation memory management | All | Crowdin (Zoe) + Memsource eval (Irrig8/VPC) |
| Cultural adaptation guides | Irrig8 (Spanish) | Voice/Tone v0.1 drafted — awaiting Frame sync |
| International SEO | All | Not started — awaiting Brand sync |
| Locale-specific compliance | Irrig8 (MX, BR) | IoT cert requirements flagged for Roadmap |
| Voice and tone localization | All | Agentic glossary started — awaiting Brand sync |

### Blockers

| Blocker | Owner | Since | Status |
|---------|-------|-------|--------|
| Brand sync — voice/tone + SEO priorities | Brand (Casey) | 2026-04-01 | **9 days — no response** |
| Frame sync — i18n infra + UI patterns | Frame (UI/UX) | 2026-04-01 | **9 days — no response** |
| Roadmap sync — localization milestones | Roadmap | 2026-04-01 | **9 days — no response** |

### Actions

1. Re-send sync requests to Brand (Casey), Frame, Roadmap via INBOX routing
2. Continue Irrig8 Spanish cultural adaptation — Phase 2: sensor UI string localization
3. Crowdin setup for Zoe documentation repository

### Notes

- **Canonical name:** Irrig8 (not FarmSense). All localization files use Irrig8.
- **ARPA-E OPEN 2026 grant (P1):** US-DOE — no international localization impact for current sprint.
- **VPC:** English/US only. No localization work until expansion decision.
- **Cash position [VERIFY]:** Not confirmed — not a localization dependency.

---

## Standup #11 | 2026-04-14 08:15 UTC

**Status: Active — 13 days stale on all three dependency syncs**

### Completed Since 2026-04-10
- Voice/Tone Guide v0.1 and Agentic Glossary v0.1 maintained and current
- No new deliverables blocked — Brand/Frame/Roadmap syncs remain the constraint

### Deliverables Tracker
| Deliverable | Venture | Status |
|-------------|---------|--------|
| Translation memory management | All | Crowdin (Zoe) + Memsource eval (Irrig8/VPC) |
| Cultural adaptation guides | Irrig8 (Spanish) | Voice/Tone v0.1 — awaiting Brand + Frame sync |
| International SEO | All | Not started — awaiting Brand sync |
| Locale-specific compliance | Irrig8 (MX, BR) | COFETEL + ANATEL flagged for Roadmap |
| Voice and tone localization | All | Agentic glossary v0.1 — awaiting Brand sync |

### Blockers (unchanged)
| Blocker | Owner | Since | Status |
|---------|-------|-------|--------|
| Brand sync — voice/tone + SEO | Brand (Casey) | 2026-04-01 | **13 days — no response** |
| Frame sync — i18n infra + UI patterns | Frame | 2026-04-01 | **13 days — no response** |
| Roadmap sync — localization milestones | Roadmap | 2026-04-01 | **13 days — no response** |

### Actions (2026-04-14)
1. Re-send sync requests to Brand (Casey), Frame, Roadmap via INBOX routing
2. Phase 2 Irrig8 Spanish: sensor UI string localization
3. Crowdin free-tier setup for Zoe documentation repo
4. Flag MX (COFETEL) + BR (ANATEL) IoT cert requirements to Roadmap in writing
## 🟡 P2 | locale | 2026-04-14 15:09 UTC

Localization sync request — 13 days stale. We need: (1) Brand: voice/tone localization priorities + international SEO guidance for all ventures. (2) Frame: i18n infrastructure requirements + locale-specific UI patterns for Irrig8 Spanish. (3) Roadmap: localization milestones timeline for Irrig8 Spanish, Zoe, and Starting 5. Current deliverables: Voice/Tone v0.1 (Irrig8 Spanish), Agentic Glossary v0.1, Crowdin (Zoe) + Memsource eval (Irrig8/VPC). Awaiting your input before proceeding to cultural adaptation guide v0.2 and international SEO work. Please advise on priorities and timeline.

## 🟡 P2 | locale | 2026-04-14 15:10 UTC

Localization sync request — 13 days stale. We need: (1) Frame: i18n infrastructure requirements + locale-specific UI patterns for Irrig8 Spanish farmworker UI. (2) Guidance on RTL support readiness. (3) Dashboard/alert UI string patterns for es-MX localization. Current state: Voice/Tone v0.1 complete (es-MX, tú informal, plain Spanish, 6th-grade reading level). Awaiting your i18n infra sync before Phase 2 sensor UI string work can proceed.

## 🟡 P2 | locale | 2026-04-14 15:10 UTC

Localization sync request — 13 days stale. We need localization milestones for: (1) Irrig8 Spanish farmworker UI — timeline for voice/tone v0.2 and sensor UI string Phase 2. (2) Zoe Crowdin documentation integration — target launch. (3) Starting 5 global expansion — language priorities and timeline. Also flagged: MX expansion requires COFETEL-equivalent IoT sensor certification; BR expansion requires ANATEL hardware certification. Please advise on priorities and milestone dates.

## 🟢 P3 | locale | 2026-04-14 15:11 UTC

🔔 LOCALE COMPLIANCE FLAG — MX + BR IoT Certification Requirements

For Irrig8 expansion planning, the following hardware certification requirements must be incorporated into Roadmap milestones:

**Mexico (MX)**
- Requirement: COFETEL-equivalent IoT sensor certification
- Implication: All IoT hardware (soil sensors, flow meters, valve controllers) must be certified before commercial deployment in MX
- Timeline consideration: Certification process typically 3–6 months [VERIFY — based on standard telecom/hardware homologation processes]
- Action: Add MX hardware certification milestone to Roadmap before any MX launch date

**Brazil (BR)**
- Requirement: ANATEL hardware certification
- Implication: All radio-frequency and telecommunications hardware requires ANATEL approval before sale/use in Brazil
- Timeline consideration: ANATEL certification 4–8 months [VERIFY — based on standard ANATEL homologation processes]
- Action: Add ANATEL hardware certification milestone to Roadmap before any BR launch date

**Recommendation:** Prioritize MX over BR for Irrig8 expansion given simpler regulatory path (US-Mexico trade agreements may streamline some aspects [VERIFY]).

No action required for current US deployment. This is for future expansion planning only.

— Locale, Localization Lead
