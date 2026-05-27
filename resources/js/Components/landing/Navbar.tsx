import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import BrandLogo from '@/Components/branding/BrandLogo';
import { MenuIcon, XIcon } from './Icons/Icons';

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler, { passive: true });

        return () => window.removeEventListener('scroll', handler);
    }, []);

    const navLinks = [
        { label: 'Como funciona', href: '#how-it-works' },
        { label: 'Demo', href: '#demo' },
        { label: 'Planos', href: '#pricing' },
    ];

    return (
        <nav className={`fixed top-0 z-50 w-full glass-nav transition-all duration-500 ease-out ${scrolled ? 'scrolled' : ''}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between sm:h-18">
                    <BrandLogo href="/" nameClassName="text-white" iconClassName="h-9 w-9 rounded-xl shadow-md shadow-brand/20 transition-shadow group-hover:shadow-lg group-hover:shadow-brand/30" />

                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} className="text-sm font-medium text-white/75 transition-colors duration-200 hover:text-white">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        <Link href={route('login')} className="px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white">
                            Entrar
                        </Link>
                        <Link
                            href={route('register')}
                            className="gradient-brand rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/25"
                        >
                            Comecar gratis
                        </Link>
                    </div>

                    <button className="p-2 text-white/85 transition-colors hover:text-white md:hidden" onClick={() => setMobileOpen((open) => !open)}>
                        {mobileOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-white/[0.08] bg-[#150a30]/97 backdrop-blur-lg md:hidden">
                    <div className="space-y-1 px-4 py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-2 space-y-2 border-t border-white/[0.08] pt-3">
                            <Link
                                href={route('login')}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white"
                            >
                                Entrar
                            </Link>
                            <Link
                                href={route('register')}
                                onClick={() => setMobileOpen(false)}
                                className="gradient-brand block rounded-xl px-5 py-3 text-center text-sm font-semibold text-white"
                            >
                                Comecar gratis
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};