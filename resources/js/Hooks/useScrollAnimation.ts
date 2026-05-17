import { useState, useLayoutEffect, useRef } from 'react';
import { observeScrollReveal } from '@/lib/scrollReveal';

interface ScrollAnimationOptions {
  threshold?: number;
}

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    return observeScrollReveal(el, () => setIsVisible(true), threshold);
  }, [threshold]);

  return { ref, isVisible };
}
