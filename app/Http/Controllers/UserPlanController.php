<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserPlanRequest;
use App\Services\Plan\PlanChangeService;
use App\Services\Plan\PlanPricingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class UserPlanController extends Controller
{
    public function __construct(
        private readonly PlanPricingService $pricing,
        private readonly PlanChangeService $planChangeService,
    ) {}

    public function store(UpdateUserPlanRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $fromPlanKey = $user->plan_key ?? 'trial';
        $fromBilling = $user->plan_billing ?? 'monthly';
        $toPlanKey = $validated['plan_key'];
        $toBilling = $validated['plan_billing'];

        if ($fromPlanKey === $toPlanKey && $fromBilling === $toBilling) {
            throw ValidationException::withMessages([
                'plan_key' => 'Este já é o seu plano atual.',
            ]);
        }

        if ($toPlanKey === 'trial') {
            throw ValidationException::withMessages([
                'plan_key' => 'Use a opção "Cancelar assinatura" para voltar ao Trial.',
            ]);
        }

        if (! $this->pricing->isUpgrade($fromPlanKey, $fromBilling, $toPlanKey, $toBilling)) {
            throw ValidationException::withMessages([
                'plan_key' => 'No momento só é possível fazer upgrade para planos mais caros. Para reduzir, cancele a assinatura.',
            ]);
        }

        $this->planChangeService->startUpgrade($request, $user, $toPlanKey, $toBilling);

        return redirect()->route('subscription.payment');
    }
}
