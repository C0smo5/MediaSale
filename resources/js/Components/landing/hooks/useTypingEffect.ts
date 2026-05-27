import { useEffect, useState } from 'react';

export function useTypingEffect(
    texts: string[],
    typeSpeed: number = 45,
    deleteSpeed: number = 25,
    pauseTime: number = 2200,
): string {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = texts[textIndex];
        let timer: ReturnType<typeof setTimeout>;

        if (!isDeleting && displayText === current) {
            timer = setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && displayText === '') {
            setIsDeleting(false);
            setTextIndex((index) => (index + 1) % texts.length);
        } else {
            const speed = isDeleting ? deleteSpeed : typeSpeed;
            timer = setTimeout(() => {
                setDisplayText((previous) => (
                    isDeleting
                        ? previous.slice(0, -1)
                        : current.slice(0, previous.length + 1)
                ));
            }, speed);
        }

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, textIndex, texts, typeSpeed, deleteSpeed, pauseTime]);

    return displayText;
}
