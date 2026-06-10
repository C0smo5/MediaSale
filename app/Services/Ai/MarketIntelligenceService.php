<?php

namespace App\Services\Ai;

use App\Contracts\Ai\AiEngineClient;
use App\DTOs\Ai\MarketIntelligence;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\MarketIntelligenceExtraction;
use App\Support\Ai\MarketIntelligenceParser;

class MarketIntelligenceService
{
    public function __construct(
        private readonly AiEngineClient $client,
        private readonly MarketIntelligenceParser $parser,
    ) {}

    /**
     * Analyze the seller's message, persist the conversation + extraction
     * and return the typed intelligence DTO.
     */
    public function analyze(
        int $userId,
        string $message,
        ?int $conversationId = null,
    ): array {
        $conversation = $conversationId
            ? ChatConversation::where('id', $conversationId)->where('user_id', $userId)->firstOrFail()
            : ChatConversation::create(['user_id' => $userId]);

        $userMessage = ChatMessage::create([
            'conversation_id' => $conversation->id,
            'role'            => 'user',
            'content'         => $message,
        ]);

        $transcript = $conversation->messages()
            ->where('id', '<', $userMessage->id)
            ->orderBy('id')
            ->pluck('content')
            ->all();

        $aiResponse = $this->client->analyze($message, $transcript, $userId);

        $intelligence = $this->parser->parse($aiResponse->rawOutput);

        $fields = $intelligence->toArray();

        $extraction = MarketIntelligenceExtraction::create([
            'conversation_id'       => $conversation->id,
            'message_id'            => $userMessage->id,
            'raw_output'            => $aiResponse->rawOutput,
            'engine_model'          => $aiResponse->model,
            'latency_ms'            => $aiResponse->latencyMs,
            ...$fields,
        ]);

        $assistantMessage = ChatMessage::create([
            'conversation_id' => $conversation->id,
            'role'            => 'assistant',
            'content'         => $this->formatAssistantSummary($intelligence),
        ]);

        return [
            'conversation_id' => $conversation->id,
            'message_id'      => $userMessage->id,
            'extraction_id'   => $extraction->id,
            'assistant_message_id' => $assistantMessage->id,
            'extraction'      => $fields,
        ];
    }

    private function formatAssistantSummary(MarketIntelligence $intel): string
    {
        $lines = [
            "**Produto:** {$intel->produtoAlvo}",
            "**Categoria:** {$intel->categoriaMercado->value}",
            "**Concorrente/Marketplace:** {$intel->termoConcorrente}",
            "**Intenção:** {$intel->intencaoAnalise->value}",
            "**Métrica:** {$intel->metricaMonitoramento->value}",
            "**Faixa de preço:** {$intel->faixaPrecoAlvo}",
        ];

        return implode("\n", $lines);
    }
}
