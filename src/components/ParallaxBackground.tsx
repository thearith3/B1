import React, { useEffect, useRef } from 'react';

interface ParallaxBackgroundProps {
  videoSrc?: string;
  imageSrc?: string;
  overlayOpacity?: number;
  active?: boolean;
  isMobileMode?: boolean;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  videoSrc = '/assets/aistudio/prewedding_bg_video.mp4',
  imageSrc = '/assets/aistudio/IMG_9276_82dea8b5.JPG',
  overlayOpacity = 0.16,
  active = true,
  isMobileMode = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Robust video playback: ensure muted, autoPlay, and retry on user interaction / door open
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    const attemptPlay = () => {
      if (video.paused) {
        const p = video.play();
        if (p !== undefined) {
          p.catch((err) => {
            console.warn('Background video play waiting for user gesture:', err);
          });
        }
      }
    };

    attemptPlay();

    // Browser autoplay policy: on first touch/click/scroll anywhere, ensure video plays
    const handleUserInteraction = () => {
      attemptPlay();
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };
  }, [videoSrc, active]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden flex justify-center bg-[#120409]"
      aria-hidden="true"
    >
      {/* 
        Phone-frame scoped container:
        Matches the 440px max-width on desktop simulator or full screen on mobile.
        100% Fixed in viewport so when user scrolls, the video NEVER moves! (រក្សាវិដេអូនៅដដែល)
      */}
      <div className={`w-full h-full relative overflow-hidden ${isMobileMode ? 'max-w-[440px]' : ''}`}>
        {/* High-speed fast-start background video */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          poster={imageSrc}
          onCanPlay={() => {
            videoRef.current?.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover object-center will-change-transform brightness-[0.96] contrast-[1.03]"
        >
          <source src={videoSrc} type="video/mp4" />
          <source src="/assets/aistudio/prewedding_bg_video.mp4" type="video/mp4" />
          <source src="/assets/aistudio/1106__2__e348991e.mp4" type="video/mp4" />
        </video>

        {/* Delicate dark & gold vignette for cinematic wedding presentation */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`
          }}
        />

        {/* Top and Bottom soft traditional royal crimson-maroon vignetting */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#24060E]/40 via-transparent to-[#24060E]/50 pointer-events-none" />

        {/* Subtle traditional royal Khmer watermark grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Soft perimeter gold ambient glow */}
        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(197,160,89,0.25)] pointer-events-none" />
      </div>
    </div>
  );
};
