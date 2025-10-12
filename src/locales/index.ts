import * as Localization from 'expo-localization'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import en from './en.json'
import vi from './vi.json'

// Get device locale
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en'

// Supported languages
const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
}

// Initialize i18next
i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: deviceLanguage, // default language from device
    fallbackLng: 'en', // fallback language if translation is missing
    compatibilityJSON: 'v4', // Updated for React Native
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false, // Important for React Native
    },
  })

export default i18next
