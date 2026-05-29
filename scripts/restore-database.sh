#!/usr/bin/env bash
# Orin — Restore encrypted database backup
# Usage: ./scripts/restore-database.sh <path-to-backup.sql.gz.gpg>
# Requires: BACKUP_GPG_PASSPHRASE, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD

set -euo pipefail

BACKUP_FILE="${1:?Usage: $0 <backup-file.sql.gz.gpg>}"

: "${BACKUP_GPG_PASSPHRASE:?BACKUP_GPG_PASSPHRASE must be set}"
: "${DB_DATABASE:?DB_DATABASE must be set}"
: "${DB_USERNAME:?DB_USERNAME must be set}"
: "${DB_PASSWORD:?DB_PASSWORD must be set}"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"

echo "[$(date)] Restoring ${BACKUP_FILE} into ${DB_DATABASE}..."

gpg --batch --yes --passphrase "$BACKUP_GPG_PASSPHRASE" \
    --decrypt "$BACKUP_FILE" \
  | gunzip \
  | MYSQL_PWD="$DB_PASSWORD" mysql \
      --host="$DB_HOST" \
      --port="$DB_PORT" \
      --user="$DB_USERNAME" \
      "$DB_DATABASE"

echo "[$(date)] Restore complete."
