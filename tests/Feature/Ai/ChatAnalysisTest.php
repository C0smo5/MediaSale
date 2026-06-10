<?php

use App\Contracts\Ai\AiEngineClient;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\MarketIntelligenceExtraction;
use App\Models\User;
use App\Services\Ai\LogAiEngineClient;

beforeEach(function (): void {
    $this->app->bind(AiEngineClient::class, LogAiEngineClient::class);
});

test('unauthenticated request is rejected', function (): void {
    $this->postJson(route('chat.analyze'), ['message' => 'teste'])
        ->assertUnauthorized();
});

test('authenticated user can analyze a message and extraction is persisted', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson(route('chat.analyze'), ['message' => 'Quero comparar o Galaxy S24 na Shopee'])
        ->assertOk()
        ->assertJsonStructure([
            'conversation_id',
            'message_id',
            'extraction_id',
            'assistant_message_id',
            'extraction' => [
                'produto_alvo',
                'categoria_mercado',
                'termo_concorrente',
                'intencao_analise',
                'metrica_monitoramento',
                'faixa_preco_alvo',
            ],
        ]);

    $data = $response->json();

    expect(ChatConversation::find($data['conversation_id']))->not->toBeNull()
        ->and(ChatMessage::find($data['message_id'])?->role)->toBe('user')
        ->and(MarketIntelligenceExtraction::find($data['extraction_id']))->not->toBeNull();
});

test('subsequent message reuses existing conversation', function (): void {
    $user = User::factory()->create();

    $first = $this->actingAs($user)
        ->postJson(route('chat.analyze'), ['message' => 'Primeiro produto'])
        ->assertOk()
        ->json('conversation_id');

    $second = $this->actingAs($user)
        ->postJson(route('chat.analyze'), [
            'message'         => 'Segundo produto',
            'conversation_id' => $first,
        ])
        ->assertOk()
        ->json('conversation_id');

    expect($second)->toBe($first);
    expect(ChatMessage::where('conversation_id', $first)->count())->toBe(4); // 2 user + 2 assistant
});

test('invalid conversation_id belonging to another user is rejected', function (): void {
    $owner  = User::factory()->create();
    $other  = User::factory()->create();

    $conversation = ChatConversation::create(['user_id' => $owner->id]);

    $this->actingAs($other)
        ->postJson(route('chat.analyze'), [
            'message'         => 'teste',
            'conversation_id' => $conversation->id,
        ])
        ->assertStatus(404);
});

test('message field is required', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('chat.analyze'), [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['message']);
});

test('incomplete registration is blocked by middleware', function (): void {
    $user = User::factory()->registrationIncomplete()->create();

    $this->actingAs($user)
        ->postJson(route('chat.analyze'), ['message' => 'teste'])
        ->assertRedirect();
});
