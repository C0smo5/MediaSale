<?php

namespace App\DTOs\Ai;

final readonly class AiAnalysisResponse
{
    public function __construct(
        public string $rawOutput,
        public string $model,
        public int $latencyMs,
    ) {}
}
