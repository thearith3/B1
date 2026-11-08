import React, { useState, useRef } from 'react';
import { WeddingData } from '../weddingData';
import { ScrollReveal } from './ScrollReveal';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Upload,
  Trash2,
  Plus,
  Link as LinkIcon,
  Camera,
  Check,
  Heart,
  ChevronDown,
  LayoutGrid,
  Smartphone
} from 'lucide-react';

interface PhotoGalleryProps {
  data: WeddingData;
  isAdmin?: boolean;
  onUpdatePhotos?: (newPhotos: string[]) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ data, isAdmin, onUpdatePhotos }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'vertical' | 'grid'>('vertical');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = data.galleryPhotos || [];

  const showNotification = (msg: string) => {
    setDeleteNotice(msg);
    setTimeout(() => setDeleteNotice(null), 3000);
  };

  const handleNext = () => {
    if (selectedPhotoIndex === null || photos.length === 0) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null || photos.length === 0) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotoUrls: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotoUrls.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          const updated = [...photos, ...newPhotoUrls];
          if (onUpdatePhotos) {
            onUpdatePhotos(updated);
          }
          showNotification(`បានបន្ថែមរូបថតចំនួន ${newPhotoUrls.length} ដោយជោគជ័យ! ✓`);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleReplacePhotoFile = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("ទំហំរូបភាពធំពេក (សូមជ្រើសរើសរូបភាពក្រោម 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newUrl = event.target.result as string;
        const updated = [...photos];
        updated[idx] = newUrl;
        if (onUpdatePhotos) {
          onUpdatePhotos(updated);
        }
        showNotification(`បានដូររូបថតទី ${idx + 1} ថ្មីដោយជោគជ័យ! ✓`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const updated = [...photos, urlInput.trim()];
    if (onUpdatePhotos) {
      onUpdatePhotos(updated);
    }
    setUrlInput('');
    setShowUrlInput(false);
    showNotification("បានបន្ថែមរូបថតថ្មីដោយជោគជ័យ! ✓");
  };

  const handleDeletePhoto = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = photos.filter((_, i) => i !== idx);
    if (onUpdatePhotos) {
      onUpdatePhotos(updated);
    }
    if (selectedPhotoIndex !== null) {
      if (updated.length === 0) {
        setSelectedPhotoIndex(null);
      } else if (selectedPhotoIndex >= updated.length) {
        setSelectedPhotoIndex(updated.length - 1);
      }
    }
    showNotification("បានលុបរូបថតចេញដោយជោគជ័យ! ✓");
  };

  const handleClearAllPhotos = () => {
    if (window.confirm("តើអ្នកពិតជាចង់លុបរូបថតទាំងអស់ចេញមែនទេ?")) {
      if (onUpdatePhotos) {
        onUpdatePhotos([]);
      }
      setSelectedPhotoIndex(null);
      showNotification("បានលុបរូបថតទាំងអស់ចេញរួចរាល់! ✓");
    }
  };

  const handleResetDefaultPhotos = () => {
    const defaultPhotos = [
      "/assets/aistudio/IMG_9276_82dea8b5.JPG",
      "/assets/aistudio/IMG_9275_746d52a9.JPG",
      "/assets/aistudio/IMG_9278_ffef013e.JPG",
      "/assets/aistudio/IMG_9273_1af6dc47.JPG",
      "/assets/aistudio/IMG_9281_c5cef5a9.JPG",
      "/assets/aistudio/IMG_9282_16c72082.JPG",
      "/assets/aistudio/IMG_9283_802241a0.JPG",
      "/assets/aistudio/IMG_9284_9abf23de.JPG"
    ];
    if (onUpdatePhotos) {
      onUpdatePhotos(defaultPhotos);
    }
    showNotification("បានកំណត់រូបថតដើមឡើងវិញរួចរាល់! ✓");
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-5">
        <span className="font-cinzel text-[9px] sm:text-[11px] uppercase tracking-widest text-[#C5A059] block mb-1">
          Pre-Wedding Moments
        </span>
        <h2 className="font-moul text-base sm:text-lg text-[#3D101E] mb-1.5">
          វិចិត្រសាលរូបថតអនុស្សាវរីយ៍
        </h2>
        <p className="font-kantumruy text-[11px] sm:text-xs text-slate-600">
          រូបភាពនៃសេចក្តីស្រឡាញ់ និងការចាប់ផ្តើមដំណើរជីវិតគូថ្មី
        </p>

        {/* View Mode Switcher */}
        {photos.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="inline-flex p-1 rounded-xl bg-white/80 backdrop-blur-md border border-[#C5A059]/40 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('vertical')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-kantumruy text-[11px] font-semibold transition-all ${
                  viewMode === 'vertical'
                    ? 'bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="បង្ហាញជាជួរអូសចុះក្រោម (Vertical Feed)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>អូសចុះក្រោម (បញ្ឈរ)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-kantumruy text-[11px] font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="បង្ហាញជាក្រឡាចត្រង្គ (Grid)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>ក្រឡាចត្រង្គ (Grid)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Temporary Toast Alert */}
      {deleteNotice && (
        <div className="mb-4 p-2.5 rounded-xl bg-emerald-600 text-white font-kantumruy text-xs text-center font-bold flex items-center justify-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* Photo Management Toolbar - ONLY VISIBLE TO AUTHENTICATED ADMIN */}
      {isAdmin && (
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-amber-50/80 backdrop-blur-md border-2 border-[#C5A059]/40 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#C5A059]" />
              <div>
                <span className="font-kantumruy text-xs font-bold text-[#3D101E] block">
                  ផ្ទាំងគ្រប់គ្រងរូបថត (Photo Manager - Admin Only)
                </span>
                <span className="font-kantumruy text-[11px] text-slate-500">
                  មានរូបថតសរុប៖ {photos.length} សន្លឹក
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] font-kantumruy text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>+ បន្ថែមរូបពីទូរស័ព្ទ</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#C5A059]/50 text-slate-700 font-kantumruy text-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>ដាក់ Link</span>
              </button>

              {photos.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClearAllPhotos}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-kantumruy text-xs hover:bg-rose-100 transition-all cursor-pointer"
                  title="លុបរូបទាំងអស់ចេញ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>លុបទាំងអស់</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetDefaultPhotos}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-100 text-[#3D101E] border border-[#C5A059]/50 font-kantumruy text-xs font-semibold hover:bg-amber-200 transition-all cursor-pointer"
                  title="កំណត់រូបគំរូដើមឡើងវិញ"
                >
                  <span>កំណត់រូបដើមវិញ</span>
                </button>
              )}
            </div>
          </div>

          {showUrlInput && (
            <form onSubmit={handleAddUrl} className="flex items-center gap-2 pt-2 border-t border-[#C5A059]/20">
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="បិទភ្ជាប់តំណ Link រូបភាព (https://...)"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-kantumruy outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#C5A059] text-white text-xs font-kantumruy font-bold hover:brightness-105 cursor-pointer"
              >
                បន្ថែម
              </button>
            </form>
          )}
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-[#C5A059]/40 bg-white/70 shadow-sm">
          <Camera className="w-12 h-12 text-[#C5A059]/70 mx-auto mb-2" />
          <h4 className="font-moul text-base text-[#3D101E] mb-1">
            {isAdmin ? "បានដករូបថតចេញអស់ហើយ" : "រូបថតអនុស្សាវរីយ៍អាពាហ៍ពិពាហ៍"}
          </h4>
          <p className="font-kantumruy text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {isAdmin
              ? "អ្នកអាចផ្ទុកឡើងរូបថតផ្ទាល់ខ្លួនរបស់អ្នកពីទូរស័ព្ទដៃ ឬកុំព្យូទ័របានយ៉ាងងាយស្រួល"
              : "សូមរង់ចាំទស្សនារូបថតអនុស្សាវរីយ៍ដ៏ស្រស់ស្អាតរបស់គូស្វាមីភរិយា"}
          </p>
          {isAdmin && (
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] font-kantumruy text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>+ ផ្ទុកឡើងរូបថតឥឡូវនេះ</span>
              </button>
              <button
                onClick={handleResetDefaultPhotos}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#C5A059] text-[#3D101E] font-kantumruy text-xs font-semibold hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
              >
                កំណត់រូបគំរូដើមឡើងវិញ
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 1: VERTICAL FEED (លក្ខណៈអូសចុះក្រោម - Vertical Scroll Down) */}
      {photos.length > 0 && viewMode === 'vertical' && (
        <div className="space-y-8 sm:space-y-12 max-w-xl mx-auto">
          {/* Scroll down encouragement banner */}
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#FFF0D4]/80 border border-[#ECCB76] text-[#664816] font-kantumruy text-xs font-medium w-fit mx-auto shadow-2xs">
            <span>អូសចុះក្រោមដើម្បីទស្សនារូបថតទាំងអស់</span>
            <ChevronDown className="w-4 h-4 text-[#C5A059] animate-bounce" />
          </div>

          {photos.map((photoUrl, idx) => (
            <ScrollReveal
              key={idx}
              direction="up"
              delayMs={60}
              durationMs={650}
              className="relative"
            >
              <div className="relative group rounded-3xl bg-white border-2 border-[#C5A059]/40 p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Top Card Header */}
                <div className="flex items-center justify-between px-3 py-2 mb-1 border-b border-[#C5A059]/15">
                  <div className="flex items-center gap-1.5 text-xs text-[#3D101E] font-kantumruy font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                    <span>រូបថតទី {String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="font-cinzel text-[11px] text-[#C5A059] tracking-wider uppercase font-semibold">
                    Pre-Wedding
                  </span>
                </div>

                {/* Main Photo Image Container */}
                <div
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer bg-slate-900 shadow-inner group/img"
                >
                  <img
                    src={photoUrl}
                    alt={`Pre-wedding portrait ${idx + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-500 group-hover/img:scale-[1.02]"
                  />

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#3D101E] font-kantumruy text-xs font-bold shadow-lg">
                      <Eye className="w-4 h-4 text-[#C5A059]" />
                      <span>ចុចពង្រីកពេញអេក្រង់</span>
                    </div>
                  </div>

                  {/* Floating Bottom Badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-cinzel border border-white/20 pointer-events-none">
                    <span>{idx + 1} / {photos.length}</span>
                  </div>
                </div>

                {/* Card Footer Action Bar with Replace and Delete */}
                <div className="mt-2.5 px-2 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-kantumruy">
                  <span className="text-[11px] text-[#C5A059] font-medium hidden sm:inline">
                    ✧ សិរីមង្គលអាពាហ៍ពិពាហ៍ ✧
                  </span>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Admin Only: Direct Replace & Delete */}
                    {isAdmin && (
                      <>
                        <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#3D101E] border border-[#C5A059]/60 text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>ដូររូបថ្មី</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleReplacePhotoFile(idx, e)}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={(e) => handleDeletePhoto(idx, e)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                          title="លុបរូបនេះចេញ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>លុប</span>
                        </button>
                      </>
                    )}

                    {/* Zoom button for all guests */}
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>ពង្រីក</span>
                    </button>
                  </div>
                </div>

                {/* Small decorative connector flourish between cards */}
                {idx < photos.length - 1 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-white border border-[#C5A059]/40 flex items-center justify-center shadow-xs">
                      <Heart className="w-2.5 h-2.5 fill-[#C5A059] text-[#C5A059]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Mode 2: GRID DISPLAY (ក្រឡាចត្រង្គ) */}
      {photos.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-[#C5A059]/30 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <img
                src={photoUrl}
                alt={`Pre-wedding photo ${idx + 1}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-[#3D101E]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white/90 text-[#3D101E] flex items-center justify-center shadow-md">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              {/* Top Action Buttons (Replace & Delete) - ADMIN ONLY */}
              {isAdmin && (
                <div
                  className="absolute top-2 right-2 z-30 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Replace Button */}
                  <label
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 hover:bg-white text-[#3D101E] text-[10px] font-kantumruy font-bold shadow-md hover:scale-105 active:scale-95 transition-all border border-[#C5A059]/60 cursor-pointer"
                    title="ដូររូបថ្មី"
                  >
                    <Upload className="w-3 h-3 text-[#C5A059]" />
                    <span>ដូររូប</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleReplacePhotoFile(idx, e)}
                    />
                  </label>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeletePhoto(idx, e)}
                    className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-red-600 text-white text-[10px] font-kantumruy font-bold shadow-md hover:bg-red-700 active:scale-90 transition-all border border-white/40 cursor-pointer"
                    title="ចុចដើម្បីលុបរូបនេះចេញ"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>លុប</span>
                  </button>
                </div>
              )}

              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] text-white font-cinzel drop-shadow-md pointer-events-none">
                <span className="bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  Photo 0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Full Screen View */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="បិទរូបភាព"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 z-50 p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="រូបមុន"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Current Image and Action Bar */}
          <div
            className="relative max-w-3xl max-h-[88vh] p-2 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Wedding photo ${selectedPhotoIndex + 1}`}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto mx-auto rounded-2xl shadow-2xl object-contain border border-[#C5A059]/40"
            />
            
            <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-md mt-3 px-2">
              <span className="text-white/90 font-cinzel text-xs font-semibold">
                {selectedPhotoIndex + 1} / {photos.length}
              </span>

              <div className="flex items-center gap-2">
                {/* Replace Photo in Lightbox */}
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-[#3D101E] font-kantumruy text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>ដូររូបថ្មី</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleReplacePhotoFile(selectedPhotoIndex, e)}
                  />
                </label>

                {/* Delete from lightbox */}
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(selectedPhotoIndex)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-kantumruy text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>លុបរូបនេះចេញ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Next button */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="រូបបន្ទាប់"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
