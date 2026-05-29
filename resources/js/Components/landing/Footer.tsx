import React from 'react';
import BrandLogo from '@/Components/branding/BrandLogo';

export const Footer: React.FC = () => (
  <footer className="bg-ink text-white py-16 sm:py-20 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-4">
            <BrandLogo href="/" nameClassName="text-xl text-white" iconClassName="h-9 w-9 rounded-xl" />
          </div>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs">Orin: a IA que ajuda vendedores online a monitorar mercado, precificar e vender melhor.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-4">Produto</h4>
          <ul className="space-y-2.5">{['Como funciona', 'Planos e preços', 'Demo interativa', 'Integrações'].map(item => (<li key={item}><a href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors">{item}</a></li>))}</ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-4">Empresa</h4>
          <ul className="space-y-2.5">{['Sobre nós', 'Blog', 'Carreiras', 'Contato'].map(item => (<li key={item}><a href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors">{item}</a></li>))}</ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-4">Legal</h4>
          <ul className="space-y-2.5">{['Privacidade', 'Termos de uso', 'Cookies', 'LGPD'].map(item => (<li key={item}><a href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors">{item}</a></li>))}</ul>
        </div>
      </div>
      <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} Orin. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">{['Twitter', 'LinkedIn', 'Instagram'].map(s => (<a key={s} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{s}</a>))}</div>
      </div>
    </div>
  </footer>
);