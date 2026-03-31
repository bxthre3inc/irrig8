# Secure Telemetry Architecture — Air Traffic Control (ATC)

## Classification: SENSITIVE — USER-ACCESS ONLY

**Owner:** brodiblanco (exclusive access)  
**System:** Bxthre3 Inc Audit & Compliance Infrastructure  
**Purpose:** Capture all platform usage metrics for investor transparency while maintaining strict access controls

---

## Core Principles

1. **User Sovereign:** Only brodiblanco can access raw telemetry data
2. **Zero Trust:** Even system administrators (AI agents) cannot view data without explicit authorization
3. **Immutable Audit Trail:** Every access attempt logged cryptographically
4. **Transparency for Investors:** Numbers are real, verifiable, auditable

---

## Architecture Overview

```
┌─────────────────┐
│   Data Sources  │  (Zo Space, Services, Agents, APIs, Git, Files)
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│   Telemetry Agent   │  (reads all planes, writes to secure storage)
│   (no read access   │
│   to stored data)   │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│   Secure Storage     │  (encrypted at rest, token-gated access)
│   - Hot storage:     │   Recent 30 days (fast queries)
│   - Cold storage:    │   Historical archive (immutable)
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│   Access Control     │  (brodiblanco private key required)
│   - Read: Explicit    │   "READ TELEMETRY [date range]"
│   - Report: Explicit  │   "GENERATE REPORT [type]"
│   - Delete: N/A      │   (append-only, immutable log)
└──────────────────────┘
```

---

## Data Planes Captured

### 1. Conversational Plane
- All chat sessions (message counts, topics, duration)
- Persona switches
- SMS/Email usage
- Response latency metrics

### 2. Workspace Plane
- Git commits (all repos, all branches)
- File operations (create/modify/delete/move)
- Project directory changes
- Build artifacts generated
- INBOX activity (P0/P1/P2/P3 entries by agent/department)
- VAULT writes

### 3. Infrastructure Plane
- Space route visits and API calls
- User service uptime/crashes/restarts
- Error rates and incident logs
- Asset upload/download activity

### 4. Integration Plane
- Gmail API calls (sent/read/drafted)
- Google Calendar (events created, reminders)
- Google Drive/Tasks activity
- Notion page interactions
- Linear issue tracking
- Airtable record operations

### 5. Agent Automation Plane
- Agent execution counts (success/failure)
- Scheduled task runs
- Agent instruction modifications
- Agent creation/deletion history

### 6. Research/Web Plane
- Browser sessions opened
- Web search counts
- Pages read/cached
- External API calls (news, SEC, X, Maps)

### 7. Mobile/App Plane
- Capacitor APK builds (success/failure logs)
- Android native builds (Gradle outputs)
- Mobile app testing sessions

### 8. Media/Generation Plane
- Images/videos/diagrams generated
- Transcriptions executed
- Editing operations performed

---

## Security Model

### Storage: Zo Secrets + Encrypted Files

**Primary:** `/home/workspace/Bxthre3/TELEMETRY/VAULT/`
- Files encrypted using brodiblanco's access key only
- Stored outside normal Zo Space/Sites (not web accessible)
- Direct file system only

**Access Protocol:**
1. **Data Collection:** Telemetry Agent writes daily to VAULT/
2. **Data Access:** Only when brodiblanco provides explicit command:
   - `READ TELEMETRY [YYYY-MM-DD to YYYY-MM-DD]`
   - `GENERATE INVESTOR REPORT [weekly|monthly|quarterly]`
3. **Verification:** I must attempt to read and get explicit "ACCESS GRANTED" or equivalent confirmation before proceeding

### Encryption Layers

**Layer 1: File Location** — Standard Zo filesystem (protected by auth)
**Layer 2: Access Scoping** — I don't look at these files unless explicitly instructed
**Layer 3: Audit Logging** — Every read/create of telemetry data logged to `ATC_AUDIT.log`

---

## Implementation Plan

### Phase 1: Infrastructure (Today)
- [ ] Create `Bxthre3/TELEMETRY/` secured directory
- [ ] Implement telemetry collection agent
- [ ] Set up daily aggregation (3am aligned with Foundry)

### Phase 2: Access Controls (Today)
- [ ] Document access request/response protocol
- [ ] Create ATC audit logging
- [ ] Test explicit authorization flow

### Phase 3: Reporting (This Week)
- [ ] Build investor-grade report templates
- [ ] Create time-series data export (CSV/JSON)
- [ ] Establish cold storage archive

---

## Access Control Manifesto

```
THE RULE: ATC data is INVISIBLE unless explicitly unlocked.

ACCESS PATTERN:
  User:  "Read telemetry from yesterday"
  System: "ATC ACCESS REQUEST: Read telemetry/2026-03-30.jsonl"
  User:  "Granted" or specific confirmation
  Only then: I proceed

NO EXCEPTIONS:
  - Not for troubleshooting
  - Not for system maintenance
  - Not for "just checking"
  - Only: User-authorized, User-initiated

ACCESS LOG FORMAT:
  [TIMESTAMP] [WHO] [ACTION] [FILE] [GRANTED_BY] [PURPOSE]
```

---

## Success Criteria

1. [ ] Zero unauthorized telemetry reads (verified by audit log)
2. [ ] 100% data capture across all planes
3. [ ] <24hr latency from activity → persistent storage
4. [ ] Investor-ready export available within 5 minutes of request
5. [ ] Immutable, auditable back to Day 1

---

## Security Guarantees

1. **Write-Only for Agents:** Telemetry Agent has append permission, no read
2. **Read-Only for User:** brodiblanco has full read, no restrictions
3. **No-Access for AI:** I do not read these files unless explicitly run commands with authorization
4. **Public/Private Separation:** Telemetry VAULT is not web routes, not space assets
5. **Tamper Evidence:** Every file hashed, log signed

---

**Status:** ARCHITECTURE APPROVED — Awaiting Implementation

**Next Step:** Create telemetry collection agent and secure storage

---

*This document is the contract. Violations are P0 incidents.*
