#!/usr/bin/env bash
# Point Postgres/Redis/Elasticsearch/Temporal/Qdrant at ${RUBY_DATA_ROOT} so a
# single Docker volume keeps their state across image rebuilds. First run on an
# empty volume is a fresh cluster; infra.sh then recreates DBs, indices, and
# the Qdrant collection. Everything else (ports, users, configs) stays in the
# image.
set -euo pipefail

RUBY_DEV_SCRIPT_NAME=init-data-dirs
# shellcheck source=dev/scripts/common.sh
source "$(dirname "$0")/common.sh"
# shellcheck source=dev/scripts/env.sh
source "$(dirname "$0")/env.sh"

PG_VERSION="$(ls /etc/postgresql 2>/dev/null | sort -rn | head -1)"

stop_postgres() {
  if pgrep -x postgres >/dev/null 2>&1; then
    log "Stopping Postgres..."
    sudo pg_ctlcluster "$PG_VERSION" main stop || true
  fi
}

ensure_postgres() {
  if [ -z "$PG_VERSION" ]; then
    log "Postgres not installed; skipping"
    return 0
  fi

  local conf="/etc/postgresql/${PG_VERSION}/main/postgresql.conf"
  local target="${RUBY_POSTGRES_DATA_ROOT}/${PG_VERSION}/main"
  local current initdb
  current="$(awk -F"'" '/^data_directory/ {print $2}' "$conf")"
  initdb="/usr/lib/postgresql/${PG_VERSION}/bin/initdb"

  mkdir -p "$RUBY_POSTGRES_DATA_ROOT"
  chown postgres:postgres "$RUBY_POSTGRES_DATA_ROOT"

  if [ "$current" != "$target" ]; then
    log "Pointing Postgres at ${target}"
    stop_postgres
    sed -i "s|^data_directory = .*|data_directory = '${target}'|" "$conf"
  fi

  if [ ! -f "${target}/PG_VERSION" ]; then
    stop_postgres
    log "Initializing a fresh Postgres cluster at ${target}"
    rm -rf "$target"
    sudo -u postgres mkdir -p "$target"
    sudo -u postgres "$initdb" -D "$target"
  fi

  chown -R postgres:postgres "$RUBY_POSTGRES_DATA_ROOT"
  chmod 0700 "$target"
}

ensure_redis() {
  mkdir -p "$RUBY_REDIS_DATA_DIR"
  if id redis >/dev/null 2>&1; then
    chown -R redis:redis "$RUBY_REDIS_DATA_DIR"
  fi
}

ensure_elasticsearch() {
  mkdir -p "$RUBY_ELASTICSEARCH_DATA_DIR"
  if id elasticsearch >/dev/null 2>&1; then
    chown -R elasticsearch:elasticsearch "$(dirname "$RUBY_ELASTICSEARCH_DATA_DIR")"
  fi
}

ensure_temporal() {
  mkdir -p "$(dirname "$RUBY_TEMPORAL_DB_FILE")"
}

ensure_qdrant() {
  mkdir -p "$QDRANT__STORAGE__STORAGE_PATH" "$QDRANT__STORAGE__SNAPSHOTS_PATH"
}

mkdir -p "$RUBY_DATA_ROOT"

ensure_postgres
ensure_redis
ensure_elasticsearch
ensure_temporal
ensure_qdrant

log "Data directories ready under ${RUBY_DATA_ROOT}"
