'use client';

import { useEffect, useRef, useState } from 'react';

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export default function ScrollReveal({ children, className = '', delayMs = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        'w-full transition-all duration-700 ease-out will-change-transform',
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      ].join(' ')}
      style={revealed && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

