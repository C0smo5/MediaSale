import React from 'react';

export const StoresMarquee: React.FC = () => {
  const stores = ['Amazon', 'Mercado Livre', 'Magazine Luiza', 'Americanas', 'Casas Bahia', 'Submarino', 'Shopee', 'Shein'];
  const doubled = [...stores, ...stores];

  return (
    <section className="py-14 sm:py-16 bg-gradient-to-b from-purple-soft/48 via-purple-soft/56 to-purple-soft/52 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-widest text-center">Monitoramos estes canais e mais</p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-base to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee">
          {doubled.map((store, i) => (
        <div key={i} className="flex-shrink-0 mx-6 px-6 py-2.5 bg-surface-alt/95 border border-brand-default rounded-xl shadow-md shadow-brand/10">
              <span className="text-sm font-semibold text-muted whitespace-nowrap">{store}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};