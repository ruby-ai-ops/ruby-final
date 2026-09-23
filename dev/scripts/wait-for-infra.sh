#!/usr/bin/env bash
# Block until infra.sh finishes (Cursor runs start + terminals in parallel).
set -euo pipefail

RUBY_DEV_SCRIPT_NAME=wait-for-infra
# shellcheck source=dev/scripts/common.sh
source "$(dirname "$0")/common.sh"
# shellcheck source=dev/scripts/env.sh
source "$(dirname "$0")/env.sh"

READY_FILE="${RUBY_INFRA_LOG_DIR}/infra.ready"
MAX_WAIT_SECONDS="${RUBY_INFRA_WAIT_SECONDS:-900}"
POLL_INTERVAL="${RUBY_INFRA_WAIT_POLL:-2}"

if [ -f "$READY_FILE" ]; then
  log "Infra already ready"
  exit 0
fi

log "Waiting for infra to finish (up to ${MAX_WAIT_SECONDS}s)..."
log "Ready marker: ${READY_FILE}"

attempt=0
max_attempts=$((MAX_WAIT_SECONDS / POLL_INTERVAL))
while [ "$attempt" -lt "$max_attempts" ]; do
  if [ -f "$READY_FILE" ]; then
    log "Infra is ready"
    exit 0
  fi

  attempt=$((attempt + 1))
  if [ "$attempt" -eq 1 ] || [ $((attempt % 15)) -eq 0 ]; then
    log "Still waiting for infra (${attempt}/${max_attempts})..."
    if [ -s "${RUBY_INFRA_LOG_DIR}/setup-dev-db.log" ]; then
      tail -1 "${RUBY_INFRA_LOG_DIR}/setup-dev-db.log" 2>/dev/null || true
    fi
  fi
  sleep "$POLL_INTERVAL"
done

log "Timed out waiting for infra. Check the infra output and ${RUBY_INFRA_LOG_DIR}/"
if [ -f "${RUBY_INFRA_LOG_DIR}/init-elasticsearch.log" ]; then
  tail -20 "${RUBY_INFRA_LOG_DIR}/init-elasticsearch.log"
fi
if [ -f "${RUBY_INFRA_LOG_DIR}/setup-dev-db.log" ]; then
  tail -20 "${RUBY_INFRA_LOG_DIR}/setup-dev-db.log"
fi
exit 1
