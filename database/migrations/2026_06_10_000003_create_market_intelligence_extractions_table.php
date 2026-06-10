<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_intelligence_extractions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')
                ->constrained('chat_conversations')
                ->cascadeOnDelete();
            $table->foreignId('message_id')
                ->constrained('chat_messages')
                ->cascadeOnDelete();
            $table->string('produto_alvo')->default('Não identificado');
            $table->string('categoria_mercado')->default('Não identificado');
            $table->string('termo_concorrente')->default('Não identificado');
            $table->string('intencao_analise')->default('Não identificado');
            $table->string('metrica_monitoramento')->default('Não identificado');
            $table->string('faixa_preco_alvo')->default('Não identificado');
            $table->text('raw_output');
            $table->string('engine_model')->default('unknown');
            $table->unsignedInteger('latency_ms')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_intelligence_extractions');
    }
};
