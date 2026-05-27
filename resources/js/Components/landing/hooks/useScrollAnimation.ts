import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(threshold: number = 0.12) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
}
