import PlansPicker from '@/Components/plans/PlansPicker';
import { resolvePlanSelection, savePlanSelection } from '@/lib/planSelection';
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PlansIndex({ mode = 'public', initialPlan = 'pro', initialBilling = 'monthly' }) {
    const { planKey, billing } = resolvePlanSelection({
        planFromQuery: initialPlan,
        billingFromQuery: initialBilling,
        fallbackPlan: initialPlan,
        fallbackBilling: initialBilling,
    });

    useEffect(() => {
        savePlanSelection(planKey, billing);
    }, [planKey, billing]);

    return (
        <div className="min-h-screen min-w-0 overflow-x-hidden" style={{ backgroundColor: '#ffffff' }}>
            <Head title="Planos" />

            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold no-underline transition-colors hover:bg-black/5"
                            style={{ borderColor: 'rgba(124,58,237,0.14)', color: '#7c3aed' }}
                        >
                            ← Voltar para a landingpage
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: '#1a1040' }}>
                            Planos
                        </h1>
                        <p className="max-w-3xl text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                            Selecione um plano na lista — os detalhes de confirmação à direita atualizam conforme sua escolha.
                            Ao confirmar, você segue para o cadastro.
                        </p>
                    </div>
                </div>

                <PlansPicker
                    key={`${planKey}-${billing}`}
                    mode={mode}
                    initialPlan={planKey}
                    initialBilling={billing}
                    syncQueryParams
                />
            </div>
        </div>
    );
}
