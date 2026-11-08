import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'none';
  threshold?: number;
  triggerOnce?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  durationMs = 700,
  direction = 'up',
  threshold = 0.1,
  triggerOnce = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100 filter-none';
    }

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-7';
      case 'down':
        return 'opacity-0 -translate-y-7';
      case 'left':
        return 'opacity-0 -translate-x-7';
      case 'right':
        return 'opacity-0 translate-x-7';
      case 'zoom':
        return 'opacity-0 scale-95';
      case 'none':
        return 'opacity-0';
      default:
        return 'opacity-0 translate-y-7';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delayMs}ms`,
        willChange: 'transform, opacity'
      }}
      className={`transition-all ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
};
