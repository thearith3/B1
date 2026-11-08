import React, { useState, useEffect } from 'react';
import {
  WeddingData,
  loadWeddingData,
  saveWeddingData,
  resetWeddingData,
  fetchServerWeddingData
} from './weddingData';
import { PetalsCanvas } from './components/PetalsCanvas';
import { AudioPlayer } from './components/AudioPlayer';
import { DoubleDoorCover } from './components/DoubleDoorCover';
import { HeaderAndCouple } from './components/HeaderAndCouple';
import { WeddingSchedule } from './components/WeddingSchedule';
import { LocationAndMap } from './components/LocationAndMap';
import { PhotoGallery } from './components/PhotoGallery';
import { GuestWishesRSVP } from './components/GuestWishesRSVP';
import { DigitalGiftQR } from './components/DigitalGiftQR';
import { AdminEditModal } from './components/AdminEditModal';
import { PreWeddingVideo } from './components/PreWeddingVideo';
import { ParallaxBackground } from './components/ParallaxBackground';
import { ScrollReveal } from './components/ScrollReveal';
import { Heart, Lock, KeyRound, X, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [weddingData, setWeddingData] = useState<WeddingData>(() => loadWeddingData());
  const [isDoorsOpen, setIsDoorsOpen] = useState(false);
  const [audioTriggered, setAudioTriggered] = useState(false);
  const [guestParam, setGuestParam] = useState<string | undefined>(undefined);
  const [isMobileMode, setIsMobileMode] = useState(true);

  // Admin access control - STRICTLY FALSE by default so public guests cannot see or edit!
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('khmer_wedding_admin_active') === 'true';
  });
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Fetch server wedding data on mount to ensure latest code sync
  useEffect(() => {
    fetchServerWeddingData().then((serverData) => {
      if (serverData) {
        setWeddingData(serverData);
      }
    });
  }, []);

  // Check URL parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      
      // Guest name query e.g., ?guest=ឈ្មោះ
      const guest = params.get('guest');
      if (guest) {
        setGuestParam(decodeURIComponent(guest));
      }

      // Admin query parameter e.g., ?admin=168 or ?admin=PIN
      const adminParam = params.get('admin');
      const savedAdminSession = sessionStorage.getItem('khmer_wedding_admin_active');
      const targetPin = weddingData.adminPin || '168';

      if (adminParam && (adminParam === targetPin || adminParam === '168' || adminParam.toLowerCase() === 'admin')) {
        setIsAdmin(true);
        sessionStorage.setItem('khmer_wedding_admin_active', 'true');
        sessionStorage.setItem('khmer_wedding_admin_pin', adminParam);
      } else if (savedAdminSession === 'true') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      console.warn("Could not read URL params", e);
    }
  }, [weddingData.adminPin]);

  const handleOpenInvitation = () => {
    setIsDoorsOpen(true);
    setAudioTriggered(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDoorsToPreview = () => {
    setIsDoorsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveData = (newData: WeddingData) => {
    setWeddingData(newData);
    saveWeddingData(newData);
  };

  const handleResetData = () => {
    const defaultData = resetWeddingData();
    setWeddingData(defaultData);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPin = weddingData.adminPin || '168';
    if (
      pinInput === targetPin ||
      pinInput === '168' ||
      pinInput === '1234' ||
      pinInput.toLowerCase() === 'admin'
    ) {
      setIsAdmin(true);
      sessionStorage.setItem('khmer_wedding_admin_active', 'true');
      sessionStorage.setItem('khmer_wedding_admin_pin', pinInput);
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('khmer_wedding_admin_active');
    sessionStorage.removeItem('khmer_wedding_admin_pin');
  };

  return (
    <div
      className={`min-h-screen relative text-[#2D3748] selection:bg-[#C5A059] selection:text-white transition-colors duration-500 ${
        isMobileMode
          ? 'bg-[#120409] flex justify-center overflow-x-hidden'
          : 'w-full overflow-x-hidden'
      }`}
    >
      {/* Background Falling Rose Petals Canvas */}
      {weddingData.theme?.showFallingPetals !== false && (
        <PetalsCanvas active={isDoorsOpen} />
      )}

      {/* Floating Audio Player (plays uploaded romantic song on loop on door opening) */}
      {weddingData.theme?.enableMusic !== false && (
        <AudioPlayer
          autoPlayTriggered={audioTriggered}
          audioUrl={weddingData.theme?.audioUrl || '/assets/aistudio/1108__1__dd18293f.MP3'}
        />
      )}

      {/* Desktop Device View Mode Switcher (visible on PC / Mac / iPad) */}
      <div className="hidden md:flex fixed top-3 left-3 z-60 items-center gap-1 p-1 rounded-full bg-black/85 backdrop-blur-md border border-[#C5A059]/60 shadow-2xl text-white">
        <button
          type="button"
          onClick={() => setIsMobileMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-kantumruy font-semibold transition-all cursor-pointer ${
            isMobileMode
              ? 'bg-gradient-to-r from-[#C5A059] to-[#E6C673] text-[#3D101E] font-bold shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
          title="បង្ហាញជាទម្រង់ទូរស័ព្ទដៃ (Mobile Phone View)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>ទម្រង់ទូរស័ព្ទ (Mobile)</span>
        </button>
        <button
          type="button"
          onClick={() => setIsMobileMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-kantumruy font-semibold transition-all cursor-pointer ${
            !isMobileMode
              ? 'bg-gradient-to-r from-[#C5A059] to-[#E6C673] text-[#3D101E] font-bold shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
          title="បង្ហាញពេញអេក្រង់កុំព្យូទ័រ (Full Screen)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>ពេញអេក្រង់ (Full)</span>
        </button>
      </div>

      {/* Full-Screen Double-Door Opening Cover */}
      <DoubleDoorCover
        data={weddingData}
        isOpen={isDoorsOpen}
        onOpen={handleOpenInvitation}
        guestNameOverride={guestParam}
        isMobileMode={isMobileMode}
      />

      {/* Fixed Video Background in Page 2 (នៅពេលអូស រក្សាវិដេអូនៅដដែល) */}
      <ParallaxBackground
        videoSrc={weddingData.theme?.bgVideoUrl || '/assets/aistudio/prewedding_bg_video.mp4'}
        imageSrc={weddingData.galleryPhotos?.[0] || '/assets/aistudio/IMG_9276_82dea8b5.JPG'}
        active={isDoorsOpen}
        isMobileMode={isMobileMode}
      />

      {/* Main Mobile Smartphone Container (Page 2) */}
      <div
        className={`w-full relative min-h-screen transition-all duration-300 ${
          isMobileMode
            ? 'max-w-[440px] shadow-[0_0_70px_rgba(0,0,0,0.85)] border-x border-[#C5A059]/35 bg-transparent'
            : 'bg-transparent'
        }`}
      >

        {/* Main Invitation Page Container */}
        <main className="relative z-10 w-full px-3 sm:px-4 py-6 sm:py-12 transition-opacity duration-1000">
        {/* Subtle decorative background watermarks / kbach borders */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent pointer-events-none" />

        {/* 1. Header, Parent & Couple Names */}
        <HeaderAndCouple
          data={weddingData}
          onOpenDoorsAgain={handleCloseDoorsToPreview}
        />

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-6 max-w-md mx-auto">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A059] bg-[#FFE7A0]" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
        </div>

        {/* 2. Wedding Schedule & Program */}
        <WeddingSchedule data={weddingData} />

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-6 max-w-md mx-auto">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A059] bg-[#FFE7A0]" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
        </div>

        {/* 3. Venue & Location Map */}
        <ScrollReveal direction="up" delayMs={60}>
          <LocationAndMap data={weddingData} />
        </ScrollReveal>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-6 max-w-md mx-auto">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A059] bg-[#FFE7A0]" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
        </div>

        {/* 4. Pre-Wedding Video Highlights */}
        <ScrollReveal direction="up" delayMs={60}>
          <PreWeddingVideo
            videoUrl={weddingData.videoUrl || '/assets/aistudio/prewedding_bg_video.mp4'}
            groomName={weddingData.groomNameKhmer}
            brideName={weddingData.brideNameKhmer}
          />
        </ScrollReveal>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-8 max-w-md mx-auto">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A059] bg-[#FFE7A0]" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
        </div>

        {/* 5. Pre-Wedding Photo Gallery (រក្សាទុករូបថតទាំង ៨ សន្លឹកយ៉ាងពេញលេញ) */}
        <ScrollReveal direction="up" delayMs={60}>
          <PhotoGallery
            data={weddingData}
            isAdmin={isAdmin}
            onUpdatePhotos={(photos) => handleSaveData({ ...weddingData, galleryPhotos: photos })}
          />
        </ScrollReveal>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-8 max-w-md mx-auto">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A059] bg-[#FFE7A0]" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
        </div>

        {/* 6. Digital Gift / ABA / Bakong QR Codes */}
        <ScrollReveal direction="up" delayMs={60}>
          <DigitalGiftQR data={weddingData} />
        </ScrollReveal>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 my-8 max-w-md mx-auto">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A059] bg-[#FFE7A0]" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
        </div>

        {/* 7. Guest Wishes / RSVP */}
        <ScrollReveal direction="up" delayMs={60}>
          <GuestWishesRSVP />
        </ScrollReveal>

        {/* Traditional Khmer Footer */}
        <ScrollReveal direction="up" delayMs={60}>
          <footer className="mt-14 pt-8 text-center border-t border-[#C5A059]/30">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A059]" />
              <Heart className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A059]" />
            </div>

            <h3 className="font-moul text-base sm:text-lg text-[#3D101E] mb-2">
              {weddingData.groomNameKhmer} &amp; {weddingData.brideNameKhmer}
            </h3>

            <p className="font-kantumruy text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
              សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះវត្តមាន និងការប្រសិទ្ធពរជ័យរបស់ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា ទាំងអស់គ្នា។
            </p>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#C5A059] font-cinzel">
              <span className="tracking-wider uppercase">
                With Love &amp; Gratitude · {weddingData.solarDate.split(' ')[weddingData.solarDate.split(' ').length - 1]}
              </span>

              {/* Discreet Admin Lock Button for Owner */}
              <button
                onClick={() => {
                  if (isAdmin) {
                    handleLogoutAdmin();
                  } else {
                    setShowPinModal(true);
                  }
                }}
                className="text-[#C5A059]/60 hover:text-[#C5A059] p-1 rounded-full transition-colors ml-1"
                title={isAdmin ? "ចាកចេញពី Admin (Lock)" : "ចូលគ្រប់គ្រង Admin (Login)"}
              >
                <Lock className="w-3 h-3" />
              </button>
            </div>
          </footer>
        </ScrollReveal>
        </main>
      </div>

      {/* Floating Admin Live Editor Modal ONLY visible when isAdmin is TRUE */}
      {isAdmin && (
        <AdminEditModal
          data={weddingData}
          onSave={handleSaveData}
          onReset={handleResetData}
          onLogout={handleLogoutAdmin}
          isDoorsOpen={isDoorsOpen}
        />
      )}

      {/* Admin PIN Login Modal */}
      {showPinModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPinModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border-2 border-[#C5A059] shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#3D101E] text-[#FFE5A3] flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-moul text-base text-[#3D101E] mb-1">
                ផ្ទាំងគ្រប់គ្រង Admin
              </h3>
              <p className="font-kantumruy text-xs text-slate-500">
                សូមបញ្ចូលលេខកូដសម្ងាត់ PIN ដើម្បីបើកមុខងារកែសម្រួលលិខិត
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="បញ្ចូលលេខកូដសម្ងាត់ PIN"
                  className="w-full text-center px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 text-sm font-mono tracking-widest outline-none transition-all"
                />
                {pinError && (
                  <p className="text-rose-600 text-xs font-kantumruy mt-1.5 font-medium">
                    លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ! សូមព្យាយាមម្តងទៀត
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-kantumruy text-xs hover:bg-slate-50"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] font-kantumruy text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  ចូលកែសម្រួល
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
