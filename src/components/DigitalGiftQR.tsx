import React, { useState } from 'react';
import { WeddingData } from '../weddingData';
import { QrCode, Copy, Check, Gift, Smartphone } from 'lucide-react';

interface DigitalGiftQRProps {
  data: WeddingData;
}

export const DigitalGiftQR: React.FC<DigitalGiftQRProps> = ({ data }) => {
  const [copiedGroom, setCopiedGroom] = useState(false);
  const [copiedBride, setCopiedBride] = useState(false);
  const [activeModalQR, setActiveModalQR] = useState<{ title: string; image: string; name: string; acc: string } | null>(null);

  const handleCopy = (text: string, type: 'groom' | 'bride') => {
    navigator.clipboard.writeText(text);
    if (type === 'groom') {
      setCopiedGroom(true);
      setTimeout(() => setCopiedGroom(false), 2500);
    } else {
      setCopiedBride(true);
      setTimeout(() => setCopiedBride(false), 2500);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFE7A0] text-[#3D101E] mb-1.5 shadow-xs">
          <Gift className="w-4 h-4 text-[#3D101E]" />
        </div>
        <span className="font-cinzel text-[9px] sm:text-[11px] uppercase tracking-widest text-[#C5A059] block mb-1">
          Wedding Gifts &amp; Blessings
        </span>
        <h2 className="font-moul text-base sm:text-lg text-[#3D101E] mb-1.5">
          ចំណងដៃអាពាហ៍ពិពាហ៍ (Digital Gift)
        </h2>
        <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600 max-w-lg mx-auto">
          សូមបើកកម្មវិធីធនាគារ (ABA, Bakong ឬធនាគារផ្សេងៗ) ដើម្បីស្កេនផ្ញើចំណងដៃជូនគូស្វាមីភរិយាថ្មី
        </p>
      </div>

      {/* Dual QR Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Groom's Bank QR */}
        <div className="rounded-3xl bg-white/75 backdrop-blur-md border-2 border-[#C5A059]/40 p-5 shadow-md text-center flex flex-col justify-between">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#3D101E] text-[#FFE5A3] font-cinzel text-[10px] font-semibold uppercase mb-2 shadow-2xs">
              {data.groomBank.bankName}
            </div>
            <h3 className="font-moul text-xs sm:text-sm text-[#3D101E] mb-0.5">
              ចំណងដៃខាងកូនប្រុស
            </h3>
            <p className="font-kantumruy text-[11px] text-slate-500 mb-3">
              {data.groomNameKhmer} ({data.groomNameLatin})
            </p>

            {/* QR Code Container */}
            <div
              onClick={() =>
                setActiveModalQR({
                  title: 'ចំណងដៃខាងកូនប្រុស',
                  image: data.groomBank.qrImage,
                  name: data.groomBank.accountName,
                  acc: data.groomBank.accountNumber
                })
              }
              className="w-40 h-40 sm:w-44 sm:h-44 mx-auto p-2.5 rounded-2xl bg-white border-2 border-[#C5A059]/30 shadow-inner cursor-pointer hover:border-[#C5A059] transition-all group relative flex items-center justify-center overflow-hidden"
            >
              <img
                src={data.groomBank.qrImage}
                alt="Groom Bank QR"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/khmer_wedding_rings_1791108478647.jpg';
                }}
              />
              <div className="absolute inset-0 bg-[#3D101E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-kantumruy">
                ចុចពង្រីក QR
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200 text-left">
              <span className="text-[9px] text-slate-400 font-cinzel block">Account Name</span>
              <p className="text-[11px] font-mono font-bold text-slate-800">{data.groomBank.accountName}</p>
              <span className="text-[9px] text-slate-400 font-cinzel block mt-1">Account Number</span>
              <p className="text-xs font-mono font-bold text-[#3D101E]">{data.groomBank.accountNumber}</p>
            </div>

            <button
              onClick={() => handleCopy(data.groomBank.accountNumber, 'groom')}
              className="w-full py-2 px-3 rounded-xl border border-[#C5A059]/40 bg-white/80 hover:bg-white text-[#3D101E] font-kantumruy text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedGroom ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{copiedGroom ? 'បានចម្លងរួចរាល់' : 'ចម្លងលេខគណនី'}</span>
            </button>
          </div>
        </div>

        {/* Bride's Bank QR */}
        <div className="rounded-3xl bg-white/75 backdrop-blur-md border-2 border-[#C5A059]/40 p-5 shadow-md text-center flex flex-col justify-between">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#3D101E] text-[#FFE5A3] font-cinzel text-[10px] font-semibold uppercase mb-2 shadow-2xs">
              {data.brideBank.bankName}
            </div>
            <h3 className="font-moul text-xs sm:text-sm text-[#3D101E] mb-0.5">
              ចំណងដៃខាងកូនស្រី
            </h3>
            <p className="font-kantumruy text-[11px] text-slate-500 mb-3">
              {data.brideNameKhmer} ({data.brideNameLatin})
            </p>

            {/* QR Code Container */}
            <div
              onClick={() =>
                setActiveModalQR({
                  title: 'ចំណងដៃខាងកូនស្រី',
                  image: data.brideBank.qrImage,
                  name: data.brideBank.accountName,
                  acc: data.brideBank.accountNumber
                })
              }
              className="w-40 h-40 sm:w-44 sm:h-44 mx-auto p-2.5 rounded-2xl bg-white border-2 border-[#C5A059]/30 shadow-inner cursor-pointer hover:border-[#C5A059] transition-all group relative flex items-center justify-center overflow-hidden"
            >
              <img
                src={data.brideBank.qrImage}
                alt="Bride Bank QR"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/khmer_wedding_rings_1791108478647.jpg';
                }}
              />
              <div className="absolute inset-0 bg-[#3D101E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-kantumruy">
                ចុចពង្រីក QR
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="p-2 rounded-xl bg-white/80 border border-slate-200 text-left">
              <span className="text-[9px] text-slate-400 font-cinzel block">Account Name</span>
              <p className="text-[11px] font-mono font-bold text-slate-800">{data.brideBank.accountName}</p>
              <span className="text-[9px] text-slate-400 font-cinzel block mt-1">Account Number</span>
              <p className="text-xs font-mono font-bold text-[#3D101E]">{data.brideBank.accountNumber}</p>
            </div>

            <button
              onClick={() => handleCopy(data.brideBank.accountNumber, 'bride')}
              className="w-full py-2 px-3 rounded-xl border border-[#C5A059]/40 bg-white/80 hover:bg-white text-[#3D101E] font-kantumruy text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedBride ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{copiedBride ? 'បានចម្លងរួចរាល់' : 'ចម្លងលេខគណនី'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Large Preview Modal */}
      {activeModalQR && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModalQR(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border-2 border-[#C5A059] shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-moul text-base text-[#3D101E]">
              {activeModalQR.title}
            </h3>
            <div className="w-64 h-64 mx-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={activeModalQR.image}
                alt="QR Modal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/khmer_wedding_rings_1791108478647.jpg';
                }}
              />
            </div>
            <div className="font-mono text-sm font-bold text-slate-800">
              {activeModalQR.name} · {activeModalQR.acc}
            </div>
            <button
              onClick={() => setActiveModalQR(null)}
              className="w-full py-2.5 rounded-xl bg-[#3D101E] text-[#FFE5A3] font-kantumruy text-xs font-semibold"
            >
              បិទផ្ទាំង
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
