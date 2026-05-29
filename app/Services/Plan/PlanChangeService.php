<?php

namespace App\Services\Plan;

use App\Models\User;
use Illuminate\Http\Request;

class PlanChangeService
{
    public function __construct(
        private readonly PlanPricingService $pricing,
    ) {}

    public function sessionKey(): string
    {
        return (string) config('plans.session_pending_change_key', 'pending_plan_change');
    }

  /**
     * @return array<string, mixed>|null
     */
    public function getPendingChange(Request $request): ?array
    {
        $pending = $request->session()->get($this->sessionKey());

        return is_array($pending) ? $pending : null;
    }

    public function clearPendingChange(Request $request): void
    {
        $request->session()->forget($this->sessionKey());
    }

    /**
     * @return array<string, mixed>
     */
    public function startUpgrade(
        Request $request,
        User $user,
        string $toPlanKey,
        string $toBilling,
    ): array {
        $fromPlanKey = $user->plan_key ?? 'trial';
        $fromBilling = $user->plan_billing ?? 'monthly';

        if (! $this->pricing->isUpgrade($fromPlanKey, $fromBilling, $toPlanKey, $toBilling)) {
            throw new \InvalidArgumentException('A troca informada não é um upgrade.');
        }

        $charge = $this->pricing->calculateUpgradeCharge(
            $fromPlanKey,
            $fromBilling,
            $toPlanKey,
            $toBilling,
        );

        $pending = [
            'plan_key' => $toPlanKey,
            'plan_billing' => $toBilling,
            'from_plan_key' => $fromPlanKey,
            'from_plan_billing' => $fromBilling,
            ...$charge,
        ];

        $request->session()->put($this->sessionKey(), $pending);

        return $pending;
    }

    public function applyPendingChange(Request $request, User $user): void
    {
        $pending = $this->getPendingChange($request);

        if ($pending === null) {
            return;
        }

        $requiresPayment = $user->planRequiresPaymentForKey($pending['plan_key']);

        $user->forceFill([
            'plan_key' => $pending['plan_key'],
            'plan_billing' => $pending['plan_billing'],
            'payment_completed' => $requiresPayment,
        ])->save();

        $this->clearPendingChange($request);
    }

    public function cancelSubscription(User $user): void
    {
        $user->forceFill([
            'plan_key' => 'trial',
            'plan_billing' => 'monthly',
            'payment_completed' => false,
        ])->save();
    }
}
