import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  autoPlayTriggered: boolean;
  audioUrl?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  autoPlayTriggered,
  audioUrl = '/assets/aistudio/1108__1__dd18293f.MP3'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play audio safely
  const attemptPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = true;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log("Audio autoplay waiting for user interaction:", err);
        // Setup one-time document touch/click listener to start audio on first interaction
        const handleFirstInteraction = () => {
          if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });
      });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Triggered when doors open or user enters
  useEffect(() => {
    if (autoPlayTriggered && audioRef.current) {
      attemptPlay();
    }
  }, [autoPlayTriggered, audioUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseAudio();
    } else {
      attemptPlay();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <div className="fixed top-3 sm:top-4 right-3 sm:right-4 z-60 flex items-center gap-1.5 select-none pointer-events-auto">
      {/* Hidden Loop Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Main Music Toggle Pill */}
      <div className="relative group">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "ផ្អាកតន្ត្រី" : "ចាក់តន្ត្រី"}
          className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-[#3D101E]/95 border-[#C5A059] text-[#FFE5A3] shadow-[#C5A059]/25 ring-2 ring-[#C5A059]/30'
              : 'bg-white/95 border-slate-200 text-slate-700 hover:border-[#C5A059]'
          }`}
        >
          {/* Spinning Vinyl Record Icon */}
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border shadow-inner ${
              isPlaying
                ? 'border-[#FFE5A3] bg-gradient-to-tr from-[#3D101E] to-[#601930] animate-spin'
                : 'border-slate-300 bg-slate-100'
            }`}
            style={{ animationDuration: '3.5s' }}
          >
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#FFE5A3]' : 'bg-[#C5A059]'}`} />
          </div>

          <span className="text-[11px] sm:text-xs font-kantumruy font-semibold hidden sm:inline whitespace-nowrap">
            {isPlaying ? 'ភ្លេងមង្គលការ (កំពុងចាក់)' : 'ចាក់ភ្លេង'}
          </span>

          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-[#FFE5A3]" />
          ) : (
            <Play className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
          )}
        </button>

        {/* Dancing Audio Wave Bars */}
        {isPlaying && (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-2.5 px-1 pointer-events-none">
            <span className="w-0.5 h-2 bg-[#C5A059] rounded animate-pulse" />
            <span className="w-0.5 h-3.5 bg-[#FFE5A3] rounded animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-[#C5A059] rounded animate-pulse delay-150" />
            <span className="w-0.5 h-3 bg-[#FFE5A3] rounded animate-pulse delay-100" />
          </div>
        )}
      </div>

      {/* Mute / Unmute Button */}
      <button
        type="button"
        onClick={toggleMute}
        title={isMuted ? "បើកសំឡេង" : "បិទសំឡេង"}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 border border-[#C5A059]/40 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-[#C5A059] hover:border-[#C5A059] transition-all shadow-md cursor-pointer active:scale-90"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-red-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-[#C5A059]" />
        )}
      </button>
    </div>
  );
};
