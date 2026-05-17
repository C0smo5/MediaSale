import { useState, useEffect } from 'react';

export function useTypingEffect(
  texts: string[],
  typeSpeed: number = 38,
  deleteSpeed: number = 22,
  pauseTime: number = 1800
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
      setTextIndex((i) => (i + 1) % texts.length);
    } else {
      const speed = isDeleting ? deleteSpeed : typeSpeed;
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex, texts, typeSpeed, deleteSpeed, pauseTime]);

  return displayText;
}
