import * as Localization from 'expo-localization'

import { storage } from '@/lib/storage'
import i18n, { languageCodes } from '@/locales'
import type { ChangeLanguageFunction, LanguageCode, TFunction } from '@/types/i18next'

/**
 * Type-safe translation utility for non-React components
 * Provides the same TypeScript support as the useTranslation hook
 *
 * @example
 * import { t, changeLanguage, getCurrentLanguage } from '@/utils/translation'
 *
 * // Simple translation with autocomplete
 * const message = t('common.submit') // ✅ TypeScript suggests all available keys
 *
 * // With interpolation - TypeScript enforces required parameters
 * const welcome = t('messages.welcome', { appName: 'My App' }) // ✅ appName is required
 *
 * // Change language with type safety
 * await changeLanguage('vi') // ✅ Only 'en' | 'vi' allowed
 */
export const t: TFunction = (key, options) => {
  return i18n.t(key, options)
}

/**
 * Change the current language with type safety
 * @param language - Language code ('en' | 'vi')
 */
export const changeLanguage: ChangeLanguageFunction = (language) => {
  return i18n.changeLanguage(language)
}

/**
 * Get the current language
 * @returns Current language code
 */
export const getCurrentLanguage = (): string => {
  return i18n.language
}

/**
 * Check if current language is RTL
 * @returns True if current language is right-to-left
 */
export const isRTL = (): boolean => {
  return i18n.dir() === 'rtl'
}

/**
 * Get all available languages
 * @returns Array of available language codes
 */
export const getAvailableLanguages = (): LanguageCode[] => {
  return Object.keys(i18n.options.resources || {}) as LanguageCode[]
}

/**
 * Check if a language is supported
 * @param language - Language code to check
 * @returns True if language is supported
 */
export const isLanguageSupported = (language: string): language is LanguageCode => {
  return languageCodes.includes(language as LanguageCode)
}

/**
 * Get the saved language preference from storage
 * @returns Saved language code or null if not found
 */
export const getSavedLanguage = (): LanguageCode | null => {
  const savedLanguage = storage.getItem(storage.keys.userLanguage)
  if (savedLanguage && isLanguageSupported(savedLanguage)) {
    return savedLanguage as LanguageCode
  }
  return null
}

/**
 * Get the system/device language
 * @returns System language code or null if not supported
 */
export const getSystemLanguage = (): LanguageCode | null => {
  const systemLanguage = Localization.getLocales()[0]?.languageCode || 'en'
  if (isLanguageSupported(systemLanguage)) {
    return systemLanguage
  }
  return null
}

/**
 * Get the language to use based on priority:
 * 1. Saved preference
 * 2. System locale
 * 3. Default (en)
 *
 * @returns Language code to use
 */
export const getPreferredLanguage = (): LanguageCode => {
  const savedLanguage = getSavedLanguage()
  if (savedLanguage) {
    return savedLanguage
  }

  const systemLanguage = getSystemLanguage()
  if (systemLanguage) {
    return systemLanguage
  }

  return 'en'
}

/**
 * Save language preference to storage
 * @param language - Language code to save
 */
export const saveLanguage = (language: LanguageCode): void => {
  storage.setItem(storage.keys.userLanguage, language)
}

/**
 * Clear saved language preference
 * This will cause the app to use system locale on next launch
 */
export const clearSavedLanguage = (): void => {
  storage.removeItem(storage.keys.userLanguage)
}
