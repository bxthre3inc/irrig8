# Pulse Health Check - 2026-03-26

**Timestamp:** 2026-03-26T05:55:00 UTC

## Systems Status

| System | Status | Response Time | Notes |
|--------|--------|---------------|-------|
| zo.space | ✅ Healthy | 0.64s | HTTP 200 |
| AgentOS API (localhost:3099) | ⚠️ Offline | 1.7ms | Returns 404 - service not running on local port |
| AgentOS API (via zo.space) | ✅ Healthy | 0.53s | `/api/agentos/status` returns 200 |
| n8n connector hub | ✅ Healthy | 0.66s | HTTP 200 |
| Airtable | ✅ Connected | - | getfarmsense@gmail.com |
| Linear | ✅ Connected | - | getfarmsense@gmail.com |
| Gmail | ✅ Connected | - | getfarmsense@gmail.com |
| Google Calendar | ✅ Connected | - | getfarmsense@gmail.com |

## Notes

- AgentOS service at localhost:3099 is not running. However, AgentOS API functionality is available via zo.space routes (`/api/agentos/*`).
- All integrations (Airtable, Linear, Gmail, Google Calendar) are connected and operational.

## Escalation

- No P1 or P2 escalations required.
- P3: AgentOS local service (localhost:3099) not running - may need attention if local API access is required.

---
*Next check: Scheduled on interval*