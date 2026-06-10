<?php

namespace App\Services\Ai;

use App\Contracts\Ai\AiEngineClient;
use App\DTOs\Ai\AiAnalysisResponse;
use Illuminate\Support\Facades\Log;

class LogAiEngineClient implements AiEngineClient
{
    private const STUB_OUTPUT = <<<'TEXT'
PRODUTO_ALVO: Não identificado
CATEGORIA_MERCADO: Não identificado
TERMO_CONCORRENTE: Não identificado
INTENCAO_ANALISE: Não identificado
METRICA_MONITORAMENTO: Não identificado
FAIXA_PRECO_ALVO: Não identificado
TEXT;

    public function analyze(string $message, array $transcript = [], ?int $userId = null): AiAnalysisResponse
    {
        Log::info('AI engine (log driver): analyze called.', [
            'message' => $message,
            'transcript_length' => count($transcript),
            'user_id' => $userId,
        ]);

        return new AiAnalysisResponse(
            rawOutput: self::STUB_OUTPUT,
            model: 'log-stub',
            latencyMs: 0,
        );
    }

    public function healthy(): bool
    {
        return true;
    }
}
