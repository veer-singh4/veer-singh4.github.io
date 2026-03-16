// src/hooks/useReveal.js
import { useEffect, useRef } from 'react';

export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
          }
        });
      },
      { threshold: options.threshold || 0.12, rootMargin: options.rootMargin || '0px 0px -40px 0px' }
    );

    const targets = el.querySelectorAll('.reveal, .reveal-l, .reveal-r');
    targets.forEach((t) => observer.observe(t));

    // Also observe the container itself
    observer.observe(el);

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
}
