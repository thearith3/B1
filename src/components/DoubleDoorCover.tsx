import React, { useEffect } from 'react';
import { WeddingData } from '../weddingData';

interface DoubleDoorCoverProps {
  data: WeddingData;
  isOpen: boolean;
  onOpen: () => void;
  guestNameOverride?: string;
  isMobileMode?: boolean;
}

// Royal Khmer Traditional Floral Corner Ornament (ក្បាច់ផ្កាភ្ញីមាស)
const KhmerFloralCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const transform =
    position === 'tr' ? 'scale(-1, 1)' :
    position === 'bl' ? 'scale(1, -1)' :
    position === 'br' ? 'scale(-1, -1)' : 'none';

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-12 h-12 sm:w-16 sm:h-16 text-[#FFE5A3] drop-shadow-md pointer-events-none"
      style={{ transform }}
    >
      <defs>
        <linearGradient id={`goldFlower-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2C6" />
          <stop offset="40%" stopColor="#E6C673" />
          <stop offset="75%" stopColor="#B38728" />
          <stop offset="100%" stopColor="#FFE7A0" />
        </linearGradient>
      </defs>

      {/* Outer corner floral scrolls */}
      <path
        d="M 4,4 L 38,4 C 30,10 22,20 18,34 C 16,24 10,16 4,14 Z"
        fill={`url(#goldFlower-${position})`}
        opacity="0.9"
      />
      <path
        d="M 4,4 L 4,38 C 10,30 20,22 34,18 C 24,16 16,10 14,4 Z"
        fill={`url(#goldFlower-${position})`}
        opacity="0.9"
      />

      {/* Center Blossom (ផ្កាភ្ញី) */}
      <circle cx="24" cy="24" r="4.5" fill="#FFF2C6" />
      {/* 4 Cardinal Petals */}
      <path d="M 24,14 C 22,18 22,20 24,22 C 26,20 26,18 24,14 Z" fill={`url(#goldFlower-${position})`} />
      <path d="M 24,34 C 22,30 22,28 24,26 C 26,28 26,30 24,34 Z" fill={`url(#goldFlower-${position})`} />
      <path d="M 14,24 C 18,22 20,22 22,24 C 20,26 18,26 14,24 Z" fill={`url(#goldFlower-${position})`} />
      <path d="M 34,24 C 30,22 28,22 26,24 C 28,26 30,26 34,24 Z" fill={`url(#goldFlower-${position})`} />

      {/* 4 Diagonal Petals */}
      <path d="M 17,17 C 20,19 21,21 21,22 C 20,21 18,20 17,17 Z" fill="#FFF7DC" />
      <path d="M 31,17 C 28,19 27,21 27,22 C 28,21 30,20 31,17 Z" fill="#FFF7DC" />
      <path d="M 17,31 C 20,29 21,27 21,26 C 20,27 18,28 17,31 Z" fill="#FFF7DC" />
      <path d="M 31,31 C 28,29 27,27 27,26 C 28,27 30,28 31,31 Z" fill="#FFF7DC" />

      {/* Ornate Flower Tendril Vines */}
      <path
        d="M 24,24 Q 52,26 62,12 Q 46,40 64,44 Q 44,52 42,62 Q 40,46 12,62 Q 26,52 24,24 Z"
        fill="none"
        stroke={`url(#goldFlower-${position})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="62" cy="12" r="2" fill="#FFF2C6" />
      <circle cx="64" cy="44" r="2" fill="#FFF2C6" />
      <circle cx="12" cy="62" r="2" fill="#FFF2C6" />
    </svg>
  );
};

// Edge Floral Vine (ក្បាច់ផ្កាគែមចំហៀង)
const EdgeFloralVine = ({ side }: { side: 'left' | 'right' }) => (
  <div
    className={`absolute top-1/4 bottom-1/4 ${
      side === 'left' ? 'left-1 sm:left-2' : 'right-1 sm:right-2'
    } flex flex-col justify-around items-center pointer-events-none opacity-80 z-20`}
  >
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex flex-col items-center gap-1">
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE5A3] drop-shadow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C11.5 5 9 7.5 6 8C9 8.5 11.5 11 12 14C12.5 11 15 8.5 18 8C15 7.5 12.5 5 12 2Z" />
          <path d="M12 14C11.6 16.5 9.5 18.5 7 19C9.5 19.5 11.6 21.5 12 24C12.4 21.5 14.5 19.5 17 19C14.5 18.5 12.4 16.5 12 14Z" opacity="0.6" />
        </svg>
        <span className="w-[1px] h-6 sm:h-10 bg-gradient-to-b from-[#FFE5A3]/60 via-[#C5A059]/40 to-transparent" />
      </div>
    ))}
  </div>
);

export const DoubleDoorCover: React.FC<DoubleDoorCoverProps> = ({
  data,
  isOpen,
  onOpen,
  guestNameOverride,
  isMobileMode = true
}) => {
  // Lock body scrolling when cover is visible (កុំឲ្យឃើញកន្លែងអូស)
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpenClick = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isOpen) return;
    onOpen();
  };

  const guestText = guestNameOverride || data.guestPlaceholder;

  const coverBgMap: Record<string, string> = {
    crimson: 'from-[#3D101E] via-[#2A0713] to-[#1A030A]',
    gold: 'from-[#5C451F] via-[#433113] to-[#241907]',
    rose: 'from-[#4A1624] via-[#330D17] to-[#1F060D]',
    white: 'from-[#F5F2EB] via-[#E8E2D5] to-[#D4CBB8]',
    emerald: 'from-[#0F3826] via-[#092418] to-[#04120C]'
  };

  const selectedCover = coverBgMap[data.theme?.coverBgStyle || 'crimson'] || coverBgMap.crimson;
  const customCoverImage = data.theme?.coverCustomBgImage;

  return (
    <div
      onClick={handleOpenClick}
      className={`fixed inset-0 z-50 overflow-hidden cursor-pointer select-none touch-none transition-opacity duration-700 flex justify-center items-center ${
        isOpen ? 'pointer-events-none opacity-0 delay-500' : 'opacity-100 pointer-events-auto'
      } ${isMobileMode ? 'bg-[#0E0306]/90 backdrop-blur-md' : ''}`}
    >
      <div
        className={`relative w-full h-full flex ${
          isMobileMode ? 'max-w-[440px] shadow-[0_0_60px_rgba(0,0,0,0.85)] border-x border-[#C5A059]/40' : ''
        } ${isOpen ? 'doors-open' : ''}`}
      >
        {/* ================= LEFT DOOR ================= */}
        <div
          className={`door-panel-left relative w-1/2 h-full bg-gradient-to-br ${selectedCover} border-r border-r-[#C5A059] sm:border-r-2 flex flex-col justify-between p-3 sm:p-6 shadow-2xl overflow-hidden`}
        >
          {/* Seamless full-photo left half */}
          {customCoverImage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={customCoverImage}
                alt="Cover Groom Side"
                className="absolute top-0 left-0 w-[200%] h-full object-cover max-w-none"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          )}

          {/* Traditional subtle damask pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#FFE5A3 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Golden Outer Border Frame */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bottom-2 sm:bottom-4 right-1 sm:right-2 border border-[#C5A059]/40 pointer-events-none" />

          {/* Khmer Floral Corners (ផ្កាគៀនលើ & ផ្កាគៀនក្រោម) */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 pointer-events-none">
            <KhmerFloralCorner position="tl" />
          </div>
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20 pointer-events-none">
            <KhmerFloralCorner position="bl" />
          </div>

          {/* Edge Floral Vine (ក្បាច់ផ្កាចំហៀងឆ្វេង) */}
          <EdgeFloralVine side="left" />

          {/* Top Left Tag */}
          <div className="relative z-10 pt-2 sm:pt-3 pl-8 sm:pl-12">
            <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-[#FFE5A3] font-cinzel drop-shadow-md block truncate">
              Royal Wedding
            </span>
          </div>

          {/* Spacer */}
          <div className="my-auto" />

          {/* Groom's Name Badge - Absolute positioned for 100% horizontal alignment with Bride */}
          <div className="absolute bottom-[84px] sm:bottom-[100px] left-2 right-1.5 sm:left-5 sm:right-3.5 h-[68px] sm:h-[76px] z-20 flex flex-col justify-center">
            <div className="relative h-full flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-black/60 backdrop-blur-xs border border-[#C5A059]/70 shadow-xl text-center">
              {/* Corner floral blossom */}
              <div className="absolute top-1 left-1.5 flex items-center text-[#FFE5A3]/80">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                </svg>
              </div>

              <span className="text-[9px] sm:text-xs text-[#FFE5A3] font-kantumruy font-medium block leading-none mb-1">
                កូនប្រុស
              </span>
              <h2 className="font-moul text-[10px] sm:text-xs text-white drop-shadow leading-normal whitespace-nowrap px-0.5">
                {data.groomNameKhmer}
              </h2>
              <p className="font-cinzel text-[8px] sm:text-[9.5px] text-[#FFE5A3]/90 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mt-0.5 w-full px-1">
                {data.groomNameLatin}
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT DOOR ================= */}
        <div
          className={`door-panel-right relative w-1/2 h-full bg-gradient-to-bl ${selectedCover} border-l border-l-[#C5A059] sm:border-l-2 flex flex-col justify-between p-3 sm:p-6 shadow-2xl overflow-hidden`}
        >
          {/* Seamless full-photo right half */}
          {customCoverImage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={customCoverImage}
                alt="Cover Bride Side"
                className="absolute top-0 right-0 w-[200%] h-full object-cover max-w-none"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          )}

          {/* Traditional subtle damask pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#FFE5A3 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Golden Outer Border Frame */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bottom-2 sm:bottom-4 left-1 sm:left-2 border border-[#C5A059]/40 pointer-events-none" />

          {/* Khmer Floral Corners (ផ្កាគៀនលើ & ផ្កាគៀនក្រោម) */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 pointer-events-none">
            <KhmerFloralCorner position="tr" />
          </div>
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-20 pointer-events-none">
            <KhmerFloralCorner position="br" />
          </div>

          {/* Edge Floral Vine (ក្បាច់ផ្កាចំហៀងស្តាំ) */}
          <EdgeFloralVine side="right" />

          {/* Top Right Date Tag */}
          <div className="relative z-10 pt-2 sm:pt-3 text-right pr-8 sm:pr-12">
            <span className="text-[9px] sm:text-[11px] text-[#FFE5A3] font-kantumruy drop-shadow-md block truncate">
              {data.solarDate.split(' ')[0]} {data.solarDate.split(' ')[1]}
            </span>
          </div>

          {/* Spacer */}
          <div className="my-auto" />

          {/* Bride's Name Badge - Absolute positioned at the EXACT same height and vertical coordinates */}
          <div className="absolute bottom-[84px] sm:bottom-[100px] left-1.5 right-2 sm:left-3.5 sm:right-5 h-[68px] sm:h-[76px] z-20 flex flex-col justify-center">
            <div className="relative h-full flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-black/60 backdrop-blur-xs border border-[#C5A059]/70 shadow-xl text-center">
              {/* Corner floral blossom */}
              <div className="absolute top-1 right-1.5 flex items-center text-[#FFE5A3]/80">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                </svg>
              </div>

              <span className="text-[9px] sm:text-xs text-[#FFE5A3] font-kantumruy font-medium block leading-none mb-1">
                កូនស្រី
              </span>
              <h2 className="font-moul text-[10px] sm:text-xs text-white drop-shadow leading-normal whitespace-nowrap px-0.5">
                {data.brideNameKhmer}
              </h2>
              <p className="font-cinzel text-[8px] sm:text-[9.5px] text-[#FFE5A3]/90 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mt-0.5 w-full px-1">
                {data.brideNameLatin}
              </p>
            </div>
          </div>
        </div>

        {/* ================= CENTER OVERLAY ================= */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-between py-5 sm:py-8 px-3 pointer-events-none transition-transform duration-500 ${
            isOpen ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Top Auspicious Khmer Title Badge with Golden Floral Wings */}
          <div className="text-center pt-2 max-w-sm px-2">
            <div className="inline-block px-4 py-2 rounded-2xl bg-black/45 backdrop-blur-xs border border-[#FFE5A3]/40 shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-0.5">
                {/* Left Floral Sprig */}
                <svg className="w-3.5 h-3.5 text-[#FFE5A3]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" />
                </svg>
                <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#FFE5A3]" />
                <span className="text-[10px] font-cinzel text-[#FFE5A3] uppercase tracking-widest">
                  Wedding
                </span>
                <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#FFE5A3]" />
                {/* Right Floral Sprig */}
                <svg className="w-3.5 h-3.5 text-[#FFE5A3]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" />
                </svg>
              </div>

              <h1 className="font-moul text-[11px] sm:text-base text-[#FFE5A3] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] tracking-wide whitespace-nowrap">
                {data.title}
              </h1>
            </div>
          </div>

          {/* Center Circular Gold Medallion Button */}
          <div className="relative my-auto pointer-events-auto">
            {/* Outer pulsating concentric golden aura rings */}
            <div className="absolute -inset-4 sm:-inset-5 rounded-full bg-[#C5A059]/30 blur-lg animate-pulse" />
            <div className="absolute -inset-2 sm:-inset-3 rounded-full border-2 border-[#FFE5A3]/50 animate-ping opacity-30 pointer-events-none" />

            <button
              onClick={handleOpenClick}
              onTouchStart={handleOpenClick}
              disabled={isOpen}
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1.5 shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#C5A059]/60 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #FFE7A0 0%, #C5A059 45%, #7C5413 85%, #EAC671 100%)'
              }}
              title="ចុចដើម្បីបើកលិខិត"
            >
              {/* Inner ring */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#3D101E] to-[#1E040B] p-2 flex flex-col items-center justify-center text-center border-2 border-[#FFE5A3]/70 group-hover:from-[#4D1426] transition-colors shadow-inner">
                {/* Traditional lotus / ring icon */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 text-[#FFE5A3] group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="9" cy="12" r="5" />
                    <circle cx="15" cy="12" r="5" />
                  </svg>
                </div>

                <span className="font-moul text-[11px] sm:text-sm text-[#FFE5A3] group-hover:text-white transition-colors drop-shadow tracking-wide">
                  បើកលិខិត
                </span>

                <span className="font-kantumruy text-[8px] sm:text-[10px] font-semibold text-[#FFE5A3]/90 mt-0.5">
                  ចុចទីនេះ
                </span>
              </div>
            </button>
          </div>

          {/* Bottom Guest Greeting Box */}
          <div className="text-center max-w-[280px] sm:max-w-md px-3 sm:px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm border border-[#C5A059]/50 pointer-events-auto shadow-xl mb-1 sm:mb-2">
            <p className="text-[10px] sm:text-[11px] text-[#FFE5A3] font-kantumruy font-light mb-0.5">
              {data.greetingTitle}
            </p>
            <p className="font-kantumruy font-medium text-xs sm:text-sm text-[#FFF7F8] drop-shadow truncate">
              {guestText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
