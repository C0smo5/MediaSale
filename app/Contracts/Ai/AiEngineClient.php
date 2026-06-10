<?php

namespace App\Contracts\Ai;

use App\DTOs\Ai\AiAnalysisResponse;

interface AiEngineClient
{
    /**
     * Send a seller message (and optional conversation transcript) to the AI engine
     * and receive a structured market intelligence extraction in raw "Key: Value" format.
     *
     * @param  string[]  $transcript  Previous messages in the conversation, oldest first.
     */
    public function analyze(string $message, array $transcript = [], ?int $userId = null): AiAnalysisResponse;

    /**
     * Check if the AI engine is reachable and healthy.
     */
    public function healthy(): bool;
}
