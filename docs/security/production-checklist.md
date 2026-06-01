# Orin — Checklist de segurança para produção

Todas as variáveis abaixo devem ser revisadas antes de qualquer deploy em ambiente público.

> **Legenda:** `[x]` = implementado no código/repositório. `[ ]` = pendente de configuração de infraestrutura ou .env de produção.

---

## Já implementado no código

- [x] CPF e telefone criptografados no banco (`'cpf' => 'encrypted'`, `'phone' => 'encrypted'` em `User`).
- [x] Segredo TOTP e recovery codes criptografados (`'two_factor_secret' => 'encrypted'`, `'two_factor_recovery_codes' => 'encrypted:array'`).
- [x] `APP_PREVIOUS_KEYS` suportado em `config/app.php` para rotação segura de `APP_KEY`.
- [x] Comando `php artisan users:encrypt-pii` disponível para migrar/re-criptografar PII.
- [x] `auth.user` compartilhado via Inertia retorna apenas campos mínimos (sem CPF, telefone, segredos 2FA, `settings`, `google_id`).
- [x] Sessão `two_factor_verified` definida após challenge 2FA bem-sucedido.
- [x] Recovery codes exigem `password.confirm` para visualização.
- [x] Throttle `6,1` em login, challenge 2FA e reenvio de SMS 2FA.
- [x] `debugSmsCode` vinculado a `REGISTRATION_ALLOW_PAYMENT_SKIP` (não exposto quando `false`).
- [x] Open redirect no login protegido por allowlist de prefixos internos.
- [x] Mass assignment bloqueado para campos críticos (`verify_account`, `plan_key`, `payment_completed`).
- [x] Teste de regressão para todos os itens acima em `tests/Feature/Security/`.

---

## Variáveis de ambiente críticas

| Variável | Valor em produção | Por quê |
|----------|-------------------|---------|
| `APP_ENV` | `production` | Desativa helpers de debug do framework |
| `APP_DEBUG` | `false` | Impede stack traces na resposta HTTP |
| `APP_KEY` | gerada via `php artisan key:generate` | Chave mestra de criptografia (CPF, telefone, 2FA, sessão) |
| `SESSION_ENCRYPT` | `true` | Cifra o payload da sessão em repouso no banco |
| `SESSION_LIFETIME` | `120` (ou menor) | Limita janela de sessões inativas |
| `REGISTRATION_ALLOW_PAYMENT_SKIP` | `false` | Desativa rota de bypass de pagamento e OTP mock |
| `SMS_MOCK_CODE` | vazio (``) | Remove código OTP fixo do fluxo de verificação |
| `SMS_DRIVER` | `twilio` | Usa SMS real em vez do driver de log |

> **Atenção:** `REGISTRATION_ALLOW_PAYMENT_SKIP` herda `APP_DEBUG` como padrão.
> Em produção, defina-o **explicitamente** como `false` para não depender de `APP_DEBUG`.

---

## Autenticação e 2FA

- [ ] `APP_DEBUG=false` — obrigatório; com `true`, o mock de OTP fica acessível ao frontend.
- [ ] `REGISTRATION_ALLOW_PAYMENT_SKIP=false` — bloqueia `/register/payment/complete` como rota sem gateway e oculta `debugSmsCode` na tela de verificação. *(código já verifica essa flag; só falta setar no .env de produção)*
- [ ] Fluxo de pagamento integrado a gateway real (Stripe/Asaas/etc.) antes de cobrar usuários — ver [docs/security/payment-gateway.md](payment-gateway.md) quando disponível.
- [ ] Verificar que `SESSION_ENCRYPT=true` está ativo para proteger `two_factor_verified` e `pending_2fa_user_id` armazenados na sessão. *(config/session.php já lê `SESSION_ENCRYPT`; só falta setar no .env de produção)*

---

## HTTPS e cookies

- [ ] `APP_URL` começa com `https://`.
- [ ] `SESSION_SECURE_COOKIE=true` no `.env` de produção (cookies só trafegam via HTTPS). *(config/session.php já lê `SESSION_SECURE_COOKIE`; só falta setar no .env de produção)*
- [x] `SESSION_SAME_SITE=lax` — padrão já configurado em `config/session.php` (`'same_site' => env('SESSION_SAME_SITE', 'lax')`).
- [ ] Certificado TLS válido e renovação automática configurada.

---

## Banco de dados

- [ ] `DB_PASSWORD` forte, gerada aleatoriamente, armazenada em secret manager.
- [ ] Conexão MySQL/PostgreSQL com TLS (`DB_SSLMODE=required`).
- [ ] Volume do banco criptografado no provedor (AWS EBS, GCP Persistent Disk).
- [x] Scripts de backup GPG implementados (`scripts/backup-database.sh` e `scripts/restore-database.sh`) — ver [encryption-at-rest.md](encryption-at-rest.md). Falta agendar (`cron` ou orquestrador).
- [ ] `BACKUP_GPG_PASSPHRASE` em secret manager (nunca no `.env` commitado). *(`.env.example` tem a variável como referência; garantir que o valor real não seja commitado)*

---

## Credenciais de serviços externos

- [ ] `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` configurados e testados.
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` com redirect URI apontando para o domínio de produção (`GOOGLE_REDIRECT_URI`).
- [x] Segredos **não** estão no repositório — `.env`, `.env.backup` e `.env.production` estão no `.gitignore`.

---

## Headers HTTP

Considere adicionar os headers abaixo via middleware ou proxy reverso:

| Header | Valor sugerido |
|--------|---------------|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | configurar por rota |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |

---

## Rotação de chaves

Ao rotacionar `APP_KEY`:

1. Adicionar a chave atual em `APP_PREVIOUS_KEYS`.
2. Gerar nova chave com `php artisan key:generate`.
3. Re-criptografar registros: `php artisan users:encrypt-pii`.
4. Remover `APP_PREVIOUS_KEYS` após confirmar que todos os registros foram migrados.

---

## Verificação pós-deploy

```bash
# Confirmar que APP_DEBUG está desligado
php artisan about | grep "Debug"

# Confirmar que sessão está criptografada
php artisan about | grep "Session"

# Confirmar que PII está criptografada no banco
php artisan users:encrypt-pii --dry-run
```
