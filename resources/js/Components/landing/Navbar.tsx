import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { FilterIcon, XIcon, MenuIcon } from './Icons/Icons';

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
    <nav className={`fixed top-0 w-full z-50 glass-nav transition-all duration-500 ease-out ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand/20 group-hover:shadow-lg group-hover:shadow-brand/30 transition-shadow">
              <FilterIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Media<span className="gradient-brand-text">Sell</span></span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-white/75 hover:text-white transition-colors duration-200">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href={route('login')} className="text-sm font-medium text-white/75 hover:text-white transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link href={route('register')} className="gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5 transition-all duration-200">
              Começar Grátis
            </Link>
          </div>

          <button className="md:hidden p-2 text-white/85 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#150a30]/97 backdrop-blur-lg border-t border-white/[0.08]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors">
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 space-y-2 border-t border-white/[0.08]">
              <Link href={route('login')} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white rounded-xl transition-colors">
                Entrar
              </Link>
              <Link href={route('register')} onClick={() => setMobileOpen(false)} className="block gradient-brand text-white text-sm font-semibold px-5 py-3 rounded-xl text-center">
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};