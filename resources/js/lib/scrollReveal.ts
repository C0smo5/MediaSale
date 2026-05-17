type RevealCallback = () => void;

let sharedObserver: IntersectionObserver | null = null;
let observerThreshold = 0.1;
const callbacks = new WeakMap<Element, RevealCallback>();

function getObserver(threshold = 0.1): IntersectionObserver {
  if (!sharedObserver || observerThreshold !== threshold) {
    sharedObserver?.disconnect();
    observerThreshold = threshold;
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target;
          const cb = callbacks.get(el);

          if (cb) {
            requestAnimationFrame(cb);
          }

          sharedObserver?.unobserve(el);
          callbacks.delete(el);
        }
      },
      { threshold, rootMargin: '0px 0px 5% 0px' }
    );
  }

  return sharedObserver;
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.98 && rect.bottom > 0;
}

export function observeScrollReveal(
  el: HTMLElement,
  onReveal: RevealCallback,
  threshold = 0.1
): () => void {
  if (isInViewport(el)) {
    requestAnimationFrame(() => requestAnimationFrame(onReveal));
    return () => {};
  }

  callbacks.set(el, onReveal);
  getObserver(threshold).observe(el);

  const fallback = window.setTimeout(onReveal, 3500);

  return () => {
    clearTimeout(fallback);
    callbacks.delete(el);
    sharedObserver?.unobserve(el);
  };
}
