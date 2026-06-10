<?php

use App\DTOs\Ai\AiAnalysisResponse;
use App\Services\Ai\LogAiEngineClient;

$client = new LogAiEngineClient;

test('analyze returns an AiAnalysisResponse with log-stub model', function () use ($client): void {
    $response = $client->analyze('Quero comparar preços do Galaxy S24', [], 1);

    expect($response)->toBeInstanceOf(AiAnalysisResponse::class)
        ->and($response->model)->toBe('log-stub')
        ->and($response->latencyMs)->toBe(0)
        ->and($response->rawOutput)->toContain('PRODUTO_ALVO:');
});

test('healthy always returns true', function () use ($client): void {
    expect($client->healthy())->toBeTrue();
});
