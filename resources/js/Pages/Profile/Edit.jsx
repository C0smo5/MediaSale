import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { confirmAction } from '@/lib/swal';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import LinkedAccountsForm from './Partials/LinkedAccountsForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { ComparisonTable } from '@/Components/plans/PlansPicker';
import { plans as unifiedPlans, plansByKey, getPlanPrice, formatBrl } from '@/data/plans';
import { calculateUpgradeCharge, isPlanUpgrade } from '@/lib/planUpgrade';

const LogoutIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const LinkAccountIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const PlansIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const DangerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

function AccountLinkingBanner({ linkedAccounts, onCreateOrinPassword }) {
    if (!linkedAccounts || linkedAccounts.accountType === 'linked') {
        return null;
    }

    const isGoogleOnly = linkedAccounts.hasGoogle && !linkedAccounts.hasOrinPassword;

    const actionButton = isGoogleOnly ? (
        <button
            type="button"
            onClick={onCreateOrinPassword}
            className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
                background: 'linear-gradient(135deg,#d97706,#f59e0b)',
                boxShadow: '0 4px 14px rgba(245,158,11,0.25)',
            }}
        >
            Criar senha Orin
        </button>
    ) : (
        <a
            href={route('auth.google.link')}
            className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
            style={{
                background: 'linear-gradient(135deg,#d97706,#f59e0b)',
                boxShadow: '0 4px 14px rgba(245,158,11,0.25)',
            }}
        >
            Conectar Google
        </a>
    );

    return (
        <div
            className="flex flex-col gap-4 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
                backgroundColor: '#fffbeb',
                borderColor: 'rgba(245,158,11,0.35)',
            }}
            role="status"
        >
            <div className="flex min-w-0 items-start gap-3">
                <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#d97706' }}
                >
                    <LinkAccountIcon />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: '#92400e' }}>
                        Vincule outro metodo de acesso
                    </p>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: '#b45309' }}>
                        {isGoogleOnly
                            ? 'Sua conta usa apenas o Google. Crie uma senha Orin para recuperar o acesso, excluir a conta e desconectar o Google quando quiser.'
                            : 'Sua conta usa apenas e-mail e senha. Conecte o Google para entrar com um clique e ter um metodo alternativo de login.'}
                    </p>
                </div>
            </div>
            {actionButton}
        </div>
    );
}

export default function Edit({ mustVerifyEmail, initialSection = 'info', linkedAccounts }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeSection, setActiveSection] = useState(initialSection);
    const [pendingLinkingScroll, setPendingLinkingScroll] = useState(false);

    const focusOrinPasswordField = () => {
        document.getElementById('link_password')?.focus();
    };

    const scrollToOrinPassword = () => {
        const target = document.getElementById('orin-password-link');

        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.setTimeout(focusOrinPasswordField, 350);
            return;
        }

        setPendingLinkingScroll(true);
        setActiveSection('info');
    };

    useEffect(() => {
        if (!pendingLinkingScroll || activeSection !== 'info') {
            return;
        }

        setPendingLinkingScroll(false);

        const timer = window.setTimeout(() => {
            document.getElementById('orin-password-link')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.setTimeout(focusOrinPasswordField, 350);
        }, 50);

        return () => window.clearTimeout(timer);
    }, [pendingLinkingScroll, activeSection]);

    const memberSince = user.created_at
        ? new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(user.created_at))
        : '—';

    const currentPlanKey = user.plan_key ?? 'trial';
    const currentPlanBilling = user.plan_billing ?? 'monthly';
    const currentPlan = plansByKey[currentPlanKey] ?? plansByKey.trial;

    const initials = user.name
        .split(' ')
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const sections = [
        { key: 'info', label: 'Dados pessoais', description: 'Nome e e-mail', icon: UserIcon },
        { key: 'password', label: 'Senha', description: 'Seguranca de acesso', icon: LockIcon },
        { key: 'settings', label: 'Configuracoes', description: 'Preferencias da conta', icon: SettingsIcon, isLink: true },
        { key: 'plans', label: 'Planos', description: 'Assinatura e uso', icon: PlansIcon },
        { key: 'danger', label: 'Zona de risco', description: 'Excluir conta', icon: DangerIcon, isDanger: true },
    ];

    const renderContent = () => {
        if (activeSection === 'settings') {
            return (
                <div
                    className="overflow-hidden rounded-2xl border"
                    style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}
                >
                    <div
                        className="border-b px-6 py-8 sm:px-8"
                        style={{
                            borderColor: 'rgba(124,58,237,0.10)',
                            background: 'linear-gradient(135deg, #f0eeff 0%, #ffffff 60%)',
                        }}
                    >
                        <div
                            className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                            style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                        >
                            <SettingsIcon />
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: '#1a1040' }}>
                            Configuracoes da conta
                        </h2>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>
                            Notificacoes, preferencias do chat, lojas monitoradas, privacidade e guia de
                            implementacao para o backend.
                        </p>
                        <Link
                            href={route('settings')}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
                            style={{
                                background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                                boxShadow: '0 4px 14px rgba(124,58,237,0.25)',
                            }}
                        >
                            Abrir configuracoes
                            <ChevronIcon />
                        </Link>
                    </div>
                    <div className="grid gap-3 p-6 sm:grid-cols-2">
                        {[
                            'Notificacoes por e-mail e SMS',
                            'Preferencias do Chat IA',
                            'Plano e limites de uso',
                            'Privacidade e exportacao',
                        ].map((item) => (
                            <div
                                key={item}
                                className="rounded-xl border px-4 py-3 text-sm"
                                style={{ borderColor: 'rgba(124,58,237,0.12)', color: '#6b6b8a' }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeSection === 'info') {
            return (
                <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                    <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                        <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>Dados pessoais</h2>
                        <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>
                            Atualize seus dados e conecte contas Orin e Google
                        </p>
                    </div>
                    <div className="space-y-8 px-6 py-6">
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} />
                        <div id="account-linking" className="border-t pt-8 scroll-mt-24" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                            <h3 className="mb-4 text-sm font-bold" style={{ color: '#1a1040' }}>
                                Metodos de acesso
                            </h3>
                            <LinkedAccountsForm linkedAccounts={linkedAccounts} />
                        </div>
                    </div>
                </div>
            );
        }

        if (activeSection === 'password') {
            return (
                <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                    <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                        <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>Alterar senha</h2>
                        <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>
                            Use uma senha longa e aleatoria para manter sua conta segura
                        </p>
                    </div>
                    <div className="px-6 py-6">
                        {linkedAccounts?.hasOrinPassword ? (
                            <UpdatePasswordForm />
                        ) : (
                            <p className="text-sm" style={{ color: '#6b6b8a' }}>
                                Crie uma senha Orin em{' '}
                                <button
                                    type="button"
                                    onClick={() => setActiveSection('info')}
                                    className="font-semibold underline"
                                    style={{ color: '#7c3aed' }}
                                >
                                    Dados pessoais
                                </button>
                                {' '}para habilitar login com e-mail e senha.
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        if (activeSection === 'plans') {
            return (
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                        <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                            <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>Escolha seu plano</h2>
                            <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>
                                Voce esta no <strong style={{ color: '#7c3aed' }}>Plano {currentPlan.name}</strong> ({currentPlanBilling === 'annual' ? 'anual' : 'mensal'}). No Trial, o upgrade cobra o preço fixo integral do plano escolhido, sem juros. Nos demais planos, cobra-se o complemento ate o preço fixo do destino + 6,38% de juros sobre o complemento.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
                            {unifiedPlans.map((plan) => {
                                const isCurrent = plan.key === currentPlanKey;
                                const monthly = getPlanPrice(plan, 'monthly');
                                const canUpgrade = isPlanUpgrade(
                                    currentPlanKey,
                                    currentPlanBilling,
                                    plan.key,
                                    currentPlanBilling,
                                );
                                const upgradeCharge = canUpgrade
                                    ? calculateUpgradeCharge(
                                          currentPlanKey,
                                          currentPlanBilling,
                                          plan.key,
                                          currentPlanBilling,
                                      )
                                    : null;
                                return (
                                    <div
                                        key={plan.key}
                                        className="relative flex flex-col gap-4 rounded-2xl border p-5"
                                        style={{
                                            borderColor: isCurrent ? 'rgba(124,58,237,0.40)' : 'rgba(124,58,237,0.12)',
                                            backgroundColor: isCurrent ? '#f0eeff' : '#ffffff',
                                            boxShadow: isCurrent ? '0 4px 20px rgba(124,58,237,0.10)' : 'none',
                                        }}
                                    >
                                        {isCurrent && (
                                            <span
                                                className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                                                style={{ backgroundColor: '#7c3aed' }}
                                            >
                                                Atual
                                            </span>
                                        )}
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>
                                                {plan.name}
                                            </p>
                                            <div className="mt-1 flex items-end gap-1">
                                                <span className="text-2xl font-bold" style={{ color: '#1a1040' }}>
                                                    {plan.monthlyPrice === 0 ? 'Grátis' : formatBrl(monthly)}
                                                </span>
                                                {plan.monthlyPrice !== 0 && (
                                                    <span className="mb-0.5 text-sm" style={{ color: '#6b6b8a' }}>
                                                        /mês
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs" style={{ color: '#6b6b8a' }}>
                                                {plan.description}
                                            </p>
                                        </div>
                                        <ul className="flex-1 space-y-2">
                                            {plan.features
                                                .filter((f) => f.included)
                                                .slice(0, 5)
                                                .map((feature) => (
                                                    <li key={feature.label} className="flex items-center gap-2 text-xs" style={{ color: '#1a1040' }}>
                                                        <span className="font-bold" style={{ color: '#059669' }}>
                                                            ✓
                                                        </span>
                                                        {feature.detail ? `${feature.label} (${feature.detail})` : feature.label}
                                                    </li>
                                                ))}
                                        </ul>
                                        {isCurrent ? (
                                            <span
                                                className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold"
                                                style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: '#7c3aed' }}
                                            >
                                                Plano atual
                                            </span>
                                        ) : canUpgrade ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.post(route('plans.update'), {
                                                        plan_key: plan.key,
                                                        plan_billing: currentPlanBilling,
                                                    })
                                                }
                                                className="w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white"
                                                style={{
                                                    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                                                }}
                                            >
                                                Upgrade · {formatBrl(upgradeCharge.amountDue)}
                                            </button>
                                        ) : (
                                            <span
                                                className="block w-full rounded-xl py-2.5 text-center text-xs font-medium"
                                                style={{ backgroundColor: 'rgba(124,58,237,0.06)', color: '#6b6b8a' }}
                                            >
                                                {plan.key === 'trial' ? 'Use cancelar assinatura' : 'Plano inferior'}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <ComparisonTable billing={currentPlanBilling} selectedKey={currentPlanKey} />

                    {currentPlanKey !== 'trial' && (
                        <div
                            className="flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center"
                            style={{ backgroundColor: '#ffffff', borderColor: 'rgba(239,68,68,0.2)' }}
                        >
                            <div>
                                <p className="text-sm font-semibold" style={{ color: '#1a1040' }}>
                                    Cancelar assinatura
                                </p>
                                <p className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>
                                    Voce volta imediatamente ao plano Trial gratuito.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={async () => {
                                    const confirmed = await confirmAction({
                                        title: 'Cancelar assinatura?',
                                        text: 'Voce voltara imediatamente ao plano Trial gratuito. Esta acao e imediata.',
                                        confirmText: 'Sim, cancelar',
                                        icon: 'warning',
                                    });

                                    if (confirmed) {
                                        router.post(route('subscription.cancel'));
                                    }
                                }}
                                className="shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-red-50"
                                style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#dc2626' }}
                            >
                                Cancelar assinatura
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        if (activeSection === 'danger') {
            return (
                <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(234,88,12,0.25)' }}>
                    <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(234,88,12,0.15)', backgroundColor: '#fff7ed' }}>
                        <h2 className="text-base font-bold" style={{ color: '#ea580c' }}>Zona de risco</h2>
                        <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>Acoes irreversiveis para sua conta</p>
                    </div>
                    <div className="px-6 py-6">
                        <DeleteUserForm />
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />

            <div className="min-h-screen min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8" style={{ backgroundColor: '#f8f7ff' }}>
                <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
                    <div
                        className="overflow-hidden rounded-2xl border"
                        style={{
                            backgroundColor: '#ffffff',
                            borderColor: 'rgba(124,58,237,0.12)',
                            boxShadow: '0 4px 24px rgba(124,58,237,0.06)',
                        }}
                    >
                        <div
                            className="relative px-6 pb-6 pt-8 sm:px-8"
                            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c4b5fd 100%)' }}
                        >
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                <div className="flex items-end gap-4">
                                    <div
                                        className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-white text-2xl font-bold text-white shadow-lg"
                                        style={{ background: 'linear-gradient(135deg,#5b21b6,#7c3aed)' }}
                                    >
                                        {initials}
                                    </div>
                                    <div className="min-w-0 pb-1">
                                        <h1 className="truncate text-xl font-bold text-white sm:text-2xl">{user.name}</h1>
                                        <p className="mt-1 truncate text-sm text-white/80">{user.email}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                                Plano {currentPlan.name}
                                            </span>
                                            <span className="rounded-full bg-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                                Conta verificada
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Link
                                        href={route('settings')}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white no-underline backdrop-blur-sm transition-colors hover:bg-white/25"
                                    >
                                        <SettingsIcon />
                                        Configuracoes
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => router.post(route('logout'))}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/90"
                                        style={{ color: '#7c3aed' }}
                                    >
                                        <LogoutIcon />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AccountLinkingBanner
                        linkedAccounts={linkedAccounts}
                        onCreateOrinPassword={scrollToOrinPassword}
                    />

                    <div className="flex flex-col gap-6 lg:flex-row">
                        <aside className="w-full shrink-0 lg:w-72">
                            <div
                                className="mb-4 rounded-2xl border p-4"
                                style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#6b6b8a' }}>
                                    Membro desde
                                </p>
                                <p className="mt-0.5 truncate text-sm font-bold" style={{ color: '#1a1040' }}>
                                    {memberSince}
                                </p>
                            </div>

                            <nav
                                className="overflow-hidden rounded-2xl border"
                                style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}
                            >
                                <p className="border-b px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'rgba(124,58,237,0.08)', color: '#6b6b8a' }}>
                                    Menu do perfil
                                </p>
                                {sections.map((section, index) => {
                                    const isActive = activeSection === section.key;
                                    const SectionIcon = section.icon;

                                    if (section.isLink) {
                                        return (
                                            <Link
                                                key={section.key}
                                                href={route('settings')}
                                                className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium no-underline transition-colors"
                                                style={{
                                                    borderTop: index > 0 ? '1px solid rgba(124,58,237,0.07)' : 'none',
                                                    color: '#7c3aed',
                                                    backgroundColor: 'transparent',
                                                }}
                                            >
                                                <span
                                                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                                                    style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
                                                >
                                                    <SectionIcon />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block">{section.label}</span>
                                                    <span className="block text-xs font-normal" style={{ color: '#6b6b8a' }}>
                                                        {section.description}
                                                    </span>
                                                </span>
                                                <ChevronIcon />
                                            </Link>
                                        );
                                    }

                                    return (
                                        <button
                                            key={section.key}
                                            type="button"
                                            onClick={() => setActiveSection(section.key)}
                                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-colors"
                                            style={{
                                                borderTop: index > 0 ? '1px solid rgba(124,58,237,0.07)' : 'none',
                                                backgroundColor: isActive ? '#f0eeff' : 'transparent',
                                                color: isActive ? '#7c3aed' : section.isDanger ? '#ea580c' : '#1a1040',
                                            }}
                                        >
                                            <span
                                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                                                style={{
                                                    backgroundColor: isActive
                                                        ? 'rgba(124,58,237,0.15)'
                                                        : section.isDanger
                                                          ? '#fff7ed'
                                                          : 'rgba(124,58,237,0.08)',
                                                    color: isActive ? '#7c3aed' : section.isDanger ? '#ea580c' : '#6b6b8a',
                                                }}
                                            >
                                                <SectionIcon />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block">{section.label}</span>
                                                <span
                                                    className="block text-xs font-normal"
                                                    style={{ color: isActive ? '#7c3aed' : '#6b6b8a' }}
                                                >
                                                    {section.description}
                                                </span>
                                            </span>
                                            {isActive && (
                                                <span className="text-xs font-semibold" style={{ color: '#a855f7' }}>
                                                    Ativo
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>

                        <div className="min-w-0 flex-1">{renderContent()}</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
