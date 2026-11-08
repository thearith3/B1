import React, { useEffect, useState } from 'react';
import { WeddingData } from '../weddingData';
import { Heart, Calendar, MapPin, Clock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface HeaderAndCoupleProps {
  data: WeddingData;
  onOpenDoorsAgain: () => void;
}

export const HeaderAndCouple: React.FC<HeaderAndCoupleProps> = ({ data, onOpenDoorsAgain }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(data.calendarTargetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data.calendarTargetDate]);

  return (
    <section className="relative pt-8 sm:pt-12 pb-10 px-4 sm:px-6 text-center max-w-4xl mx-auto">
      {/* Subtle top re-close cover button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={onOpenDoorsAgain}
          className="text-xs font-kantumruy text-[#C5A059] hover:text-[#996515] inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-white/60 hover:bg-white transition-all shadow-xs cursor-pointer"
        >
          <span>ទ្វារបើកលិខិត (បិទទ្វារវិញ)</span>
        </button>
      </div>

      {/* Traditional Ornate Header Arch & Title with Smooth Slide Down */}
      <ScrollReveal direction="down" delayMs={100} durationMs={800}>
        <div className="inline-block mx-auto mb-2">
          <div className="flex items-center justify-center gap-2.5">
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#FFE7A0] to-[#C5A059] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#FFF7F8]/90 rounded-full flex items-center justify-center text-[#B38A38]">
                <Heart className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              </div>
            </div>
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* Main Wedding Title (Smaller, refined, luxury) */}
        <div className="inline-block px-4 py-1.5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#C5A059]/40 shadow-xs mb-1">
          <h1 className="font-moul text-base sm:text-xl text-[#3D101E] tracking-normal text-balance shimmer-gold-text">
            {data.title}
          </h1>
        </div>

        <p className="font-cinzel text-[9.5px] sm:text-xs text-[#C5A059] tracking-widest uppercase mb-4 font-bold drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
          Traditional Royal Khmer Wedding
        </p>
      </ScrollReveal>

      {/* Formal Blessing Statement with Animated Running Text Reveal */}
      <ScrollReveal direction="up" delayMs={250} durationMs={750}>
        <div className="max-w-2xl mx-auto p-3 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#C5A059]/35 shadow-sm mb-6 text-slate-700 leading-relaxed font-kantumruy text-[11px] sm:text-xs">
          <TextReveal
            text={data.invitationBlessing}
            speedMs={20}
            delayMs={350}
            triggerOnVisible={true}
          />
        </div>
      </ScrollReveal>

      {/* 2-Column Parents Section - Side-by-Side on all screens */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-5 text-center">
        {/* Groom's Parents */}
        <ScrollReveal direction="left" delayMs={350} durationMs={700}>
          <div className="p-2 sm:p-3.5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#C5A059]/30 shadow-xs relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
            <span className="font-cinzel text-[7.5px] sm:text-[10px] uppercase tracking-wider text-[#C5A059] block mb-0.5">
              Groom&apos;s Parents
            </span>
            <h3 className="font-moul text-[9px] sm:text-xs text-[#3D101E] mb-1 whitespace-nowrap">
              មាតាបិតាខាងប្រុស
            </h3>
            <div className="space-y-0.5 font-kantumruy text-[9px] sm:text-[11px] text-slate-800">
              <p className="font-medium whitespace-nowrap truncate">{data.groomFatherName}</p>
              <p className="font-medium whitespace-nowrap truncate">{data.groomMotherName}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Bride's Parents */}
        <ScrollReveal direction="right" delayMs={350} durationMs={700}>
          <div className="p-2 sm:p-3.5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#C5A059]/30 shadow-xs relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
            <span className="font-cinzel text-[7.5px] sm:text-[10px] uppercase tracking-wider text-[#C5A059] block mb-0.5">
              Bride&apos;s Parents
            </span>
            <h3 className="font-moul text-[9px] sm:text-xs text-[#3D101E] mb-1 whitespace-nowrap">
              មាតាបិតាខាងស្រី
            </h3>
            <div className="space-y-0.5 font-kantumruy text-[9px] sm:text-[11px] text-slate-800">
              <p className="font-medium whitespace-nowrap truncate">{data.brideFatherName}</p>
              <p className="font-medium whitespace-nowrap truncate">{data.brideMotherName}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Grand Couple Presentation - ALWAYS Side-by-Side (ទន្ទឹមគ្នា) */}
      <ScrollReveal direction="up" delayMs={450} durationMs={750}>
        <div className="relative py-3.5 px-2 sm:py-5 sm:px-5 rounded-3xl bg-white/75 backdrop-blur-md border-2 border-[#C5A059]/40 shadow-xl max-w-3xl mx-auto mb-6">
          {/* Decorative corner accents */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 sm:w-5 sm:h-5 border-t-2 border-l-2 border-[#C5A059]" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 sm:w-5 sm:h-5 border-t-2 border-r-2 border-[#C5A059]" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 sm:w-5 sm:h-5 border-b-2 border-l-2 border-[#C5A059]" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 sm:w-5 sm:h-5 border-b-2 border-r-2 border-[#C5A059]" />

          {/* Strict Side-by-Side Grid layout: Groom (col 1) | Central & (col 2) | Bride (col 3) */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-3">
            {/* Groom (ខាងប្រុស) */}
            <div className="text-center px-0.5">
              <span className="font-kantumruy text-[8px] sm:text-[10px] text-[#C5A059] font-medium block mb-0.5 whitespace-nowrap">
                កូនប្រុសនាម
              </span>
              <h2 className="font-moul text-[10.5px] sm:text-base text-[#3D101E] mb-0.5 leading-snug tracking-normal whitespace-nowrap">
                {data.groomNameKhmer}
              </h2>
              <p className="font-cinzel text-[7.5px] sm:text-[10px] text-slate-600 font-semibold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                {data.groomNameLatin}
              </p>
            </div>

            {/* Central Golden Joiner */}
            <div className="flex flex-col items-center justify-center shrink-0 px-0.5">
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#FFE7A0] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#3D101E] flex flex-col items-center justify-center text-[#FFE5A3]">
                  <span className="font-moul text-[8px] sm:text-[10px]">&amp;</span>
                </div>
              </div>
              <span className="font-kantumruy text-[6.5px] sm:text-[9px] text-[#C5A059] mt-0.5 font-medium whitespace-nowrap">
                ភ្ជាប់និស្ស័យ
              </span>
            </div>

            {/* Bride (ខាងស្រី) */}
            <div className="text-center px-0.5">
              <span className="font-kantumruy text-[8px] sm:text-[10px] text-[#C5A059] font-medium block mb-0.5 whitespace-nowrap">
                កូនស្រីនាម
              </span>
              <h2 className="font-moul text-[10.5px] sm:text-base text-[#3D101E] mb-0.5 leading-snug tracking-normal whitespace-nowrap">
                {data.brideNameKhmer}
              </h2>
              <p className="font-cinzel text-[7.5px] sm:text-[10px] text-slate-600 font-semibold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                {data.brideNameLatin}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Date & Countdown Box */}
      <ScrollReveal direction="up" delayMs={550} durationMs={750}>
        <div className="max-w-2xl mx-auto rounded-3xl bg-white/75 backdrop-blur-md border border-[#C5A059]/40 p-4 sm:p-6 shadow-lg">
          <div className="inline-flex items-center justify-center gap-1.5 mb-1.5 text-[#C5A059]">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-cinzel text-[9px] sm:text-[11px] uppercase tracking-widest font-semibold">
              The Auspicious Date
            </span>
          </div>

          <h3 className="font-moul text-sm sm:text-base text-[#3D101E] mb-1">
            {data.solarDate}
          </h3>

          <p className="font-kantumruy text-[10.5px] sm:text-xs text-slate-600 mb-4 font-medium">
            ត្រូវនឹង {data.lunarDate}
          </p>

          {/* Countdown Clock Grid (Refined smaller text) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
            <div className="p-1.5 sm:p-2 rounded-xl bg-white/70 border border-[#C5A059]/30 text-center shadow-xs">
              <span className="font-moul text-sm sm:text-lg text-[#3D101E] block">
                {timeLeft.days}
              </span>
              <span className="font-kantumruy text-[8.5px] sm:text-[10px] text-slate-500 uppercase tracking-wider">
                ថ្ងៃ
              </span>
            </div>

            <div className="p-1.5 sm:p-2 rounded-xl bg-white/70 border border-[#C5A059]/30 text-center shadow-xs">
              <span className="font-moul text-sm sm:text-lg text-[#3D101E] block">
                {timeLeft.hours}
              </span>
              <span className="font-kantumruy text-[8.5px] sm:text-[10px] text-slate-500 uppercase tracking-wider">
                ម៉ោង
              </span>
            </div>

            <div className="p-1.5 sm:p-2 rounded-xl bg-white/70 border border-[#C5A059]/30 text-center shadow-xs">
              <span className="font-moul text-sm sm:text-lg text-[#3D101E] block">
                {timeLeft.minutes}
              </span>
              <span className="font-kantumruy text-[8.5px] sm:text-[10px] text-slate-500 uppercase tracking-wider">
                នាទី
              </span>
            </div>

            <div className="p-1.5 sm:p-2 rounded-xl bg-white/70 border border-[#C5A059]/30 text-center shadow-xs">
              <span className="font-moul text-sm sm:text-lg text-[#C5A059] block animate-pulse">
                {timeLeft.seconds}
              </span>
              <span className="font-kantumruy text-[8.5px] sm:text-[10px] text-slate-500 uppercase tracking-wider">
                វិនាទី
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
