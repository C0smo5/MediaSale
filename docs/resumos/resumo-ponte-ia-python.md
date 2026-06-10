# Resumo — Ponte Laravel ↔ Python (IA do Orin)

**Data do resumo:** 10 de junho de 2026  
**Commit:** `1039bf2` — "Feat: Adição da ponte python para a IA" (10/06/2026)

---

## Objetivo

Criar a infraestrutura para integrar a IA do Orin como um **microserviço Python (FastAPI)** separado do Laravel, sem acoplar o backend PHP a nenhum provedor de LLM. A lógica de inteligência artificial entra depois — basta implementar dentro de `services/ai-engine/`.

---

## Arquitetura

```
Chat.jsx (futuro)
    ↓ POST /chat/analyze
ChatAnalysisController
    ↓
MarketIntelligenceService
    ↓                    ↓
AiEngineClient      MarketIntelligenceParser
    ↓ (HTTP)              ↓
FastAPI ai-engine    DTO tipado + persistência
```

**Princípio:** Laravel nunca fala com LLM diretamente. Ele só conhece o contrato HTTP do serviço Python.

---

## O que foi implementado

### 1. Microserviço Python (`services/ai-engine/`)

| Arquivo | Função |
|---------|--------|
| `Dockerfile` | Imagem Python 3.12 slim + uvicorn |
| `requirements.txt` | fastapi, uvicorn, pydantic |
| `app/main.py` | App FastAPI com CORS |
| `app/routes/health.py` | `GET /health` |
| `app/routes/analyze.py` | `POST /analyze` (stub) |
| `app/schemas.py` | Request/response tipados (Pydantic) |

O endpoint `/analyze` retorna por enquanto campos com `"Não identificado"`. Quando a IA real for implementada, só esse arquivo precisa mudar.

**Contrato HTTP estável:**

Request:
```json
{
  "message": "Quero comparar o Galaxy S24 na Shopee",
  "transcript": ["mensagem anterior"],
  "user_id": 123
}
```

Response:
```json
{
  "raw_output": "PRODUTO_ALVO: ...\nCATEGORIA_MERCADO: ...\n...",
  "model": "stub",
  "latency_ms": 12
}
```

### 2. Docker Compose (Sail)

- Serviço `ai-engine` adicionado ao `compose.yaml`
- Porta externa: `${AI_ENGINE_PORT:-8001}` → interna `8000`
- Healthcheck via `GET /health`
- `laravel.test` aguarda `ai-engine` e `mysql` estarem saudáveis antes de subir
- Laravel acessa o Python por hostname interno: `http://ai-engine:8000`

### 3. Ponte Laravel (padrão Contract + Gateway)

Segue o mesmo padrão do `SmsGateway` (Twilio/log):

| Componente | Arquivo |
|------------|---------|
| Contrato | `app/Contracts/Ai/AiEngineClient.php` |
| Driver HTTP | `app/Services/Ai/HttpAiEngineClient.php` |
| Driver log (stub) | `app/Services/Ai/LogAiEngineClient.php` |
| Orquestração | `app/Services/Ai/MarketIntelligenceService.php` |
| Config | `config/ai.php` |
| Binding | `app/Providers/AppServiceProvider.php` |

**Drivers disponíveis:**
- `log` — retorna stub local, sem rede (testes/CI)
- `http` — chama o FastAPI no Docker

### 4. Parser e tipos de negócio

| Componente | Arquivo |
|------------|---------|
| Parser | `app/Support/Ai/MarketIntelligenceParser.php` |
| DTO resposta IA | `app/DTOs/Ai/AiAnalysisResponse.php` |
| DTO inteligência | `app/DTOs/Ai/MarketIntelligence.php` |
| Enum categorias | `app/Enums/Ai/MarketCategory.php` |
| Enum intenções | `app/Enums/Ai/AnalysisIntent.php` |
| Enum métricas | `app/Enums/Ai/MonitoringMetric.php` |

O parser converte o formato `CHAVE: Valor` da IA em DTO tipado, com fallback `"Não identificado"` para campos ausentes.

**Campos extraídos:**
- `PRODUTO_ALVO`
- `CATEGORIA_MERCADO` (Eletrônicos, Vestuário, Casa, Beleza, Automotivo, Brinquedos, Outros)
- `TERMO_CONCORRENTE` (Mercado Livre, Shopee, Amazon Brasil, etc.)
- `INTENCAO_ANALISE` (Comparação de Preços, Análise de Concorrência, Tendência, Ideia de Conteúdo)
- `METRICA_MONITORAMENTO` (Preço Mínimo, Preço Médio, Volume de Vendas, Frete, Anúncio)
- `FAIXA_PRECO_ALVO` (formato numérico: `150-200`)

### 5. Banco de dados (batch 11)

| Tabela | Campos principais |
|--------|-------------------|
| `chat_conversations` | `user_id`, `title` |
| `chat_messages` | `conversation_id`, `role` (user/assistant), `content` |
| `market_intelligence_extractions` | FKs + 6 campos de extração + `raw_output`, `engine_model`, `latency_ms` |

Models Eloquent: `ChatConversation`, `ChatMessage`, `MarketIntelligenceExtraction`.

### 6. Endpoint Laravel

- `POST /chat/analyze` — autenticado, middleware `registration.complete`
- Controller: `app/Http/Controllers/ChatAnalysisController.php`
- Valida: `message` (obrigatório), `conversation_id` (opcional)
- Cria conversa + mensagem do usuário → chama IA → parse → persiste extração → salva resposta assistant
- Retorna JSON com `extraction` estruturada

O `Chat.jsx` **não foi alterado** — o endpoint está pronto para ser conectado depois.

### 7. Testes e ferramentas

| Teste | Tipo | Status |
|-------|------|--------|
| `MarketIntelligenceParserTest` | Unit (7 casos) | Passando |
| `LogAiEngineClientTest` | Unit (2 casos) | Passando |
| `ChatAnalysisTest` | Feature (6 casos) | Pronto (roda no Sail) |

Comando Artisan:
```bash
./vendor/bin/sail artisan ai:health
```

### 8. Variáveis de ambiente

```env
AI_ENGINE_DRIVER=http          # log | http
AI_ENGINE_URL=http://ai-engine:8000
AI_ENGINE_PORT=8001
AI_ENGINE_TIMEOUT=30
AI_ENGINE_TOKEN=
```

---

## Como rodar localmente

```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate        # já rodado (batch 11)
./vendor/bin/sail artisan ai:health      # verifica se o Python responde
```

---

## O que falta (próximas fases)

| Item | Descrição |
|------|-----------|
| IA real no Python | Implementar LLM/prompt em `services/ai-engine/app/routes/analyze.py` |
| Conectar Chat.jsx | Substituir "Em breve" por chamada ao `POST /chat/analyze` |
| Dashboard/Recharts | Consumir `market_intelligence_extractions` nos gráficos |
| Fila assíncrona | Para análises longas (se necessário) |
| Deploy produção | Python como serviço separado no Railway; Laravel recebe `AI_ENGINE_URL` via env |

---

## Arquivos criados/alterados

| Ação | Caminho |
|------|---------|
| Criado | `services/ai-engine/**` (8 arquivos) |
| Alterado | `compose.yaml` |
| Criado | `config/ai.php` |
| Alterado | `.env.example`, `.env` |
| Criado | `app/Contracts/Ai/AiEngineClient.php` |
| Criado | `app/Services/Ai/{Http,Log}AiEngineClient.php` |
| Criado | `app/Services/Ai/MarketIntelligenceService.php` |
| Criado | `app/Support/Ai/MarketIntelligenceParser.php` |
| Criado | `app/DTOs/Ai/*.php` (2 arquivos) |
| Criado | `app/Enums/Ai/*.php` (3 arquivos) |
| Criado | `app/Models/{ChatConversation,ChatMessage,MarketIntelligenceExtraction}.php` |
| Criado | `database/migrations/2026_06_10_00000{1,2,3}_*.php` |
| Criado | `app/Http/Controllers/ChatAnalysisController.php` |
| Criado | `app/Console/Commands/AiEngineHealthCheck.php` |
| Alterado | `app/Providers/AppServiceProvider.php` |
| Alterado | `routes/web.php` |
| Criado | `tests/Unit/Ai/*.php`, `tests/Feature/Ai/*.php` |
| Alterado | `tests/Pest.php`, `phpunit.xml` |
