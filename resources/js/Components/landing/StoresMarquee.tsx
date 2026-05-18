import React from 'react';
import { AnimateOnScroll } from './Ui/AnimateOnScroll';

// ─── Dados das lojas ────────────────────────────────────────────────────────
// dot: cor do indicador visual de cada loja
const STORES: { name: string; dot: string }[] = [
  { name: 'Amazon',        dot: '#FF9900' },
  { name: 'Mercado Livre', dot: '#FFE600' },
  { name: 'AliExpress',    dot: '#FF4747' },
];

// Divide as lojas em dois trilhos para as duas linhas
const ROW_A = STORES;
const ROW_B = [...STORES].reverse(); // linha de baixo vai na direção oposta

// ─── Componente de card ─────────────────────────────────────────────────────
const StoreCard: React.FC<{ name: string; dot: string }> = ({ name, dot }) => (
  <div className="flex-shrink-0 mx-3 px-5 py-2.5 bg-surface-alt/95 border border-brand-default rounded-xl shadow-md shadow-brand/10 flex items-center gap-2.5 select-none">
    {/* Dot colorido representando a "logo" da loja */}
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: dot, boxShadow: `0 0 6px ${dot}80` }}
    />
    <span className="text-sm font-semibold text-muted whitespace-nowrap">{name}</span>
  </div>
);

// ─── Componente principal ───────────────────────────────────────────────────
export const StoresMarquee: React.FC = () => {
  return (
    <section className="py-14 sm:py-16 bg-gradient-to-b from-purple-soft/48 via-purple-soft/56 to-purple-soft/52 overflow-hidden">

      {/* ── Keyframes injetados inline (sem depender de tailwind.config) ── */}
      <style>{`
        @keyframes marquee-ltr {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-rtl {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        .marquee-row {
          display: flex;
          flex-nowrap: nowrap;
          width: max-content;
        }

        .marquee-row--ltr {
          animation: marquee-ltr 28s linear infinite;
        }
        .marquee-row--rtl {
          animation: marquee-rtl 32s linear infinite;
        }

        /* Pausa ao passar o mouse em qualquer trilho */
        .marquee-viewport:hover .marquee-row--ltr,
        .marquee-viewport:hover .marquee-row--rtl {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── Label ─────────────────────────────────────────────────────── */}
      <AnimateOnScroll className="max-w-7xl mx-auto px-4 mb-8">
        <p className="text-xs font-semibold text-muted uppercase tracking-widest text-center">
          Monitorando preços nas principais lojas do Brasil
        </p>
      </AnimateOnScroll>

      {/* ── Viewport com fade nas bordas ──────────────────────────────── */}
      <div className="marquee-viewport relative flex flex-col gap-3">

        {/* Fade esquerda / direita */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-base to-transparent z-10 pointer-events-none" />

        {/* ── Linha 1: esquerda → direita ─────────────────────────── */}
        <div className="overflow-hidden">
          <div className="marquee-row marquee-row--ltr">
            {/* Dois sets idênticos = loop sem corte */}
            {[...ROW_A, ...ROW_A, ...ROW_A, ...ROW_A].map((store, i) => (
              <StoreCard key={`a-${i}`} {...store} />
            ))}
          </div>
        </div>

        {/* ── Linha 2: direita → esquerda ─────────────────────────── */}
        <div className="overflow-hidden">
          <div className="marquee-row marquee-row--rtl">
            {[...ROW_B, ...ROW_B, ...ROW_B, ...ROW_B].map((store, i) => (
              <StoreCard key={`b-${i}`} {...store} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Contagem de lojas ─────────────────────────────────────────── */}
      <AnimateOnScroll className="max-w-7xl mx-auto px-4 mt-8">
        <p className="text-xs text-muted/60 text-center">
          3 lojas integradas · novos parceiros em breve
        </p>
      </AnimateOnScroll>

    </section>
  );
};