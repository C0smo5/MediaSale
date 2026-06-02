<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Services\Payment\MercadoPagoService;
use App\Services\Plan\PlanChangeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPaymentController extends Controller
{
    public function __construct(
        private readonly PlanChangeService $planChangeService,
        private readonly MercadoPagoService $mercadoPago,
    ) {}

    public function show(Request $request): Response|RedirectResponse
    {
        $pending = $this->planChangeService->getPendingChange($request);

        if ($pending === null) {
            return redirect()
                ->route('profile.edit', ['section' => 'plans'])
                ->with('status', 'no-pending-plan-change');
        }

        $user = $request->user();
        $mpPublicKey = trim((string) config('services.mercadopago.public_key'));

        return Inertia::render('Subscription/Payment', [
            'pending' => $pending,
            'canSkipPayment' => config('registration.allow_payment_skip'),
            'mpPublicKey' => $mpPublicKey !== '' ? $mpPublicKey : null,
            'payerEmail' => $user->email,
        ]);
    }

    /**
     * TODO (gateway): Replace with webhook-driven plan activation once a payment provider is integrated.
     * This endpoint is already gated behind `allow_payment_skip` (returns 404 in production).
     * When integrating a gateway, add a webhook handler and remove or repurpose this route.
     */
    public function complete(Request $request): RedirectResponse
    {
        abort_unless(config('registration.allow_payment_skip'), 404);

        $pending = $this->planChangeService->getPendingChange($request);

        if ($pending === null) {
            return redirect()->route('profile.edit', ['section' => 'plans']);
        }

        $user = $request->user();
        $this->planChangeService->applyPendingChange($request, $user);
        $user->refresh();

        return redirect()
            ->route('profile.edit', ['section' => 'plans'])
            ->with('status', 'plan-updated');
    }

    public function subscribe(Request $request): RedirectResponse
    {
        $pending = $this->planChangeService->getPendingChange($request);

        if ($pending === null) {
            return redirect()->route('profile.edit', ['section' => 'plans']);
        }

        $user = $request->user();

        $validated = $request->validate([
            'token' => ['required', 'string'],
            'issuer_id' => ['nullable', 'string'],
            'payment_method_id' => ['required', 'string'],
            'transaction_amount' => ['required', 'numeric', 'min:0.01'],
            'installments' => ['required', 'integer', 'min:1'],
            'payer.email' => ['required', 'email'],
            'payer.identification.type' => ['required', Rule::in(['CPF', 'CNPJ'])],
            'payer.identification.number' => ['required', 'string'],
        ]);

        // Cancel any active subscription in MP before creating a new one
        $activeSubscription = Subscription::query()
            ->where('user_id', $user->id)
            ->active()
            ->first();

        if ($activeSubscription?->mp_preapproval_id) {
            $this->mercadoPago->cancelPreApproval($activeSubscription->mp_preapproval_id);
            $activeSubscription->update(['status' => Subscription::STATUS_CANCELLED]);
        }

        /** @var Subscription $subscription */
        $subscription = Subscription::query()->create([
            'user_id' => $user->id,
            'plan_key' => $pending['plan_key'],
            'billing' => $pending['plan_billing'],
            'status' => Subscription::STATUS_PENDING,
            'amount_due' => $validated['transaction_amount'],
        ]);

        try {
            $result = $this->mercadoPago->createCardPayment($user, $validated, $subscription);
        } catch (\Throwable $e) {
            $mpError = $e instanceof \MercadoPago\Exceptions\MPApiException
                ? $e->getApiResponse()?->getContent()
                : null;

            Log::error('Pagamento: falha ao processar cartão no Mercado Pago', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'plan_key' => $pending['plan_key'],
                'message' => $e->getMessage(),
                'mp_response' => $mpError,
            ]);

            throw ValidationException::withMessages([
                'payment' => 'Não foi possível processar o pagamento. Tente novamente ou use outro cartão.',
            ]);
        }

        $subscription->update(['mp_preapproval_id' => $result['id']]);

        if ($result['status'] === 'authorized') {
            $subscription->update(['status' => Subscription::STATUS_AUTHORIZED]);
            $this->planChangeService->applyPendingChange($request, $user);
            $user->refresh();
        }

        return redirect()
            ->route('profile.edit', ['section' => 'plans'])
            ->with('status', 'plan-updated');
    }

    public function cancelPending(Request $request): RedirectResponse
    {
        $this->planChangeService->clearPendingChange($request);

        return redirect()
            ->route('profile.edit', ['section' => 'plans'])
            ->with('status', 'plan-change-cancelled');
    }
}
