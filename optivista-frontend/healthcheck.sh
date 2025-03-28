#!/bin/bash

# Health check script for OptiVista Frontend
# This script checks if the frontend is responding properly and restarts the service if needed

# Configuration
FRONTEND_URL="http://localhost"
MAX_RETRIES=3
RETRY_INTERVAL=10
LOG_FILE="/var/log/optivista-frontend-health.log"
METRICS_FILE="/var/log/optivista-frontend-metrics.log"
SERVICE_NAME="optivista-frontend"
SLACK_WEBHOOK_URL="" # Set your Slack webhook URL if you want notifications

# Ensure log directory exists
mkdir -p $(dirname "$LOG_FILE")
mkdir -p $(dirname "$METRICS_FILE")

# Function to log messages
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to send notification
notify() {
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -s -X POST -H 'Content-type: application/json' --data "{\"text\":\"$1\"}" "$SLACK_WEBHOOK_URL"
  fi
}

# Function to record metrics
record_metric() {
  echo "$(date +'%Y-%m-%d %H:%M:%S'),$1,$2" >> "$METRICS_FILE"
}

# Check if the frontend is responding
check_frontend() {
  response=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null)
  if [ "$response" = "200" ]; then
    return 0
  else
    return 1
  fi
}

# Get CPU and memory usage of the service
get_resource_usage() {
  CPU_USAGE=$(ps -C serve -o %cpu --no-headers | awk '{s+=$1} END {print s}')
  MEM_USAGE=$(ps -C serve -o %mem --no-headers | awk '{s+=$1} END {print s}')
  
  # Record metrics
  record_metric "cpu" "$CPU_USAGE"
  record_metric "memory" "$MEM_USAGE"
  
  log "Current resource usage: CPU ${CPU_USAGE}%, Memory ${MEM_USAGE}%"
}

# Main health check logic
for ((i=1; i<=MAX_RETRIES; i++)); do
  log "Health check attempt $i of $MAX_RETRIES"
  
  if check_frontend; then
    log "Frontend is responding normally"
    get_resource_usage
    exit 0
  else
    log "Frontend is not responding properly (attempt $i)"
    
    if [ $i -eq $MAX_RETRIES ]; then
      log "Maximum retries reached, attempting to restart the service"
      
      # Check if service is running
      if systemctl is-active --quiet "$SERVICE_NAME"; then
        log "Service is running but not responding, restarting..."
        notify "⚠️ OptiVista Frontend is not responding. Attempting restart."
        
        # Restart the service
        systemctl restart "$SERVICE_NAME"
        
        # Wait for service to restart
        sleep 30
        
        # Check if restart fixed the issue
        if check_frontend; then
          log "Service successfully restarted and is now responding"
          notify "✅ OptiVista Frontend successfully restarted and is now responding"
          exit 0
        else
          log "Service still not responding after restart, manual intervention required"
          notify "🚨 CRITICAL: OptiVista Frontend not responding after restart. Manual intervention required!"
          exit 1
        fi
      else
        log "Service is not running, attempting to start"
        notify "⚠️ OptiVista Frontend service is not running. Attempting to start."
        
        # Start the service
        systemctl start "$SERVICE_NAME"
        
        # Wait for service to start
        sleep 30
        
        # Check if start fixed the issue
        if check_frontend; then
          log "Service successfully started and is now responding"
          notify "✅ OptiVista Frontend successfully started and is now responding"
          exit 0
        else
          log "Service still not responding after start, manual intervention required"
          notify "🚨 CRITICAL: OptiVista Frontend not starting properly. Manual intervention required!"
          exit 1
        fi
      fi
    fi
    
    # Wait before retrying
    sleep "$RETRY_INTERVAL"
  fi
done

exit 1 