#compdef ruby-hive dh

# Zsh completion script for ruby-hive (and dh alias)
#
# Install (pick one):
#   1. Source directly in .zshrc:
#        source /path/to/completions/ruby-hive.zsh
#   2. Symlink into a directory on your $fpath:
#        ln -s /path/to/completions/ruby-hive.zsh "${fpath[1]}/_ruby-hive"
#   3. Add the completions dir to fpath (before compinit):
#        fpath=(/path/to/completions $fpath)
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

_ruby_hive_services=(
  sdk ui front-api core oauth connectors front-workers front-spa-admin front-spa-app viz
)
_ruby_hive_warm_state_services=(
  front-api core oauth connectors front-workers front-spa-admin front-spa-app viz
)
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
    # Lightweight JSON parse — avoid external deps
    local last
    last="$(command grep -o '"lastEnv" *: *"[^"]*"' "$activity" 2>/dev/null | head -1)"
    [[ -n "$last" ]] || return
    # Extract value between the last pair of quotes
    last="${last##*: \"}"
    last="${last%\"}"
    echo "$last"
  fi
}

_ruby_hive_envs() {
  local -a envs
  if [[ -d ~/.ruby-hive/envs ]]; then
    envs=(${(f)"$(ls ~/.ruby-hive/envs 2>/dev/null)"})
  fi
  (( $#envs )) || return

  _ruby_hive_describe_envs "${envs[@]}"
}

_ruby_hive_word_already_used() {
  local candidate="${1:?usage: _ruby_hive_word_already_used <name>}"
  local i word

  for (( i = 1; i < CURRENT; i++ )); do
    word="${words[i]}"
    [[ "$word" == -* ]] && continue
    [[ "$word" == "$candidate" ]] && return 0
  done

  return 1
}

_ruby_hive_describe_envs() {
  local -a envs=("$@")
  (( $#envs )) || return

  local env
  local -a filtered_envs=()
  for env in "${envs[@]}"; do
    _ruby_hive_word_already_used "$env" || filtered_envs+=("$env")
  done
  envs=("${filtered_envs[@]}")
  (( $#envs )) || return

  local current
  current="$(_ruby_hive_current_env)"

  if [[ -n "$current" ]] && (( ${envs[(Ie)$current]} )); then
    # Show current/active env first in its own group so menu-select highlights it
    local -a others=("${(@)envs:#$current}")
    local -a active=("$current")
    _describe -V 'current environment' active
    (( $#others )) && _describe -V 'environment' others
  else
    _describe -V 'environment' envs
  fi
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
  (( $# )) || return
  local desired_states="$*"
  local -a envs

  envs=(${(f)"$(
    _ruby_hive_fast_state_rows | awk -v desired_states="$desired_states" '
      BEGIN {
        split(desired_states, states, " ")
        for (i in states) {
          state_set[states[i]] = 1
        }
      }
      state_set[$2] { print $1 }
    '
  )"})

  _ruby_hive_describe_envs "${envs[@]}"
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

_ruby_hive_service() {
  _describe 'service' _ruby_hive_services
}

_ruby_hive_first_positional() {
  local i word

  for (( i = 2; i < CURRENT; i++ )); do
    word="${words[i]}"
    [[ "$word" == -* ]] && continue
    echo "$word"
    return
  done
}

_ruby_hive_feature_flags_file() {
  local -a roots=()
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
      echo "$root/front/types/shared/feature_flags.ts"
      return
    fi
  done
}

# Parse flag names out of the source file; invoking the Bun CLI here would be too slow.
_ruby_hive_flag_names() {
  local file
  file="$(_ruby_hive_feature_flags_file)"
  [[ -n "$file" ]] || return

  command sed -nE '/WHITELISTABLE_FEATURES_CONFIG = \{/,/^\} as const/ s/^  ([A-Za-z0-9_]+):[[:space:]]*\{[[:space:]]*$/\1/p' "$file" 2>/dev/null
}

_ruby_hive_flags() {
  local -a flags
  flags=(${(f)"$(_ruby_hive_flag_names)"})
  (( $#flags )) || return

  local flag
  local -a remaining=()
  for flag in "${flags[@]}"; do
    _ruby_hive_word_already_used "$flag" || remaining+=("$flag")
  done
  (( $#remaining )) || return

  _describe -V 'feature flag' remaining
}

_ruby-hive() {
  local curcontext="$curcontext" state line
  typeset -A opt_args

  _arguments -C \
    '1:command:->command' \
    '*::args:->args'

  case $state in
    command)
      local -a commands=(
        'spawn:Create a new environment'
        'adopt:Register an existing git worktree as an environment'
        'open:Open environment terminal session'
        'reload:Kill and reopen terminal session'
        'restart:Restart a single service'
        'warm:Start docker and all services'
        'cool:Stop services, keep SDK watch'
        'start:Resume stopped environment'
        'stop:Stop all services in environment'
        'up:Start managed services (temporal + test postgres + test redis)'
        'down:Stop all envs, temporal, test postgres, test redis'
        'destroy:Remove environment'
        'unregister:Remove Hive resources but keep worktree'
        'list:Show all environments'
        'status:Show service health'
        'logs:Show service logs'
        'url:Print front URL'
        'kibana:Open Kibana for a warm environment'
        'cd:Print worktree path'
        'setup:Check prerequisites and guide initial setup'
        'doctor:Check prerequisites (non-interactive)'
        'cache:Show binary cache status'
        'refresh:Restore node_modules links in worktree'
        'forward:Manage OAuth port forwarding'
        'sync:Pull latest main, rebuild binaries, refresh deps'
        'temporal:Manage Temporal server'
        'seed-config:Extract user data from existing DB'
        'env:Manage config.env vars (list|get|set|unset)'
        'feed:Run seed script for a scenario'
        'flag:Toggle a feature flag on the workspace'
        'help:Show help'
      )
      _describe 'command' commands
      ;;
    args)
      case $words[1] in
        spawn|s)
          _arguments \
            '1::name:' \
            '-n[Environment name]:name:' \
            '--name[Environment name]:name:' \
            '-b[Git branch name]:branch:' \
            '--branch-name[Git branch name]:branch:' \
            '-r[Reuse existing local branch]' \
            '--reuse-existing-branch[Reuse existing local branch]' \
            '-O[Do not open terminal session]' \
            '--no-open[Do not open terminal session]' \
            '-A[Create session but do not attach]' \
            '--no-attach[Create session but do not attach]' \
            '-w[Open with warm tab]' \
            '--warm[Open with warm tab]' \
            '-W[Wait for SDK to build before opening]' \
            '--wait[Wait for SDK to build before opening]' \
            '-c[Run command in shell tab]:command:' \
            '--command[Run command in shell tab]:command:' \
            '-C[Use compact layout]' \
            '--compact[Use compact layout]' \
            '-u[Use single unified logs tab]' \
            '--unified-logs[Use single unified logs tab]'
          ;;
        adopt)
          _arguments \
            '1::name:' \
            '-n[Environment name]:name:' \
            '--name[Environment name]:name:' \
            '-p[Existing worktree path]:path:_files -/' \
            '--path[Existing worktree path]:path:_files -/' \
            '-b[Branch name to display]:branch:' \
            '--branch-name[Branch name to display]:branch:' \
            '--base-branch[Base branch to record]:branch:' \
            '-W[Wait for cold services to finish their initial builds]' \
            '--wait[Wait for cold services to finish their initial builds]'
          ;;
        open|o)
          _arguments \
            '1::name:_ruby_hive_envs' \
            '-C[Use compact layout]' \
            '--compact[Use compact layout]' \
            '-u[Use single unified logs tab]' \
            '--unified-logs[Use single unified logs tab]'
          ;;
        reload)
          _arguments \
            '1::name:_ruby_hive_envs' \
            '-u[Use single unified logs tab]' \
            '--unified-logs[Use single unified logs tab]'
          ;;
        restart)
          _arguments \
            '1::name:_ruby_hive_envs' \
            '2::service:_ruby_hive_service'
          ;;
        warm|w)
          _arguments \
            '*::names:_ruby_hive_warmable_envs' \
            '-F[Disable OAuth port forwarding]' \
            '--no-forward[Disable OAuth port forwarding]' \
            '-p[Kill processes blocking service ports]' \
            '--force-ports[Kill processes blocking service ports]'
          ;;
        cool|c)
          _arguments '*::names:_ruby_hive_coolable_envs'
          ;;
        start)
          _arguments '*::names:_ruby_hive_startable_envs'
          ;;
        stop|x)
          _arguments \
            '1::name:_ruby_hive_stoppable_envs' \
            '2::service:_ruby_hive_service'
          ;;
        up)
          _arguments \
            '-a[Attach to main terminal session]' \
            '--attach[Attach to main terminal session]' \
            '-f[Force rebuild even if no changes]' \
            '--force[Force rebuild even if no changes]' \
            '-C[Use compact layout]' \
            '--compact[Use compact layout]'
          ;;
        down)
          _arguments \
            '-f[Skip confirmation prompt]' \
            '--force[Skip confirmation prompt]'
          ;;
        destroy|rm)
          _arguments \
            '1::name:_ruby_hive_envs' \
            '-f[Force destroy even with uncommitted changes]' \
            '--force[Force destroy even with uncommitted changes]' \
            '-k[Keep the git branch]' \
            '--keep-branch[Keep the git branch]'
          ;;
        unregister)
          _arguments \
            '1::name:_ruby_hive_envs' \
            '-f[Force cleanup of blocked service ports]' \
            '--force[Force cleanup of blocked service ports]'
          ;;
        list|ls|l)
          ;;
        status|st)
          _arguments '1::name:_ruby_hive_envs'
          ;;
        logs|log)
          _arguments \
            '1::name:_ruby_hive_envs' \
            '2::service:_ruby_hive_service' \
            '-f[Follow log output]' \
            '--follow[Follow log output]' \
            '-i[Interactive TUI with service switching]' \
            '--interactive[Interactive TUI with service switching]'
          ;;
        url|cd)
          _arguments '1::name:_ruby_hive_envs'
          ;;
        kibana)
          _arguments '1::name:_ruby_hive_warm_envs'
          ;;
        setup)
          _arguments \
            '-y[Run without prompts]' \
            '--non-interactive[Run without prompts]'
          ;;
        doctor|cache)
          ;;
        refresh)
          _arguments '1::name:_ruby_hive_envs'
          ;;
        forward)
          _arguments \
            '1::name or subcommand:->forward_arg'
          case $state in
            forward_arg)
              local -a subcmds=('status:Show current forwarding status' 'stop:Stop the port forwarder')
              _describe 'subcommand' subcmds
              _ruby_hive_envs
              ;;
          esac
          ;;
        sync)
          _arguments \
            '-f[Force rebuild even if no changes]' \
            '--force[Force rebuild even if no changes]'
          ;;
        temporal)
          _arguments \
            '1::subcommand:(start stop restart status logs)'
          ;;
        seed-config)
          _arguments '1:postgres-uri:'
          ;;
        env)
          _arguments \
            '1::subcommand:(list get set unset)' \
            '2::key:' \
            '3::value:'
          ;;
        feed)
          _arguments \
            '1::name:_ruby_hive_warm_envs' \
            '2::scenario:'
          ;;
        flag)
          _arguments \
            '1:name:_ruby_hive_warm_envs' \
            '*:feature flag:_ruby_hive_flags' \
            '-d[Disable the flags]' \
            '--disable[Disable the flags]'
          ;;
      esac
      ;;
  esac
}

# dh: simple alias for ruby-hive
alias dh=ruby-hive

# Shorthand aliases (use `function` keyword to avoid zsh alias expansion on the name)
unalias dhs dho dhl dhd dhw dhc dhx dhb dhdb dhcd 2>/dev/null
function dhs  { command ruby-hive spawn -C -c "claude --dangerously-skip-permissions" "$@"; }
function dho  { command ruby-hive open -C "$@"; }
function dhl  { command ruby-hive list "$@"; }
function dhd  { command ruby-hive destroy "$@"; }
function dhw  { command ruby-hive warm "$@"; }
function dhc  { command ruby-hive cool "$@"; }
function dhx  { command ruby-hive spawn -C -c "codex" "$@"; }

function _ruby_hive_matching_row {
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

function _ruby_hive_base_port {
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

function dhb {
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

function dhdb {
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
function dhcd {
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

# Completions for shorthand aliases — complete remaining args for the underlying command
function _dhs  { local words=("ruby-hive" "spawn" "${(@)words[2,-1]}"); local CURRENT=$((CURRENT+1)); _ruby-hive; }
function _dho  { local words=("ruby-hive" "open" "${(@)words[2,-1]}"); local CURRENT=$((CURRENT+1)); _ruby-hive; }
function _dhl  { :; }
function _dhd  { local words=("ruby-hive" "destroy" "${(@)words[2,-1]}"); local CURRENT=$((CURRENT+1)); _ruby-hive; }
function _dhw  { local words=("ruby-hive" "warm" "${(@)words[2,-1]}"); local CURRENT=$((CURRENT+1)); _ruby-hive; }
function _dhc  { local words=("ruby-hive" "cool" "${(@)words[2,-1]}"); local CURRENT=$((CURRENT+1)); _ruby-hive; }
function _dhx  { local words=("ruby-hive" "spawn" "${(@)words[2,-1]}"); local CURRENT=$((CURRENT+1)); _ruby-hive; }
function _dhb  { _arguments '1::worktree:_ruby_hive_warm_envs'; }
function _dhdb_database {
  local cur="${words[CURRENT]}"
  local use_unmatched=0
  local -a dbs

  case "$cur" in
    front*) dbs=(ruby_front); use_unmatched=1 ;;
    connectors*) dbs=(ruby_connectors); use_unmatched=1 ;;
    core*) dbs=(ruby_api); use_unmatched=1 ;;
    oauth*) dbs=(ruby_oauth); use_unmatched=1 ;;
    *) dbs=(ruby_front ruby_connectors ruby_api ruby_oauth) ;;
  esac

  if (( use_unmatched )); then
    compadd -U -X database -- "${dbs[@]}"
  else
    compadd -X database -- "${dbs[@]}"
  fi
}
function _dhdb {
  case "$CURRENT" in
    2)
      _ruby_hive_envs
      ;;
    3)
      if [[ "${words[CURRENT]}" == -* ]]; then
        _files
      else
        _dhdb_database
      fi
      ;;
    *)
      _files
      ;;
  esac
}
function _dhcd { local words=("ruby-hive" "cd" "${(@)words[2,-1]}"); local CURRENT=$((CURRENT+1)); _ruby-hive; }

# When loaded via fpath, zsh calls the file as a function — invoke the completer.
# When sourced manually, just register with compdef and skip the direct call.
if [[ "$funcstack[1]" == _ruby-hive ]]; then
  _ruby-hive "$@"
else
  compdef _ruby-hive ruby-hive dh
  compdef _dhs dhs
  compdef _dho dho
  compdef _dhl dhl
  compdef _dhd dhd
  compdef _dhw dhw
  compdef _dhc dhc
  compdef _dhx dhx
  compdef _dhb dhb
  compdef _dhdb dhdb
  compdef _dhcd dhcd
fi
