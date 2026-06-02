import MercadoPagoCardBrick, { cleanupMercadoPagoBrick } from '@/Components/payment/MercadoPagoCardBrick';
import InputError from '@/Components/InputError';
import { formatBrl, plansByKey } from '@/data/plans';
import { logPaymentFormError } from '@/lib/paymentFormLogger';
import { showFlashMessage } from '@/lib/swal';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * @param {'registration' | 'subscription'} context
 * @param {object}      pending
 * @param {boolean}     canSkipPayment
 * @param {string|null} [mpPublicKey]
 * @param {string|null} [payerEmail]
 */
export default function PlanPaymentView({ context, pending, canSkipPayment = false, mpPublicKey = null, payerEmail = null }) {
    const [processing, setProcessing] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const pageErrors = usePage().props.errors;

    const isRegistration = context === 'registration';
    const targetPlan = plansByKey[pending.plan_key];
    const fromPlan = plansByKey[pending.from_plan_key] ?? plansByKey.trial;
    const billingLabel = pending.plan_billing === 'annual' ? 'Anual' : 'Mensal';

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

    const handleSkipPayment = () => {
        const routeName = isRegistration ? 'register.payment.skip' : 'subscription.payment.complete';
        withProcessing(() => router.post(route(routeName)));
    };

    const handleSecondaryAction = () => {
        cleanupMercadoPagoBrick();

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

    const handleBrickSubmit = (formData) => {
        const subscribeRoute = isRegistration
            ? route('register.payment.subscribe')
            : route('subscription.payment.subscribe');

        setSubmitError(null);

        return new Promise((resolve, reject) => {
            router.post(subscribeRoute, formData, {
                onStart: () => setProcessing(true),
                onSuccess: () => {
                    setSubmitError(null);
                    resolve();
                },
                onError: (errors) => {
                    logPaymentFormError('PlanPaymentView:subscribe', errors, {
                        route: subscribeRoute,
                        plan_key: pending.plan_key,
                    });

                    if (isRegistration && errors?.registration) {
                        showFlashMessage('registration-expired');
                        router.visit(route('register'));
                        reject(errors);
                        return;
                    }

                    const paymentError = errors?.payment ?? errors?.token;
                    const firstError = Object.values(errors ?? {})[0];
                    const message =
                        typeof paymentError === 'string'
                            ? paymentError
                            : typeof firstError === 'string'
                              ? firstError
                              : 'Não foi possível processar o pagamento. Verifique os dados e tente novamente.';
                    setSubmitError(message);
                    reject(errors);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            });
        });
    };

    const handleBrickError = (brickError) => {
        logPaymentFormError('PlanPaymentView:brick', brickError, {
            plan_key: pending.plan_key,
            amount_due: pending.amount_due,
        });
    };

    const title = isRegistration ? 'Pagamento do plano' : 'Pagamento do upgrade';
    const secondaryLabel = isRegistration ? 'Cancelar cadastro' : 'Cancelar alteração';
    const showBrick = !!mpPublicKey;
    const displayError = submitError ?? pageErrors?.payment ?? pageErrors?.token;

    useEffect(() => () => {
        cleanupMercadoPagoBrick();
    }, []);

    return (
        <div className="min-h-screen min-w-0 overflow-x-hidden" style={{ backgroundColor: '#f8f7ff' }}>
            <Head title={title} />

            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                {/* Cabeçalho / progresso */}
                <header className="mb-8">
                    {isRegistration ? (
                        <div className="mb-4">
                            <div className="mb-2 flex items-center justify-between text-xs">
                                <span className="font-semibold" style={{ color: '#1a1040' }}>
                                    Etapa final — Pagamento
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
                    ) : (
                        <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs" aria-label="Navegação">
                            <Link
                                href={route('profile.edit', { section: 'plans' })}
                                className="font-medium no-underline transition-colors hover:underline"
                                style={{ color: '#7c3aed' }}
                            >
                                Planos
                            </Link>
                            <span style={{ color: '#c4b5fd' }}>/</span>
                            <span style={{ color: '#6b6b8a' }}>Pagamento</span>
                        </nav>
                    )}

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: '#1a1040' }}>
                        {title}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                        {isRegistration
                            ? 'Revise o resumo abaixo e informe os dados do cartão para concluir seu cadastro.'
                            : 'Confirme o valor do upgrade e finalize com cartão de crédito ou débito.'}
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
                    {/* Coluna esquerda — resumo */}
                    <aside className="flex flex-col gap-4 lg:col-span-2">
                        <section
                            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                            style={{ borderColor: 'rgba(124,58,237,0.12)' }}
                            aria-labelledby="payment-summary-heading"
                        >
                            <div
                                className="border-b px-5 py-4"
                                style={{ borderColor: 'rgba(124,58,237,0.08)', backgroundColor: '#faf9ff' }}
                            >
                                <h2 id="payment-summary-heading" className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#6b6b8a' }}>
                                    Resumo do pedido
                                </h2>
                            </div>

                            <div className="space-y-4 p-5">
                                {/* Plano */}
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6b6b8a' }}>
                                        Plano
                                    </p>
                                    {isRegistration ? (
                                        <div className="mt-2">
                                            <p className="text-lg font-bold" style={{ color: '#1a1040' }}>
                                                {targetPlan?.name}
                                            </p>
                                            <span
                                                className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                                style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                                            >
                                                {billingLabel}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span
                                                className="rounded-lg border px-2.5 py-1 text-sm font-medium"
                                                style={{ borderColor: 'rgba(124,58,237,0.15)', color: '#6b6b8a' }}
                                            >
                                                {fromPlan?.name}
                                            </span>
                                            <span style={{ color: '#c4b5fd' }} aria-hidden="true">
                                                →
                                            </span>
                                            <span
                                                className="rounded-lg px-2.5 py-1 text-sm font-semibold"
                                                style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                                            >
                                                {targetPlan?.name}
                                            </span>
                                            <span
                                                className="w-full text-xs font-medium sm:w-auto"
                                                style={{ color: '#6b6b8a' }}
                                            >
                                                · {billingLabel}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Itens */}
                                <dl className="space-y-3 border-t pt-4 text-sm" style={{ borderColor: 'rgba(124,58,237,0.08)' }}>
                                    <div className="flex justify-between gap-3">
                                        <dt style={{ color: '#6b6b8a' }}>
                                            {pending.uses_complement
                                                ? 'Complemento até o preço do plano'
                                                : 'Valor do plano'}
                                        </dt>
                                        <dd className="font-semibold tabular-nums" style={{ color: '#1a1040' }}>
                                            {formatBrl(pending.complement)}
                                        </dd>
                                    </div>
                                    {pending.interest_amount > 0 && (
                                        <div className="flex justify-between gap-3">
                                            <dt style={{ color: '#6b6b8a' }}>
                                                Juros ({interestPercent}%)
                                            </dt>
                                            <dd className="font-semibold tabular-nums" style={{ color: '#1a1040' }}>
                                                {formatBrl(pending.interest_amount)}
                                            </dd>
                                        </div>
                                    )}
                                </dl>

                                <div
                                    className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
                                    style={{ backgroundColor: '#f3f0ff' }}
                                >
                                    <span className="text-sm font-semibold" style={{ color: '#1a1040' }}>
                                        Total a pagar
                                    </span>
                                    <span className="text-xl font-bold tabular-nums" style={{ color: '#7c3aed' }}>
                                        {formatBrl(pending.amount_due)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section
                            className="rounded-2xl border bg-white p-4 text-xs leading-relaxed"
                            style={{ borderColor: 'rgba(124,58,237,0.12)', color: '#6b6b8a' }}
                        >
                            <p className="font-semibold" style={{ color: '#1a1040' }}>
                                Pagamento seguro
                            </p>
                            <p className="mt-1">
                                Processado pelo Mercado Pago. Os dados do cartão não são armazenados nos servidores do Orin.
                            </p>
                        </section>
                    </aside>

                    {/* Coluna direita — pagamento */}
                    <main className="flex flex-col gap-4 lg:col-span-3">
                        <section
                            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                            style={{ borderColor: 'rgba(124,58,237,0.12)' }}
                            aria-labelledby="payment-form-heading"
                        >
                            <div
                                className="border-b px-5 py-4"
                                style={{ borderColor: 'rgba(124,58,237,0.08)', backgroundColor: '#faf9ff' }}
                            >
                                <h2 id="payment-form-heading" className="text-base font-semibold" style={{ color: '#1a1040' }}>
                                    Dados de pagamento
                                </h2>
                                <p className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>
                                    Preencha as informações do cartão no formulário abaixo.
                                </p>
                            </div>

                            <div className="p-5">
                                {showBrick ? (
                                    <>
                                        <MercadoPagoCardBrick
                                            publicKey={mpPublicKey}
                                            transactionAmount={Number(pending.amount_due)}
                                            payerEmail={payerEmail}
                                            onSubmit={handleBrickSubmit}
                                            onError={handleBrickError}
                                            disabled={processing}
                                        />

                                        {displayError && (
                                            <div
                                                className="mt-4 rounded-xl border px-4 py-3 text-sm"
                                                role="alert"
                                                style={{
                                                    borderColor: 'rgba(239,68,68,0.35)',
                                                    backgroundColor: '#fef2f2',
                                                    color: '#b91c1c',
                                                }}
                                            >
                                                {displayError}
                                            </div>
                                        )}

                                        {import.meta.env.DEV && (
                                            <div
                                                className="mt-4 rounded-xl border px-4 py-3 text-xs leading-relaxed"
                                                style={{
                                                    borderColor: 'rgba(124,58,237,0.2)',
                                                    backgroundColor: '#faf9ff',
                                                    color: '#6b6b8a',
                                                }}
                                            >
                                                <span className="font-semibold" style={{ color: '#7c3aed' }}>
                                                    Sandbox:
                                                </span>{' '}
                                                cartão 5031 4332 1540 6351 · titular APRO · CVV 123 · CPF 12345678909
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="py-6 text-center">
                                        <p className="text-sm" style={{ color: '#6b6b8a' }}>
                                            O formulário de pagamento não está disponível no momento.
                                        </p>
                                        {canSkipPayment && (
                                            <button
                                                type="button"
                                                onClick={handleSkipPayment}
                                                disabled={processing}
                                                className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
                                                style={{
                                                    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                                                    boxShadow: '0 10px 24px rgba(124,58,237,0.22)',
                                                }}
                                            >
                                                {isRegistration ? 'Pular pagamento (teste)' : 'Confirmar pagamento (teste)'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {processing && showBrick && (
                                    <p className="mt-4 flex items-center justify-center gap-2 text-sm" style={{ color: '#6b6b8a' }}>
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Processando pagamento…
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Ações */}
                        <div
                            className="flex flex-col-reverse gap-3 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                            style={{ borderColor: 'rgba(124,58,237,0.12)' }}
                        >
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleSecondaryAction}
                                    disabled={processing}
                                    className="rounded-xl border px-4 py-2.5 text-center text-sm font-semibold transition-colors hover:bg-black/[0.03] disabled:opacity-60"
                                    style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#6b6b8a' }}
                                >
                                    {secondaryLabel}
                                </button>
                                {isRegistration ? (
                                    <button
                                        type="button"
                                        onClick={handleBackToPlans}
                                        disabled={processing}
                                        className="rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-colors hover:underline disabled:opacity-60"
                                        style={{ color: '#7c3aed' }}
                                    >
                                        Alterar plano
                                    </button>
                                ) : (
                                    <Link
                                        href={route('profile.edit', { section: 'plans' })}
                                        className="rounded-xl px-4 py-2.5 text-center text-sm font-semibold no-underline transition-colors hover:underline"
                                        style={{ color: '#7c3aed' }}
                                    >
                                        Ver todos os planos
                                    </Link>
                                )}
                            </div>
                            <p className="text-center text-xs sm:text-right" style={{ color: '#6b6b8a' }}>
                                Ao pagar, você concorda com a cobrança exibida no resumo.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
