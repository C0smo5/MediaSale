# Resumo de Desenvolvimento — Orin

**Data do resumo:** 10 de junho de 2026  
**Último commit:** `b900936` — "Fix: mudanças no design do menu de configuração" (03/06/2026)

---

## Visão Geral

Orin é uma plataforma SaaS voltada ao mercado brasileiro de e-commerce, oferecendo análises com IA para comparar preços, monitorar concorrentes e gerar conteúdo. Construída com Laravel 12 + React (Inertia.js SPA), a aplicação possui sistema completo de cadastro multi-etapas, autenticação com 2FA, planos de assinatura e integração de pagamentos com Mercado Pago.

---

## Histórico de Desenvolvimento (por fase)

### Fase 1 — Fundação (Commit `f67a15c` → `821ea3b`)

**Versões:** v0.1.0 → v0.2.0 Beta Docker

- Commit inicial com a estrutura base do Laravel
- Criação dos layouts da aplicação (autenticado e guest)
- Configuração do Docker com Laravel Sail (PHP 8.5, MySQL 8.4)
- Definição das rotas principais e estrutura de diretórios

### Fase 2 — Sistema de Autenticação (Commit `a4ba9ee` → `c583de2`)

**Versões:** v0.2.1 Beta → v0.2.51 Beta release

- Implementação do cadastro com verificação por email e SMS (OTP via log)
- Criação das telas de login e registro multi-etapas
- Adição do Docker como ambiente de desenvolvimento
- Tela de configurações do usuário
- Correção das telas de login e fluxo de autenticação
- Sistema de planos: 5 tiers (Trial, Starter, Pro, Business, Elite)
- Upgrade de planos com cálculo de juros e complemento
- Tela de pagamento integrada ao fluxo de registro
- Login e cadastro com Google (Laravel Socialite)
- Organização de rotas de autenticação em arquivo separado (`routes/auth.php`)
- Remoção de dados mockados e correções de bugs

### Fase 3 — Segurança (Commit `30152cf` → `8c588ba`)

**Versões:** v0.2.6 Beta segurança

- Melhoria significativa no sistema de segurança
- Criptografia de dados sensíveis (CPF e telefone com AES-256-CBC)
- Proteção contra mass assignment
- Criação da suíte de testes de segurança (13 arquivos de teste)
- Testes de criptografia de PII, políticas de acesso, rate limiting e sessões

### Fase 4 — Pagamentos e Deploy (Commit `b6822cc` → `2746ae3`)

- Integração inicial com Mercado Pago (Checkout Bricks e PreApproval)
- Configuração de deploy Docker para Railway (nginx + PHP-FPM + supervisor + queue worker)
- Correções para HTTPS, porta dinâmica e permissões no Railway
- Correção de tela em branco em produção (remoção do `public/hot`)
- Verificação lazily de conta ao completar registro
- Logs de debug para diagnóstico em produção
- Correção de redirect do nginx para `/tmp`

### Fase 5 — Estabilização e UI (Commit `fb77f0a` → `b900936`)

**Estado atual**

- Correção de erros e bugs diversos
- Ajustes de responsividade (altura em mobile)
- Correção de atualização de página
- Remoção dos logs de debug
- Adição do sistema de 2FA com TOTP (Laravel Fortify + bacon/bacon-qr-code)
- Redesign do menu de configurações

---

## Funcionalidades Implementadas

### Autenticação e Contas
- Cadastro por email+senha com fluxo multi-etapas
- Login com Google OAuth (vinculação e desvinculação de contas)
- Autenticação de dois fatores (2FA) via TOTP
- Gerenciamento de sessões ativas
- Recuperação de senha
- Exclusão de conta
- Rate limiting em login, 2FA e reenvio de OTP

### Fluxo de Registro (4 etapas)
1. **Perfil** — Nome, email, telefone, CPF, senha (validação brasileira)
2. **Verificação** — OTP por email + SMS (Twilio ou log)
3. **Plano** — Escolha entre 5 planos com tabela comparativa
4. **Pagamento** — Mercado Pago (ou skip em desenvolvimento)

### Sistema de Planos
- 5 tiers: Trial (grátis), Starter (R$29,99), Pro (R$59,99), Business (R$149,99), Elite (R$299,99)
- Ciclo mensal e anual (15% de desconto no anual)
- Upgrade com cálculo automático de complemento + juros
- Downgrade com lógica de sessão pendente
- Página de comparação com tabela de funcionalidades

### Pagamentos (Mercado Pago)
- Checkout Bricks para tokenização de cartão no frontend
- Pagamentos únicos via Payments API
- Assinaturas via PreApproval API
- Webhooks com verificação de assinatura HMAC-SHA256
- Chaves de idempotência para retentativas seguras

### Segurança
- PII criptografada (CPF e telefone com AES-256-CBC)
- Secrets de 2FA criptografados
- Proteção contra mass assignment nos campos críticos
- Payload mínimo do Inertia (sem PII ou secrets)
- Testes abrangentes de segurança (13 arquivos)
- Checklist de segurança para produção

### Interface
- Landing page com seções: Navbar, Hero, StoresMarquee, HowItWorks, LiveDemo, Features, Pricing, CTA, Footer
- Dashboard com cards de estatísticas e estados vazios
- Página de Chat (UI construída, aguardando implementação da IA)
- Perfil com abas: Informações, Senha, Planos, Zona de Perigo, Configurações
- Página de planos com comparação detalhada
- Página de pagamento da assinatura
- Tema personalizado roxo com Tailwind CSS
- Fontes Google (Inter, Space Grotesk)
- Responsivo e mobile-friendly

---

## O que Falta Implementar

- **Chat com IA** — Página criada mas funcionalidade não implementada (exibe "Em breve")
- **Dashboard com dados reais** — Estatísticas são placeholders
- **Twilio em produção** — Configurado mas usando driver de log em desenvolvimento
- **Testes end-to-end com Mercado Pago real** — Webhooks e pagamentos não testados com credenciais reais

---

## Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| Backend | PHP 8.2+, Laravel 12 |
| Frontend | React 18, TypeScript, Inertia.js 2 |
| CSS | Tailwind CSS 3, PostCSS |
| Build | Vite 7 |
| Auth | Laravel Fortify, Socialite (Google), Sanctum |
| Pagamentos | Mercado Pago SDK (dx-php) |
| SMS | Twilio SDK |
| Banco | MySQL (produção), SQLite (dev/teste) |
| Fila | Database queue |
| Infra | Docker multi-estágio, Railway, Supervisor |
| Testes | Pest PHP 3 |
| Gráficos | Recharts |
| Alertas | SweetAlert2 |

---

## Estatísticas do Projeto

- **Commits totais:** 37
- **Versões:** v0.1.0 → v0.2.6 Beta (atual)
- **Testes:** 31+ arquivos (Feature + Unit)
- **Migrations:** 14 tabelas
- **Controllers:** 20+ controllers
- **Páginas React:** 20+ páginas
- **Serviços:** 10+ classes de serviço
