#!/usr/bin/env bash
set -euo pipefail

# Open a shell (or run a one-off command) in the prodbox pod of a Ruby
# production cell. Switches gcloud and kubectl via ruby-cell (leaves that
# cell selected). Requires setup_infra.sh.
#
# Usage:
#   connect-prodbox.sh <eu|us|cell-*>                  # interactive shell
#   connect-prodbox.sh <eu|us|cell-*> -- <command...>  # run a command, then exit

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/prodbox.sh
source "${SCRIPT_DIR}/lib/prodbox.sh"

ALIAS="${1:?Usage: connect-prodbox.sh <eu|us|cell-*> [-- <command...>]}"
shift

# Drop the optional "--" separator before the command, if present.
if [[ "${1:-}" == "--" ]]; then
  shift
fi

require_ruby_cell

CELL="$(cell_for_alias "$ALIAS")"
ruby-cell "$CELL"

POD_NAME="$(get_prodbox_pod)"
echo "   Pod: ${POD_NAME}" >&2

if [[ "$#" -gt 0 ]]; then
  kubectl exec "$POD_NAME" -- "$@"
else
  echo "   Opening interactive shell (exit to disconnect)..." >&2
  kubectl exec -it "$POD_NAME" -- bash
fi
