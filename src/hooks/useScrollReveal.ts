import { useEffect } from 'react';

/**
 * Advanced Scroll Reveal Hook with continuous bi-directional animation replay.
 * Elements with '.reveal-init', '.scroll-reveal', '.scroll-card', '.scroll-heading', or '.scroll-image'
 * animate smoothly when scrolling down into view, transition smoothly when leaving,
 * and replay continuously whenever scrolling up or down again.
 */
export function useScrollReveal(dependencies: any[] = []) {
  useEffect(() => {
    // If user prefers reduced motion, make all elements immediately visible
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const selector = '.reveal-init, .scroll-reveal, .scroll-card, .scroll-heading, .scroll-image';
    const elements = document.querySelectorAll<HTMLElement>(selector);

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((el) => {
        el.classList.add('revealed', 'in-view');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Replay entrance animation when element scrolls into view
            entry.target.classList.add('revealed', 'in-view');
          } else {
            // Apply smooth exit transition when element scrolls out of view
            // (Allows replay on every upward and downward scroll direction)
            entry.target.classList.remove('revealed', 'in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}
