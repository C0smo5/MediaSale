import React from 'react';
import { useScrollAnimation } from '@/Hooks/useScrollAnimation';

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const AnimateOnScroll: React.FC<Props> = ({ children, delay = 0, className = '' }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};