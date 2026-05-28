import BrandLogo from '@/Components/branding/BrandLogo';
import { Link } from '@inertiajs/react';

const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

function BackToLandingLink({ className = '' }) {
    return (
        <Link
            href={route('home')}
            className={`inline-flex items-center gap-2 text-sm font-semibold no-underline transition-colors hover:opacity-80 ${className}`}
            style={{ color: '#7c3aed' }}
        >
            <ArrowLeftIcon />
            Voltar para a pagina inicial
        </Link>
    );
}

const panelStats = [
    { value: '50+', label: 'Lojas monitoradas' },
    { value: '95%', label: 'Precisao das analises' },
    { value: '24/7', label: 'Disponibilidade' },
];

function BrandPanel() {
    return (
        <div
            className="relative flex h-full min-h-0 w-full flex-col justify-between overflow-hidden rounded-[28px] border lg:rounded-[32px]"
            style={{
                background: 'linear-gradient(135deg, #140a2d 0%, #1a1040 55%, #2b1364 100%)',
                borderColor: 'rgba(124,58,237,0.16)',
                boxShadow: '0 28px 80px rgba(26,16,64,0.22)',
            }}
        >
            <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
                style={{ background: 'rgba(168,85,247,0.22)' }}
            />
            <div
                className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full blur-3xl"
                style={{ background: 'rgba(124,58,237,0.18)' }}
            />

            <div className="relative z-10 space-y-5 p-8 lg:p-10 xl:p-12">
                <BrandLogo
                    href={route('home')}
                    iconClassName="h-12 w-12 rounded-2xl lg:h-14 lg:w-14"
                    nameClassName="text-2xl text-white lg:text-3xl"
                    iconStyle={{ boxShadow: '0 12px 32px rgba(124,58,237,0.30)' }}
                />
                <BackToLandingLink className="!text-[#c4b5fd] hover:!text-white" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col justify-center space-y-5 px-8 lg:px-10 xl:px-12">
                <span
                    className="inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{
                        backgroundColor: 'rgba(168,85,247,0.14)',
                        color: '#c4b5fd',
                        border: '1px solid rgba(168,85,247,0.22)',
                    }}
                >
                    Plataforma inteligente
                </span>
                <h1 className="max-w-2xl text-3xl font-bold leading-[1.08] text-white lg:text-4xl xl:text-[2.75rem]">
                    Acesse seu painel com a mesma identidade visual do projeto.
                </h1>
                <p className="max-w-2xl text-base leading-7 lg:text-lg" style={{ color: 'rgba(255,255,255,0.76)' }}>
                    Monitore oportunidades, compare precos e acompanhe suas analises em uma experiencia
                    consistente do login ao dashboard.
                </p>
            </div>

            <div className="auth-panel-stats relative z-10 w-full min-w-0 px-8 pb-8 lg:px-10 lg:pb-10 xl:px-12 xl:pb-12">
                {panelStats.map((item) => (
                    <div
                        key={item.label}
                        className="auth-stat-card"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}
                    >
                        <p className="auth-stat-card__value">{item.value}</p>
                        <p className="auth-stat-card__label">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#f8f7ff]">
            <div
                className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full blur-3xl sm:left-0 sm:h-[420px] sm:w-[420px]"
                style={{ background: 'rgba(124,58,237,0.18)' }}
            />
            <div
                className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full blur-3xl sm:right-0 sm:h-[360px] sm:w-[360px]"
                style={{ background: 'rgba(168,85,247,0.12)' }}
            />

            <div className="auth-guest-layout">
                <aside className="auth-guest-brand hidden lg:flex">
                    <BrandPanel />
                </aside>

                <div className="auth-guest-form">
                    <BackToLandingLink className="mb-4 shrink-0 lg:hidden" />

                    <div
                        className="auth-guest-form-card w-full min-w-0 rounded-[24px] border shadow-2xl sm:rounded-[28px] lg:rounded-[28px]"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.98)',
                            borderColor: 'rgba(124,58,237,0.14)',
                            boxShadow: '0 20px 60px rgba(26,16,64,0.14)',
                        }}
                    >
                        <div className="auth-guest-form-scroll">
                            <div className="auth-guest-form-inner p-5 sm:p-7 lg:p-8">
                                <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
                                    <BrandLogo
                                        href={route('home')}
                                        nameClassName="text-xl"
                                        nameStyle={{ color: '#1a1040' }}
                                    />
                                </div>

                                <div className="min-w-0">{children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
