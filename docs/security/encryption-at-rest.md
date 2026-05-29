# Orin — Criptografia at-rest

## Camadas implementadas

### 1. PII da aplicação (`cpf`, `phone`)

O modelo `User` usa o cast `encrypted` do Laravel (`Illuminate\Database\Eloquent\Casts\Attribute` via `'cpf' => 'encrypted'`) para os campos `cpf` e `phone`. Os valores são cifrados com `AES-256-CBC` usando a `APP_KEY` antes de serem persistidos, e descriptografados transparentemente na leitura.

**Migração de dados existentes:**
```bash
php artisan users:encrypt-pii --dry-run   # verifica sem salvar
php artisan users:encrypt-pii             # migra em produção
```

### 2. Campos de 2FA

`two_factor_secret` e `two_factor_recovery_codes` usam o cast `encrypted` / `encrypted:array`, garantindo que o segredo TOTP nunca fique em plaintext no banco.

### 3. Sessões

Ativar criptografia de sessão (recomendado em produção):

```dotenv
SESSION_ENCRYPT=true
```

O Laravel cifra o payload inteiro da sessão com `APP_KEY`.

### 4. Backups criptografados

Scripts disponíveis em `scripts/`:

```bash
# Criar backup criptografado
export BACKUP_GPG_PASSPHRASE="sua-senha-forte"
./scripts/backup-database.sh

# Restaurar
./scripts/restore-database.sh storage/backups/backup-20260101_000000.sql.gz.gpg
```

Variáveis de ambiente necessárias: `BACKUP_GPG_PASSPHRASE`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `BACKUP_DIR` (opcional), `RETENTION_DAYS` (padrão: 30).

### 5. Rotação de `APP_KEY`

Ao rotacionar a chave em produção, adicione a chave antiga a `APP_PREVIOUS_KEYS` para que o Laravel consiga descriptografar dados antigos:

```dotenv
APP_KEY=base64:nova-chave
APP_PREVIOUS_KEYS=base64:chave-anterior
```

Depois execute `users:encrypt-pii` para re-criptografar os registros existentes com a nova chave.

## Checklist de produção

- [ ] `APP_KEY` gerada com `php artisan key:generate` e armazenada em secret manager
- [ ] `SESSION_ENCRYPT=true` no `.env` de produção
- [ ] Volume do banco de dados criptografado no provedor (AWS EBS, GCP Persistent Disk)
- [ ] Conexão MySQL com TLS (`DB_SSLMODE=required`)
- [ ] Backups GPG agendados (`cron` ou orquestrador de containers)
- [ ] `BACKUP_GPG_PASSPHRASE` em secret manager (não no `.env`)
- [ ] Retenção de backups configurada (`RETENTION_DAYS`)
- [ ] Teste periódico de restauração

## Dev/Sail

O volume `sail-mysql` é local sem criptografia de disco — isso é aceitável para desenvolvimento. Em staging/produção, use sempre volumes criptografados do provedor de nuvem.
