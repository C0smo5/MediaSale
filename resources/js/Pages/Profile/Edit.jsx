import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const LogoutIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const plans = [
    {
        key: 'free',
        label: 'Gratis',
        price: 'R$ 0',
        period: '/mes',
        description: 'Para comecar a explorar',
        features: ['5 analises por mes', '10 lojas monitoradas', 'Historico de 7 dias'],
        current: false,
    },
    {
        key: 'pro',
        label: 'Pro',
        price: 'R$ 49',
        period: '/mes',
        description: 'Para vendedores ativos',
        features: ['100 analises por mes', '50 lojas monitoradas', 'Historico de 90 dias', 'Alertas de preco', 'Exportar relatorios'],
        current: true,
    },
    {
        key: 'enterprise',
        label: 'Enterprise',
        price: 'R$ 149',
        period: '/mes',
        description: 'Para operacoes em escala',
        features: ['Analises ilimitadas', 'Lojas ilimitadas', 'Historico completo', 'Acesso via API', 'Suporte prioritario'],
        current: false,
    },
];

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeSection, setActiveSection] = useState('info');

    const initials = user.name
        .split(' ')
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const sections = [
        { key: 'info', label: 'Dados pessoais', iconLabel: 'DP' },
        { key: 'password', label: 'Senha', iconLabel: 'SN' },
        { key: 'plans', label: 'Planos', iconLabel: 'PL' },
        { key: 'danger', label: 'Zona de risco', iconLabel: 'ZR' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />

            <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: '#f8f7ff' }}>
                <div className="mx-auto max-w-7xl space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1a1040' }}>Meu perfil</h1>
                        <p className="mt-1 text-sm" style={{ color: '#6b6b8a' }}>Gerencie suas informacoes, seguranca e preferencias da conta</p>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row">
                        <aside className="w-full shrink-0 space-y-4 lg:w-72">
                            <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                                <div className="h-16" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }} />
                                <div className="px-5 pb-5">
                                    <div
                                        className="-mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white text-xl font-bold text-white shadow-lg"
                                        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
                                    >
                                        {initials}
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-base font-bold" style={{ color: '#1a1040' }}>{user.name}</p>
                                        <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>{user.email}</p>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
                                            Plano Pro
                                        </span>
                                        <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                                            Conta verificada
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => router.post(route('logout'))}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-sm font-medium transition-all duration-200"
                                        style={{ borderColor: 'rgba(234,88,12,0.25)', color: '#ea580c', backgroundColor: 'transparent' }}
                                        onMouseEnter={(event) => {
                                            event.currentTarget.style.backgroundColor = '#fff7ed';
                                            event.currentTarget.style.borderColor = 'rgba(234,88,12,0.45)';
                                        }}
                                        onMouseLeave={(event) => {
                                            event.currentTarget.style.backgroundColor = 'transparent';
                                            event.currentTarget.style.borderColor = 'rgba(234,88,12,0.25)';
                                        }}
                                    >
                                        <LogoutIcon /> Sair da conta
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-2xl border p-5" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>Dados da conta</p>
                                {[
                                    { label: 'Membro desde', value: 'Jan 2025' },
                                    { label: 'Analises realizadas', value: '47' },
                                    { label: 'Economia gerada', value: 'R$ 3.240' },
                                    { label: 'Lojas favoritas', value: '8' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: '#6b6b8a' }}>{item.label}</span>
                                        <span className="text-xs font-semibold" style={{ color: '#1a1040' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <nav className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                                {sections.map((section, index) => (
                                    <button
                                        key={section.key}
                                        type="button"
                                        onClick={() => setActiveSection(section.key)}
                                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-all duration-150"
                                        style={{
                                            borderTop: index > 0 ? '1px solid rgba(124,58,237,0.07)' : 'none',
                                            backgroundColor: activeSection === section.key ? '#f0eeff' : 'transparent',
                                            color: activeSection === section.key ? '#7c3aed' : section.key === 'danger' ? '#ea580c' : '#1a1040',
                                        }}
                                    >
                                        <span
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold"
                                            style={{
                                                backgroundColor: activeSection === section.key ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)',
                                                color: activeSection === section.key ? '#7c3aed' : '#6b6b8a',
                                            }}
                                        >
                                            {section.iconLabel}
                                        </span>
                                        <span>{section.label}</span>
                                        {activeSection === section.key && (
                                            <span className="ml-auto text-xs" style={{ color: '#a855f7' }}>Ativo</span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        <div className="min-w-0 flex-1">
                            {activeSection === 'info' && (
                                <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                                    <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                                        <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>Dados pessoais</h2>
                                        <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>Atualize seu nome e endereco de e-mail</p>
                                    </div>
                                    <div className="px-6 py-6">
                                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'password' && (
                                <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                                    <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                                        <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>Alterar senha</h2>
                                        <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>Use uma senha longa e aleatoria para manter sua conta segura</p>
                                    </div>
                                    <div className="px-6 py-6">
                                        <UpdatePasswordForm />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'plans' && (
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                                        <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                                            <h2 className="text-base font-bold" style={{ color: '#1a1040' }}>Escolha seu plano</h2>
                                            <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>
                                                Voce esta no <strong style={{ color: '#7c3aed' }}>Plano Pro</strong>. Ajuste o plano quando quiser.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
                                            {plans.map((plan) => (
                                                <div
                                                    key={plan.key}
                                                    className="relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-200"
                                                    style={{
                                                        borderColor: plan.current ? 'rgba(124,58,237,0.40)' : 'rgba(124,58,237,0.12)',
                                                        backgroundColor: plan.current ? '#f0eeff' : '#ffffff',
                                                        boxShadow: plan.current ? '0 4px 20px rgba(124,58,237,0.10)' : 'none',
                                                    }}
                                                >
                                                    {plan.current && (
                                                        <span className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: '#7c3aed', color: '#ffffff' }}>
                                                            Atual
                                                        </span>
                                                    )}
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>{plan.label}</p>
                                                        <div className="mt-1 flex items-end gap-1">
                                                            <span className="text-2xl font-bold" style={{ color: '#1a1040' }}>{plan.price}</span>
                                                            <span className="mb-0.5 text-sm" style={{ color: '#6b6b8a' }}>{plan.period}</span>
                                                        </div>
                                                        <p className="mt-1 text-xs" style={{ color: '#6b6b8a' }}>{plan.description}</p>
                                                    </div>
                                                    <ul className="flex-1 space-y-2">
                                                        {plan.features.map((feature) => (
                                                            <li key={feature} className="flex items-center gap-2 text-xs" style={{ color: '#1a1040' }}>
                                                                <span style={{ color: '#059669' }}>OK</span> {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <button
                                                        type="button"
                                                        disabled={plan.current}
                                                        className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200"
                                                        style={
                                                            plan.current
                                                                ? { backgroundColor: 'rgba(124,58,237,0.15)', color: '#7c3aed', cursor: 'default' }
                                                                : { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#ffffff', boxShadow: '0 4px 14px rgba(124,58,237,0.20)' }
                                                        }
                                                    >
                                                        {plan.current ? 'Plano atual' : `Mudar para ${plan.label}`}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                    </div>

                                    <div className="flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#1a1040' }}>Proxima cobranca</p>
                                            <p className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>R$ 49,00 em 15 de junho de 2025 · Cartao final 4242</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
                                            style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed', backgroundColor: '#f0eeff' }}
                                        >
                                            Gerenciar pagamento
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'danger' && (
                                <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(234,88,12,0.25)' }}>
                                    <div className="border-b px-6 py-5" style={{ borderColor: 'rgba(234,88,12,0.15)', backgroundColor: '#fff7ed' }}>
                                        <h2 className="text-base font-bold" style={{ color: '#ea580c' }}>Zona de risco</h2>
                                        <p className="mt-0.5 text-sm" style={{ color: '#6b6b8a' }}>Acoes irreversiveis para sua conta</p>
                                    </div>
                                    <div className="px-6 py-6">
                                        <DeleteUserForm />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
