import { FilterIcon } from '@/Components/landing/Icons/Icons';
import { Link } from '@inertiajs/react';

export default function AuthLandingLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-page-balanced font-body text-ink antialiased flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute top-20 -left-40 w-[400px] h-[400px] bg-brand/[0.07] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 -right-32 w-[320px] h-[320px] bg-brand-light/[0.08] rounded-full blur-3xl pointer-events-none" />

            <Link
                href="/"
                className="relative z-10 flex items-center gap-2.5 mb-8 group"
            >
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand/20 group-hover:shadow-lg group-hover:shadow-brand/30 transition-shadow">
                    <FilterIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-2xl text-ink">
                    Media<span className="gradient-brand-text">Sell</span>
                </span>
            </Link>

            <div className="relative z-10 w-full max-w-md bg-panel-soft rounded-3xl border border-brand-default shadow-xl shadow-brand/[0.1] p-8 sm:p-10 ring-1 ring-brand/20">
                <div className="text-center mb-8">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 text-sm text-muted">{subtitle}</p>
                    )}
                </div>
                {children}
            </div>

            <Link
                href="/"
                className="relative z-10 mt-6 text-sm font-medium text-muted hover:text-brand transition-colors"
            >
                ← Voltar para a página inicial
            </Link>
        </div>
    );
}
