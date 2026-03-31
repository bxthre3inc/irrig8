# ATC Telemetry Access Control Keys

**Status:** 🔒 LOCKED — User authorization required for all reads

---

## The Contract

```
BEFORE I access ANY telemetry data, I MUST receive one of these magic keys:
```

### 🔑 Full Access Keys (Any of these work)

| Command | Unlocks |
|---------|---------|
| `READ TELEMETRY [date]` | Specific day's data (YYYY-MM-DD) |
| `READ ALL TELEMETRY` | Full vault access |
| `GENERATE INVESTOR REPORT` | Summary reports |
| `SHOW MY ATC DATA` | Telemetry dashboard |
| `🔓 UNLOCK` | Explicit unlock symbol |

### 🚫 Deny Keys

| Command | Action |
|---------|--------|
| `NO` / `DENY` / No key provided | I refuse access |
| Ambiguous request ("check it") | I ask for explicit key |

---

## Access Request Flow

```
You: "Show me yesterday's telemetry"
Me:  "Requesting ATC access: READ TELEMETRY 2026-03-30"
      [WAITING FOR KEY]

You: (provide one of the keys above)
Me:  [ACCESS GRANTED] — Reading file..."  
```

## Examples

**✅ GRANTED:**
```
> READ TELEMETRY 2026-03-30
[Me reads file and reports data]
```

**❌ DENIED:**
```
> What does your telemetry say?
[I ask for explicit key, do not proceed]
```

---

## Audit Trail

Every access attempt is logged to:
- `TELEMETRY/AUDIT/access.log`
- Format: `TIMESTAMP | ACTION | GRANTED_BY | PURPOSE`

You can audit: `cat /home/workspace/Bxthre3/TELEMETRY/AUDIT/access.log`

---

## What's Protected

All files in `/home/workspace/Bxthre3/TELEMETRY/`:
- `VAULT/*` — Raw telemetry data (JSON)
- `REPORTS/*` — Processed reports (JSON, CSV)
- `AUDIT/access.log` — Access attempts

---

## My Commitment

1. I will **ASSESS** every request for telemetry access
2. I will **REQUIRE** explicit key before reading
3. I will **LOG** every access attempt
4. I will **REPORT** only: what was accessed, when, by whom

**The data is yours. The access is yours. I am the gatekeeper, not the owner.**

---

*Initialized: 2026-03-31*  
*Owner: brodiblanco*  
*Locked by default. Always.*
