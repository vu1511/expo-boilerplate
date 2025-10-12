import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { LanguageCode, useTranslation } from '@/hooks/use-translation'

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    minWidth: 120,
  },
  activeLanguageButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  flag: {
    fontSize: 20,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activeLanguageText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
