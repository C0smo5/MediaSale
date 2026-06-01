<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Plan\PlanPricingService;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisterPaymentController extends Controller
{
    public function __construct(
        private readonly RegistrationAccountService $registrationAccounts,
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

        return Inertia::render('Auth/RegisterPayment', [
            'pending' => $pending,
            'canSkipPayment' => config('registration.allow_payment_skip'),
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

    /**
     * TODO (gateway): Replace with webhook-driven confirmation once a payment provider is integrated.
     * This endpoint currently marks payment as complete without verifying a real charge.
     * Before going live with paid plans:
     *   1. Gate this route behind `abort_unless(config('registration.allow_payment_skip'), 404)` as a safety net.
     *   2. Add a webhook handler that sets `payment_completed` after a verified `payment_succeeded` event.
     *   3. Add a regression test asserting that with `allow_payment_skip=false`, POST here does NOT set payment_completed.
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
