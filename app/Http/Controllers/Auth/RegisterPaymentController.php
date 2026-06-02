<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Services\Payment\MercadoPagoService;
use App\Services\Plan\PlanPricingService;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisterPaymentController extends Controller
{
    public function __construct(
        private readonly RegistrationAccountService $registrationAccounts,
        private readonly MercadoPagoService $mercadoPago,
    ) {}

    public function show(Request $request, PlanPricingService $pricing): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->isFullyVerified()) {
            return redirect()->route('register.verify');
        }

        if (! $user->hasSelectedPlan()) {
            return redirect()->route('register.plan');
        }

        if (! $user->planRequiresPayment() || $user->hasCompletedPayment()) {
            return redirect()->route('dashboard');
        }

        $charge = $pricing->calculateUpgradeCharge(
            'trial',
            'monthly',
            $user->plan_key,
            $user->plan_billing,
        );

        $pending = [
            'plan_key' => $user->plan_key,
            'plan_billing' => $user->plan_billing,
            'from_plan_key' => 'trial',
            'from_plan_billing' => 'monthly',
            ...$charge,
        ];

        $mpPublicKey = trim((string) config('services.mercadopago.public_key'));

        return Inertia::render('Auth/RegisterPayment', [
            'pending' => $pending,
            'canSkipPayment' => config('registration.allow_payment_skip'),
            'mpPublicKey' => $mpPublicKey !== '' ? $mpPublicKey : null,
            'payerEmail' => $user->email,
        ]);
    }

    public function skipForTesting(Request $request): RedirectResponse
    {
        abort_unless(config('registration.allow_payment_skip'), 404);

        $user = $request->user();

        if (! $user->isFullyVerified() || ! $user->hasSelectedPlan() || ! $user->planRequiresPayment()) {
            return redirect()->route('dashboard');
        }

        $user->forceFill(['payment_completed' => true])->save();
        $this->registrationAccounts->markAccountVerified($user);

        return redirect()->route('dashboard');
    }

    public function subscribe(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($this->registrationAccounts->isInactive($user)) {
            $this->registrationAccounts->deleteIncompleteRegistration($user);

            throw ValidationException::withMessages([
                'registration' => 'Cadastro expirado por inatividade. Reinicie o cadastro para continuar.',
            ]);
        }

        if (! $user->isFullyVerified() || ! $user->hasSelectedPlan() || ! $user->planRequiresPayment() || $user->hasCompletedPayment()) {
            return redirect()->route('dashboard');
        }

        $pricing = $request->session()->get('pending_plan_pricing');

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

        /** @var Subscription $subscription */
        $subscription = Subscription::query()->create([
            'user_id' => $user->id,
            'plan_key' => $user->plan_key,
            'billing' => $user->plan_billing,
            'status' => Subscription::STATUS_PENDING,
            'amount_due' => $validated['transaction_amount'],
        ]);

        try {
            $result = $this->mercadoPago->createCardPayment($user, $validated, $subscription);
        } catch (\Throwable $e) {
            $mpError = $e instanceof \MercadoPago\Exceptions\MPApiException
                ? $e->getApiResponse()?->getContent()
                : null;

            Log::error('Pagamento: falha ao processar cartão no Mercado Pago (cadastro)', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'plan_key' => $user->plan_key,
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
            $user->forceFill(['payment_completed' => true])->save();
            $this->registrationAccounts->markAccountVerified($user);

            return redirect()->route('dashboard');
        }

        return redirect()->route('register.payment.pending');
    }

    public function pending(): Response
    {
        return Inertia::render('Auth/RegisterPaymentPending');
    }

    /**
     * Mock/test shortcut — only available when `allow_payment_skip` is enabled.
     * @deprecated Replaced by the real subscribe() flow with Mercado Pago.
     */
    public function complete(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->isFullyVerified() || ! $user->hasSelectedPlan() || ! $user->planRequiresPayment()) {
            return redirect()->route('dashboard');
        }

        $user->forceFill(['payment_completed' => true])->save();
        $this->registrationAccounts->markAccountVerified($user);

        return redirect()->route('dashboard');
    }
}
