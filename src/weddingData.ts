export interface WeddingScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  iconType: 'fruits' | 'haircut' | 'blessing' | 'banquet' | 'cake' | 'music';
}

export interface BankQRInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  qrImage: string;
  note: string;
}

export interface GuestWish {
  id: string;
  name: string;
  affiliation: 'groom' | 'bride' | 'both';
  attending: 'yes' | 'no';
  guestCount: number;
  message: string;
  timestamp: string;
  likes: number;
}

export interface WeddingTheme {
  coverBgStyle?: 'crimson' | 'gold' | 'rose' | 'white' | 'emerald';
  coverCustomBgImage?: string;
  pageBgColor?: string;
  pageCustomBgImage?: string;
  bgVideoUrl?: string;
  showFallingPetals?: boolean;
  enableMusic?: boolean;
  audioUrl?: string;
}

export interface WeddingData {
  title: string;
  greetingTitle: string;
  guestPlaceholder: string;
  invitationBlessing: string;
  
  // Groom's side
  groomNameKhmer: string;
  groomNameLatin: string;
  groomFatherName: string;
  groomMotherName: string;
  groomBank: BankQRInfo;

  // Bride's side
  brideNameKhmer: string;
  brideNameLatin: string;
  brideFatherName: string;
  brideMotherName: string;
  brideBank: BankQRInfo;

  // Ceremony Dates & Location
  solarDate: string;
  lunarDate: string;
  calendarTargetDate: string; // ISO date for countdown
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  mapImage: string;

  // Schedules
  morningSchedule: WeddingScheduleItem[];
  eveningSchedule: WeddingScheduleItem[];

  // Gallery & Video
  galleryPhotos: string[];
  videoUrl?: string;

  // Background & Theme customization
  theme?: WeddingTheme;

  // Admin PIN protection (Default: 168)
  adminPin?: string;
}

export const DEFAULT_WEDDING_DATA: WeddingData = {
  "adminPin": "168",
  "title": "សិរីមង្គលអាពាហ៍ពិពាហ៍",
  "greetingTitle": "សូមគោរពអញ្ជើញ",
  "guestPlaceholder": "ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា",
  "invitationBlessing": "យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា និងប្រិយមិត្តជិតឆ្ងាយទាំងអស់ មេត្តាអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខ ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស កូនស្រី របស់យើងខ្ញុំ។",
  "groomNameKhmer": "ប៊ុន ចាន់ធារិទ្ធិ",
  "groomNameLatin": "Bun Chanthearith",
  "groomFatherName": "លោក ចាន់ សុម៉ាលី",
  "groomMotherName": "លោកស្រី ប៊ុន បឿន",
  "groomBank": {
    "bankName": "ABA Bank",
    "accountName": "BUN CHANTHEARITH",
    "accountNumber": "001 568 992",
    "currency": "USD / KHR",
    "qrImage": "/images/khmer_wedding_rings_1791108478647.jpg",
    "note": "ស្កេនផ្ញើចំណងដៃជូនកូនប្រុស ប៊ុន ចាន់ធារិទ្ធិ តាមរយៈ ABA / Bakong"
  },
  "brideNameKhmer": "យឺន រក្សា",
  "brideNameLatin": "Yoen Reaksa",
  "brideFatherName": "លោក សេង វណ្ណា",
  "brideMotherName": "លោកស្រី ម៉ៅ សុភាព",
  "brideBank": {
    "bankName": "Bakong / ABA Bank",
    "accountName": "SENG BOPHA",
    "accountNumber": "002 789 456",
    "currency": "USD / KHR",
    "qrImage": "/images/khmer_wedding_rings_1791108478647.jpg",
    "note": "ស្កេនផ្ញើចំណងដៃជូនកូនស្រីតាមរយៈ Bakong / ABA"
  },
  "solarDate": "ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦",
  "lunarDate": "ថ្ងៃអាទិត្យ ៥កើត ខែកត្តិក ឆ្នាំរោង ឆស័ក ព.ស. ២៥៦៨",
  "calendarTargetDate": "2026-11-15T07:00:00",
  "venueName": "មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ (អគារ G)",
  "venueAddress": "អគារ G, មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ, សង្កាត់ទន្លេបាសាក់, ខណ្ឌចំការមន, រាជធានីភ្នំពេញ",
  "googleMapsUrl": "https://maps.google.com/?q=Koh+Pich+Convention+and+Exhibition+Center+Building+G+Phnom+Penh",
  "mapImage": "/images/khmer_wedding_reception_hall_1791108491974.jpg",
  "morningSchedule": [
    {
      "id": "m1",
      "time": "០៦:៣០ ព្រឹក",
      "title": "ពិធីជួបជុំភ្ញៀវកិត្តិយស",
      "description": "ជួបជុំបងប្អូនញាតិមិត្ត និងភ្ញៀវកិត្តិយសទាំងអស់ដើម្បីត្រៀមក្បួនហែ",
      "iconType": "fruits"
    },
    {
      "id": "m2",
      "time": "០៧:០០ ព្រឹក",
      "title": "ពិធីហែជំនូន និងផ្លែឈើបណ្ណាការ",
      "description": "ក្បួនហែជំនូនផ្លែឈើចូលគេហដ្ឋានខាងស្រី ប្រគល់ជំនូនបណ្ណាការ",
      "iconType": "blessing"
    },
    {
      "id": "m3",
      "time": "០៨:៣០ ព្រឹក",
      "title": "ពិធីពិសាអាហារពេលព្រឹក",
      "description": "ទទួលទានអាហារពេលព្រឹកប្រកបដោយសាមគ្គីភាព និងសេចក្តីរីករាយ",
      "iconType": "fruits"
    },
    {
      "id": "m4",
      "time": "០៩:០០ ព្រឹក",
      "title": "ពិធីសំពះផ្ទឹម និងកាត់សក់បង្កក់សិរី",
      "description": "ពិធីកាត់សក់ជម្រះគ្រោះចង្រៃ និងសំពះផ្ទឹមទទួលពរជ័យពីមាតាបិតា",
      "iconType": "haircut"
    },
    {
      "id": "m5",
      "time": "១០:៣០ ព្រឹក",
      "title": "ពិធីចងដៃ និងបង្វិលពពិល",
      "description": "ញាតិមិត្តជិតឆ្ងាយចងដៃសែនព្រេន និងបង្វិលពពិលប្រសិទ្ធពរជ័យ",
      "iconType": "blessing"
    }
  ],
  "eveningSchedule": [
    {
      "id": "e1",
      "time": "០៥:០០ ល្ងាច",
      "title": "ពិធីទទួលបដិសណ្ឋារកិច្ច និងថតរូប",
      "description": "ស្វាគមន៍ភ្ញៀវកិត្តិយស និងថតរូបអនុស្សាវរីយ៍មុខក្លោងទ្វារអាពាហ៍ពិពាហ៍",
      "iconType": "blessing"
    },
    {
      "id": "e2",
      "time": "០៦:០០ ល្ងាច",
      "title": "ពិធីពិសាភោជនាហារ និងកាត់នំខេក",
      "description": "ពិធីជប់លៀងពិសាភោជនាហារពេលល្ងាច និងពិធីកាត់នំអាពាហ៍ពិពាហ៍",
      "iconType": "cake"
    },
    {
      "id": "e3",
      "time": "០៨:០០ យប់",
      "title": "កម្មវិធីតន្ត្រី និងរាំកម្សាន្ត",
      "description": "រាំកម្សាន្តប្រពៃណី និងសម័យ អបអរសាទរគូស្វាមីភរិយាថ្មី",
      "iconType": "music"
    }
  ],
  "galleryPhotos": [
    "/assets/aistudio/IMG_9276_82dea8b5.JPG",
    "/assets/aistudio/IMG_9275_746d52a9.JPG",
    "/assets/aistudio/IMG_9278_ffef013e.JPG",
    "/assets/aistudio/IMG_9273_1af6dc47.JPG",
    "/assets/aistudio/IMG_9281_c5cef5a9.JPG",
    "/assets/aistudio/IMG_9282_16c72082.JPG",
    "/assets/aistudio/IMG_9283_802241a0.JPG",
    "/assets/aistudio/IMG_9284_9abf23de.JPG"
  ],
  "videoUrl": "/assets/aistudio/prewedding_bg_video.mp4",
  "theme": {
    "enableMusic": true,
    "audioUrl": "/assets/aistudio/1108__1__dd18293f.MP3",
    "showFallingPetals": true,
    "coverBgStyle": "crimson",
    "coverCustomBgImage": "/assets/aistudio/IMG_9276_82dea8b5.JPG",
    "pageBgColor": "#FFFFFF",
    "bgVideoUrl": "/assets/aistudio/prewedding_bg_video.mp4"
  }
};

export const INITIAL_GUEST_WISHES: GuestWish[] = [
  {
    id: "w1",
    name: "ឯកឧត្តម ជា សុវណ្ណ និងលោកជំទាវ",
    affiliation: "both",
    attending: "yes",
    guestCount: 2,
    message: "សូមប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខ កើតមានដល់ក្មួយប្រុសក្មួយស្រី ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង មានសុភមង្គល និងទ្រព្យសម្បត្តិស្តុកស្តម្ភ!",
    timestamp: "២ ម៉ោងមុន",
    likes: 12
  },
  {
    id: "w2",
    name: "បងប្រុស រ័ត្ន និងក្រុមគ្រួសារ",
    affiliation: "groom",
    attending: "yes",
    guestCount: 2,
    message: "អបអរសាទរមង្គលការប្អូនប្រុសចំរើន និងប្អូនស្រីបុប្ផា! សូមឱ្យគ្រួសារថ្មីនេះមានតែស្នាមញញឹម សេចក្តីសុខ និងទទួលបានកូនចៅជាទីគាប់ចិត្ត!",
    timestamp: "៥ ម៉ោងមុន",
    likes: 8
  },
  {
    id: "w3",
    name: "កញ្ញា លីដា និងមិត្តភក្តិវិទ្យាល័យ",
    affiliation: "bride",
    attending: "yes",
    guestCount: 1,
    message: "Happy Wedding dearest Bopha! កូនក្រមុំស្អាតខ្លាំងណាស់ថ្ងៃនេះ សូមជូនពរឱ្យគូស្វាមីភរិយាថ្មីមានសុភមង្គលជានិរន្តរ៍!",
    timestamp: "១ ថ្ងៃមុន",
    likes: 15
  }
];

const STORAGE_KEY = "khmer_wedding_custom_data_v2";
const WISHES_KEY = "khmer_wedding_wishes_v1";

export function loadWeddingData(): WeddingData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const mergedTheme = {
        ...DEFAULT_WEDDING_DATA.theme,
        ...(parsed.theme || {})
      };

      // Always ensure the user's requested song and looping are enabled
      mergedTheme.enableMusic = true;
      mergedTheme.audioUrl = "/assets/aistudio/1108__1__dd18293f.MP3";

      // Always ensure the user's requested background video
      if (!mergedTheme.bgVideoUrl) {
        mergedTheme.bgVideoUrl = "/assets/aistudio/prewedding_bg_video.mp4";
      }

      // Automatically migrate to user's real photoshoot images if still holding placeholder mock images
      let galleryPhotos = parsed.galleryPhotos;
      const hasOldMockPhotos = Array.isArray(galleryPhotos) &&
        galleryPhotos.some((p: string) => typeof p === 'string' && p.startsWith('/images/khmer_wedding_'));

      if (!Array.isArray(galleryPhotos) || galleryPhotos.length === 0 || hasOldMockPhotos) {
        galleryPhotos = DEFAULT_WEDDING_DATA.galleryPhotos;
      }

      // Ensure cover custom background uses couple's real photo if not customized
      if (!mergedTheme.coverCustomBgImage || mergedTheme.coverCustomBgImage.startsWith('/images/khmer_wedding_')) {
        mergedTheme.coverCustomBgImage = "/assets/aistudio/IMG_9276_82dea8b5.JPG";
      }

      return {
        ...DEFAULT_WEDDING_DATA,
        ...parsed,
        videoUrl: parsed.videoUrl || "/assets/aistudio/prewedding_bg_video.mp4",
        galleryPhotos,
        theme: mergedTheme
      };
    }
  } catch (err) {
    console.warn("Failed to load wedding data from localStorage", err);
  }
  return DEFAULT_WEDDING_DATA;
}

export async function fetchServerWeddingData(): Promise<WeddingData | null> {
  try {
    const res = await fetch('/api/wedding-data');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        return data as WeddingData;
      }
    }
  } catch (err) {
    console.log("Server API not reachable or offline", err);
  }
  return null;
}

export function saveWeddingData(data: WeddingData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save wedding data to localStorage", err);
  }

  // Auto-sync with backend to rewrite src/weddingData.ts on disk!
  try {
    const adminPin = sessionStorage.getItem('khmer_wedding_admin_pin') || data.adminPin || '168';
    fetch('/api/save-wedding-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': adminPin
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(res => {
        console.log(">>> [AUTO-CODE-SYNC]", res.message);
      })
      .catch(err => {
        console.warn("Backend code auto-sync warning:", err);
      });
  } catch (err) {
    console.warn("Could not dispatch code auto-sync", err);
  }
}

export function resetWeddingData(): WeddingData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to reset wedding data", err);
  }
  return DEFAULT_WEDDING_DATA;
}

export function loadGuestWishes(): GuestWish[] {
  try {
    const saved = localStorage.getItem(WISHES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn("Failed to load guest wishes", err);
  }
  return INITIAL_GUEST_WISHES;
}

export function saveGuestWishes(wishes: GuestWish[]): void {
  try {
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
  } catch (err) {
    console.error("Failed to save guest wishes", err);
  }
}
