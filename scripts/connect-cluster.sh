#!/usr/bin/env bash
set -euo pipefail

# Point kubectl at a Ruby production cell.
#
# Switches gcloud and kubectl via ruby-cell. Requires setup_infra.sh.
#
# Usage: connect-cluster.sh <eu|us|cell-*>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/prodbox.sh
source "${SCRIPT_DIR}/lib/prodbox.sh"

ALIAS="${1:?Usage: connect-cluster.sh <eu|us|cell-*>}"

require_ruby_cell

CELL="$(cell_for_alias "$ALIAS")"
ruby-cell "$CELL"

echo "✅ kubectl is now pointed at ${CELL}."
