import React from 'react';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { MessageSquareIcon, FilterIcon, TargetIcon } from './Icons/Icons';

export const HowItWorks: React.FC = () => {
  const steps = [
    { icon: <MessageSquareIcon className="w-7 h-7" />, title: 'Descreva seu produto', description: 'Informe o que você vende, o nicho ou a dúvida — preço, concorrência, copy ou tendência. A IA entende o contexto do seu negócio.', bg: 'bg-purple-soft', border: 'border-brand-default' },
    { icon: <FilterIcon className="w-7 h-7" />, title: 'IA cruza o mercado', description: 'Cruzamos anúncios e preços em marketplaces e lojas online, analisando concorrentes e oportunidades em tempo real.', bg: 'bg-green-soft', border: 'border-emerald-default' },
    { icon: <TargetIcon className="w-7 h-7" />, title: 'Venda com mais clareza', description: 'Receba preço sugerido, posicionamento frente à concorrência e insights para anunciar — prontos para aplicar na operação.', bg: 'bg-orange-soft', border: 'border-orange-default' },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-gradient-to-b from-purple-soft/52 via-purple-soft/46 to-base/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimateOnScroll className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-soft border border-brand-default rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-brand uppercase tracking-wider">Como Funciona</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-4">Simples como deve ser</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">Três passos para precificar, posicionar e decidir mais rápido — sem planilhas e sem adivinhação</p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, i) => (
            <AnimateOnScroll key={i} delay={i * 150}>
              <div className="relative text-center">
                <div className={`w-16 h-16 ${step.bg} ${step.border} border rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand relative z-10`}>{step.icon}</div>
                <div className="inline-flex items-center justify-center w-7 h-7 gradient-brand text-white text-xs font-bold rounded-full mb-4">{i + 1}</div>
                <h3 className="font-display text-xl font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
