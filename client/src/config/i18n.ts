import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import translationEN from "../locales/en/translation.json";
import translationPT from "../locales/pt/translation.json";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false,
    },
    
    resources: {
      en: {
        translation: translationEN,
      },
      pt: {
        translation: translationPT,
      },
    },
    
    react: {
      useSuspense: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;