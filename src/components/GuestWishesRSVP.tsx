import React, { useState } from 'react';
import { GuestWish, loadGuestWishes, saveGuestWishes } from '../weddingData';
import { Heart, Send, MessageCircleHeart, CheckCircle2, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuestWishesRSVP: React.FC = () => {
  const [wishes, setWishes] = useState<GuestWish[]>(() => loadGuestWishes());
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState<'groom' | 'bride' | 'both'>('both');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const quickBlessings = [
    "សូមជូនពរឱ្យមានសុភមង្គល និងស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង!",
    "ជ័យហោង! សិរីសួស្តី ជ័យមង្គល វិបុលសុខ កើតមានដល់គូស្វាមីភរិយាថ្មី!",
    "សូមឱ្យជីវិតអាពាហ៍ពិពាហ៍ពោរពេញដោយសុភមង្គល និងទ្រព្យសម្បត្តិស្តុកស្តម្ភ!",
    "អបអរសាទរថ្ងៃមង្គលការ! សូមឱ្យមានសុខភាពល្អ និងកូនចៅជាទីគាប់ចិត្ត!"
  ];

  // Golden Khmer-Themed Confetti Animation
  const triggerGoldenKhmerConfetti = () => {
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 2000);

    const khmerGoldPalette = [
      '#FFE5A3', // Soft Champagne Gold
      '#C5A059', // Antique Cambodian Gold
      '#D4AF37', // Metallic Royal Gold
      '#996515', // Deep Bronze Gold
      '#8B0000', // Royal Wine Crimson
      '#3D101E', // Traditional Maroon
      '#FFB6C1', // Lotus Petal Blush Pink
      '#FFF'     // Diamond Sparkle White
    ];

    // Center burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.65 },
      colors: khmerGoldPalette,
      shapes: ['star', 'circle'],
      scalar: 1.2,
      ticks: 200
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 75,
        origin: { x: 0.1, y: 0.7 },
        colors: khmerGoldPalette,
        shapes: ['circle', 'square'],
        scalar: 1.1
      });
    }, 150);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 75,
        origin: { x: 0.9, y: 0.7 },
        colors: khmerGoldPalette,
        shapes: ['circle', 'square'],
        scalar: 1.1
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: GuestWish = {
      id: 'wish_' + Date.now(),
      name: name.trim(),
      affiliation,
      attending,
      guestCount,
      message: message.trim(),
      timestamp: 'ទើបតែផ្ញើ',
      likes: 1
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    saveGuestWishes(updated);

    setName('');
    setMessage('');
    setSubmitted(true);

    // Trigger joyous golden confetti upon RSVP submission
    triggerGoldenKhmerConfetti();

    setTimeout(() => setSubmitted(false), 4500);
  };

  const handleLike = (id: string) => {
    const updated = wishes.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w));
    setWishes(updated);
    saveGuestWishes(updated);
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Section Header with Celebrate Action */}
      <div className="text-center mb-6 relative">
        <span className="font-cinzel text-[9px] sm:text-[11px] uppercase tracking-widest text-[#C5A059] block mb-1">
          Wishes &amp; RSVP
        </span>
        <h2 className="font-moul text-base sm:text-lg text-[#3D101E] mb-1.5">
          ផ្ញើសារជូនពរ &amp; បញ្ជាក់ការចូលរួម
        </h2>
        <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600 max-w-md mx-auto">
          សេចក្តីជូនពរ និងវត្តមានរបស់លោកអ្នកគឺជាកិត្តិយសដ៏ខ្ពង់ខ្ពស់របស់យើងខ្ញុំ
        </p>

        {/* Dedicated Celebrate Button */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={triggerGoldenKhmerConfetti}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C5A059] shadow-sm transition-all duration-300 font-kantumruy text-[11px] sm:text-xs font-bold ${
              isCelebrating
                ? 'scale-105 bg-[#3D101E] text-[#FFE5A3] ring-4 ring-[#C5A059]/40'
                : 'bg-gradient-to-r from-[#FFE5A3] via-[#FFF1C5] to-[#E6C673] hover:from-[#FFDF8A] hover:to-[#D4AF37] text-[#24060E] hover:scale-105 active:scale-95'
            }`}
            title="ចុចដើម្បីអបអរសាទរជាមួយកាំជ្រួចផ្កាកុលាប និងផ្កាយមាស (Celebrate)"
          >
            <PartyPopper className={`w-3.5 h-3.5 text-[#3D101E] ${isCelebrating ? 'animate-bounce' : ''}`} />
            <span>អបអរសាទរ (Celebrate)</span>
            <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
          </button>
        </div>
      </div>

      {/* RSVP & Wish Form */}
      <div className="rounded-3xl bg-white/75 backdrop-blur-md border border-[#C5A059]/35 p-5 sm:p-7 shadow-lg mb-8 relative overflow-hidden">
        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFE7A0] to-[#C5A059] text-[#3D101E] rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-moul text-sm sm:text-base text-[#3D101E]">
              សូមអរគុណយ៉ាងជ្រាលជ្រៅ!
            </h3>
            <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              សារជូនពរ និងការបញ្ជាក់វត្តមានរបស់លោកអ្នកត្រូវបានកត់ត្រារួចរាល់។ ជ័យហោង! សិរីសួស្តី ជ័យមង្គល!
            </p>
            <button
              type="button"
              onClick={triggerGoldenKhmerConfetti}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3D101E] text-[#FFE5A3] font-kantumruy text-xs font-semibold hover:brightness-110 shadow-xs"
            >
              <PartyPopper className="w-3.5 h-3.5" />
              <span>អបអរសាទរម្តងទៀត!</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Guest Name */}
            <div>
              <label className="block font-kantumruy text-xs font-semibold text-[#3D101E] mb-1.5">
                ឈ្មោះភ្ញៀវកិត្តិយស *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ឧ. លោក សុខា និងភរិយា"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 text-sm font-kantumruy outline-none transition-all"
              />
            </div>

            {/* Attendance & Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-kantumruy text-xs font-semibold text-[#3D101E] mb-1.5">
                  ការចូលរួម
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    className={`py-2 px-3 rounded-xl text-xs font-kantumruy font-medium border text-center transition-all ${
                      attending === 'yes'
                        ? 'bg-[#3D101E] text-[#FFE5A3] border-[#3D101E]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    នឹងចូលរួម
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    className={`py-2 px-3 rounded-xl text-xs font-kantumruy font-medium border text-center transition-all ${
                      attending === 'no'
                        ? 'bg-rose-900 text-rose-100 border-rose-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    សុំអភ័យទោស
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-kantumruy text-xs font-semibold text-[#3D101E] mb-1.5">
                  ចំនួនភ្ញៀវចូលរួម
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#C5A059] text-sm font-kantumruy outline-none transition-all"
                >
                  <option value={1}>១ នាក់</option>
                  <option value={2}>២ នាក់</option>
                  <option value={3}>៣ នាក់</option>
                  <option value={4}>៤ នាក់</option>
                  <option value={5}>៥ នាក់ ឬច្រើនជាង</option>
                </select>
              </div>
            </div>

            {/* Affiliation */}
            <div>
              <label className="block font-kantumruy text-xs font-semibold text-[#3D101E] mb-1.5">
                ភ្ញៀវខាង
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAffiliation('groom')}
                  className={`py-2 px-2 rounded-xl text-xs font-kantumruy font-medium border text-center transition-all ${
                    affiliation === 'groom'
                      ? 'bg-[#C5A059] text-[#24060E] border-[#C5A059]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ខាងកូនប្រុស
                </button>
                <button
                  type="button"
                  onClick={() => setAffiliation('bride')}
                  className={`py-2 px-2 rounded-xl text-xs font-kantumruy font-medium border text-center transition-all ${
                    affiliation === 'bride'
                      ? 'bg-[#C5A059] text-[#24060E] border-[#C5A059]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ខាងកូនស្រី
                </button>
                <button
                  type="button"
                  onClick={() => setAffiliation('both')}
                  className={`py-2 px-2 rounded-xl text-xs font-kantumruy font-medium border text-center transition-all ${
                    affiliation === 'both'
                      ? 'bg-[#C5A059] text-[#24060E] border-[#C5A059]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ទាំងសងខាង
                </button>
              </div>
            </div>

            {/* Quick Blessings */}
            <div>
              <label className="block font-kantumruy text-[11px] text-slate-500 mb-1">
                ជ្រើសរើសពាក្យជូនពររហ័ស៖
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickBlessings.map((b, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(b)}
                    className="text-[11px] font-kantumruy px-2.5 py-1 rounded-lg bg-[#FFF7F8] hover:bg-[#FDEEF1] text-[#3D101E] border border-[#C5A059]/20 transition-colors text-left"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishes Message */}
            <div>
              <label className="block font-kantumruy text-xs font-semibold text-[#3D101E] mb-1.5">
                សារជូនពរ *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="សរសេរសារជូនពរដល់គូស្វាមីភរិយាថ្មីនៅទីនេះ..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 text-sm font-kantumruy outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] font-kantumruy text-sm font-medium shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#FFE5A3]" />
              <span>ផ្ញើសារជូនពរ &amp; បញ្ជាក់</span>
            </button>
          </form>
        )}
      </div>

      {/* Guest Wishes Wall */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-moul text-sm sm:text-base text-[#3D101E] flex items-center gap-2">
            <MessageCircleHeart className="w-4 h-4 text-[#C5A059]" />
            <span>សារជូនពរពីភ្ញៀវកិត្តិយស ({wishes.length})</span>
          </h3>
        </div>

        <div className="space-y-3">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl bg-white border border-[#C5A059]/25 shadow-xs transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="font-kantumruy font-bold text-sm text-[#3D101E]">
                    {w.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-kantumruy mt-0.5">
                    <span>
                      {w.affiliation === 'groom'
                        ? 'ភ្ញៀវខាងកូនប្រុស'
                        : w.affiliation === 'bride'
                        ? 'ភ្ញៀវខាងកូនស្រី'
                        : 'ភ្ញៀវទាំងសងខាង'}
                    </span>
                    <span>·</span>
                    <span>{w.timestamp}</span>
                    {w.attending === 'yes' && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">ចូលរួម ({w.guestCount}នាក់)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(w.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs font-cinzel"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{w.likes}</span>
                </button>
              </div>

              <p className="font-kantumruy text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FFFDFE] p-3 rounded-xl border border-rose-100/60">
                {w.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
