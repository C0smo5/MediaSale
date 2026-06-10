<?php

namespace App\Services\Ai;

use App\Contracts\Ai\AiEngineClient;
use App\DTOs\Ai\AiAnalysisResponse;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class HttpAiEngineClient implements AiEngineClient
{
    public function __construct(
        private readonly string $baseUrl,
        private readonly int $timeout,
        private readonly ?string $token,
    ) {}

    public function analyze(string $message, array $transcript = [], ?int $userId = null): AiAnalysisResponse
    {
        $response = $this->http()
            ->post('/analyze', [
                'message'   => $message,
                'transcript' => $transcript,
                'user_id'   => $userId,
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'AI engine responded with HTTP '.$response->status().': '.$response->body()
            );
        }

        $data = $response->json();

        return new AiAnalysisResponse(
            rawOutput: (string) ($data['raw_output'] ?? ''),
            model: (string) ($data['model'] ?? 'unknown'),
            latencyMs: (int) ($data['latency_ms'] ?? 0),
        );
    }

    public function healthy(): bool
    {
        try {
            $response = $this->http()->timeout(5)->get('/health');

            return $response->successful()
                && ($response->json('status') === 'ok');
        } catch (ConnectionException) {
            return false;
        }
    }

    private function http(): \Illuminate\Http\Client\PendingRequest
    {
        $pending = Http::baseUrl($this->baseUrl)->timeout($this->timeout);

        if ($this->token) {
            $pending = $pending->withToken($this->token);
        }

        return $pending;
    }
}
