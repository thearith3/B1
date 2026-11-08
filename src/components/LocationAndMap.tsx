import React, { useState } from 'react';
import { WeddingData } from '../weddingData';
import { MapPin, Navigation, Copy, Check, CalendarPlus, Download, ExternalLink } from 'lucide-react';

interface LocationAndMapProps {
  data: WeddingData;
}

export const LocationAndMap: React.FC<LocationAndMapProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [downloadedIcs, setDownloadedIcs] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(data.venueAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadICS = () => {
    const targetDate = new Date(data.calendarTargetDate || '2026-11-15T07:00:00');
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');

    const dtStart = `${yyyy}${mm}${dd}T063000`;
    const dtEnd = `${yyyy}${mm}${dd}T220000`;
    const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const summary = `សិរីមង្គលអាពាហ៍ពិពាហ៍ ${data.groomNameKhmer} & ${data.brideNameKhmer} (${data.groomNameLatin} & ${data.brideNameLatin})`;
    const description = `សិរីមង្គលអាពាហ៍ពិពាហ៍ ${data.groomNameKhmer} & ${data.brideNameKhmer}\\n\\n` +
      `ទីតាំង៖ ${data.venueName}\\n` +
      `អាសយដ្ឋាន៖ ${data.venueAddress}\\n` +
      `Google Maps: ${data.googleMapsUrl}\\n\\n` +
      `សូមគោរពអញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយស!`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Khmer Wedding//Wedding Schedule E-Invitation//KM',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:wedding-${yyyy}${mm}${dd}-${Date.now()}@khmerwedding.app`,
      `DTSTAMP:${nowUtc}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${data.venueAddress.replace(/,/g, '\\,')}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'DESCRIPTION:Wedding Reminder',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `wedding_${data.groomNameLatin}_${data.brideNameLatin}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 3000);
  };

  const handleOpenGoogleCalendar = () => {
    const targetDate = new Date(data.calendarTargetDate || '2026-11-15T07:00:00');
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');

    const title = encodeURIComponent(`សិរីមង្គលអាពាហ៍ពិពាហ៍ ${data.groomNameKhmer} & ${data.brideNameKhmer}`);
    const details = encodeURIComponent(
      `សិរីមង្គលអាពាហ៍ពិពាហ៍ ${data.groomNameKhmer} និង ${data.brideNameKhmer}\n` +
      `ទីតាំង៖ ${data.venueAddress}\n\n` +
      `សូមគោរពអញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយស!`
    );
    const location = encodeURIComponent(data.venueAddress);
    const dates = `${yyyy}${mm}${dd}T063000/${yyyy}${mm}${dd}T220000`;

    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-6">
        <span className="font-cinzel text-[9px] sm:text-[11px] uppercase tracking-widest text-[#C5A059] block mb-1">
          Wedding Venue &amp; Map
        </span>
        <h2 className="font-moul text-base sm:text-lg text-[#3D101E] mb-1.5">
          ទីតាំងកម្មវិធីសិរីមង្គល
        </h2>
        <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600">
          សូមស្វាគមន៍វត្តមានដ៏ខ្ពង់ខ្ពស់របស់លោកអ្នក
        </p>
      </div>

      <div className="rounded-3xl bg-white/75 backdrop-blur-md border border-[#C5A059]/35 shadow-lg overflow-hidden">
        {/* Map Preview Image / Hero Banner */}
        <div className="relative h-44 sm:h-56 w-full bg-slate-900 overflow-hidden">
          <img
            src={data.mapImage}
            alt="Venue Map"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
            onError={(e) => {
              // fallback to reception hall image
              (e.currentTarget as HTMLImageElement).src = '/images/khmer_wedding_reception_hall_1791108491974.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 sm:p-5">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C5A059] text-[#24060E] text-[10px] sm:text-[11px] font-kantumruy font-bold mb-1 shadow-xs">
                <MapPin className="w-3 h-3" />
                {data.venueName}
              </span>
              <p className="text-white text-[11px] sm:text-xs font-kantumruy drop-shadow-sm line-clamp-2">
                {data.venueAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Content details and QR card */}
        <div className="p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex-1 space-y-3 text-left">
            <div>
              <h3 className="font-moul text-xs sm:text-sm text-[#3D101E] mb-0.5">
                {data.venueName}
              </h3>
              <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                {data.venueAddress}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] font-kantumruy text-[11px] sm:text-xs font-semibold shadow-xs hover:brightness-110 active:scale-95 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-[#FFE5A3]" />
                <span>បើកក្នុង Google Maps</span>
              </a>

              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white/80 hover:bg-white text-slate-700 font-kantumruy text-[11px] sm:text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'បានចម្លងរួច' : 'ចម្លងអាសយដ្ឋាន'}</span>
              </button>

              <button
                onClick={handleDownloadICS}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#C5A059]/40 bg-[#FFF7F8] hover:bg-[#FDEEF1] text-[#3D101E] font-kantumruy text-xs sm:text-sm transition-colors shadow-2xs"
                title="ទាញយកឯកសារ .ics សម្រាប់ Apple Calendar / Outlook"
              >
                {downloadedIcs ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Download className="w-4 h-4 text-[#C5A059]" />
                )}
                <span>{downloadedIcs ? 'បានទាញយក .ICS' : 'ទាញយក .ICS'}</span>
              </button>

              <button
                onClick={handleOpenGoogleCalendar}
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-kantumruy text-xs transition-colors"
                title="Google Calendar"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Google Calendar</span>
              </button>
            </div>
          </div>

          {/* Mini QR Code for Mobile Scanning */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center shrink-0 w-36">
            <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
              {/* Simulated QR Code SVG */}
              <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" />
                <rect x="65" y="10" width="25" height="25" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" />
                <rect x="10" y="65" width="25" height="25" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" />
                <rect x="45" y="15" width="8" height="8" />
                <rect x="45" y="45" width="10" height="10" />
                <rect x="60" y="45" width="8" height="15" />
                <rect x="75" y="70" width="15" height="15" />
                <rect x="45" y="70" width="10" height="15" />
              </svg>
            </div>
            <span className="font-kantumruy text-[10px] text-slate-500 mt-2 block">
              ស្កេនបើកផែនទី
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
