import React from 'react';
import { useTypingEffect } from '../../Hooks/useTypingEffect';
import { ProductThumb } from './Ui/ProductThumb';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { SearchIcon, SparklesIcon, ArrowRightIcon } from './Icons/Icons';
import { heroPreviewProducts } from '../../Data/demoQuestions';

export const Hero: React.FC = () => {
  const typedQuery = useTypingEffect(
    [
      'Melhor notebook até R$3.000?',
      'Smartphone com boa câmera e bateria?',
      'Fone Bluetooth com bom custo-benefício?',
      'TV 50 polegadas com melhor preço?',
    ],
    40,
    20,
    2000
  );

  const typedVender = useTypingEffect(['vender'], 90, 55, 2800);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 sm:pb-24 overflow-hidden bg-gradient-to-b from-purple-soft/55 via-base to-purple-soft/48">
      <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-brand/[0.07] rounded-full blur-3xl animate-float-orb pointer-events-none max-md:scale-75" />
      <div className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-brand-light/[0.09] rounded-full blur-3xl animate-float-delayed pointer-events-none max-md:hidden" />
      <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-emerald-brand/[0.06] rounded-full blur-3xl animate-float-slow pointer-events-none max-md:hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <AnimateOnScroll onMount>
              <div className="inline-flex items-center gap-2 bg-purple-soft border border-brand-default rounded-full px-4 py-1.5 mb-6">
                <SparklesIcon className="w-4 h-4 text-brand" />
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">Powered by IA</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll onMount delay={100}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-6">
                A IA que encontra os{' '}
                <span className="gradient-brand-text">melhores produtos</span>{' '}
                para você{' '}
                <span className="gradient-brand-text whitespace-nowrap">
                  {typedVender}
                  <span className="text-brand font-light animate-blink-cursor">|</span>
                </span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll onMount delay={200}>
              <p className="text-lg text-muted leading-relaxed mb-8 max-w-md">
                Pergunte. A IA filtra. Receba os melhores resultados de todas as lojas online em segundos.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll onMount delay={300}>
              <div className="flex flex-wrap gap-3">
                <a href="#demo" className="gradient-brand text-white font-semibold px-7 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-brand/25 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2">
                  Experimentar Agora
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
                <a href="#how-it-works" className="bg-surface-alt border border-brand-default text-ink font-semibold px-7 py-3.5 rounded-2xl hover:border-brand hover:bg-purple-soft/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  Ver como funciona
                </a>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll onMount delay={400}>
              <div className="flex items-center gap-6 mt-10 pt-8">
                {[
                  { value: '2M+', label: 'produtos analisados' },
                  { value: '50+', label: 'lojas comparadas' },
                  { value: '97%', label: 'satisfação' },
                ].map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    {i > 0 && <div className="w-px h-8 bg-brand/15" />}
                    <div className="text-center">
                      <div className="text-xl font-bold text-ink">{stat.value}</div>
                      <div className="text-xs text-muted">{stat.label}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll onMount delay={150} className="lg:max-w-lg lg:ml-auto">
            <div className="bg-panel-soft rounded-3xl border border-brand-default shadow-xl shadow-brand/[0.1] p-6 sm:p-8 relative ring-1 ring-brand/20">
              <div className="flex items-center gap-3 bg-ink/90 backdrop-blur-sm rounded-2xl px-5 py-4 border border-brand/20 mb-6">
                <SearchIcon className="w-5 h-5 text-brand-light flex-shrink-0" />
                <span className="text-white font-medium text-sm sm:text-base truncate">{typedQuery}</span>
                <span className="animate-blink-cursor text-brand-light font-light">|</span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 bg-emerald-brand rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-brand uppercase tracking-wider">IA buscando nas lojas...</span>
              </div>
              <div className="space-y-3">
                {heroPreviewProducts.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      item.isBest ? 'bg-green-soft border-emerald-default' : 'bg-surface-alt/80 border-brand-soft'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ProductThumb src={item.image} alt={item.name} isBest={item.isBest} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-ink truncate">{item.name.split('—')[0].trim()}</span>
                          {item.isBest && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-brand bg-emerald-brand/10 px-2 py-0.5 rounded-full">
                              Melhor
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted">{item.store}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-ink flex-shrink-0 ml-3">{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/[0.06] rounded-full blur-2xl pointer-events-none" />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};
