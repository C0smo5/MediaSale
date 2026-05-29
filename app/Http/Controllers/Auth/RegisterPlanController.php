<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserPlanRequest;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisterPlanController extends Controller
{
    public function __construct(
        private readonly RegistrationAccountService $registrationAccounts,
    ) {}

    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->usesGoogleAuth() && ! $user->isFullyVerified()) {
            return redirect()->route('register.verify');
        }

        if ($user->hasSelectedPlan()) {
            $nextRoute = $user->nextRegistrationStep();

            if ($nextRoute !== null && $nextRoute !== 'register.plan') {
                return redirect()->route($nextRoute);
            }

            if ($nextRoute === null) {
                return redirect()->route('dashboard');
            }
        }

        return Inertia::render('Auth/RegisterPlan', [
            'initialPlan' => $request->query('plan', 'pro'),
            'initialBilling' => $request->query('billing', 'monthly'),
            'accountType' => $user->accountType(),
            'accountTypeLabel' => $user->accountTypeLabel(),
        ]);
    }

    public function store(UpdateUserPlanRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $user->fill([
            'plan_key' => $validated['plan_key'],
            'plan_billing' => $validated['plan_billing'],
        ]);
        $user->save();

        $user->refresh();

        $nextRoute = $user->nextRegistrationStep();

        if ($nextRoute !== null) {
            return redirect()->route($nextRoute);
        }

        $this->registrationAccounts->markAccountVerified($user);

        return redirect()->route('dashboard');
    }
}
