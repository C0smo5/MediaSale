<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketIntelligenceExtraction extends Model
{
    protected $fillable = [
        'conversation_id',
        'message_id',
        'produto_alvo',
        'categoria_mercado',
        'termo_concorrente',
        'intencao_analise',
        'metrica_monitoramento',
        'faixa_preco_alvo',
        'raw_output',
        'engine_model',
        'latency_ms',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(ChatConversation::class, 'conversation_id');
    }

    public function message(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'message_id');
    }
}
