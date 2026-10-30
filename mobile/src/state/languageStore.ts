import { create } from 'zustand';

export type LanguageCode = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    // Navigation
    home: string;
    stock: string;
    scan: string;
    bills: string;
    alerts: string;
    profile: string;

    // Dashboard
    overviewToday: string;
    totalSales: string;
    grossProfit: string;
    stockValue: string;
    stockHealth: string;
    lowStock: string;
    expiringSoon: string;
    coreOps: string;
    scanAdd: string;
    quickPOS: string;
    suppliers: string;
    reports: string;
    recentMovements: string;
    reorderPO: string;

    // Login
    mobileNumber: string;
    getOtp: string;
    verifyOtp: string;
    freeForever: string;

    // Profile & Settings
    shopProfile: string;
    shopName: string;
    ownerPhone: string;
    gstin: string;
    language: string;
    selectLanguage: string;
    english: string;
    hindi: string;
    marathi: string;
    invoiceSettings: string;
    exportData: string;
    logout: string;
    save: string;
  };
}

export const translations: Translations = {
  en: {
    home: 'Home',
    stock: 'Stock',
    scan: 'Scan',
    bills: 'Bills',
    alerts: 'Alerts',
    profile: 'Profile',

    overviewToday: 'Today Overview',
    totalSales: 'Total Sales',
    grossProfit: 'Profit',
    stockValue: 'Stock Value',
    stockHealth: 'Stock Health',
    lowStock: 'Low Stock',
    expiringSoon: 'Expiring Soon',
    coreOps: 'Quick Actions',
    scanAdd: 'Photo Scan',
    quickPOS: 'POS Bill',
    suppliers: 'Suppliers',
    reports: 'Reports',
    recentMovements: 'Recent Movements',
    reorderPO: 'Reorder via WhatsApp',

    mobileNumber: 'Enter Mobile Number',
    getOtp: 'Get OTP',
    verifyOtp: 'Verify & Login',
    freeForever: '100% Free Forever',

    shopProfile: 'Shop Profile',
    shopName: 'Shop Name',
    ownerPhone: 'Mobile Number',
    gstin: 'GST Number',
    language: 'App Language',
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    marathi: 'मराठी (Marathi)',
    invoiceSettings: 'Bill & Invoice Settings',
    exportData: 'Download Excel / CSV',
    logout: 'Log Out',
    save: 'Save Changes',
  },
  hi: {
    home: 'होम',
    stock: 'स्टॉक',
    scan: 'स्कैन',
    bills: 'बिल',
    alerts: 'अलर्ट',
    profile: 'प्रोफाइल',

    overviewToday: 'आज का हिसाब',
    totalSales: 'कुल बिक्री',
    grossProfit: 'मुनाफ़ा',
    stockValue: 'स्टॉक कीमत',
    stockHealth: 'स्टॉक स्थिति',
    lowStock: 'कम स्टॉक',
    expiringSoon: 'जल्द एक्सपायर',
    coreOps: 'त्वरित कार्य',
    scanAdd: 'फ़ोटो स्कैन',
    quickPOS: 'पक्का बिल',
    suppliers: 'सप्लायर',
    reports: 'रिपोर्ट',
    recentMovements: 'हाल की हलचल',
    reorderPO: 'व्हाट्सएप से आर्डर दें',

    mobileNumber: 'मोबाइल नंबर दर्ज करें',
    getOtp: 'OTP भेजें',
    verifyOtp: 'लॉगिन करें',
    freeForever: 'हमेशा के लिए 100% मुफ़्त',

    shopProfile: 'दुकान प्रोफाइल',
    shopName: 'दुकान का नाम',
    ownerPhone: 'मोबाइल नंबर',
    gstin: 'जीएसटी नंबर',
    language: 'ऐप की भाषा',
    selectLanguage: 'भाषा चुनें',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    marathi: 'मराठी (Marathi)',
    invoiceSettings: 'बिल सेटिंग्स',
    exportData: 'एक्सेल डाउनलोड करें',
    logout: 'लॉग आउट',
    save: 'सेव करें',
  },
  mr: {
    home: 'होम',
    stock: 'स्टॉक',
    scan: 'स्कॅन',
    bills: 'बिल',
    alerts: 'अलर्ट',
    profile: 'प्रोफाइल',

    overviewToday: 'आजचा हिशोब',
    totalSales: 'एकूण विक्री',
    grossProfit: 'नफा',
    stockValue: 'स्टॉक मूल्य',
    stockHealth: 'स्टॉक स्थिती',
    lowStock: 'कमी स्टॉक',
    expiringSoon: 'लवकर संपणारे',
    coreOps: 'जलद कृती',
    scanAdd: 'फोटो स्कॅन',
    quickPOS: 'POS बिल',
    suppliers: 'पुरवठादार',
    reports: 'रिपोर्ट्स',
    recentMovements: 'नुकतीच झालेली हालचाल',
    reorderPO: 'व्हॉट्सअ‍ॅपवर ऑर्डर करा',

    mobileNumber: 'मोबाईल नंबर टाका',
    getOtp: 'OTP पाठवा',
    verifyOtp: 'लॉगिन करा',
    freeForever: 'कायमस्वरूपी १००% मोफत',

    shopProfile: 'दुकानाची माहिती',
    shopName: 'दुकानाचे नाव',
    ownerPhone: 'मोबाईल क्रमांक',
    gstin: 'जीएसटी क्रमांक',
    language: 'अ‍ॅपची भाषा',
    selectLanguage: 'भाषा निवडा',
    english: 'English',
    hindi: 'हिन्दी (Hindi)',
    marathi: 'मराठी (Marathi)',
    invoiceSettings: 'बिल सेटिंग्ज',
    exportData: 'एक्सेल डाउनलोड करा',
    logout: 'बाहेर पडा (Logout)',
    save: 'जतन करा',
  },
};

interface LanguageState {
  lang: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations['en'];
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  lang: 'en',
  setLanguage: (lang: LanguageCode) => set({ lang, t: translations[lang] }),
  t: translations.en,
}));
