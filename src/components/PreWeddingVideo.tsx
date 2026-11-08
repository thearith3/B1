import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, Film, Sparkles } from 'lucide-react';

interface PreWeddingVideoProps {
  videoUrl?: string;
  groomName?: string;
  brideName?: string;
}

export const PreWeddingVideo: React.FC<PreWeddingVideoProps> = ({
  videoUrl = '/assets/aistudio/prewedding_bg_video.mp4',
  groomName = 'ប៊ុន ចាន់ដារាឫទ្ធិ',
  brideName = 'សេង បុប្ផា'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if ((videoRef.current as any).webkitRequestFullscreen) {
      (videoRef.current as any).webkitRequestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleContainerInteraction = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-6 relative">
      {/* Ornate Header */}
      <div className="text-center mb-5 sm:mb-6">
        <div className="inline-flex items-center justify-center gap-1.5 mb-1 text-[#C5A059]">
          <Film className="w-3.5 h-3.5" />
          <span className="font-cinzel text-[9px] sm:text-[11px] uppercase tracking-widest font-semibold">
            Pre-Wedding Love Story
          </span>
          <Sparkles className="w-3 h-3 text-[#FFE7A0]" />
        </div>

        <h2 className="font-moul text-base sm:text-lg text-[#3D101E] tracking-normal mb-1">
          វីដេអូអនុស្សាវរីយ៍
        </h2>

        <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600 max-w-md mx-auto">
          ទិដ្ឋភាពអនុស្សាវរីយ៍ដ៏ផ្អែមល្ហែមរវាង {groomName} &amp; {brideName}
        </p>
      </div>

      {/* Video Player Outer Card Frame */}
      <div className="max-w-[340px] sm:max-w-[380px] mx-auto relative group">
        {/* Golden outer glow & traditional border */}
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#C5A059] via-[#FFE7A0] to-[#B38A38] rounded-[30px] opacity-75 blur-xs group-hover:opacity-100 transition-opacity" />

        {/* Video Card Container */}
        <div
          onClick={handleContainerInteraction}
          className="relative rounded-[26px] overflow-hidden bg-black border-2 border-[#FFE7A0]/70 shadow-2xl aspect-[9/16] flex items-center justify-center cursor-pointer select-none"
        >
          {/* Corner Khmer Floral Accents */}
          <div className="absolute top-2 left-2 z-20 pointer-events-none opacity-85">
            <svg className="w-5 h-5 text-[#FFE5A3]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2C6 2 9 5 9 9C9 5 12 2 16 2C12 2 9 5 9 9C9 13 12 16 16 16C12 16 9 13 9 9C9 13 6 16 2 16C6 16 9 13 9 9C9 5 6 2 2 2Z" />
            </svg>
          </div>
          <div className="absolute top-2 right-2 z-20 pointer-events-none opacity-85">
            <svg className="w-5 h-5 text-[#FFE5A3] rotate-90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2C6 2 9 5 9 9C9 5 12 2 16 2C12 2 9 5 9 9C9 13 12 16 16 16C12 16 9 13 9 9C9 13 6 16 2 16C6 16 9 13 9 9C9 5 6 2 2 2Z" />
            </svg>
          </div>
          <div className="absolute bottom-10 left-2 z-20 pointer-events-none opacity-85">
            <svg className="w-5 h-5 text-[#FFE5A3] -rotate-90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2C6 2 9 5 9 9C9 5 12 2 16 2C12 2 9 5 9 9C9 13 12 16 16 16C12 16 9 13 9 9C9 13 6 16 2 16C6 16 9 13 9 9C9 5 6 2 2 2Z" />
            </svg>
          </div>
          <div className="absolute bottom-10 right-2 z-20 pointer-events-none opacity-85">
            <svg className="w-5 h-5 text-[#FFE5A3] rotate-180" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 2C6 2 9 5 9 9C9 5 12 2 16 2C12 2 9 5 9 9C9 13 12 16 16 16C12 16 9 13 9 9C9 13 6 16 2 16C6 16 9 13 9 9C9 5 6 2 2 2Z" />
            </svg>
          </div>

          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={videoUrl}
            poster="/assets/aistudio/IMG_9276_82dea8b5.JPG"
            playsInline
            muted={isMuted}
            preload="metadata"
            loop
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Large Center Play Button Overlay (when paused or controls active) */}
          {(!isPlaying || showControls) && (
            <div
              onClick={togglePlay}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                !isPlaying ? 'bg-black/40 backdrop-blur-[1px]' : 'bg-transparent'
              }`}
            >
              {!isPlaying && (
                <button
                  type="button"
                  aria-label="Play Video"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#FFE7A0] to-[#C5A059] p-1 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                >
                  <div className="w-full h-full rounded-full bg-[#3D101E] flex items-center justify-center text-[#FFE5A3] pl-1 border border-[#FFE7A0]/70">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current" />
                  </div>
                </button>
              )}
            </div>
          )}

          {/* Top Bar with Title & Sound / Fullscreen Badges */}
          <div
            className={`absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#C5A059]/40">
              <span className="w-2 h-2 rounded-full bg-[#FFE7A0] animate-ping" />
              <span className="text-[10px] font-cinzel text-[#FFE5A3] tracking-wider uppercase font-semibold">
                Angkor Wat Highlights
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Mute/Unmute */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs border border-[#C5A059]/50 flex items-center justify-center text-[#FFE5A3] hover:bg-black/80 transition-colors"
                title={isMuted ? 'បើកសំឡេង' : 'បិទសំឡេង'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-300" />
                )}
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Fullscreen"
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs border border-[#C5A059]/50 flex items-center justify-center text-[#FFE5A3] hover:bg-black/80 transition-colors"
                title="ពង្រីកពេញអេក្រង់"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Bar: Progress Track & Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-30 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Interactive Progress Bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer mb-2 relative group/track"
            >
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#FFE7A0] rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Row controls */}
            <div className="flex items-center justify-between text-[#FFE5A3]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current pl-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  aria-label="Restart Video"
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  title="ចាក់ឡើងវិញ"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                <span className="text-[10px] font-mono text-white/90">
                  {currentTime} / {duration}
                </span>
              </div>

              <span className="text-[10px] font-kantumruy text-[#FFE5A3]/90">
                {isMuted ? 'សំឡេង: បិទ' : 'សំឡេង: បើក'}
              </span>
            </div>
          </div>
        </div>

        {/* Caption below video */}
        <div className="mt-3 text-center px-2">
          <p className="font-kantumruy text-xs text-slate-600 italic">
            &ldquo;អនុស្សាវរីយ៍នៃសេចក្ដីស្រឡាញ់ដ៏ផ្អែមល្ហែម ក្រោមម្លប់នៃប្រាសាទអង្គរវត្តដ៏ពិសិដ្ឋ&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
