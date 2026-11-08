import React, { useEffect, useRef, useState } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delayMs?: number;
  speedMs?: number;
  triggerOnVisible?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delayMs = 300,
  speedMs = 28,
  triggerOnVisible = true
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!triggerOnVisible) {
      const timer = setTimeout(() => {
        setIsRevealing(true);
      }, delayMs);
      return () => clearTimeout(timer);
    }

    if (!('IntersectionObserver' in window)) {
      setDisplayedLength(text.length);
      setIsComplete(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            setIsRevealing(true);
          }, delayMs);
          observer.unobserve(entry.target);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delayMs, text.length, triggerOnVisible]);

  useEffect(() => {
    if (!isRevealing || isComplete) return;

    if (displayedLength >= text.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      // Advance by 1 to 2 characters for fluid Khmer text typing speed
      setDisplayedLength((prev) => {
        const next = Math.min(text.length, prev + 2);
        if (next >= text.length) {
          setIsComplete(true);
        }
        return next;
      });
    }, speedMs);

    return () => clearTimeout(timer);
  }, [isRevealing, displayedLength, text.length, speedMs, isComplete]);

  // If user clicks, reveal immediately
  const handleQuickReveal = () => {
    setDisplayedLength(text.length);
    setIsComplete(true);
  };

  return (
    <div
      ref={ref}
      onClick={handleQuickReveal}
      className={`cursor-pointer select-text ${className}`}
      title="ចុចដើម្បីបង្ហាញអត្ថបទទាំងអស់ភ្លាមៗ"
    >
      <span>{text.slice(0, displayedLength)}</span>
      {!isComplete && isRevealing && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-[#C5A059] animate-pulse align-middle rounded-full shadow-xs" />
      )}
    </div>
  );
};
