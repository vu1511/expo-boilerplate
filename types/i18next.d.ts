import 'react-i18next'

import en from '@/locales/en.json'

type TranslationKeys = typeof en

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKey = NestedKeyOf<TranslationKeys>

export type TFunction = (key: TranslationKey, options?: TOptionsBase & $Dictionary) => any

export type LanguageCode = 'en' | 'vi'

export type ChangeLanguageFunction = (language: LanguageCode) => Promise<TFunction>

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: TranslationKeys
    }
  }

  interface UseTranslationResponse {
    t: TFunction
  }
}

// Extend the i18next module to provide type safety for direct usage
declare module 'i18next' {
  interface i18n {
    t: TFunction
  }
}
