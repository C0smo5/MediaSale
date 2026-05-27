import BrandLogo from '@/Components/branding/BrandLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f8f7ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div
                className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full blur-3xl"
                style={{ background: 'rgba(124,58,237,0.18)' }}
            />
            <div
                className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full blur-3xl"
                style={{ background: 'rgba(168,85,247,0.12)' }}
            />

            <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,0.88fr)_380px] xl:grid-cols-[minmax(0,0.95fr)_400px] xl:gap-8">
                <div
                    className="relative hidden min-h-[560px] overflow-hidden rounded-[32px] border p-8 lg:flex lg:flex-col lg:justify-between xl:min-h-[600px] xl:p-10"
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

                    <div className="relative z-10">
                        <BrandLogo
                            href="/"
                            iconClassName="h-12 w-12 rounded-2xl"
                            nameClassName="text-2xl text-white"
                            iconStyle={{ boxShadow: '0 12px 32px rgba(124,58,237,0.30)' }}
                        />
                    </div>

                    <div className="relative z-10 max-w-xl space-y-5">
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
                        <h1 className="max-w-[11ch] text-4xl font-bold leading-[1.05] text-white xl:text-5xl">
                            Acesse seu painel com a mesma identidade visual do projeto.
                        </h1>
                        <p className="max-w-xl text-base leading-7" style={{ color: 'rgba(255,255,255,0.76)' }}>
                            Monitore oportunidades, compare precos e acompanhe suas analises em uma experiencia
                            consistente do login ao dashboard.
                        </p>
                    </div>

                    <div className="relative z-10 grid max-w-xl gap-3 sm:grid-cols-3">
                        {[
                            { value: '50+', label: 'Lojas monitoradas' },
                            { value: '95%', label: 'Precisao das analises' },
                            { value: '24/7', label: 'Disponibilidade' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border p-4"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}
                            >
                                <p className="text-2xl font-bold text-white">{item.value}</p>
                                <p className="mt-1.5 text-xs leading-5" style={{ color: 'rgba(255,255,255,0.70)' }}>
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-xl justify-self-center lg:max-w-[380px] xl:max-w-[400px]">
                    <div
                        className="overflow-hidden rounded-[28px] border p-6 shadow-2xl sm:p-8"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.98)',
                            borderColor: 'rgba(124,58,237,0.14)',
                            boxShadow: '0 20px 60px rgba(26,16,64,0.14)',
                        }}
                    >
                        <div className="mb-6 flex items-center justify-between lg:hidden">
                            <BrandLogo href="/" nameClassName="text-xl" nameStyle={{ color: '#1a1040' }} />
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
