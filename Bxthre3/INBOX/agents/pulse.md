# Pulse Health Check Log
**Last Run:** 2026-03-29 14:05 UTC

## System Status

| System | Status | Response Time | Notes |
|--------|--------|---------------|-------|
| zo.space | ✅ Healthy | 0.46s | HTTP 200 |
| AgentOS API | ✅ Healthy | 0.17s | HTTP 200 |
| n8n Connector Hub | 🔴 DOWN | 0.15s | HTTP 521 (Cloudflare origin unreachable) |
| Airtable | ✅ Healthy | ~0.4s | Connected - 1 base (AgentOS Base) |
| Linear | ✅ Healthy | ~0.5s | Connected as getfarmsense@gmail.com |
| Gmail | ✅ Healthy | - | OAuth connected |

## Alerts

### 🔴 P1 - n8n Connector Hub (n8n-connector-hub-brodiblanco.zocomputer.io)
- **Issue:** HTTP 521 - Origin connection refused
- **Start Time:** 2026-03-29 14:05 UTC
- **Status:** DOWN > 0 min (no uptime data)
- **Escalation:** P2 to INBOX (not P1 until > 5 min)

### P3 - n8n unavailable
- n8n webhook triggers will not fire until service is restored

## Actions Taken
1. Logged status to this file
2. No SMS sent (not P1 yet)

## Next Check
- Scheduled: Next interval per agent configuration
## 🟡 P2 | pulse | 2026-03-29 14:06 UTC

n8n connector hub (https://n8n-connector-hub-brodiblanco.zocomputer.io) returning HTTP 521. zo.space, AgentOS API, Airtable, Linear, Gmail all healthy.
