import React from 'react';
import { useTypingEffect } from './hooks/useTypingEffect';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { DemoResultThumb } from './Ui/DemoResultThumb';
import { demoImages } from './data/demoImages';
import { SearchIcon, SparklesIcon, ArrowRightIcon } from './Icons/Icons';

export const Hero: React.FC = () => {
  const typedText = useTypingEffect(
    [
      'Qual preço praticar no meu fone Bluetooth?',
      'Concorrência do Galaxy A54 no Mercado Livre',
      'Tendência de vendas para notebooks até R$3.000',
      'Copy para anúncio do meu produto campeão',
    ],
    40,
    20,
    2000
  );

  const mockInsights = [
    { label: 'Preço médio concorrência', value: 'R$ 89', store: 'Mercado Livre', match: 96, best: true, image: demoImages.phone01, imageAlt: 'Celular — preço médio da concorrência' },
    { label: 'Sua faixa sugerida', value: 'R$ 79–84', store: 'Margem ~18%', match: 91, best: false, image: demoImages.phone02, imageAlt: 'Celular — faixa de preço sugerida' },
    { label: 'Anúncio líder', value: 'R$ 92', store: 'Amazon', match: 84, best: false, image: demoImages.phone03, imageAlt: 'Celular — anúncio líder' },
  ];

  return (
    <section className="relative flex min-h-screen items-center overflow-x-hidden bg-gradient-to-b from-purple-soft/55 via-base to-purple-soft/48 pt-20 pb-20 sm:pb-24">
      <div className="pointer-events-none absolute top-20 -left-40 h-[min(500px,90vw)] w-[min(500px,90vw)] rounded-full bg-brand/[0.07] blur-3xl animate-float-orb" />
      <div className="pointer-events-none absolute bottom-0 -right-32 h-[min(400px,80vw)] w-[min(400px,80vw)] rounded-full bg-brand-light/[0.09] blur-3xl animate-float-delayed" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[min(300px,70vw)] w-[min(300px,70vw)] -translate-x-1/2 rounded-full bg-emerald-brand/[0.06] blur-3xl animate-float-slow" />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="min-w-0 lg:max-w-xl">
            <AnimateOnScroll>
              <div className="inline-flex items-center gap-2 bg-purple-soft border border-brand-default rounded-full px-4 py-1.5 mb-6">
                <SparklesIcon className="w-4 h-4 text-brand" />
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">IA para quem vende online</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-6">
                A IA que ajuda você a{' '}
                <span className="gradient-brand-text">vender melhor</span>{' '}
                no mercado
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <p className="text-lg text-muted leading-relaxed mb-8 max-w-md">
                Monitore concorrentes, precifique com segurança e gere insights para seus anúncios — em segundos, em qualquer canal online.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
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

            <AnimateOnScroll delay={400}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 pt-8">
                <div className="text-center"><div className="text-xl font-bold text-ink">50+</div><div className="text-xs text-muted">canais monitorados</div></div>
                <div className="hidden h-8 w-px bg-brand/15 sm:block" />
                <div className="text-center"><div className="text-xl font-bold text-ink">2M+</div><div className="text-xs text-muted">anúncios analisados</div></div>
                <div className="hidden h-8 w-px bg-brand/15 sm:block" />
                <div className="text-center"><div className="text-xl font-bold text-ink">97%</div><div className="text-xs text-muted">satisfação</div></div>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={200} className="min-w-0 w-full max-w-full lg:max-w-none">
            <div className="relative mx-auto w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-brand-default bg-panel-soft p-4 shadow-xl shadow-brand/[0.1] ring-1 ring-brand/20 sm:p-6 lg:mx-0 lg:p-8">
                <div className="mb-6 flex flex-wrap items-start gap-2 rounded-2xl border border-brand/20 bg-ink/90 px-4 py-3 backdrop-blur-sm sm:items-center sm:gap-3 sm:px-5 sm:py-4">
                  <SearchIcon className="h-5 w-5 flex-shrink-0 text-brand-light" />
                  <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-white sm:text-base">
                    {typedText}
                  </span>
                  <span className="animate-blink-cursor flex-shrink-0 font-light text-brand-light">|</span>
                </div>
              <div className="flex items-center gap-2 mb-5">
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-emerald-brand rounded-full" />
                  <div className="absolute w-2.5 h-2.5 bg-emerald-brand rounded-full animate-ping" />
                </div>
                <span className="text-xs font-semibold text-emerald-brand uppercase tracking-wider">IA analisando o mercado...</span>
              </div>
              <div className="space-y-3">
                {mockInsights.map((item, i) => (
                  <div
                    key={i}
                    className={`flex min-w-0 items-center justify-between gap-2 rounded-xl border p-3 sm:p-3.5 transition-all duration-200 ${item.best ? 'bg-green-soft border-emerald-default' : 'bg-surface-alt/80 border-brand-soft'}`}
                  >
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <DemoResultThumb
                        src={item.image}
                        alt={item.imageAlt}
                        match={item.match}
                        highlight={item.best}
                        className="h-10 w-10 sm:h-11 sm:w-11 [&_img]:h-10 [&_img]:w-10 sm:[&_img]:h-11 sm:[&_img]:w-11"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-ink">{item.label}</div>
                        <div className="truncate text-xs text-muted">{item.store}</div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-xs font-bold text-ink sm:text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute -top-20 -right-20 hidden h-40 w-40 rounded-full bg-brand/[0.06] blur-3xl sm:block" />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};
