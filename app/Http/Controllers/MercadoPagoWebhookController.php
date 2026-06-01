<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Services\Payment\MercadoPagoService;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MercadoPagoWebhookController extends Controller
{
    public function __construct(
        private readonly MercadoPagoService $mercadoPago,
        private readonly RegistrationAccountService $registrationAccounts,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        if (! $this->mercadoPago->verifyWebhookSignature($request)) {
            Log::warning('MercadoPago webhook: invalid signature', [
                'x_request_id' => $request->header('x-request-id'),
                'ip' => $request->ip(),
            ]);

            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $type = $request->input('type') ?? $request->input('topic');

        match ($type) {
            'payment' => $this->handlePayment($request),
            'preapproval' => $this->handlePreApproval($request),
            default => null,
        };

        return response()->json(['ok' => true]);
    }

    private function handlePayment(Request $request): void
    {
        $externalReference = $request->input('data.external_reference')
            ?? $request->input('external_reference');

        if (! $externalReference) {
            return;
        }

        /** @var Subscription|null $subscription */
        $subscription = Subscription::query()->find((int) $externalReference);

        if (! $subscription) {
            return;
        }

        $subscription->update(['status' => Subscription::STATUS_AUTHORIZED]);

        $user = $subscription->user;

        if (! $user->hasCompletedPayment()) {
            $user->forceFill(['payment_completed' => true])->save();
            $this->registrationAccounts->markAccountVerified($user);
        }

        Log::info('MercadoPago webhook: payment authorized', [
            'subscription_id' => $subscription->id,
            'user_id' => $user->id,
        ]);
    }

    private function handlePreApproval(Request $request): void
    {
        $preApprovalId = $request->input('data.id') ?? $request->input('id');

        if (! $preApprovalId) {
            return;
        }

        /** @var Subscription|null $subscription */
        $subscription = Subscription::query()->where('mp_preapproval_id', $preApprovalId)->first();

        if (! $subscription) {
            return;
        }

        $status = $request->input('data.status') ?? $request->input('status');

        $mapped = match ($status) {
            'paused' => Subscription::STATUS_PAUSED,
            'cancelled' => Subscription::STATUS_CANCELLED,
            'authorized' => Subscription::STATUS_AUTHORIZED,
            default => null,
        };

        if ($mapped !== null) {
            $subscription->update(['status' => $mapped]);
        }
    }
}
