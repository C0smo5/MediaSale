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
