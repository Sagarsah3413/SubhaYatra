import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import neTranslations from './locales/ne.json';
import hiTranslations from './locales/hi.json';
import zhTranslations from './locales/zh.json';
import jaTranslations from './locales/ja.json';
import koTranslations from './locales/ko.json';

const resources = {
  en: {
    translation: enTranslations
  },
  ne: {
    translation: neTranslations
  },
  hi: {
    translation: hiTranslations
  },
  zh: {
    translation: zhTranslations
  },
  ja: {
    translation: jaTranslations
  },
  ko: {
    translation: koTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;