#!/usr/bin/env bash
# Orin — Encrypted database backup
# Usage: ./scripts/backup-database.sh
# Requires: BACKUP_GPG_PASSPHRASE, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Output: backup-<timestamp>.sql.gz.gpg  in  BACKUP_DIR (default: ./storage/backups)

set -euo pipefail

: "${BACKUP_GPG_PASSPHRASE:?BACKUP_GPG_PASSPHRASE must be set}"
: "${DB_DATABASE:?DB_DATABASE must be set}"
: "${DB_USERNAME:?DB_USERNAME must be set}"
: "${DB_PASSWORD:?DB_PASSWORD must be set}"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
BACKUP_DIR="${BACKUP_DIR:-$(dirname "$0")/../storage/backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="backup-${TIMESTAMP}.sql.gz.gpg"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup of ${DB_DATABASE}..."

MYSQL_PWD="$DB_PASSWORD" mysqldump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USERNAME" \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_DATABASE" \
  | gzip \
  | gpg --batch --yes --symmetric \
        --passphrase "$BACKUP_GPG_PASSPHRASE" \
        --cipher-algo AES256 \
        -o "$BACKUP_DIR/$FILENAME"

echo "[$(date)] Backup saved to ${BACKUP_DIR}/${FILENAME}"

# Remove backups older than RETENTION_DAYS (default 30)
RETENTION_DAYS="${RETENTION_DAYS:-30}"
find "$BACKUP_DIR" -name "backup-*.sql.gz.gpg" -mtime "+${RETENTION_DAYS}" -delete
echo "[$(date)] Pruned backups older than ${RETENTION_DAYS} days."
