#!/bin/bash
LOGDIR="/home/workspace/Bxthre3/INBOX/agents/standups"
LOGFILE="$LOGDIR/cascade-backstop-standup-$(date '+%Y-%m-%d').md"
API="https://brodiblanco.zo.space/api/agentic/cascade/tri"
EVENTS=("sprint.kickoff" "cascade.heartbeat" "mcp.integration.complete" "cig.colorado.loi.submitted" "sage.vpc.deal.closed")
FAIL_COUNT=0

log_cycle() {
  echo "## Cycle — $(date -u '+%Y-%m-%d %H:%M UTC')" >> "$LOGFILE"
  echo "| # | Event | Status | Response |" >> "$LOGFILE"
  echo "|---|-------|--------|----------|" >> "$LOGFILE"
  for i in "${!EVENTS[@]}"; do
    EVENT="${EVENTS[$i]}"
    RESPONSE=$(curl -s "${API}?event=${EVENT}" 2>&1)
    EXIT=$?
    if [ $EXIT -eq 0 ]; then
      echo "| $((i+1)) | ${EVENT} | ✓ 200 | ${RESPONSE} |" >> "$LOGFILE"
    else
      echo "| $((i+1)) | ${EVENT} | ✗ ${EXIT} | ${RESPONSE} |" >> "$LOGFILE"
    fi
  done
  echo "" >> "$LOGFILE"
}

while true; do
  LOGFILE="$LOGDIR/cascade-backstop-standup-$(date '+%Y-%m-%d').md"
  TODAY=$(date '+%Y-%m-%d')
  
  # Rotate log if day changed
  NEWLOG="$LOGDIR/cascade-backstop-standup-${TODAY}.md"
  [ "$LOGFILE" != "$NEWLOG" ] && LOGFILE="$NEWLOG"

  FAILURES=0
  for EVENT in "${EVENTS[@]}"; do
    RESPONSE=$(curl -s "${API}?event=${EVENT}" 2>&1)
    EXIT=$?
    if [ $EXIT -ne 0 ]; then
      FAILURES=$((FAILURES+1))
      # Retry once
      sleep 2
      RESPONSE=$(curl -s "${API}?event=${EVENT}" 2>&1)
      [ $? -ne 0 ] && FAILURES=$((FAILURES+3)) # Mark retry fail as 3 to distinguish
    fi
  done

  if [ $FAILURES -ge 15 ]; then
    # All 5 failed twice = consecutive total failure
    curl -s -X POST "https://api.zo.computer/zo/ask" \
      -H "Authorization: Bearer ${ZO_CLIENT_IDENTITY_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{"input":"CASCADE BACKSTOP FAILURE: All 5 cascade events failed consecutively. Immediate attention required.","model_name":"zo:minimax/minimax-m2.7"}' > /dev/null 2>&1
  fi

  log_cycle
  sleep 300
done
