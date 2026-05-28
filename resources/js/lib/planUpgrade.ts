import { type BillingCycle, type PlanKey, getPlanPrice, plansByKey } from '@/data/plans';

export const UPGRADE_INTEREST_RATE = 0.0638;

export function isFreePlan(planKey: PlanKey): boolean {
    return planKey === 'trial';
}

export function calculateUpgradeCharge(
    fromPlanKey: PlanKey,
    fromBilling: BillingCycle,
    toPlanKey: PlanKey,
    toBilling: BillingCycle,
) {
    const fromPlan = plansByKey[fromPlanKey];
    const toPlan = plansByKey[toPlanKey];
    const fromPrice = getPlanPrice(fromPlan, fromBilling);
    const toPrice = getPlanPrice(toPlan, toBilling);
    const fromIsTrial = isFreePlan(fromPlanKey);

    const complement = fromIsTrial
        ? Math.round(toPrice * 100) / 100
        : Math.max(0, Math.round((toPrice - fromPrice) * 100) / 100);

    const interestRate = fromIsTrial ? 0 : UPGRADE_INTEREST_RATE;
    const interestAmount = fromIsTrial ? 0 : Math.round(complement * interestRate * 100) / 100;
    const amountDue = Math.round((complement + interestAmount) * 100) / 100;

    return {
        fromPrice,
        toPrice,
        complement,
        usesComplement: !fromIsTrial,
        fromIsTrial,
        interestRate,
        interestAmount,
        amountDue,
    };
}

export function isPlanUpgrade(
    fromPlanKey: PlanKey,
    fromBilling: BillingCycle,
    toPlanKey: PlanKey,
    toBilling: BillingCycle,
): boolean {
    const fromPlan = plansByKey[fromPlanKey];
    const toPlan = plansByKey[toPlanKey];

    return getPlanPrice(toPlan, toBilling) > getPlanPrice(fromPlan, fromBilling);
}
