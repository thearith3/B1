import React, { useState, useEffect, useRef } from 'react';
import { WeddingData, resetWeddingData } from '../weddingData';
import {
  Settings,
  X,
  Save,
  RotateCcw,
  Upload,
  Image,
  Plus,
  Trash2,
  Download,
  FileUp,
  Lock,
  Palette,
  CheckCircle2,
  Loader2,
  Check,
  Music,
  VolumeX
} from 'lucide-react';

interface AdminEditModalProps {
  data: WeddingData;
  onSave: (newData: WeddingData) => void;
  onReset: () => void;
  onLogout?: () => void;
  isDoorsOpen?: boolean;
}

export const AdminEditModal: React.FC<AdminEditModalProps> = ({ data, onSave, onReset, onLogout, isDoorsOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<WeddingData>(data);
  const [activeTab, setActiveTab] = useState<'couple' | 'dates' | 'photos' | 'bank' | 'theme'>('couple');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Auto-Save State
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'editing' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(true);

  const lastSavedJsonRef = useRef<string>(JSON.stringify(data));
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestFormDataRef = useRef<WeddingData>(formData);
  latestFormDataRef.current = formData;

  // Sync formData when data prop changes or modal opens
  const handleOpenModal = () => {
    const cloned = JSON.parse(JSON.stringify(data));
    setFormData(cloned);
    lastSavedJsonRef.current = JSON.stringify(cloned);
    setAutoSaveStatus('idle');
    setIsOpen(true);
  };

  // Immediate save execution
  const executeSave = (dataToSave: WeddingData) => {
    try {
      setAutoSaveStatus('saving');
      onSave(dataToSave);
      lastSavedJsonRef.current = JSON.stringify(dataToSave);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLastSavedTime(timeStr);
      setAutoSaveStatus('saved');
    } catch (err) {
      console.error('Failed to auto-save wedding data:', err);
      setAutoSaveStatus('idle');
    }
  };

  // Debounced Auto-Save effect whenever formData changes
  useEffect(() => {
    if (!isOpen || !isAutoSaveEnabled) return;
    const currentJson = JSON.stringify(formData);
    if (currentJson === lastSavedJsonRef.current) return;

    setAutoSaveStatus('editing');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSave(formData);
    }, 700);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData, isOpen, isAutoSaveEnabled]);

  // Clean close ensuring any pending changes are immediately saved
  const handleCloseModal = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const currentJson = JSON.stringify(latestFormDataRef.current);
    if (currentJson !== lastSavedJsonRef.current) {
      executeSave(latestFormDataRef.current);
    }
    setIsOpen(false);
  };

  const handleInputChange = (field: keyof WeddingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: 'groomBank' | 'brideBank', field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Convert uploaded image file to Base64 string
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 4MB for localStorage)
    if (file.size > 4 * 1024 * 1024) {
      alert("ទំហំរូបភាពធំពេក (សូមជ្រើសរើសរូបភាពក្រោម 4MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onComplete(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    executeSave(formData);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setIsOpen(false);
    }, 1000);
  };

  const handleResetToDefault = () => {
    if (window.confirm("តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញទៅតាមលំនាំដើមមែនទេ?")) {
      onReset();
      setIsOpen(false);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `khmer_wedding_config_${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setFormData(parsed);
        setImportNotice("✓ បាននាំចូលទិន្នន័យដោយជោគជ័យ! សូមចុច 'រក្សាទុក' ដើម្បីអនុវត្ត។");
        setTimeout(() => setImportNotice(null), 4000);
      } catch (err) {
        setImportNotice("✕ ឯកសារ JSON មិនត្រឹមត្រូវ!");
        setTimeout(() => setImportNotice(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {/* Floating Edit Button - Top Right when doors closed, Bottom Right when doors open */}
      <div
        className={`fixed z-60 transition-all duration-300 ${
          isDoorsOpen
            ? 'bottom-4 right-4 sm:bottom-6 sm:right-6'
            : 'top-3 right-3 sm:top-4 sm:right-4'
        }`}
      >
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#3D101E] to-[#601930] border-2 border-[#C5A059] text-[#FFE5A3] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group ring-4 ring-[#C5A059]/20"
          title="កែសម្រួលទិន្នន័យលិខិតអញ្ជើញ"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE5A3] group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-kantumruy font-bold text-xs sm:text-sm tracking-wide">
            កែសម្រួល (Edit)
          </span>
        </button>
      </div>

      {/* Admin Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-70 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92dvh] sm:max-h-[90vh] flex flex-col shadow-2xl border-2 border-[#C5A059] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-3 py-2.5 sm:px-6 sm:py-3.5 bg-gradient-to-r from-[#3D101E] to-[#24060E] text-white flex items-center justify-between border-b border-[#C5A059]/40 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059] shrink-0" />
                <h3 className="font-moul text-xs sm:text-base text-[#FFE5A3] truncate">
                  ផ្ទាំងកែសម្រួល
                </h3>

                {/* Auto-Save Status Badge */}
                <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/40 border border-[#C5A059]/40 text-[10px] sm:text-xs font-kantumruy">
                  {autoSaveStatus === 'saving' && (
                    <span className="flex items-center gap-1 text-amber-300 animate-pulse font-medium">
                      <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                      <span className="hidden xs:inline">កំពុង Auto-save...</span>
                      <span className="xs:hidden">Saving...</span>
                    </span>
                  )}
                  {autoSaveStatus === 'editing' && (
                    <span className="flex items-center gap-1 text-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="hidden xs:inline">កំពុងកែប្រែ...</span>
                      <span className="xs:hidden">Editing...</span>
                    </span>
                  )}
                  {(autoSaveStatus === 'saved' || autoSaveStatus === 'idle') && (
                    <span className="flex items-center gap-1 text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="hidden sm:inline">Auto-save រួចរាល់</span>
                      <span className="sm:hidden">Auto-saved</span>
                      {lastSavedTime && <span className="opacity-80 text-[9px] font-mono hidden md:inline">({lastSavedTime})</span>}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Auto-save Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
                  className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-kantumruy border transition-colors ${
                    isAutoSaveEnabled
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-600 text-slate-400'
                  }`}
                  title={isAutoSaveEnabled ? 'Auto-save កំពុងបើក (ចុចដើម្បីបិទ)' : 'Auto-save ត្រូវបានបិទ (ចុចដើម្បីបើក)'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isAutoSaveEnabled ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                  <span className="hidden sm:inline">Auto-save:</span>
                  <span>{isAutoSaveEnabled ? 'បើក (ON)' : 'បិទ (OFF)'}</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      handleCloseModal();
                      onLogout();
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg bg-black/40 hover:bg-black/60 text-amber-200 text-[10px] sm:text-xs font-kantumruy border border-[#C5A059]/40 transition-colors"
                    title="ចាកចេញពី Admin (ដើម្បីមើលក្នុងនាមជាភ្ញៀវ)"
                  >
                    <Lock className="w-3 h-3 text-[#C5A059]" />
                    <span className="hidden sm:inline">ចាកចេញ</span>
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  aria-label="បិទផ្ទាំង"
                  title="បិទផ្ទាំងកែសម្រួល"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success Banner */}
            {saveSuccessNotice && (
              <div className="bg-emerald-600 text-white text-xs font-kantumruy py-2 px-4 text-center font-bold animate-pulse">
                ✓ បានរក្សាទុកការកែប្រែដោយជោគជ័យ! ទិន្នន័យបានធ្វើបច្ចុប្បន្នភាពភ្លាមៗ។
              </div>
            )}

            {importNotice && (
              <div className="bg-blue-600 text-white text-xs font-kantumruy py-2 px-4 text-center font-bold">
                {importNotice}
              </div>
            )}

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('couple')}
                className={`py-3 px-4 font-kantumruy text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'couple'
                    ? 'border-[#C5A059] text-[#3D101E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                គូស្នេហ៍ &amp; មាតាបិតា
              </button>
              <button
                onClick={() => setActiveTab('dates')}
                className={`py-3 px-4 font-kantumruy text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'dates'
                    ? 'border-[#C5A059] text-[#3D101E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                កាលបរិច្ឆេទ &amp; ទីតាំង
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-3 px-4 font-kantumruy text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'photos'
                    ? 'border-[#C5A059] text-[#3D101E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                រូបថត &amp; វិចិត្រសាល
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className={`py-3 px-4 font-kantumruy text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'bank'
                    ? 'border-[#C5A059] text-[#3D101E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ចំណងដៃធនាគារ (QR)
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`py-3 px-4 font-kantumruy text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'theme'
                    ? 'border-[#C5A059] text-[#3D101E]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>ផ្ទៃខាងក្រោយ &amp; តន្ត្រី</span>
              </button>
            </div>

            {/* Modal Body / Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm font-kantumruy text-slate-700">
              {/* Tab 1: Couple & Parents */}
              {activeTab === 'couple' && (
                <div className="space-y-6">
                  {/* Title & Invitation Prose */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ចំណងជើងកម្មវិធី (Title)
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ពាក្យស្វាគមន៍ភ្ញៀវលើទ្វារបើក
                      </label>
                      <input
                        type="text"
                        value={formData.guestPlaceholder}
                        onChange={(e) => handleInputChange('guestPlaceholder', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      សេចក្តីគោរពអញ្ជើញ (Invitation Blessing Text)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.invitationBlessing}
                      onChange={(e) => handleInputChange('invitationBlessing', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Groom Details */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-4">
                    <h4 className="font-moul text-sm text-[#3D101E]">
                      ព័ត៌មានខាងកូនប្រុស (Groom Information)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះកូនប្រុស (ខ្មែរ)
                        </label>
                        <input
                          type="text"
                          value={formData.groomNameKhmer}
                          onChange={(e) => handleInputChange('groomNameKhmer', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះកូនប្រុស (ឡាតាំង/English)
                        </label>
                        <input
                          type="text"
                          value={formData.groomNameLatin}
                          onChange={(e) => handleInputChange('groomNameLatin', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឪពុកកូនប្រុស
                        </label>
                        <input
                          type="text"
                          value={formData.groomFatherName}
                          onChange={(e) => handleInputChange('groomFatherName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ម្តាយកូនប្រុស
                        </label>
                        <input
                          type="text"
                          value={formData.groomMotherName}
                          onChange={(e) => handleInputChange('groomMotherName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bride Details */}
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-4">
                    <h4 className="font-moul text-sm text-[#3D101E]">
                      ព័ត៌មានខាងកូនស្រី (Bride Information)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះកូនស្រី (ខ្មែរ)
                        </label>
                        <input
                          type="text"
                          value={formData.brideNameKhmer}
                          onChange={(e) => handleInputChange('brideNameKhmer', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះកូនស្រី (ឡាតាំង/English)
                        </label>
                        <input
                          type="text"
                          value={formData.brideNameLatin}
                          onChange={(e) => handleInputChange('brideNameLatin', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឪពុកកូនស្រី
                        </label>
                        <input
                          type="text"
                          value={formData.brideFatherName}
                          onChange={(e) => handleInputChange('brideFatherName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ម្តាយកូនស្រី
                        </label>
                        <input
                          type="text"
                          value={formData.brideMotherName}
                          onChange={(e) => handleInputChange('brideMotherName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Date & Venue */}
              {activeTab === 'dates' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        កាលបរិច្ឆេទសុរិយគតិ (Solar Date)
                      </label>
                      <input
                        type="text"
                        value={formData.solarDate}
                        onChange={(e) => handleInputChange('solarDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        កាលបរិច្ឆេទចន្ទគតិ (Khmer Lunar Date)
                      </label>
                      <input
                        type="text"
                        value={formData.lunarDate}
                        onChange={(e) => handleInputChange('lunarDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ឈ្មោះទីតាំងកម្មវិធី (Venue Name)
                    </label>
                    <input
                      type="text"
                      value={formData.venueName}
                      onChange={(e) => handleInputChange('venueName', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      អាសយដ្ឋានពេញលេញ (Full Address)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.venueAddress}
                      onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      តំណភ្ជាប់ Google Maps URL
                    </label>
                    <input
                      type="text"
                      value={formData.googleMapsUrl}
                      onChange={(e) => handleInputChange('googleMapsUrl', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs sm:text-sm font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Photos Gallery & Upload */}
              {activeTab === 'photos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-moul text-sm text-[#3D101E]">
                        គ្រប់គ្រងវិចិត្រសាលរូបថត
                      </h4>
                      <p className="text-xs text-slate-500">
                        បញ្ចូលរូបថត Pre-wedding ថ្មី ឬផ្ទុកឡើងរូបភាពផ្ទាល់ខ្លួន (Base64)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.galleryPhotos.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("តើអ្នកពិតជាចង់លុបរូបថតទាំងអស់ចេញមែនទេ?")) {
                              setFormData((prev) => ({ ...prev, galleryPhotos: [] }));
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-kantumruy font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>លុបទាំងអស់</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              galleryPhotos: [
                                "/assets/aistudio/IMG_9276_82dea8b5.JPG",
                                "/assets/aistudio/IMG_9275_746d52a9.JPG",
                                "/assets/aistudio/IMG_9278_ffef013e.JPG",
                                "/assets/aistudio/IMG_9273_1af6dc47.JPG",
                                "/assets/aistudio/IMG_9281_c5cef5a9.JPG",
                                "/assets/aistudio/IMG_9282_16c72082.JPG",
                                "/assets/aistudio/IMG_9283_802241a0.JPG",
                                "/assets/aistudio/IMG_9284_9abf23de.JPG"
                              ]
                            }));
                          }}
                          className="px-3 py-2 rounded-xl bg-amber-100 text-[#3D101E] hover:bg-amber-200 border border-[#C5A059] text-xs font-kantumruy font-semibold cursor-pointer"
                        >
                          <span>កំណត់រូបដើមវិញ</span>
                        </button>
                      )}

                      {/* Add Image Upload Button */}
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#3D101E] text-[#FFE5A3] font-kantumruy text-xs font-medium hover:brightness-110 shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>ផ្ទុកឡើងរូបថ្មី</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (base64) => {
                              setFormData((prev) => ({
                                ...prev,
                                galleryPhotos: [...prev.galleryPhotos, base64]
                              }));
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pre-wedding Video Configuration */}
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      វីដេអូអនុស្សាវរីយ៍ Pre-Wedding (Video Source / URL)
                    </label>
                    <input
                      type="text"
                      value={formData.videoUrl ?? '/assets/aistudio/prewedding_bg_video.mp4'}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      placeholder="/assets/aistudio/prewedding_bg_video.mp4"
                      className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      វីដេអូលំនាំដើម: វីដេអូថតនៅប្រាសាទអង្គរវត្ត (/assets/aistudio/prewedding_bg_video.mp4)
                    </p>
                  </div>

                  {formData.galleryPhotos.length === 0 ? (
                    <div className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                      <p className="font-kantumruy text-xs text-slate-500 mb-3">
                        បានដករូបថតចេញអស់ហើយ។ អ្នកអាចផ្ទុកឡើងរូបថតថ្មីផ្ទាល់ខ្លួនរបស់អ្នក។
                      </p>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D101E] text-[#FFE5A3] font-kantumruy text-xs font-bold">
                        <Upload className="w-4 h-4" />
                        <span>+ ផ្ទុកឡើងរូបថតថ្មីឥឡូវនេះ</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (base64) => {
                              setFormData((prev) => ({
                                ...prev,
                                galleryPhotos: [...prev.galleryPhotos, base64]
                              }));
                            })
                          }
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {formData.galleryPhotos.map((url, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] group bg-slate-50">
                          <img
                            src={url}
                            alt={`Gallery ${i}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {/* Replace Photo Button */}
                          <label
                            className="absolute bottom-1.5 left-1.5 px-2 py-1 rounded-lg bg-black/80 hover:bg-black text-[#FFE5A3] text-[10px] font-kantumruy font-bold shadow-md flex items-center gap-1 active:scale-90 transition-all border border-white/40 cursor-pointer"
                            title="ដូររូបនេះ"
                          >
                            <Upload className="w-3 h-3 text-[#C5A059]" />
                            <span>ដូររូប</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, (base64) => {
                                  setFormData((prev) => {
                                    const updated = [...prev.galleryPhotos];
                                    updated[i] = base64;
                                    return { ...prev, galleryPhotos: updated };
                                  });
                                })
                              }
                            />
                          </label>

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                galleryPhotos: prev.galleryPhotos.filter((_, idx) => idx !== i)
                              }));
                            }}
                            className="absolute top-1.5 right-1.5 px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-kantumruy font-bold shadow-md flex items-center gap-1 active:scale-90 transition-all border border-white/50 cursor-pointer"
                            title="លុបរូបភាពនេះ"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>លុប</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Bank QR Details & Upload */}
              {activeTab === 'bank' && (
                <div className="space-y-6">
                  {/* Groom Bank */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
                    <h4 className="font-moul text-sm text-[#3D101E]">
                      ធនាគារខាងកូនប្រុស (Groom ABA / Bakong)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះធនាគារ
                        </label>
                        <input
                          type="text"
                          value={formData.groomBank.bankName}
                          onChange={(e) => handleNestedChange('groomBank', 'bankName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះម្ចាស់គណនី
                        </label>
                        <input
                          type="text"
                          value={formData.groomBank.accountName}
                          onChange={(e) => handleNestedChange('groomBank', 'accountName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          លេខគណនី
                        </label>
                        <input
                          type="text"
                          value={formData.groomBank.accountNumber}
                          onChange={(e) => handleNestedChange('groomBank', 'accountNumber', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-16 h-16 rounded-xl border bg-white p-1 shrink-0 overflow-hidden">
                        <img
                          src={formData.groomBank.qrImage}
                          alt="Groom QR"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700">
                          <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>ផ្ទុកឡើងរូប QR ថ្មី</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (base64) => {
                                handleNestedChange('groomBank', 'qrImage', base64);
                              })
                            }
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 mt-1">រូបភាព QR Code (PNG/JPG)</p>
                      </div>
                    </div>
                  </div>

                  {/* Bride Bank */}
                  <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3">
                    <h4 className="font-moul text-sm text-[#3D101E]">
                      ធនាគារខាងកូនស្រី (Bride Bakong / ABA)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះធនាគារ
                        </label>
                        <input
                          type="text"
                          value={formData.brideBank.bankName}
                          onChange={(e) => handleNestedChange('brideBank', 'bankName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ឈ្មោះម្ចាស់គណនី
                        </label>
                        <input
                          type="text"
                          value={formData.brideBank.accountName}
                          onChange={(e) => handleNestedChange('brideBank', 'accountName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          លេខគណនី
                        </label>
                        <input
                          type="text"
                          value={formData.brideBank.accountNumber}
                          onChange={(e) => handleNestedChange('brideBank', 'accountNumber', e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-16 h-16 rounded-xl border bg-white p-1 shrink-0 overflow-hidden">
                        <img
                          src={formData.brideBank.qrImage}
                          alt="Bride QR"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700">
                          <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>ផ្ទុកឡើងរូប QR ថ្មី</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (base64) => {
                                handleNestedChange('brideBank', 'qrImage', base64);
                              })
                            }
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 mt-1">រូបភាព QR Code (PNG/JPG)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Background & Theme */}
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  {/* 1. Double-door Cover Style */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-[#C5A059]/40 space-y-4">
                    <div>
                      <h4 className="font-moul text-sm text-[#3D101E] mb-1">
                        ១. ផ្ទៃខាងក្រោយទ្វារបើកលិខិត (Double Door Cover)
                      </h4>
                      <p className="text-xs text-slate-500">
                        ជ្រើសរើសពណ៌ប្រណិត ឬដាក់រូបភាពផ្ទាល់ខ្លួនសម្រាប់ទ្វារបើកខាងមុខ
                      </p>
                    </div>

                    {/* Color Presets */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { id: 'crimson', label: 'ក្រហមប្រពៃណី', bg: 'bg-[#3D101E]', border: 'border-[#C5A059]' },
                        { id: 'gold', label: 'ពណ៌មាសប្រណិត', bg: 'bg-[#5C451F]', border: 'border-[#E5C158]' },
                        { id: 'rose', label: 'ពណ៌ផ្កាឈូក', bg: 'bg-[#4A1624]', border: 'border-[#F472B6]' },
                        { id: 'white', label: 'សក្បុសទំនើប', bg: 'bg-[#F5F2EB]', border: 'border-[#C5A059]' },
                        { id: 'emerald', label: 'ត្បូងមរកត', bg: 'bg-[#0F3826]', border: 'border-[#34D399]' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              theme: {
                                ...prev.theme,
                                coverBgStyle: item.id as any
                              }
                            }));
                          }}
                          className={`p-2.5 rounded-xl border-2 text-left flex flex-col items-center gap-1.5 transition-all ${
                            (formData.theme?.coverBgStyle || 'crimson') === item.id
                              ? `${item.border} ring-2 ring-[#C5A059]/50 shadow-md scale-102`
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${item.bg} border ${item.border} shadow-inner`} />
                          <span className="text-[11px] font-kantumruy font-semibold text-slate-700 text-center">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Cover Image Upload */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        ឬ ផ្ទុកឡើងរូបភាពផ្ទាល់ខ្លួនសម្រាប់ Background ទ្វារបើក៖
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#C5A059] text-xs font-medium text-[#3D101E] hover:bg-amber-50">
                          <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>ជ្រើសរើសរូបភាព</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (base64) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  theme: {
                                    ...prev.theme,
                                    coverCustomBgImage: base64
                                  }
                                }));
                              })
                            }
                          />
                        </label>
                        {formData.theme?.coverCustomBgImage && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600 font-medium">✓ បានដាក់រូបភាពរួចរាល់</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  theme: {
                                    ...prev.theme,
                                    coverCustomBgImage: undefined
                                  }
                                }));
                              }}
                              className="px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-kantumruy hover:bg-red-200"
                            >
                              លុបរូបចេញ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Main Page Background */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div>
                      <h4 className="font-moul text-sm text-[#3D101E] mb-1">
                        ២. ផ្ទៃខាងក្រោយទំព័រទាំងមូល (Main Page Background)
                      </h4>
                      <p className="text-xs text-slate-500">
                        កែសម្រួលពណ៌ផ្ទៃខាងក្រោយនៃទំព័រលិខិតអញ្ជើញ
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { color: '#FFF7F8', label: 'ផ្កាឈូកស្រាល (ដើម)' },
                        { color: '#FFFFFF', label: 'ពណ៌សសុទ្ធ' },
                        { color: '#FAF7F2', label: 'ពណ៌កាតព្វកិច្ច Ivory' },
                        { color: '#F8FAFC', label: 'ពណ៌ប្រផេះស្រាល' },
                      ].map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              theme: {
                                ...prev.theme,
                                pageBgColor: item.color
                              }
                            }));
                          }}
                          className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                            (formData.theme?.pageBgColor || '#FFF7F8') === item.color
                              ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40 bg-white shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-inner shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs font-kantumruy font-medium text-slate-700">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Page Background Image */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        ឬ ផ្ទុកឡើងរូបភាព Background សម្រាប់ទំព័រទាំងមូល៖
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>ជ្រើសរើសរូបភាព</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (base64) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  theme: {
                                    ...prev.theme,
                                    pageCustomBgImage: base64
                                  }
                                }));
                              })
                            }
                          />
                        </label>
                        {formData.theme?.pageCustomBgImage && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600 font-medium">✓ បានដាក់រូបភាពរួចរាល់</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  theme: {
                                    ...prev.theme,
                                    pageCustomBgImage: undefined
                                  }
                                }));
                              }}
                              className="px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-kantumruy hover:bg-red-200"
                            >
                              លុបរូបចេញ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Background Video for Page 2 */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        វិដេអូ Background សម្រាប់ Page ទី២ (រក្សាទុកនៅដដែលពេលអូស)៖
                      </label>
                      <input
                        type="text"
                        value={formData.theme?.bgVideoUrl || '/assets/aistudio/1106__2__e348991e.mp4'}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              bgVideoUrl: e.target.value
                            }
                          }));
                        }}
                        placeholder="តំណភ្ជាប់វិដេអូ Background"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 bg-white outline-none focus:border-[#C5A059]"
                      />
                      <p className="text-[11px] text-emerald-600 font-kantumruy mt-1">
                        ✓ វិដេអូ Pre-wedding កំពុងចាក់ជា Background នៅ Page ទី២ (រក្សាទុកនៅដដែលពេលអូស)
                      </p>
                    </div>
                  </div>

                  {/* 3. Falling Petals Effect */}
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-moul text-sm text-[#3D101E] mb-1">
                        ៣. ផ្កាកុលាបធ្លាក់ (Falling Petals Animation)
                      </h4>
                      <p className="text-xs text-slate-500">
                        បើក ឬបិទ ផ្កាកុលាបធ្លាក់លើអេក្រង់
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.theme?.showFallingPetals !== false}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              showFallingPetals: e.target.checked
                            }
                          }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3D101E]"></div>
                    </label>
                  </div>

                  {/* 4. Wedding Background Music Toggle */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    formData.theme?.enableMusic
                      ? 'bg-amber-50/60 border-[#C5A059]'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {formData.theme?.enableMusic ? (
                          <Music className="w-4 h-4 text-[#C5A059]" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-rose-600" />
                        )}
                        <h4 className="font-moul text-sm text-[#3D101E]">
                          ៤. តន្ត្រីផ្ទៃខាងក្រោយ (Background Music)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        បើក ឬបិទ សំឡេងតន្ត្រី និងប៊ូតុងចាក់ភ្លេងលើអេក្រង់។ (បច្ចុប្បន្ន៖{' '}
                        <strong className={formData.theme?.enableMusic ? 'text-emerald-600' : 'text-rose-600'}>
                          {formData.theme?.enableMusic ? '✓ កំពុងបើកភ្លេង (Loop)' : '✕ បានបិទភ្លេង'}
                        </strong>)
                      </p>
                      {formData.theme?.enableMusic && (
                        <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">
                          ឯកសារបទចម្រៀង៖ {formData.theme?.audioUrl || '/assets/aistudio/1108__1__dd18293f.MP3'}
                        </p>
                      )}
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.theme?.enableMusic === true}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              enableMusic: e.target.checked,
                              audioUrl: prev.theme?.audioUrl || '/assets/aistudio/1108__1__dd18293f.MP3'
                            }
                          }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3D101E]"></div>
                    </label>
                  </div>

                  {/* 5. Security & Admin PIN (ការពារមិនឱ្យភ្ញៀវកែបាន) */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-[#C5A059]/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="font-moul text-sm text-[#3D101E]">
                        ៥. លេខកូដសម្ងាត់ Admin PIN (ការពារមិនឱ្យភ្ញៀវមើលឃើញ ឬកែបាន)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600">
                      កំណត់លេខកូដសម្ងាត់សម្រាប់ Admin។ ពេល Host ឬផ្ញើ Link ទៅភ្ញៀវ ភ្ញៀវនឹងមិនឃើញប៊ូតុងកែ ឬអាចលុបរូបបានឡើយ (អនុញ្ញាតតែអ្នកមានលេខកូដនេះប៉ុណ្ណោះ)។
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="text"
                        value={formData.adminPin || '168'}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            adminPin: e.target.value
                          }));
                        }}
                        placeholder="ឧ. 168"
                        className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono tracking-widest bg-white outline-none focus:border-[#C5A059] max-w-[160px] font-bold"
                      />
                      <span className="text-xs text-slate-500 font-kantumruy">
                        (លេខកូដបច្ចុប្បន្ន៖ <strong className="text-[#3D101E] font-mono">{formData.adminPin || '168'}</strong>)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-kantumruy text-xs font-medium flex items-center gap-1.5 transition-colors"
                  title="កំណត់ទិន្នន័យឡើងវិញទៅតាមលំនាំដើម"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>កំណត់ឡើងវិញ (Reset)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-kantumruy text-xs font-medium flex items-center gap-1 text-slate-700 transition-colors"
                  title="ទាញយកឯកសារ JSON Backup"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <label className="cursor-pointer px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-kantumruy text-xs font-medium flex items-center gap-1 text-slate-700 transition-colors">
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJSON}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Auto-Save Status indicator on footer */}
                <div className="hidden md:flex items-center gap-1.5 text-xs font-kantumruy">
                  {autoSaveStatus === 'saving' ? (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>កំពុង Auto-save...</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Auto-save រួចរាល់</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-kantumruy text-xs font-semibold transition-colors"
                >
                  រួចរាល់ (Done)
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#3D101E] to-[#601930] text-[#FFE5A3] border border-[#C5A059] font-kantumruy text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 flex items-center gap-1.5 transition-all"
                  title="ចុចដើម្បីរក្សាទុកភ្លាមៗ"
                >
                  <Save className="w-4 h-4 text-[#FFE5A3]" />
                  <span>រក្សាទុក (Save)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
