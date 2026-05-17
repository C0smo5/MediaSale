import React, { useLayoutEffect, useRef, useState } from 'react';
import { observeScrollReveal } from '@/lib/scrollReveal';

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Hero: anima na montagem sem esperar scroll */
  onMount?: boolean;
}

export const AnimateOnScroll: React.FC<Props> = ({
  children,
  delay = 0,
  className = '',
  onMount = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // onMount = hero section: dispara logo no carregamento sem esperar scroll
    if (onMount) {
      const t = window.setTimeout(() => setRevealed(true), delay);
      return () => clearTimeout(t);
    }

    return observeScrollReveal(el, () => setRevealed(true), 0.06);
  }, [onMount, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0px)' : 'translateY(28px)',
        transition: `opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};