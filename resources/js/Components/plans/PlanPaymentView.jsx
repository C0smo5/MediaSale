import { formatBrl, plansByKey } from '@/data/plans';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * @param {'registration' | 'subscription'} context
 * @param {object} pending
 * @param {boolean} canSkipPayment
 */
export default function PlanPaymentView({ context, pending, canSkipPayment = false }) {
    const [processing, setProcessing] = useState(false);

    const isRegistration = context === 'registration';
    const targetPlan = plansByKey[pending.plan_key];
    const fromPlan = plansByKey[pending.from_plan_key] ?? plansByKey.trial;

    const interestPercent = (pending.interest_rate * 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const withProcessing = (visit) => {
        visit({
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    const completePayment = () => {
        const routeName = isRegistration ? 'register.payment.skip' : 'subscription.payment.complete';
        withProcessing(() => router.post(route(routeName)));
    };

    const handleSecondaryAction = () => {
        if (isRegistration) {
            withProcessing(() => router.post(route('register.cancel')));
            return;
        }

        withProcessing(() => router.post(route('subscription.payment.cancel')));
    };

    const handleBackToPlans = () => {
        if (isRegistration) {
            router.visit(route('register.plan'));
            return;
        }

        withProcessing(() => router.post(route('subscription.payment.cancel')));
    };

    const title = isRegistration ? 'Pagamento do plano' : 'Pagamento do upgrade';
    const secondaryLabel = isRegistration ? 'Cancelar cadastro' : 'Voltar aos planos';
    const completeLabel = isRegistration ? 'Pular pagamento (teste)' : 'Confirmar pagamento (teste)';

    return (
        <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: '#ffffff' }}>
            <Head title={title} />

            <div className="w-full max-w-lg">
                <h1 className="text-xl font-bold" style={{ color: '#1a1040' }}>
                    {title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                    {isRegistration ? (
                        <>
                            Plano escolhido: <strong>{targetPlan?.name}</strong> (
                            {pending.plan_billing === 'annual' ? 'anual' : 'mensal'})
                        </>
                    ) : (
                        <>
                            De <strong>{fromPlan?.name}</strong> para <strong>{targetPlan?.name}</strong> (
                            {pending.plan_billing === 'annual' ? 'anual' : 'mensal'})
                        </>
                    )}
                </p>

                <div
                    className="mt-6 space-y-3 rounded-2xl border p-5 text-sm"
                    style={{ borderColor: 'rgba(124,58,237,0.12)', backgroundColor: '#faf9ff' }}
                >
                    <div className="flex justify-between gap-4">
                        <span style={{ color: '#6b6b8a' }}>
                            {pending.uses_complement
                                ? 'Complemento (falta para o preço fixo do plano)'
                                : 'Valor do plano (preço fixo)'}
                        </span>
                        <span className="font-semibold" style={{ color: '#1a1040' }}>
                            {formatBrl(pending.complement)}
                        </span>
                    </div>
                    {pending.interest_amount > 0 && (
                        <div className="flex justify-between gap-4">
                            <span style={{ color: '#6b6b8a' }}>Juros ({interestPercent}% sobre o complemento)</span>
                            <span className="font-semibold" style={{ color: '#1a1040' }}>
                                {formatBrl(pending.interest_amount)}
                            </span>
                        </div>
                    )}
                    <div
                        className="flex justify-between gap-4 border-t pt-3"
                        style={{ borderColor: 'rgba(124,58,237,0.12)' }}
                    >
                        <span className="font-semibold" style={{ color: '#1a1040' }}>
                            Total a pagar
                        </span>
                        <span className="text-lg font-bold" style={{ color: '#7c3aed' }}>
                            {formatBrl(pending.amount_due)}
                        </span>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs" style={{ color: '#6b6b8a' }}>
                    A tela de pagamento definitiva será integrada em breve.
                </p>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleSecondaryAction}
                        disabled={processing}
                        className="w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors hover:bg-black/5 disabled:opacity-60 sm:w-auto sm:min-w-[160px]"
                        style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#6b6b8a', backgroundColor: '#ffffff' }}
                    >
                        {secondaryLabel}
                    </button>

                    {canSkipPayment ? (
                        <button
                            type="button"
                            onClick={completePayment}
                            disabled={processing}
                            className="w-full flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            style={{
                                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                                boxShadow: '0 10px 24px rgba(124,58,237,0.22)',
                            }}
                        >
                            {completeLabel}
                        </button>
                    ) : (
                        <span
                            className="flex flex-1 items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-medium"
                            style={{ backgroundColor: 'rgba(124,58,237,0.08)', color: '#6b6b8a' }}
                        >
                            Pagamento em breve
                        </span>
                    )}
                </div>

                <p className="mt-4 text-center">
                    {isRegistration ? (
                        <button
                            type="button"
                            onClick={handleBackToPlans}
                            className="text-sm font-medium"
                            style={{ color: '#7c3aed' }}
                        >
                            Alterar plano
                        </button>
                    ) : (
                        <Link
                            href={route('profile.edit', { section: 'plans' })}
                            className="text-sm font-medium"
                            style={{ color: '#7c3aed' }}
                        >
                            Ver planos no perfil
                        </Link>
                    )}
                </p>
            </div>
        </div>
    );
}
