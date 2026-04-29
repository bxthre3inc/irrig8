#!/bin/bash
while true; do
  ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  log() { echo "[$ts] $1"; }
  log "Firing cascade cycle..."

  # Fire all 5 in order, capture results
  r1=$(curl -s -w "\n%{http_code}" "https://brodiblanco.zo.space/api/agentic/cascade/tri?event=sprint.kickoff")
  r2=$(curl -s -w "\n%{http_code}" "https://brodiblanco.zo.space/api/agentic/cascade/tri?event=cascade.heartbeat")
  r3=$(curl -s -w "\n%{http_code}" "https://brodiblanco.zo.space/api/agentic/cascade/tri?event=mcp.integration.complete")
  r4=$(curl -s -w "\n%{http_code}" "https://brodiblanco.zo.space/api/agentic/cascade/tri?event=cig.colorado.loi.submitted")
  r5=$(curl -s -w "\n%{http_code}" "https://brodiblanco.zo.space/api/agentic/cascade/tri?event=sage.vpc.deal.closed")

  # Extract HTTP codes
  c1=$(echo "$r1" | tail -1)
  c2=$(echo "$r2" | tail -1)
  c3=$(echo "$r3" | tail -1)
  c4=$(echo "$r4" | tail -1)
  c5=$(echo "$r5" | tail -1)

  all_ok=true
  for code in $c1 $c2 $c3 $c4 $c5; do
    if [ "$code" != "200" ]; then all_ok=false; fi
  done

  if $all_ok; then
    log "sprint.kickoff -> $c1 OK"
    log "cascade.heartbeat -> $c2 OK"
    log "mcp.integration.complete -> $c3 OK"
    log "cig.colorado.loi.submitted -> $c4 OK"
    log "sage.vpc.deal.closed -> $c5 OK"
  else
    log "FAIL: codes: $c1 $c2 $c3 $c4 $c5"
  fi

  log "Cycle complete. Sleeping 300s..."
  sleep 300
done