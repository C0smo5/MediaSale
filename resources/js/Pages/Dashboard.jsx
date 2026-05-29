import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function StatCard({ label, value, sub, color }) {
    const colors = {
        purple: { bg: '#ffffff', text: '#7c3aed', border: 'rgba(124,58,237,0.20)' },
        green: { bg: '#ffffff', text: '#059669', border: 'rgba(5,150,105,0.25)' },
        orange: { bg: '#ffffff', text: '#ea580c', border: 'rgba(234,88,12,0.25)' },
    };
    const selected = colors[color] || colors.purple;

    return (
        <div className="flex flex-col gap-1 rounded-2xl border p-5" style={{ backgroundColor: selected.bg, borderColor: selected.border }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>{label}</span>
            <span className="text-3xl font-bold" style={{ color: selected.text }}>{value}</span>
            {sub && <span className="text-xs" style={{ color: '#6b6b8a' }}>{sub}</span>}
        </div>
    );
}

function EmptyState({ title, description, action }) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-2xl border px-6 py-12 text-center"
            style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}
        >
            <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg,#ede9fe,#f0eeff)' }}
            >
                <svg className="h-6 w-6" fill="none" stroke="#7c3aed" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <h3 className="text-base font-bold" style={{ color: '#1a1040' }}>{title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: '#6b6b8a' }}>{description}</p>
            {action}
        </div>
    );
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const firstName = auth.user.name.split(' ')[0];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: '#f8f7ff' }}>
                <div className="mx-auto max-w-7xl space-y-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: '#1a1040' }}>
                                Ola, {firstName}
                            </h1>
                            <p className="mt-1 text-sm" style={{ color: '#6b6b8a' }}>
                                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                        <Link
                            href={route('chat')}
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.30)' }}
                        >
                            <span className="text-base">*</span>
                            Analisar com IA
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Analises na semana" value="0" sub="Nenhuma analise ainda" color="purple" />
                        <StatCard label="Lojas monitoradas" value="—" sub="Disponivel em breve" color="purple" />
                        <StatCard label="Economia total" value="R$ 0" sub="Sem dados no periodo" color="green" />
                        <StatCard label="Melhor desconto" value="—" sub="Aguardando analises" color="orange" />
                    </div>

                    <EmptyState
                        title="Nenhuma analise realizada"
                        description="Quando voce usar o chat para comparar produtos, seus insights e metricas aparecerao aqui."
                        action={
                            <Link
                                href={route('chat')}
                                className="mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
                            >
                                Iniciar primeira analise
                            </Link>
                        }
                    />

                    <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(124,58,237,0.12)' }}>
                        <div className="border-b px-6 py-4" style={{ borderColor: 'rgba(124,58,237,0.10)' }}>
                            <h2 className="text-sm font-bold" style={{ color: '#1a1040' }}>Historico de analises</h2>
                            <p className="mt-0.5 text-xs" style={{ color: '#6b6b8a' }}>Suas pesquisas recentes aparecerao aqui</p>
                        </div>
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm" style={{ color: '#6b6b8a' }}>Nenhuma analise no historico.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
