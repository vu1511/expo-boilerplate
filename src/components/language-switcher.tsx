import React from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { ThemedView } from '@/components/themed-view'
import { LanguageCode, useTranslation } from '@/hooks/useTranslation'

import { Typography } from './typography'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
]

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage } = useTranslation()

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode as LanguageCode)
  }

  return (
    <ThemedView style={styles.container}>
      {LANGUAGES.map((language) => {
        const isActive = currentLanguage.startsWith(language.code)

        return (
          <TouchableOpacity
            key={language.code}
            onPress={() => handleLanguageChange(language.code)}
            style={[styles.languageButton, isActive && styles.activeLanguageButton]}
            activeOpacity={0.7}
          >
            <Typography style={styles.flag}>{language.flag}</Typography>
            <Typography style={[styles.languageText, isActive && styles.activeLanguageText]}>
              {language.name}
            </Typography>
          </TouchableOpacity>
        )
      })}
    </ThemedView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    minWidth: 120,
  },
  activeLanguageButton: {
    backgroundColor: theme.colors.tint,
    borderColor: theme.colors.tint,
  },
  flag: {
    fontSize: theme.fontSize.lg,
  },
  languageText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  activeLanguageText: {},
}))
