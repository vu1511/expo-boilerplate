import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { LanguageCode } from '@/types'
import { setDateLocale } from '@/utils/date'
import { getPreferredLanguage, saveLanguage } from '@/utils/translation'

import en from './en.json'
import vi from './vi.json'

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
}

export const languageCodes = Object.keys(resources) as LanguageCode[]

const initialLanguage = getPreferredLanguage()

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: initialLanguage, // Priority: Storage > System Locale > Fallback
    fallbackLng: 'en', // fallback language if translation is missing
    compatibilityJSON: 'v4', // Updated for React Native
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false, // Important for React Native
    },
  })

i18next.on('languageChanged', (lng) => {
  const languageCode = lng as LanguageCode
  saveLanguage(languageCode)
  setDateLocale(languageCode)
})

export default i18next
