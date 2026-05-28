import PlansPicker from '@/Components/plans/PlansPicker';
import { plansByKey } from '@/data/plans';
import { readPlanSelection, savePlanSelection } from '@/lib/planSelection';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function RegisterPlan({ initialPlan = 'pro', initialBilling = 'monthly' }) {
    const [plan, setPlan] = useState(initialPlan);
    const [billing, setBilling] = useState(initialBilling);

    useEffect(() => {
        const stored = readPlanSelection();
        const nextPlan = stored?.planKey && plansByKey[stored.planKey] ? stored.planKey : initialPlan;
        const nextBilling = stored?.billing ?? initialBilling;
        setPlan(nextPlan);
        setBilling(nextBilling);
        savePlanSelection(nextPlan, nextBilling);
    }, [initialPlan, initialBilling]);

    return (
        <div className="min-h-screen min-w-0 overflow-x-hidden" style={{ backgroundColor: '#ffffff' }}>
            <Head title="Escolher plano" />

            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-semibold" style={{ color: '#1a1040' }}>
                            Etapa 3 de 3 — Plano
                        </span>
                        <span style={{ color: '#6b6b8a' }}>Cadastro</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: '#ede9fe' }}>
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: '100%',
                                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: '#1a1040' }}>
                        Escolha seu plano para testar
                    </h1>
                    <p className="max-w-3xl text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                        Conta verificada. Escolha o plano para concluir o cadastro. Planos pagos seguem para a etapa de pagamento.
                    </p>
                </div>

                <PlansPicker
                    key={`${plan}-${billing}`}
                    mode="registration"
                    initialPlan={plan}
                    initialBilling={billing}
                    syncQueryParams={false}
                />
            </div>
        </div>
    );
}
