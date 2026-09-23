# Bash completion script for ruby-hive (and dh alias)
#
# Install (pick one):
#   1. Source directly in .bashrc:
#        source /path/to/completions/ruby-hive.bash
#   2. Copy/symlink into bash_completion.d:
#        ln -s /path/to/completions/ruby-hive.bash /etc/bash_completion.d/ruby-hive
#        # or on macOS with brew:
#        ln -s /path/to/completions/ruby-hive.bash "$(brew --prefix)/etc/bash_completion.d/ruby-hive"
#
# Sourcing this file defines:
#   dh    - alias for ruby-hive
#   dhs   - spawn -C -c "claude --dangerously-skip-permissions"
#   dho   - open -C
#   dhl   - list
#   dhd   - destroy
#   dhw   - warm
#   dhc   - cool
#   dhx   - spawn -C -c "codex"
#   dhb   - open app URL in browser
#   dhdb  - open psql on environment database
#   dhcd  - cd into environment worktree (changes dir in current shell)

_ruby_hive_services=(sdk ui front core oauth connectors front-workers front-spa-admin front-spa-app viz)
_ruby_hive_warm_state_services=(front front-api core oauth connectors front-workers front-spa-admin front-spa-app viz)
# Avoid invoking the Bun CLI from completion; derive state from PID files plus one Docker scan.

_ruby_hive_json_string() {
  local file="${1:?usage: _ruby_hive_json_string <file> <key>}"
  local key="${2:?usage: _ruby_hive_json_string <file> <key>}"

  command sed -nE "s/^[[:space:]]*\"$key\"[[:space:]]*:[[:space:]]*\"([^\"]*)\".*/\\1/p" "$file" 2>/dev/null |
    head -1
}

_ruby_hive_path_is_at_or_inside() {
  local parent="${1%/}"
  local candidate="${2%/}"

  [[ -n "$parent" ]] || return 1
  [[ "$candidate" == "$parent" || "$candidate" == "$parent"/* ]]
}

_ruby_hive_env_worktree_path() {
  local env_name="${1:?usage: _ruby_hive_env_worktree_path <env>}"
  local metadata="$HOME/.ruby-hive/envs/$env_name/metadata.json"
  local repo_root worktree_path

  [[ -f "$metadata" ]] || return

  worktree_path="$(_ruby_hive_json_string "$metadata" "worktreePath")"
  if [[ -z "$worktree_path" ]]; then
    repo_root="$(_ruby_hive_json_string "$metadata" "repoRoot")"
    [[ -n "$repo_root" ]] || return
    worktree_path="$repo_root/.hives/$env_name"
    if [[ ! -d "$worktree_path" && -d "$HOME/ruby-hive/$env_name" ]]; then
      worktree_path="$HOME/ruby-hive/$env_name"
    fi
  fi

  echo "$worktree_path"
}

_ruby_hive_current_env_from_metadata() {
  local cwd="$PWD"
  local env_dir env_name worktree_path
  local best_env="" best_len=0 path_len

  [[ -d "$HOME/.ruby-hive/envs" ]] || return

  while IFS= read -r env_dir; do
    env_name="${env_dir##*/}"
    [[ -f "$env_dir/metadata.json" ]] || continue

    worktree_path="$(_ruby_hive_env_worktree_path "$env_name")"
    [[ -n "$worktree_path" ]] || continue

    if _ruby_hive_path_is_at_or_inside "$worktree_path" "$cwd"; then
      path_len=${#worktree_path}
      if (( path_len > best_len )); then
        best_env="$env_name"
        best_len=$path_len
      fi
    fi
  done < <(command find "$HOME/.ruby-hive/envs" -mindepth 1 -maxdepth 1 -type d 2>/dev/null)

  [[ -n "$best_env" ]] && echo "$best_env"
}

_ruby_hive_current_env() {
  # 1. Detect from cwd using registered environment metadata
  local current
  current="$(_ruby_hive_current_env_from_metadata)"
  if [[ -n "$current" ]]; then
    echo "$current"
    return
  fi

  # 2. Fall back to last-active env from activity.json
  local activity=~/.ruby-hive/activity.json
  if [[ -f "$activity" ]]; then
    local last
    last="$(command grep -o '"lastEnv" *: *"[^"]*"' "$activity" 2>/dev/null | head -1)"
    [[ -n "$last" ]] || return
    last="${last##*: \"}"
    last="${last%\"}"
    echo "$last"
  fi
}

_ruby_hive_envs() {
  local envs=()
  if [[ -d ~/.ruby-hive/envs ]]; then
    while IFS= read -r e; do
      [[ -n "$e" ]] && envs+=("$e")
    done < <(ls ~/.ruby-hive/envs 2>/dev/null)
  fi

  local current
  current="$(_ruby_hive_current_env)"

  # Put the current env first so it shows up prominently
  local result=()
  if [[ -n "$current" ]]; then
    for e in "${envs[@]}"; do
      [[ "$e" == "$current" ]] && result+=("$e")
    done
    for e in "${envs[@]}"; do
      [[ "$e" != "$current" ]] && result+=("$e")
    done
  else
    result=("${envs[@]}")
  fi

  _ruby_hive_filter_selected_envs "${result[@]}"
}

_ruby_hive_word_already_used() {
  local candidate="${1:?usage: _ruby_hive_word_already_used <name>}"
  local start=1
  local comp_cword="${COMP_CWORD:-0}"
  local i word

  if [[ -n "${cmd_index:-}" ]] && (( cmd_index > 0 )); then
    start=$(( cmd_index + 1 ))
  fi

  for (( i=start; i<comp_cword; i++ )); do
    word="${COMP_WORDS[$i]}"
    [[ "$word" == -* ]] && continue
    [[ "$word" == "$candidate" ]] && return 0
  done

  return 1
}

_ruby_hive_filter_selected_envs() {
  local env

  for env in "$@"; do
    _ruby_hive_word_already_used "$env" || printf '%s\n' "$env"
  done
}

_ruby_hive_pid_is_running() {
  local pid_file="${1:?usage: _ruby_hive_pid_is_running <pid-file>}"
  local pid

  [[ -r "$pid_file" ]] || return 1
  IFS= read -r pid < "$pid_file" || [[ -n "$pid" ]] || return 1
  [[ "$pid" =~ ^[0-9]+$ ]] || return 1

  kill -0 "$pid" 2>/dev/null
}

_ruby_hive_service_is_running() {
  local env_name="${1:?usage: _ruby_hive_service_is_running <env> <service>}"
  local service="${2:?usage: _ruby_hive_service_is_running <env> <service>}"

  _ruby_hive_pid_is_running "$HOME/.ruby-hive/envs/$env_name/$service.pid"
}

_ruby_hive_docker_warm_envs() {
  command docker ps --format '{{.Label "com.docker.compose.project"}}' 2>/dev/null |
    awk '/^ruby-hive-/ { sub(/^ruby-hive-/, ""); print }' |
    sort -u
}

_ruby_hive_name_in_lines() {
  local name="${1:?usage: _ruby_hive_name_in_lines <name> <lines>}"
  local lines="${2-}"

  [[ "
$lines
" == *"
$name
"* ]]
}

_ruby_hive_fast_state_rows() {
  local docker_warm_envs env_dir env_name state service

  [[ -d "$HOME/.ruby-hive/envs" ]] || return

  docker_warm_envs="$(_ruby_hive_docker_warm_envs)"

  while IFS= read -r env_dir; do
    env_name="${env_dir##*/}"
    [[ -f "$env_dir/metadata.json" ]] || continue

    state="stopped"
    if _ruby_hive_name_in_lines "$env_name" "$docker_warm_envs"; then
      state="warm"
    elif _ruby_hive_service_is_running "$env_name" "sdk" &&
      _ruby_hive_service_is_running "$env_name" "ui"; then
      state="cold"
    fi

    if [[ "$state" != "warm" ]]; then
      for service in "${_ruby_hive_warm_state_services[@]}"; do
        if _ruby_hive_service_is_running "$env_name" "$service"; then
          state="warm"
          break
        fi
      done
    fi

    printf '%s %s\n' "$env_name" "$state"
  done < <(command find "$HOME/.ruby-hive/envs" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort)
}

_ruby_hive_envs_by_states() {
  local desired_states=("$@")
  [[ ${#desired_states[@]} -gt 0 ]] || return
  local envs=()
  local name

  while IFS= read -r name; do
    [[ -n "$name" ]] && envs+=("$name")
  done < <(
    _ruby_hive_fast_state_rows | awk -v desired_states="${desired_states[*]}" '
      BEGIN {
        split(desired_states, states, " ")
        for (i in states) {
          state_set[states[i]] = 1
        }
      }
      state_set[$2] { print $1 }
    '
  )

  local current
  current="$(_ruby_hive_current_env)"

  local result=()
  if [[ -n "$current" ]]; then
    for name in "${envs[@]}"; do
      [[ "$name" == "$current" ]] && result+=("$name")
    done
    for name in "${envs[@]}"; do
      [[ "$name" != "$current" ]] && result+=("$name")
    done
  else
    result=("${envs[@]}")
  fi

  _ruby_hive_filter_selected_envs "${result[@]}"
}

_ruby_hive_warmable_envs() {
  _ruby_hive_envs_by_states cold
}

_ruby_hive_warm_envs() {
  _ruby_hive_envs_by_states warm
}

_ruby_hive_coolable_envs() {
  _ruby_hive_warm_envs
}

_ruby_hive_startable_envs() {
  _ruby_hive_envs_by_states stopped
}

_ruby_hive_stoppable_envs() {
  _ruby_hive_envs_by_states cold warm
}

_ruby_hive_first_positional() {
  local comp_cword="${COMP_CWORD:-0}"
  local start=1
  local i word

  if [[ -n "${cmd_index:-}" ]] && (( cmd_index > 0 )); then
    start=$(( cmd_index + 1 ))
  fi

  for (( i=start; i<comp_cword; i++ )); do
    word="${COMP_WORDS[$i]}"
    [[ "$word" == -* ]] && continue
    printf '%s\n' "$word"
    return
  done
}

_ruby_hive_feature_flags_file() {
  local roots=()
  local env_name worktree_path repo_root root

  for env_name in "$(_ruby_hive_first_positional)" "$(_ruby_hive_current_env)"; do
    [[ -n "$env_name" ]] || continue

    worktree_path="$(_ruby_hive_env_worktree_path "$env_name")"
    [[ -n "$worktree_path" ]] && roots+=("$worktree_path")

    repo_root="$(_ruby_hive_json_string "$HOME/.ruby-hive/envs/$env_name/metadata.json" "repoRoot")"
    [[ -n "$repo_root" ]] && roots+=("$repo_root")
  done

  for root in "${roots[@]}"; do
    if [[ -f "$root/front/types/shared/feature_flags.ts" ]]; then
      printf '%s\n' "$root/front/types/shared/feature_flags.ts"
      return
    fi
  done
}

# Parse flag names out of the source file; invoking the Bun CLI here would be too slow.
_ruby_hive_flags() {
  local file
  file="$(_ruby_hive_feature_flags_file)"
  [[ -n "$file" ]] || return

  local flag
  while IFS= read -r flag; do
    _ruby_hive_word_already_used "$flag" || printf '%s\n' "$flag"
  done < <(
    command sed -nE '/WHITELISTABLE_FEATURES_CONFIG = \{/,/^\} as const/ s/^  ([A-Za-z0-9_]+):[[:space:]]*\{[[:space:]]*$/\1/p' "$file" 2>/dev/null
  )
}

_ruby_hive_complete() {
  local cur prev words cword
  _init_completion 2>/dev/null || {
    # Fallback if bash-completion library isn't loaded
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    words=("${COMP_WORDS[@]}")
    cword=$COMP_CWORD
  }

  # Find which subcommand is active (skip the binary name at index 0)
  local cmd=""
  local cmd_index=0
  local i
  for (( i=1; i<cword; i++ )); do
    local w="${COMP_WORDS[$i]}"
    if [[ "$w" != -* ]]; then
      cmd="$w"
      cmd_index=$i
      break
    fi
  done

  # Top-level command completion
  if [[ -z "$cmd" ]]; then
    local commands="spawn adopt open reload restart warm cool start stop up down destroy unregister list status logs url kibana cd setup doctor cache refresh forward sync temporal seed-config feed flag help"
    COMPREPLY=($(compgen -W "$commands" -- "$cur"))
    return
  fi

  # Per-command argument/flag completion
  case "$cmd" in
    spawn|s)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-n --name -b --branch-name -r --reuse-existing-branch -O --no-open -A --no-attach -w --warm -W --wait -c --command -C --compact -u --unified-logs" -- "$cur"))
          ;;
        *)
          # No env name completion for spawn (creates new ones)
          ;;
      esac
      ;;
    adopt)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-n --name -p --path -b --branch-name --base-branch -W --wait" -- "$cur"))
          ;;
        *)
          ;;
      esac
      ;;
    open|o)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-C --compact -u --unified-logs" -- "$cur"))
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "$cur"))
          ;;
      esac
      ;;
    reload)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-u --unified-logs" -- "$cur"))
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "$cur"))
          ;;
      esac
      ;;
    restart)
      # Determine position: 1st positional = env, 2nd = service
      local pos=0
      for (( i=cmd_index+1; i<cword; i++ )); do
        [[ "${COMP_WORDS[$i]}" != -* ]] && (( pos++ ))
      done
      if (( pos == 0 )); then
        COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "$cur"))
      elif (( pos == 1 )); then
        COMPREPLY=($(compgen -W "${_ruby_hive_services[*]}" -- "$cur"))
      fi
      ;;
    warm|w)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-F --no-forward -p --force-ports" -- "$cur"))
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_warmable_envs)" -- "$cur"))
          ;;
      esac
      ;;
    cool|c)
      case "$cur" in
        -*)
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_coolable_envs)" -- "$cur"))
          ;;
      esac
      ;;
    start)
      case "$cur" in
        -*)
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_startable_envs)" -- "$cur"))
          ;;
      esac
      ;;
    stop|x)
      # 1st positional = env, 2nd = service
      local pos=0
      for (( i=cmd_index+1; i<cword; i++ )); do
        [[ "${COMP_WORDS[$i]}" != -* ]] && (( pos++ ))
      done
      if (( pos == 0 )); then
        COMPREPLY=($(compgen -W "$(_ruby_hive_stoppable_envs)" -- "$cur"))
      elif (( pos == 1 )); then
        COMPREPLY=($(compgen -W "${_ruby_hive_services[*]}" -- "$cur"))
      fi
      ;;
    up)
      COMPREPLY=($(compgen -W "-a --attach -f --force -C --compact" -- "$cur"))
      ;;
    down)
      COMPREPLY=($(compgen -W "-f --force" -- "$cur"))
      ;;
    destroy|rm)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-f --force -k --keep-branch" -- "$cur"))
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "$cur"))
          ;;
      esac
      ;;
    unregister)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-f --force" -- "$cur"))
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "$cur"))
          ;;
      esac
      ;;
    list|ls|l)
      ;;
    status|st|url|cd|refresh)
      case "$cur" in
        -*)
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "$cur"))
          ;;
      esac
      ;;
    kibana)
      case "$cur" in
        -*)
          ;;
        *)
          COMPREPLY=($(compgen -W "$(_ruby_hive_warm_envs)" -- "$cur"))
          ;;
      esac
      ;;
    logs|log)
      # 1st positional = env, 2nd = service; flags anywhere
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-f --follow -i --interactive" -- "$cur"))
          ;;
        *)
          local pos=0
          for (( i=cmd_index+1; i<cword; i++ )); do
            [[ "${COMP_WORDS[$i]}" != -* ]] && (( pos++ ))
          done
          if (( pos == 0 )); then
            COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "$cur"))
          elif (( pos == 1 )); then
            COMPREPLY=($(compgen -W "${_ruby_hive_services[*]}" -- "$cur"))
          fi
          ;;
      esac
      ;;
    setup)
      COMPREPLY=($(compgen -W "-y --non-interactive" -- "$cur"))
      ;;
    doctor|cache)
      ;;
    forward)
      case "$cur" in
        -*)
          ;;
        *)
          # Could be a subcommand or an env name
          local subcmds="status stop"
          COMPREPLY=($(compgen -W "$subcmds $(_ruby_hive_envs)" -- "$cur"))
          ;;
      esac
      ;;
    sync)
      COMPREPLY=($(compgen -W "-f --force" -- "$cur"))
      ;;
    temporal)
      case "$cur" in
        -*)
          ;;
        *)
          COMPREPLY=($(compgen -W "start stop restart status logs" -- "$cur"))
          ;;
      esac
      ;;
    feed)
      # 1st positional = env, 2nd = scenario (no known list)
      local pos=0
      for (( i=cmd_index+1; i<cword; i++ )); do
        [[ "${COMP_WORDS[$i]}" != -* ]] && (( pos++ ))
      done
      if (( pos == 0 )); then
        COMPREPLY=($(compgen -W "$(_ruby_hive_warm_envs)" -- "$cur"))
      fi
      ;;
    flag)
      case "$cur" in
        -*)
          COMPREPLY=($(compgen -W "-d --disable" -- "$cur"))
          ;;
        *)
          local pos=0
          for (( i=cmd_index+1; i<cword; i++ )); do
            [[ "${COMP_WORDS[$i]}" != -* ]] && (( pos++ ))
          done
          if (( pos == 0 )); then
            COMPREPLY=($(compgen -W "$(_ruby_hive_warm_envs)" -- "$cur"))
          else
            COMPREPLY=($(compgen -W "$(_ruby_hive_flags)" -- "$cur"))
          fi
          ;;
      esac
      ;;
    seed-config)
      # Expects a postgres URI — no useful completion
      ;;
  esac
}

complete -F _ruby_hive_complete ruby-hive
complete -F _ruby_hive_complete dh

# Shorthand aliases
alias dh='ruby-hive'

dhs() { command ruby-hive spawn -C -c "claude --dangerously-skip-permissions" "$@"; }
dho() { command ruby-hive open -C "$@"; }
dhl() { command ruby-hive list "$@"; }
dhd() { command ruby-hive destroy "$@"; }
dhw() { command ruby-hive warm "$@"; }
dhc() { command ruby-hive cool "$@"; }
dhx() { command ruby-hive spawn -C -c "codex" "$@"; }

_ruby_hive_matching_row() {
  local query="${1:?usage: _ruby_hive_matching_row <worktree-name-query>}"

  command ruby-hive list | awk '
    /^[[:space:]]*$/ { next }
    /^NAME[[:space:]]/ { next }
    /^-+/ { next }
    {
      for (i = 1; i <= NF; i++) {
        if ($i ~ /^[0-9]+-[0-9]+$/) {
          print $1 "\t" $i "\t" $0
          next
        }
      }
    }
  ' | fzf --filter="$query" --delimiter=$'\t' --nth=1,3 | head -n 1
}

_ruby_hive_base_port() {
  local query="${1:?usage: _ruby_hive_base_port <worktree-name-query>}"
  local row range

  row="$(_ruby_hive_matching_row "$query")"

  if [[ -z "$row" ]]; then
    echo "No matching ruby-hive worktree for: $query" >&2
    return 1
  fi

  range="$(printf '%s\n' "$row" | cut -f2)"
  printf '%s\n' "${range%%-*}"
}

dhb() {
  local query="${1:-}"
  local offset="${DHB_PORT_OFFSET:-11}"
  local base port url

  if (( $# == 0 )); then
    query="$(_ruby_hive_current_env_from_metadata)"
  fi
  if [[ -z "$query" ]]; then
    echo "usage: dhb <worktree-name-query>" >&2
    return 1
  fi

  base="$(_ruby_hive_base_port "$query")" || return
  port=$((base + offset))
  url="http://localhost:${port}/w/DevWkSpace/"

  echo "Opening $url"
  open "$url"
}

dhdb() {
  local usage="usage: dhdb <worktree-name-query> [front|connectors|core|ruby_front|ruby_connectors|ruby_api|ruby_oauth] [psql-args...]"
  local query="${1:-}"
  local db="ruby_front"
  local offset="${DHDB_PORT_OFFSET:-432}"
  local base port

  if (( $# == 0 )); then
    query="$(_ruby_hive_current_env_from_metadata)"
  else
    shift
  fi
  if [[ -z "$query" ]]; then
    echo "$usage" >&2
    return 1
  fi

  if (( $# > 0 )); then
    case "$1" in
      front|ruby_front)
        db="ruby_front"
        shift
        ;;
      connectors|ruby_connectors)
        db="ruby_connectors"
        shift
        ;;
      core|ruby_api)
        db="ruby_api"
        shift
        ;;
      oauth|ruby_oauth)
        db="ruby_oauth"
        shift
        ;;
      -*) ;;
      *)
        echo "Invalid database: $1" >&2
        echo "$usage" >&2
        return 2
        ;;
    esac
  fi

  base="$(_ruby_hive_base_port "$query")" || return
  port=$((base + offset))

  echo "Connecting to $db on localhost:$port"
  command psql "postgres://dev:dev@localhost:${port}/${db}" "$@"
}

# dhcd: cd into an environment's worktree in the current shell
dhcd() {
  local tmpfile="${TMPDIR:-/tmp}/ruby-hive-cd.$$"
  RUBY_HIVE_CD_FILE="$tmpfile" command ruby-hive cd "$@"
  local rc=$?
  if (( rc == 0 )) && [[ -f "$tmpfile" ]]; then
    local dir
    dir="$(<"$tmpfile")"
    rm -f "$tmpfile"
    [[ -d "$dir" ]] && cd "$dir"
  else
    rm -f "$tmpfile"
    return $rc
  fi
}

# Completions for shorthand aliases — delegate to the underlying command's completion
_dhs()  { local COMP_WORDS=("ruby-hive" "spawn" "${COMP_WORDS[@]:1}"); local COMP_CWORD=$(( COMP_CWORD + 1 )); _ruby_hive_complete; }
_dho()  { local COMP_WORDS=("ruby-hive" "open" "${COMP_WORDS[@]:1}"); local COMP_CWORD=$(( COMP_CWORD + 1 )); _ruby_hive_complete; }
_dhl()  { :; }
_dhd()  { local COMP_WORDS=("ruby-hive" "destroy" "${COMP_WORDS[@]:1}"); local COMP_CWORD=$(( COMP_CWORD + 1 )); _ruby_hive_complete; }
_dhw()  { local COMP_WORDS=("ruby-hive" "warm" "${COMP_WORDS[@]:1}"); local COMP_CWORD=$(( COMP_CWORD + 1 )); _ruby_hive_complete; }
_dhc()  { local COMP_WORDS=("ruby-hive" "cool" "${COMP_WORDS[@]:1}"); local COMP_CWORD=$(( COMP_CWORD + 1 )); _ruby_hive_complete; }
_dhx()  { local COMP_WORDS=("ruby-hive" "spawn" "${COMP_WORDS[@]:1}"); local COMP_CWORD=$(( COMP_CWORD + 1 )); _ruby_hive_complete; }
_dhb() {
  if (( COMP_CWORD == 1 )); then
    COMPREPLY=($(compgen -W "$(_ruby_hive_warm_envs)" -- "${COMP_WORDS[COMP_CWORD]}"))
  fi
}
_dhdb() {
  if (( COMP_CWORD == 1 )); then
    COMPREPLY=($(compgen -W "$(_ruby_hive_envs)" -- "${COMP_WORDS[COMP_CWORD]}"))
  elif (( COMP_CWORD == 2 )); then
    local cur="${COMP_WORDS[COMP_CWORD]}"

    case "$cur" in
      front*) COMPREPLY=(ruby_front) ;;
      connectors*) COMPREPLY=(ruby_connectors) ;;
      core*) COMPREPLY=(ruby_api) ;;
      oauth*) COMPREPLY=(ruby_oauth) ;;
      "") COMPREPLY=(ruby_front ruby_connectors ruby_api ruby_oauth) ;;
      *) COMPREPLY=($(compgen -W "ruby_front ruby_connectors ruby_api ruby_oauth" -- "$cur")) ;;
    esac
  fi
}
_dhcd() { local COMP_WORDS=("ruby-hive" "cd" "${COMP_WORDS[@]:1}"); local COMP_CWORD=$(( COMP_CWORD + 1 )); _ruby_hive_complete; }

complete -F _dhs  dhs
complete -F _dho  dho
complete -F _dhl  dhl
complete -F _dhd  dhd
complete -F _dhw  dhw
complete -F _dhc  dhc
complete -F _dhx  dhx
complete -F _dhb  dhb
complete -F _dhdb dhdb
complete -F _dhcd dhcd
