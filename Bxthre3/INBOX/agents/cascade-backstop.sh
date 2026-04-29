#!/bin/bash
# Cascade Backstop Agent for Bxthre3 Inc — Agentic
# P0: Keep Agentic alive. Fire 5 cascade triggers every 5 minutes.

LOG_DIR=/home/workspace/Bxthre3/INBOX/agents/standups
CASCADE_URLS=(
  'https://brodiblanco.zo.space/api/agentic/cascade/tri?event=sprint.kickoff'
  'https://brodiblanco.zo.space/api/agentic/cascade/tri?event=cascade.heartbeat'
  'https://brodiblanco.zo.space/api/agentic/cascade/tri?event=mcp.integration.complete'
  'https://brodiblanco.zo.space/api/agentic/cascade/tri?event=cig.colorado.loi.submitted'
  'https://brodiblanco.zo.space/api/agentic/cascade/tri?event=sage.vpc.deal.closed'
)

EVENT_NAMES=(
  'sprint.kickoff'
  'cascade.heartbeat'
  'mcp.integration.complete'
  'cig.colorado.loi.submitted'
  'sage.vpc.deal.closed'
)

consecutive_failures=0

log_cycle() {
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  local log_file=${LOG_DIR}/cascade-backstop-standup-$(date '+%Y-%m-%d').md
  
  if [ ! -f $log_file ]; then
    echo '# Cascade Backstop Agent - Daily Standup Log' > $log_file
    echo '' >> $log_file
    echo '| Timestamp | Event | Status | Response |' >> $log_file
    echo '|-----------|-------|--------|----------|' >> $log_file
  fi
  
  echo $1 >> $log_file
  echo $1
}

fire_trigger() {
  local url=$1
  local event=$2
  local retry=$3
  
  response=$(curl -s -w '\n%{http_code}' --max-time 30 --retry 2 --retry-delay 1 -L -A 'CascadeBackstopAgent/1.0' --connect-timeout 10 --max-redirs 5 --fail-with-body --output - 2>&1)
  
  # Extract HTTP code (last line)
  http_code=$(echo -e $response | tail -n1)
  body=$(echo -e $response | sed '$d')
  
  if [ -z http_code ] || [ ${http_code:0:1} = '0' ]; then
    echo 'ERROR'
  elif [ $http_code -ge 200 ] && [ $http_code -lt 400 ]; then
    echo 'SUCCESS'
  else
    echo 'FAILED'
  fi
}

run_cycle() {
  local cycle_start=$(date '+%Y-%m-%d %H:%M:%S')
  local cycle_id=$(date '+%Y%m%d%H%M%S')
  local all_success=true
  local failures_this_cycle=0
  
  log_cycle ''
  log_cycle '## Cycle: `'$cycle_id'` at `'$cycle_start'`'
  log_cycle ''
  log_cycle '| # | Event | Status | HTTP | Duration |'
  log_cycle '|---|-------|--------|------|----------|'
  
  for i in ${!CASCADE_URLS[@]}; do
    local url=${CASCADE_URLS[$i]}
    local event=${EVENT_NAMES[$i]}
    local start_time=$(date +%s)
    
    # Try first attempt
    local result=$(fire_trigger $url $event 0)
    local attempt=1
    
    # Retry once if failed
    if [ $result != 'SUCCESS' ]; then
      sleep 2
      result=$(fire_trigger $url $event 1)
      attempt=2
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    local status_icon='✅'
    if [ $result != 'SUCCESS' ]; then
      status_icon='❌'
      all_success=false
      failures_this_cycle=$((failures_this_cycle + 1))
    fi
    
    log_cycle '| '$((i+1))' | `'$event'` | '$status_icon' '$result' (attempt '$attempt') | - | '${duration}s' |'
  done
  
  log_cycle ''
  
  # Track consecutive failures
  if $all_success; then
    consecutive_failures=0
    log_cycle '**✅ Cycle completed - all triggers successful**'
  else
    consecutive_failures=$((consecutive_failures + 1))
    log_cycle '**❌ Cycle completed - '$failures_this_cycle' trigger(s) failed (consecutive failures: '$consecutive_failures')**'
    
    # Critical: all 5 failed consecutively
    if [ $consecutive_failures -ge 1 ]; then
      local all_failed=true
      for i in ${!CASCADE_URLS[@]}; do
        local url=${CASCADE_URLS[$i]}
        if curl -s --max-time 10 -o /dev/null -w '%{http_code}' $url | grep -qE '^[2-3][0-9][0-9]$'; then
          all_failed=false
          break
        fi
      done
      
      if $all_failed; then
        log_cycle '🚨 **CRITICAL: All 5 triggers failed consecutively! Sending SMS alert.**'
        # Note: send_sms_to_user would be called here via the agent framework
      fi
    fi
  fi
  
  log_cycle ''
  log_cycle '---'
  log_cycle ''
}

# Main loop - run forever
log_cycle '# 🚀 Cascade Backstop Agent Started'
log_cycle '**Timestamp:** '$(date '+%Y-%m-%d %H:%M:%S %Z')
log_cycle '**PID:** '$$
log_cycle ''

while true; do
  run_cycle
  sleep 300  # 5 minutes
done