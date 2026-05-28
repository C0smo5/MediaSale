<?php

namespace App\Services\Plan;

class PlanPricingService
{
    public function isFreePlan(string $planKey): bool
    {
        return in_array($planKey, config('plans.free_plan_keys', ['trial']), true);
    }

    public function monthlyPrice(string $planKey): float
    {
        return (float) (config('plans.monthly_prices')[$planKey] ?? 0);
    }

    public function annualDiscountPercent(string $planKey): int
    {
        return (int) (config('plans.annual_discount_percent')[$planKey] ?? 0);
    }

    public function priceForBilling(string $planKey, string $billing): float
    {
        $monthly = $this->monthlyPrice($planKey);

        if ($billing === 'annual') {
            $discount = $this->annualDiscountPercent($planKey);

            return round($monthly * (1 - $discount / 100), 2);
        }

        return round($monthly, 2);
    }

    public function isUpgrade(string $fromPlanKey, string $fromBilling, string $toPlanKey, string $toBilling): bool
    {
        return $this->priceForBilling($toPlanKey, $toBilling)
            > $this->priceForBilling($fromPlanKey, $fromBilling);
    }

    /**
     * Upgrade pago: preço fixo do plano escolhido.
     * - Saindo do Trial: valor integral do plano escolhido (preço fixo), sem complemento e sem juros.
     * - Saindo de plano pago: complemento + juros (config plans.upgrade_interest_rate) sobre o complemento.
     * Cancelamento de assinatura não usa este cálculo (volta ao Trial sem cobrança).
     *
     * @return array{
     *     from_price: float,
     *     to_price: float,
     *     complement: float,
     *     uses_complement: bool,
     *     from_is_trial: bool,
     *     interest_rate: float,
     *     interest_amount: float,
     *     amount_due: float
     * }
     */
    public function calculateUpgradeCharge(
        string $fromPlanKey,
        string $fromBilling,
        string $toPlanKey,
        string $toBilling,
    ): array {
        if ($this->isFreePlan($toPlanKey)) {
            throw new \InvalidArgumentException('Não é possível fazer upgrade para o plano Trial.');
        }

        $fromPrice = $this->priceForBilling($fromPlanKey, $fromBilling);
        $toPrice = $this->priceForBilling($toPlanKey, $toBilling);
        $fromIsTrial = $this->isFreePlan($fromPlanKey);

        if ($fromIsTrial) {
            $complement = round($toPrice, 2);
            $usesComplement = false;
        } else {
            $complement = max(0, round($toPrice - $fromPrice, 2));
            $usesComplement = true;
        }

        $interestRate = $fromIsTrial ? 0.0 : (float) config('plans.upgrade_interest_rate', 0.05);
        $interestAmount = $fromIsTrial ? 0.0 : round($complement * $interestRate, 2);
        $amountDue = round($complement + $interestAmount, 2);

        return [
            'from_price' => $fromPrice,
            'to_price' => $toPrice,
            'complement' => $complement,
            'uses_complement' => $usesComplement,
            'from_is_trial' => $fromIsTrial,
            'interest_rate' => $interestRate,
            'interest_amount' => $interestAmount,
            'amount_due' => $amountDue,
        ];
    }
}
