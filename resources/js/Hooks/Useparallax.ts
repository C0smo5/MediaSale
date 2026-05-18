import { useState, useEffect, useRef } from 'react';

/**
 * useParallax — retorna um offset baseado no scroll da página.
 *
 * @param speed  Fator de velocidade (0.1 = lento, 0.5 = médio, 1 = 1:1 com scroll)
 *               Valores negativos invertem a direção.
 * @param clamp  Limite máximo de deslocamento em pixels (opcional)
 *
 * @example
 * const y = useParallax(0.25);
 * <div style={{ transform: `translateY(${y}px)` }} />
 */
export function useParallax(speed: number = 0.3, clamp?: number): number {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return; // throttle via rAF
      rafRef.current = requestAnimationFrame(() => {
        let raw = window.scrollY * speed;
        if (clamp !== undefined) {
          raw = Math.max(-clamp, Math.min(clamp, raw));
        }
        setOffset(raw);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, clamp]);

  return offset;
}

/**
 * useElementParallax — parallax relativo ao elemento na viewport.
 * Ideal para seções que não estão no topo da página.
 *
 * @param speed  Fator de velocidade
 *
 * @example
 * const { ref, offset } = useElementParallax(0.2);
 * <section ref={ref}>
 *   <div style={{ transform: `translateY(${offset}px)` }} />
 * </section>
 */
export function useElementParallax(speed: number = 0.2) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        // centro do elemento relativo ao centro da viewport
        const relativePos = rect.top + rect.height / 2 - viewH / 2;
        setOffset(relativePos * speed);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // calcular posição inicial
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  return { ref, offset };
}