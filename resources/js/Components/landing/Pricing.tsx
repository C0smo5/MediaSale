import React, { useState, useCallback } from 'react';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { Toast } from './Ui/Toast';
import { CheckIcon, XIcon, ZapIcon, ShieldIcon, RocketIcon } from './Icons/Icons';
import { pricingPlans } from '../../Data/pricingPlans';

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => { setToastMsg(msg); setToastVisible(true); };
  const hideToast = useCallback(() => setToastVisible(false), []);

  const planIcons: Record<string, React.ReactNode> = {
    'Básico': <ZapIcon className="w-6 h-6" />,
    'Pro': <ShieldIcon className="w-6 h-6" />,
    'Premium': <RocketIcon className="w-6 h-6" />,
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-purple-soft/38 via-base to-purple-soft/32 relative overflow-hidden">
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand/[0.06] rounded-full blur-2xl animate-float-orb pointer-events-none" />
      <div className="absolute -top-20 -right-40 w-96 h-96 bg-emerald-brand/[0.05] rounded-full blur-2xl animate-float-delayed pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimateOnScroll className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-soft border border-brand-default rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-brand uppercase tracking-wider">Planos</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-4">Escolha o plano ideal</h2>
          <p className="text-lg text-muted max-w-xl mx-auto mb-8">Comece grátis e evolua conforme sua necessidade. Cancele quando quiser.</p>

          <div className="inline-flex items-center gap-3 bg-purple-soft/80 rounded-2xl p-1.5 border border-brand-default shadow-md shadow-brand/10">
            <button onClick={() => setIsAnnual(false)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${!isAnnual ? 'gradient-brand text-white shadow-md shadow-brand/20' : 'text-muted hover:text-ink'}`}>Mensal</button>
            <button onClick={() => setIsAnnual(true)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isAnnual ? 'gradient-brand text-white shadow-md shadow-brand/20' : 'text-muted hover:text-ink'}`}>
              Anual
              <span className="text-[10px] font-bold bg-emerald-brand/10 text-emerald-brand px-2 py-0.5 rounded-full uppercase">-15%</span>
            </button>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <AnimateOnScroll key={plan.name} delay={i * 120}>
              <div className={`relative rounded-3xl border p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${
                plan.highlighted ? 'pricing-card-highlight border-emerald-default ring-2 ring-emerald-brand/20 shadow-xl shadow-emerald-brand/15'
                : 'bg-panel-soft border-brand-default hover:border-brand hover:shadow-lg hover:shadow-brand/12'}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full ${plan.highlighted ? 'bg-emerald-brand text-white' : 'bg-orange-brand text-white'}`}>{plan.badge}</span>
                  </div>
                )}
                <div className="mb-6 pt-2">
                  <div className={`w-12 h-12 ${plan.iconBg} rounded-xl flex items-center justify-center text-${plan.accentColor} mb-4`}>{planIcons[plan.name]}</div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted">R$</span>
                    <span className="font-display text-4xl font-bold text-ink transition-all duration-300">{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                    <span className="text-sm text-muted">/mês</span>
                  </div>
                  {isAnnual && <p className="text-xs text-emerald-brand font-medium mt-1">Cobrança anual — economize 15%</p>}
                </div>
                <div className="flex-1 mb-6">
                  <div className="space-y-3">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2.5">
                        <CheckIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 text-${plan.accentColor}`} />
                        <span className="text-sm text-ink">{f}</span>
                      </div>
                    ))}
                    {plan.limitations.map((l, li) => (
                      <div key={li} className="flex items-start gap-2.5 opacity-50">
                        <XIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted" />
                        <span className="text-sm text-muted line-through">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => showToast(`Plano ${plan.name} — em breve disponível!`)}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    plan.highlighted ? 'gradient-brand text-white hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5'
                    : 'bg-purple-soft/70 text-ink border border-brand-default hover:bg-purple-soft hover:border-brand hover:shadow-md hover:-translate-y-0.5'}`}
                >Começar com {plan.name}</button>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="text-center mt-10" delay={200}>
          <p className="text-sm text-muted">Todos os planos incluem 7 dias grátis. Cancele quando quiser, sem multa.</p>
        </AnimateOnScroll>
      </div>

      <Toast message={toastMsg} visible={toastVisible} onClose={hideToast} />
    </section>
  );
};
