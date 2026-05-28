import { plans, plansByKey, getPlanPrice, formatBrl } from '@/data/plans';
import { savePlanSelection } from '@/lib/planSelection';
import { router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const SparkleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
);

export function BillingToggle({ billing, onChange }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-2xl border p-1.5" style={{ borderColor: 'rgba(124,58,237,0.14)', backgroundColor: 'rgba(124,58,237,0.05)' }}>
            <button
                type="button"
                onClick={() => onChange('monthly')}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                style={billing === 'monthly' ? { backgroundColor: '#7c3aed', color: '#ffffff' } : { color: '#6b6b8a' }}
            >
                Mensal
            </button>
            <button
                type="button"
                onClick={() => onChange('annual')}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                style={billing === 'annual' ? { backgroundColor: '#7c3aed', color: '#ffffff' } : { color: '#6b6b8a' }}
            >
                Anual
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: 'rgba(5,150,105,0.14)', color: '#059669' }}>
                    -15%
                </span>
            </button>
        </div>
    );
}

export function ComparisonTable({ billing, selectedKey }) {
    const headerCells = ['Plano', 'Preço', 'Consultas', 'Imagens/Copy', 'Análise de Tendência'];

    return (
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(124,58,237,0.12)', backgroundColor: '#ffffff' }}>
            <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>
                    Comparação de planos
                </h2>
                <p className="mt-1 text-sm" style={{ color: '#6b6b8a' }}>
                    Valores estimados — a cobrança anual aplica desconto e mantém os mesmos limites.
                </p>
            </div>

            <div className="hidden md:block">
                <div className="grid grid-cols-5 gap-0 border-b" style={{ borderColor: 'rgba(124,58,237,0.08)' }}>
                    {headerCells.map((h) => (
                        <div key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>
                            {h}
                        </div>
                    ))}
                </div>
                {plans.map((plan) => {
                    const selected = plan.key === selectedKey;
                    const price = getPlanPrice(plan, billing);
                    const priceLabel = plan.monthlyPrice === 0 ? 'Grátis' : formatBrl(price);
                    return (
                        <div
                            key={plan.key}
                            className="grid grid-cols-5 gap-0 border-b px-0"
                            style={{
                                borderColor: 'rgba(124,58,237,0.08)',
                                backgroundColor: selected ? 'rgba(124,58,237,0.06)' : '#ffffff',
                            }}
                        >
                            <div className="px-5 py-3 text-sm font-semibold" style={{ color: '#1a1040' }}>
                                {plan.name}
                            </div>
                            <div className="px-5 py-3 text-sm" style={{ color: '#1a1040' }}>
                                {priceLabel}
                            </div>
                            <div className="px-5 py-3 text-sm" style={{ color: '#1a1040' }}>
                                {plan.comparison.consultsLabel}
                            </div>
                            <div className="px-5 py-3 text-sm" style={{ color: '#1a1040' }}>
                                {plan.comparison.imagesCopyLabel}
                            </div>
                            <div className="px-5 py-3 text-sm" style={{ color: '#1a1040' }}>
                                {plan.comparison.trendLabel === '✓' ? (
                                    <span className="inline-flex items-center gap-2 font-semibold" style={{ color: '#059669' }}>
                                        <CheckIcon /> Inclui
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2" style={{ color: '#ea580c' }}>
                                        <XIcon /> Não
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-3 p-5 md:hidden">
                {plans.map((plan) => {
                    const selected = plan.key === selectedKey;
                    const price = getPlanPrice(plan, billing);
                    const priceLabel = plan.monthlyPrice === 0 ? 'Grátis' : formatBrl(price);
                    return (
                        <div
                            key={plan.key}
                            className="rounded-2xl border p-4"
                            style={{
                                borderColor: selected ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.12)',
                                backgroundColor: selected ? 'rgba(124,58,237,0.06)' : '#ffffff',
                            }}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-bold" style={{ color: '#1a1040' }}>
                                    {plan.name}
                                </p>
                                <p className="text-sm font-semibold" style={{ color: '#7c3aed' }}>
                                    {priceLabel}
                                </p>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#6b6b8a' }}>
                                        Consultas
                                    </p>
                                    <p className="mt-0.5 font-semibold" style={{ color: '#1a1040' }}>
                                        {plan.comparison.consultsLabel}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#6b6b8a' }}>
                                        Imagens/Copy
                                    </p>
                                    <p className="mt-0.5 font-semibold" style={{ color: '#1a1040' }}>
                                        {plan.comparison.imagesCopyLabel}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#6b6b8a' }}>
                                        Tendência
                                    </p>
                                    <p className="mt-0.5 font-semibold" style={{ color: plan.comparison.trendLabel === '✓' ? '#059669' : '#ea580c' }}>
                                        {plan.comparison.trendLabel === '✓' ? 'Inclui' : 'Não inclui'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PlanConfirmationCard({ plan, billing, mode, onConfirm, processing }) {
    const price = getPlanPrice(plan, billing);
    const isFree = plan.monthlyPrice === 0;
    const priceLabel = isFree ? 'Grátis' : `${formatBrl(price)}/mês`;

    const handleConfirm = () => {
        if (mode === 'registration') {
            onConfirm?.();
            return;
        }

        savePlanSelection(plan.key, billing);
        router.visit(route('register'));
    };

    const handleCancelRegistration = () => {
        if (mode === 'registration') {
            router.post(route('register.cancel'));
            return;
        }

        router.visit(route('home'));
    };

    const confirmLabel =
        mode === 'registration' ? 'Confirmar plano e continuar' : 'Continuar com este plano';

    const helperText =
        mode === 'registration'
            ? 'Todos os planos estão disponíveis para teste. A cobrança será integrada em uma próxima etapa.'
            : 'Na próxima etapa você cria sua conta e finaliza o cadastro com o plano escolhido.';

    return (
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(124,58,237,0.12)', backgroundColor: '#ffffff' }}>
            <div
                className="border-b px-6 py-5"
                style={{
                    borderColor: 'rgba(124,58,237,0.10)',
                    background: 'linear-gradient(135deg, #f0eeff 0%, #ffffff 60%)',
                }}
            >
                <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                    <SparkleIcon /> Confirmação
                </div>
                <h2 className="text-lg font-bold" style={{ color: '#1a1040' }}>
                    Plano selecionado: {plan.name}
                </h2>
                <p className="mt-1 text-sm" style={{ color: '#6b6b8a' }}>
                    {priceLabel} · Cobrança {billing === 'annual' ? 'anual (equivalente mensal)' : 'mensal'}
                </p>
            </div>

            <div className="space-y-4 px-6 py-5">
                <div className="grid gap-2 sm:grid-cols-2">
                    {plan.features.slice(0, 6).map((feature) => (
                        <div
                            key={feature.label}
                            className="flex items-start gap-2 rounded-xl border px-3 py-2 text-sm"
                            style={{
                                borderColor: 'rgba(124,58,237,0.12)',
                                backgroundColor: feature.included ? 'rgba(5,150,105,0.08)' : 'rgba(124,58,237,0.03)',
                                color: '#1a1040',
                            }}
                        >
                            <span style={{ color: feature.included ? '#059669' : '#6b6b8a' }}>{feature.included ? <CheckIcon /> : <XIcon />}</span>
                            <span className="min-w-0">
                                <span className="font-semibold">{feature.label}</span>
                                {feature.detail && (
                                    <span className="block text-xs" style={{ color: '#6b6b8a' }}>
                                        {feature.detail}
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleCancelRegistration}
                        disabled={processing}
                        className="w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors hover:bg-black/5 disabled:opacity-60 sm:w-auto sm:min-w-[180px]"
                        style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#6b6b8a', backgroundColor: '#ffffff' }}
                    >
                        Cancelar cadastro
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={processing}
                        className="w-full flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 10px 24px rgba(124,58,237,0.22)' }}
                    >
                        {processing ? 'Salvando...' : confirmLabel}
                    </button>
                </div>

                <p className="text-center text-xs" style={{ color: '#6b6b8a' }}>
                    {helperText}
                </p>
            </div>
        </div>
    );
}

export default function PlansPicker({
    mode = 'public',
    initialPlan = 'pro',
    initialBilling = 'monthly',
    syncQueryParams = false,
    onBillingChange,
    onPlanChange,
}) {
    const form = useForm({
        plan_key: initialPlan,
        plan_billing: initialBilling,
    });

    const [billing, setBilling] = useState(initialBilling);
    const [selectedPlanKey, setSelectedPlanKey] = useState(initialPlan);

    useEffect(() => {
        setBilling(initialBilling);
        setSelectedPlanKey(initialPlan);
    }, [initialPlan, initialBilling]);

    useEffect(() => {
        if (!syncQueryParams || typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('plan', selectedPlanKey);
        url.searchParams.set('billing', billing);
        window.history.replaceState({}, '', url.toString());
    }, [selectedPlanKey, billing, syncQueryParams]);

    const selectedPlan = useMemo(() => plansByKey[selectedPlanKey] ?? plansByKey.pro, [selectedPlanKey]);

    const handleSelectPlan = (planKey) => {
        setSelectedPlanKey(planKey);
        savePlanSelection(planKey, billing);
        onPlanChange?.(planKey, billing);
    };

    const handleBillingChange = (nextBilling) => {
        setBilling(nextBilling);
        savePlanSelection(selectedPlanKey, nextBilling);
        onBillingChange?.(nextBilling);
    };

    const submitRegistrationPlan = () => {
        savePlanSelection(selectedPlanKey, billing);
        form.setData({
            plan_key: selectedPlanKey,
            plan_billing: billing,
        });
        form.post(route('register.plan.store'));
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-end gap-3">
                <BillingToggle billing={billing} onChange={handleBillingChange} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                <div className="space-y-3">
                    {plans.map((plan) => (
                        <button
                            key={plan.key}
                            type="button"
                            onClick={() => handleSelectPlan(plan.key)}
                            className="w-full rounded-2xl border p-4 text-left transition-colors hover:bg-black/5"
                            style={{
                                borderColor: plan.key === selectedPlanKey ? 'rgba(124,58,237,0.45)' : 'rgba(124,58,237,0.12)',
                                backgroundColor: plan.key === selectedPlanKey ? 'rgba(124,58,237,0.06)' : '#ffffff',
                            }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold" style={{ color: '#1a1040' }}>
                                        {plan.name}
                                    </p>
                                    <p className="mt-1 text-xs" style={{ color: '#6b6b8a' }}>
                                        {plan.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold" style={{ color: '#7c3aed' }}>
                                        {plan.monthlyPrice === 0 ? 'Grátis' : formatBrl(getPlanPrice(plan, billing))}
                                    </p>
                                    {plan.monthlyPrice !== 0 && (
                                        <p className="text-[11px]" style={{ color: '#6b6b8a' }}>
                                            /mês
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    <PlanConfirmationCard
                        key={`${selectedPlan.key}-${billing}`}
                        plan={selectedPlan}
                        billing={billing}
                        mode={mode}
                        onConfirm={mode === 'registration' ? submitRegistrationPlan : undefined}
                        processing={form.processing}
                    />
                    <ComparisonTable billing={billing} selectedKey={selectedPlanKey} />
                </div>
            </div>
        </>
    );
}
