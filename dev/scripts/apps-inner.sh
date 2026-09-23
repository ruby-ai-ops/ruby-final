#!/usr/bin/env bash
# Launch tools/mprocs.yaml (deps watches + services). Prefer apps.sh / up.sh as the entry.
set -euo pipefail

RUBY_DEV_SCRIPT_NAME=apps-inner
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=dev/scripts/common.sh
source "${SCRIPT_DIR}/common.sh"
# shellcheck source=dev/scripts/env.sh
source "${SCRIPT_DIR}/env.sh"

ensure_node_path
install_mprocs_config

cd "$RUBY_REPO_ROOT"

# Force dependents to wait for a fresh sdks-js build.
rm -rf sdks/js/dist
# Same for ui. Its dist is a volume mount, so empty it rather than removing it.
mkdir -p ui/dist && find ui/dist -mindepth 1 -delete

export RUBY_USE_START_MPROCS=1
export RUBY_IN_CONTAINER="${RUBY_IN_CONTAINER:-1}"

MPROCS_LOG_DIR="${RUBY_INFRA_LOG_DIR}/mprocs-logs"
mkdir -p "${MPROCS_LOG_DIR}"
log "Starting mprocs (select a process and press r to restart; q to quit)"
log "Process logs also under ${MPROCS_LOG_DIR}/<name>.log"
cd "${RUBY_REPO_ROOT}/tools"
exec env \
  SHELL=/bin/bash \
  TERM="${TERM}" \
  COLORTERM="${COLORTERM}" \
  LANG="${LANG}" \
  LC_ALL="${LC_ALL}" \
  RUBY_IN_CONTAINER="${RUBY_IN_CONTAINER}" \
  mprocs --config mprocs.yaml --log-dir "${MPROCS_LOG_DIR}"
