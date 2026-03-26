# AgentOS v6.0.0 — Release Notes
**Released:** 2026-03-26
**Version:** 6.0.0
**Package:** com.bxthre3.agentos

## Artifacts
- **Debug APK:** `releases/AgentOS-6.0.0-debug.apk` (18MB)
- **Build:** ./gradlew assembleDebug

## SPEC Compliance Checklist
- [x] Version 6.0.0 in API status
- [x] 19 canonical agents in /agents
- [x] Package com.bxthre3.agentos
- [x] No MockData.kt (live API only)
- [x] All 10 API endpoints operational

## Verification
```bash
curl https://brodiblanco.zo.space/api/agentos/status | jq '.version'
# Returns: "6.0.0"
```
