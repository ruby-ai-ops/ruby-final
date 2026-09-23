#!/bin/bash
# Ruby Sandbox Profile - Shared Infrastructure
# Entry point sourced by the host wrapper. Sources the provider-specific
# profile (anthropic.sh, openai.sh, gemini.sh) when RUBY_PROFILE is set
# and the matching file exists. Older images that ship only this file
# define the tool functions inline and ignore RUBY_PROFILE.

set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SCRIPT_DIR
RUBY_TOOLS_CMD="${RUBY_TOOLS_CMD:-$SCRIPT_DIR/ruby-tools}"
export RUBY_TOOLS_CMD

source "$SCRIPT_DIR/shell.sh"

run_ruby_tool() {
  # shellcheck disable=SC2206
  local ruby_tools_cmd=( $RUBY_TOOLS_CMD )
  "${ruby_tools_cmd[@]}" "$@"
}
export -f run_ruby_tool

ls() {
  command ls -al "$@"
}
export -f ls

if [ -n "${RUBY_PROFILE:-}" ] && [ -f "$SCRIPT_DIR/${RUBY_PROFILE}.sh" ]; then
  source "$SCRIPT_DIR/${RUBY_PROFILE}.sh"
fi
