const STORAGE_KEY = 'orin_plan_selection';

export const VALID_PLAN_KEYS = ['trial', 'starter', 'pro', 'business', 'elite'] as const;

export type PlanKey = (typeof VALID_PLAN_KEYS)[number];

export type BillingCycle = 'monthly' | 'annual';

export type PlanSelection = {
    planKey: string;
    billing: BillingCycle;
    updatedAt: number;
};

export function savePlanSelection(planKey: string, billing: BillingCycle = 'monthly'): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const payload: PlanSelection = {
            planKey,
            billing,
            updatedAt: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // ignore quota / private mode errors
    }
}

export function readPlanSelection(): PlanSelection | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as PlanSelection;
        if (!parsed?.planKey) {
            return null;
        }

        return {
            planKey: parsed.planKey,
            billing: parsed.billing === 'annual' ? 'annual' : 'monthly',
            updatedAt: parsed.updatedAt ?? 0,
        };
    } catch {
        return null;
    }
}

export function isValidPlanKey(planKey: string | null | undefined): planKey is PlanKey {
    return Boolean(planKey && VALID_PLAN_KEYS.includes(planKey as PlanKey));
}

export function resolvePlanSelection(options: {
    planFromQuery?: string | null;
    billingFromQuery?: string | null;
    fallbackPlan?: PlanKey;
    fallbackBilling?: BillingCycle;
} = {}): { planKey: PlanKey; billing: BillingCycle } {
    const stored = typeof window !== 'undefined' ? readPlanSelection() : null;
    const fallbackPlan = options.fallbackPlan ?? 'pro';
    const fallbackBilling = options.fallbackBilling ?? 'monthly';

    const planKey = isValidPlanKey(options.planFromQuery)
        ? options.planFromQuery
        : stored?.planKey && isValidPlanKey(stored.planKey)
          ? stored.planKey
          : fallbackPlan;

    const billing =
        options.billingFromQuery === 'monthly' || options.billingFromQuery === 'annual'
            ? options.billingFromQuery
            : stored?.billing ?? fallbackBilling;

    return { planKey, billing };
}

export function clearPlanSelection(): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}
