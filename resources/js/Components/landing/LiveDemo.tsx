import React, { useState, useEffect, useCallback } from 'react';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';
import { RatingStars } from './Ui/RatingStars';
import { ProductThumb } from './Ui/ProductThumb';
import { SearchIcon, SparklesIcon, ZapIcon, CheckIcon, XIcon } from './Icons/Icons';
import { demoQuestions, storeColors } from '../../Data/demoQuestions';
import type { DemoQuestion } from '../../Types';

export const LiveDemo: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<DemoQuestion | null>(null);
  const [phase, setPhase] = useState<'idle' | 'typing' | 'scanning' | 'filtering' | 'results'>('idle');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [scannedStores, setScannedStores] = useState<string[]>([]);
  const [visibleResults, setVisibleResults] = useState(0);
  const [filterProgress, setFilterProgress] = useState(0);

  const handleSelectQuestion = useCallback((q: DemoQuestion) => {
    setSelectedQuestion(q);
    setPhase('typing');
    setDisplayedQuery('');
    setScannedStores([]);
    setVisibleResults(0);
    setFilterProgress(0);
  }, []);

  useEffect(() => {
    if (phase !== 'typing' || !selectedQuestion) return;
    const text = selectedQuestion.text;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayedQuery(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setTimeout(() => setPhase('scanning'), 400);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [phase, selectedQuestion]);

  useEffect(() => {
    if (phase !== 'scanning' || !selectedQuestion) return;
    const stores = selectedQuestion.stores;
    let i = 0;
    const timer = setInterval(() => {
      setScannedStores(prev => [...prev, stores[i]]);
      i++;
      if (i >= stores.length) {
        clearInterval(timer);
        setTimeout(() => setPhase('filtering'), 500);
      }
    }, 350);
    return () => clearInterval(timer);
  }, [phase, selectedQuestion]);

  useEffect(() => {
    if (phase !== 'filtering' || !selectedQuestion) return;
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(() => setPhase('results'), 300);
      }
      setFilterProgress(Math.min(progress, 100));
    }, 150);
    return () => clearInterval(timer);
  }, [phase, selectedQuestion]);

  useEffect(() => {
    if (phase !== 'results' || !selectedQuestion) return;
    const count = selectedQuestion.results.length;
    let i = 0;
    setVisibleResults(0);
    const timer = setInterval(() => {
      i++;
      setVisibleResults(i);
      if (i >= count) clearInterval(timer);
    }, 300);
    return () => clearInterval(timer);
  }, [phase, selectedQuestion]);

  const handleReset = () => {
    setPhase('idle');
    setSelectedQuestion(null);
    setDisplayedQuery('');
    setScannedStores([]);
    setVisibleResults(0);
    setFilterProgress(0);
  };

  return (
    <section id="demo" className="py-24 sm:py-32 bg-gradient-to-b from-base/90 via-purple-soft/36 to-surface-alt relative overflow-hidden">
      <div className="absolute -top-40 right-0 w-80 h-80 bg-brand/[0.06] rounded-full blur-2xl animate-float-slow pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimateOnScroll className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-soft border border-brand-default rounded-full px-4 py-1.5 mb-4">
            <ZapIcon className="w-4 h-4 text-brand" />
            <span className="text-xs font-semibold text-brand uppercase tracking-wider">Demo Interativa</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-4">Veja a IA em ação</h2>
          <p className="text-lg text-muted max-w-xl mx-auto">Clique em uma pergunta e assista a IA buscar, filtrar e encontrar os melhores produtos em tempo real</p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80}>
          <div className="bg-panel-soft rounded-3xl border border-brand-default shadow-xl shadow-brand/10 overflow-hidden ring-1 ring-brand/15">
            <div className="p-5 sm:p-6 border-b border-brand-soft/25">
              <div className="flex items-center gap-3 bg-ink/90 backdrop-blur-sm rounded-2xl px-5 py-4 border border-brand/20">
                <SearchIcon className="w-5 h-5 text-brand-light flex-shrink-0" />
                {phase === 'idle' ? (
                  <span className="text-white/40 text-sm sm:text-base">Selecione uma pergunta abaixo...</span>
                ) : (
                  <span className="text-white font-medium text-sm sm:text-base">{displayedQuery}<span className="animate-blink-cursor text-brand-light">|</span></span>
                )}
              </div>
            </div>

            <div className="px-5 sm:px-6 py-4 border-b border-brand-soft/25 flex flex-wrap gap-2">
              {demoQuestions.map(q => (
                <button key={q.id} onClick={() => handleSelectQuestion(q)} disabled={phase !== 'idle'}
                  className={`text-sm px-4 py-2 rounded-xl border transition-all duration-200 font-medium ${
                    selectedQuestion?.id === q.id ? 'gradient-brand text-white border-transparent shadow-md shadow-brand/20'
                    : phase === 'idle' ? 'bg-surface-alt text-ink border-brand-default hover:border-brand hover:shadow-sm'
                    : 'bg-purple-soft/40 text-muted border-brand-soft cursor-not-allowed'}`}
                >{q.text}</button>
              ))}
              {phase !== 'idle' && (
                <button onClick={handleReset} className="text-sm px-4 py-2 rounded-xl border border-brand-default bg-surface-alt text-muted hover:text-ink hover:bg-purple-soft/50 transition-all duration-200 ml-auto flex items-center gap-1.5">
                  <XIcon className="w-3.5 h-3.5" />Limpar
                </button>
              )}
            </div>

            <div className="p-5 sm:p-6 min-h-[320px] bg-purple-soft/25">
              {phase === 'typing' && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 bg-purple-soft rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                    <SparklesIcon className="w-7 h-7 text-brand" />
                  </div>
                  <p className="text-sm font-medium text-brand">IA processando sua pergunta...</p>
                </div>
              )}

              {phase === 'idle' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-purple-soft rounded-2xl flex items-center justify-center mb-4"><SparklesIcon className="w-8 h-8 text-brand" /></div>
                  <p className="text-muted text-sm">Clique em uma das perguntas para iniciar a demonstração</p>
                </div>
              )}

              {phase === 'scanning' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-brand rounded-full" />
                      <div className="absolute w-2.5 h-2.5 bg-brand rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="text-sm font-semibold text-brand">Analisando lojas...</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scannedStores.map((store, i) => (
                      <div key={i} className="animate-card-pop inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-surface-alt border-brand-default text-xs font-semibold text-ink" style={{ animationDelay: `${i * 45}ms` }}>
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-brand" />{store}
                      </div>
                    ))}
                    {selectedQuestion && scannedStores.length < selectedQuestion.stores.length && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-default bg-surface-alt animate-scan-pulse">
                        <div className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {phase === 'filtering' && selectedQuestion && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 bg-emerald-brand rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-emerald-brand">Filtrando {selectedQuestion.totalProducts} produtos...</span>
                  </div>
                  <div className="w-full h-3 bg-surface-alt rounded-full overflow-hidden">
                    <div className="h-full gradient-brand rounded-full transition-all duration-150 ease-out" style={{ width: `${filterProgress}%` }} />
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted">
                    <span className="flex items-center gap-1"><CheckIcon className="w-3 h-3 text-emerald-brand" /> Preço comparado</span>
                    <span className="flex items-center gap-1"><CheckIcon className="w-3 h-3 text-emerald-brand" /> Avaliações verificadas</span>
                    <span className="flex items-center gap-1"><CheckIcon className="w-3 h-3 text-emerald-brand" /> Compatibilidade checada</span>
                  </div>
                </div>
              )}

              {phase === 'results' && selectedQuestion && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckIcon className="w-5 h-5 text-emerald-brand" />
                    <span className="text-sm font-semibold text-emerald-brand">{selectedQuestion.results.length} melhores resultados encontrados</span>
                  </div>
                  <div className="space-y-3">
                    {selectedQuestion.results.slice(0, visibleResults).map((result, i) => (
                      <div key={i}
                        className={`animate-card-pop flex items-center justify-between p-4 rounded-xl border ${
                          result.isBest ? 'bg-green-soft border-emerald-default ring-1 ring-emerald-brand/15'
                          : 'bg-surface-alt/90 border-brand-soft'}`}
                        style={{ animationDelay: `${i * 45}ms` }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <ProductThumb src={result.image} alt={result.name} isBest={result.isBest} />
                          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${result.isBest ? 'bg-emerald-brand/10 text-emerald-brand' : 'bg-purple-soft text-brand'}`}>
                            {result.match}%
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-ink">{result.name}</span>
                              {result.isBest && <span className="animate-badge-pop inline-flex items-center gap-1 bg-emerald-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Melhor Escolha</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <RatingStars rating={result.rating} />
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${storeColors[result.store] || 'bg-gray-100 text-gray-600'}`}>{result.store}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-base font-bold text-ink">{result.price}</div>
                          {result.originalPrice && <div className="text-xs text-muted line-through">{result.originalPrice}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};
