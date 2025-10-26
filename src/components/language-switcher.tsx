import React from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { LanguageCode, useTranslation } from '@/hooks/useTranslation'

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
            <ThemedText style={styles.flag}>{language.flag}</ThemedText>
            <ThemedText style={[styles.languageText, isActive && styles.activeLanguageText]}>
              {language.name}
            </ThemedText>
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
  activeLanguageText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.semiBold,
  },
}))
