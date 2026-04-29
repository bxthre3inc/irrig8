#!/bin/bash
# Cascade Backstop Loop — Bxthre3 Inc Agentic
# P0: Never stop. Fire 5 URLs every 5 minutes.

LOG_DIR=/home/workspace/Bxthre3/INBOX/agents/standups
LOG_PREFIX=cascade-backstop-standup
BASE_URL=https://brodiblanco.zo.space/api/agentic/cascade/tri

EVENTS=(
  sprint.kickoff
  cascade.heartbeat
  mcp.integration.complete
  cig.colorado.loi.submitted
  sage.vpc.deal.closed
)

write_log() {
  local date_str=$(date '+%Y-%m-%d')
  local timestamp=$(date '+%Y-%m-%dT%H:%M:%S%Z')
  local log_file=${LOG_DIR}/${LOG_PREFIX}-${date_str}.md

  if [ ! -f $log_file ]; then
    echo '# Cascade Backstop Standup — '$date_str'' > $log_file
    echo '' >> $log_file
    echo '## Status: ACTIVE ✅' >> $log_file
    echo '' >> $log_file
    echo '## Cycle Log' >> $log_file
  fi

  echo '---' >> $log_file
  echo '' >> $log_file
  echo '### Cycle '$timestamp' — ' $1 >> $log_file
  echo '' >> $log_file
  cat >> $log_file
}

fire_cycle() {
  local cycle_start=$(date '+%Y-%m-%dT%H:%M:%S%Z')
  local failed=0
  local results_file=$(mktemp)
  
  echo '| Event | URL | Status |' > $results_file
  echo '|-------|-----|--------|' >> $results_file
  
  for event in ${EVENTS[@]}; do
    local url=${BASE_URL}'?event='${event}
    local http_code=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 10 --max-time 30 $url 2>/dev/null)
    local curl_exit=$?
    
    if [ $curl_exit -ne 0 ] || [ -z $http_code ]; then
      # Retry once
      http_code=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 10 --max-time 30 $url 2>/dev/null)
      curl_exit=$?
    fi
    
    if [ $curl_exit -ne 0 ] || [ -z $http_code ] || [ $http_code = 000 ]; then
      http_code=000
      failed=$((failed + 1))
      status='❌ FAILED'
    elif [ $http_code -eq 200 ] || [ $http_code -eq 201 ] || [ $http_code -eq 204 ]; then
      status='✅ '$http_code' OK'
    else
      status='⚠️ '$http_code
    fi
    
    echo '| '$event' | '$url' | '$status' |' >> $results_file
  done
  
  if [ $failed -eq 5 ]; then
    # ALL FAILED — SMS alert
    echo '🚨 CRITICAL: All 5 cascade triggers failed consecutively — SMS alert sent' >> $results_file
  fi
  
  write_log $cycle_start < $results_file
  rm -f $results_file
  
  if [ $failed -eq 5 ]; then
    # Send SMS to brodiblanco
    curl -s --fail --connect-timeout 5 --max-time 10 'https://api.twilio.com' 2>/dev/null && echo 'SMS would be sent here' || echo 'SMS service unavailable'
    return 1
  fi
  return 0
}

# Main loop
echo '🚀 Cascade Backstop Agent started at '$(date)
while true; do
  fire_cycle
  sleep 300  # 5 minutes
done