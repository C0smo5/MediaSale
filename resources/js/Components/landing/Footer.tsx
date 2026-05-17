import React from 'react';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { FilterIcon } from './Icons/Icons';

export const Footer: React.FC = () => (
  <footer className="bg-ink text-white py-16 sm:py-20 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimateOnScroll>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center"><FilterIcon className="w-5 h-5 text-white" /></div>
              <span className="font-display font-bold text-xl text-white">Media<span className="gradient-brand-text">Sell</span></span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">MediaSell: a IA que encontra os melhores produtos para você em todas as lojas online.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-4">Produto</h4>
            <ul className="space-y-2.5">{['Como funciona', 'Planos e preços', 'Demo interativa', 'Integrações'].map(item => (<li key={item}><a href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300">{item}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-4">Empresa</h4>
            <ul className="space-y-2.5">{['Sobre nós', 'Blog', 'Carreiras', 'Contato'].map(item => (<li key={item}><a href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300">{item}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white/60 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">{['Privacidade', 'Termos de uso', 'Cookies', 'LGPD'].map(item => (<li key={item}><a href="#" className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300">{item}</a></li>))}</ul>
          </div>
        </div>
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} MediaSell. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">{['Twitter', 'LinkedIn', 'Instagram'].map(s => (<a key={s} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors duration-300">{s}</a>))}</div>
        </div>
      </AnimateOnScroll>
    </div>
  </footer>
);
