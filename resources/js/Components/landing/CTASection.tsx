import React from 'react';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { ArrowRightIcon } from './Icons/Icons';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-purple-soft/32 via-base/95 to-base">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimateOnScroll>
          <div className="gradient-brand rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full" />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 relative z-10">Pronto para vender com mais inteligência?</h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-8 relative z-10">Monitore concorrentes, precifique com segurança e use IA na sua operação — comece grátis em minutos.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <a
                href={route('register')}
                className="bg-surface-alt text-ink font-semibold px-8 py-4 rounded-2xl border border-white/40 shadow-lg hover:bg-purple-soft hover:border-white/60 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
              >
                Começar a vender grátis <ArrowRightIcon className="w-5 h-5" />
              </a>
              <a href="#demo" className="text-white/80 font-medium hover:text-white transition-colors inline-flex items-center gap-2 px-6 py-4">Ver demo <ArrowRightIcon className="w-4 h-4" /></a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};
