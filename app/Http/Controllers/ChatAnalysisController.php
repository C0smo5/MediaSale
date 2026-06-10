<?php

namespace App\Http\Controllers;

use App\Services\Ai\MarketIntelligenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatAnalysisController extends Controller
{
    public function __construct(
        private readonly MarketIntelligenceService $service,
    ) {}

    public function analyze(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message'         => ['required', 'string', 'max:2000'],
            'conversation_id' => ['nullable', 'integer', 'exists:chat_conversations,id'],
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $result = $this->service->analyze(
            userId:         $user->id,
            message:        $validated['message'],
            conversationId: $validated['conversation_id'] ?? null,
        );

        return response()->json($result);
    }
}
