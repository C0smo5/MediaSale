import React from 'react';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { FilterIcon, TrendingUpIcon, ShieldIcon, BellIcon, BarChartIcon, HeartIcon } from './Icons/Icons';

export const Features: React.FC = () => {
  const features = [
    { icon: <FilterIcon className="w-6 h-6" />, title: 'Filtros Inteligentes', desc: 'A IA entende suas necessidades e aplica filtros que realmente importam para sua busca.', bg: 'bg-purple-soft', color: 'text-brand' },
    { icon: <TrendingUpIcon className="w-6 h-6" />, title: 'Comparação de Preços', desc: 'Veja o preço em todas as lojas simultaneamente e identifique a melhor oferta.', bg: 'bg-green-soft', color: 'text-emerald-brand' },
    { icon: <ShieldIcon className="w-6 h-6" />, title: 'Avaliações Verificadas', desc: 'A IA analisa milhares de avaliações e identifica padrões reais de qualidade.', bg: 'bg-orange-soft', color: 'text-orange-brand' },
    { icon: <BellIcon className="w-6 h-6" />, title: 'Alertas de Preço', desc: 'Receba notificações quando o produto que você quer tiver uma queda de preço.', bg: 'bg-purple-soft', color: 'text-brand' },
    { icon: <BarChartIcon className="w-6 h-6" />, title: 'Histórico de Preços', desc: 'Acompanhe a variação de preços ao longo do tempo e compre no momento certo.', bg: 'bg-green-soft', color: 'text-emerald-brand' },
    { icon: <HeartIcon className="w-6 h-6" />, title: 'Recomendações Personalizadas', desc: 'Quanto mais você usa, melhor a IA entende suas preferências e necessidades.', bg: 'bg-orange-soft', color: 'text-orange-brand' },
  ];

  return (
    <section className="py-24 sm:py-32 relative bg-gradient-to-b from-surface-alt via-purple-soft/40 to-purple-soft/38">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-soft border border-brand-default rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-brand uppercase tracking-wider">Recursos</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-4">Tudo que você precisa para comprar melhor</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">Ferramentas poderosas driven by IA para garantir que você sempre faça a melhor escolha</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <div className="bg-panel-soft p-7 rounded-2xl border border-brand-default hover:border-brand hover:shadow-lg hover:shadow-brand/15 hover:-translate-y-1 transition-all duration-300 h-full ring-1 ring-purple-soft">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center ${f.color} mb-5`}>{f.icon}</div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};