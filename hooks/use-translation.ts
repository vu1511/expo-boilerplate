import { useCallback } from 'react'
import { useTranslation as useTranslationI18next } from 'react-i18next'

import type { ChangeLanguageFunction, LanguageCode, TFunction, TranslationKey } from '@/types/i18next'

/**
 * Custom hook for translations with full TypeScript support
 * Wraps react-i18next's useTranslation hook for easier usage
 *
 * @example
 * const { t, changeLanguage, currentLanguage } = useTranslation();
 *
 * // Simple translation with autocomplete
 * t('common.submit') // ✅ TypeScript will suggest all available keys
 *
 * // With interpolation - TypeScript will enforce required parameters
 * t('messages.welcome', { appName: 'My App' }) // ✅ appName is required
 *
 * // With pluralization
 * t('messages.itemsCount', { count: 5 }) // ✅ count is required
 *
 * // Change language
 * changeLanguage('vi')
 */
export const useTranslation = () => {
  const { t: tFunction, i18n } = useTranslationI18next()

  const t: TFunction = useCallback((key, options) => tFunction(key, options), [tFunction])

  const changeLanguage: ChangeLanguageFunction = useCallback(
    async (language) => {
      return i18n.changeLanguage(language)
    },
    [i18n],
  )

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language,
    isRTL: i18n.dir() === 'rtl',
  }
}

export type { ChangeLanguageFunction, LanguageCode, TFunction, TranslationKey }
