import React, { useState } from 'react';
import { WeddingData, WeddingScheduleItem } from '../weddingData';
import { ScrollReveal } from './ScrollReveal';
import {
  Sun,
  Moon,
  Clock,
  Sparkles,
  Scissors,
  Utensils,
  Music,
  Heart,
  CalendarPlus,
  Download,
  ExternalLink,
  Check
} from 'lucide-react';

interface WeddingScheduleProps {
  data: WeddingData;
}

export const WeddingSchedule: React.FC<WeddingScheduleProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [downloadedIcs, setDownloadedIcs] = useState(false);

  const getIcon = (type: WeddingScheduleItem['iconType']) => {
    switch (type) {
      case 'fruits':
        return <Utensils className="w-4 h-4 text-[#C5A059]" />;
      case 'haircut':
        return <Scissors className="w-4 h-4 text-[#C5A059]" />;
      case 'blessing':
        return <Heart className="w-4 h-4 text-[#C5A059]" />;
      case 'cake':
        return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
      case 'music':
        return <Music className="w-4 h-4 text-[#C5A059]" />;
      default:
        return <Clock className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  const scheduleList = activeTab === 'morning' ? data.morningSchedule : data.eveningSchedule;

  // Generate and dynamically download the .ics file
  const handleDownloadICS = () => {
    // Format start and end date
    const targetDate = new Date(data.calendarTargetDate || '2026-11-15T07:00:00');
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');

    // Wedding ceremony start at 06:30 morning, ends at 22:00 evening
    const dtStart = `${yyyy}${mm}${dd}T063000`;
    const dtEnd = `${yyyy}${mm}${dd}T220000`;
    const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    // Construct schedule list text for description
    const morningListText = (data.morningSchedule || [])
      .map((item) => `• ${item.time}: ${item.title} - ${item.description}`)
      .join('\\n');

    const eveningListText = (data.eveningSchedule || [])
      .map((item) => `• ${item.time}: ${item.title} - ${item.description}`)
      .join('\\n');

    const summary = `សិរីមង្គលអាពាហ៍ពិពាហ៍ ${data.groomNameKhmer} & ${data.brideNameKhmer} (${data.groomNameLatin} & ${data.brideNameLatin})`;
    const description = `សិរីមង្គលអាពាហ៍ពិពាហ៍ ${data.groomNameKhmer} & ${data.brideNameKhmer}\\n\\n` +
      `[ កម្មវិធីពេលព្រឹក ]\\n${morningListText}\\n\\n` +
      `[ កម្មវិធីពេលល្ងាច ]\\n${eveningListText}\\n\\n` +
      `ទីតាំង៖ ${data.venueName}\\n` +
      `អាសយដ្ឋាន៖ ${data.venueAddress}\\n` +
      `Google Maps: ${data.googleMapsUrl}`;

    // Clean ICS string
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
      'DESCRIPTION:Wedding Reminder: Tomorrow is the wedding of ' + data.groomNameLatin + ' & ' + data.brideNameLatin,
      'ACTION:DISPLAY',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'DESCRIPTION:Wedding Reminder: Ceremony begins in 2 hours',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create Blob and trigger download
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
      `សិរីមង្គលអាពាហ៍ពិពាហ៍ ${data.groomNameKhmer} និង ${data.brideNameKhmer}\n\n` +
      `ទីតាំង៖ ${data.venueName}\n` +
      `អាសយដ្ឋាន៖ ${data.venueAddress}\n\n` +
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
      <ScrollReveal direction="up" delayMs={100}>
        <div className="text-center mb-6">
          <span className="font-cinzel text-[9px] sm:text-[11px] uppercase tracking-widest text-[#C5A059] block mb-1">
            Ceremony Timeline
          </span>
          <h2 className="font-moul text-base sm:text-lg text-[#3D101E] mb-1.5">
            កម្មវិធីសិរីមង្គលអាពាហ៍ពិពាហ៍
          </h2>
          <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600">
            ពេលវេលា និងលំដាប់លំដោយនៃពិធីមង្គលការ
          </p>
        </div>
      </ScrollReveal>

      {/* Tabs */}
      <ScrollReveal direction="up" delayMs={200}>
        <div className="flex justify-center mb-6 px-2">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/80 backdrop-blur-md border border-[#C5A059]/35 shadow-xs w-full max-w-sm">
            <button
              onClick={() => setActiveTab('morning')}
              className={`flex items-center justify-center gap-1.5 px-2 sm:px-4 py-1.5 rounded-lg font-kantumruy text-[11px] sm:text-xs font-medium transition-all ${
                activeTab === 'morning'
                  ? 'bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-[#FFE5A3] shrink-0" />
              <span className="truncate">ពេលព្រឹក (ប្រពៃណី)</span>
            </button>
            <button
              onClick={() => setActiveTab('evening')}
              className={`flex items-center justify-center gap-1.5 px-2 sm:px-4 py-1.5 rounded-lg font-kantumruy text-[11px] sm:text-xs font-medium transition-all ${
                activeTab === 'evening'
                  ? 'bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-[#FFE5A3] shrink-0" />
              <span className="truncate">ពេលល្ងាច (ពិសាភោជនាហារ)</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Timeline Card */}
      <div className="bg-white/75 backdrop-blur-md border border-[#C5A059]/35 rounded-3xl p-5 sm:p-7 shadow-lg">
        <div className="relative border-l-2 border-[#C5A059]/40 ml-3 sm:ml-5 pl-5 sm:pl-7 space-y-6">
          {scheduleList.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              direction="left"
              delayMs={idx * 100}
              durationMs={600}
              className="relative group"
            >
              {/* Timeline marker */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#FFE7A0] to-[#C5A059] p-0.5 shadow-sm flex items-center justify-center">
                <div className="w-full h-full bg-[#FFF7F8] rounded-full flex items-center justify-center scale-90">
                  {getIcon(item.iconType)}
                </div>
              </div>

              {/* Time Badge */}
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#3D101E] text-[#FFE5A3] text-[10px] sm:text-[11px] font-kantumruy font-medium mb-1 shadow-2xs">
                {item.time}
              </div>

              {/* Title & Description (refined smaller typography) */}
              <h3 className="font-moul text-xs sm:text-sm text-[#3D101E] mb-0.5">
                {item.title}
              </h3>
              <p className="font-kantumruy text-[10.5px] sm:text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </ScrollReveal>
          ))}
        </div>

        {/* Add to Calendar Action Card inside Schedule Section */}
        <div className="mt-8 pt-5 border-t border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 p-3 sm:p-4 rounded-2xl border border-[#C5A059]/20">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3D101E] text-[#FFE5A3] flex items-center justify-center shrink-0 shadow-xs">
              <CalendarPlus className="w-4 h-4 text-[#FFE5A3]" />
            </div>
            <div>
              <h4 className="font-kantumruy font-bold text-[11px] sm:text-xs text-[#3D101E]">
                កត់ត្រាកម្មវិធីចូលក្នុងប្រតិទិន (Add to Calendar)
              </h4>
              <p className="font-kantumruy text-[10px] text-slate-500">
                រក្សាទុកកាលវិភាគទៅក្នុង Apple Calendar, Google Calendar ឬ Outlook
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Primary .ICS file download button */}
            <button
              onClick={handleDownloadICS}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3D101E] to-[#601930] hover:brightness-110 active:scale-95 text-[#FFE5A3] font-kantumruy text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
              title="ទាញយកឯកសារ .ics សម្រាប់ Apple Calendar, iOS, Outlook និងទូរស័ព្ទដៃ"
            >
              {downloadedIcs ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>បានទាញយក .ICS រួចរាល់!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#FFE5A3]" />
                  <span>ទាញយក .ICS (Apple/Outlook)</span>
                </>
              )}
            </button>

            {/* Google Calendar Web Link button */}
            <button
              onClick={handleOpenGoogleCalendar}
              className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-kantumruy text-xs font-medium transition-colors whitespace-nowrap shadow-2xs"
              title="បើកក្នុង Google Calendar"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Google Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
