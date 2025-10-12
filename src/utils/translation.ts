import i18n from '@/locales'
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
export const isLanguageSupported = (language: LanguageCode): boolean => {
  return getAvailableLanguages().includes(language)
}
