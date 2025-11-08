import { Appearance } from 'react-native'

import { storage } from '@/lib/storage'

export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Get the initial theme for the app
 * Checks user preference first, then falls back to system theme
 *
 * @returns 'light' | 'dark'
 */
export const getInitialTheme = (): 'light' | 'dark' => {
  const savedMode = storage.getItem(storage.keys.themeMode) as ThemeMode

  if (savedMode === 'system' || !savedMode) {
    return Appearance.getColorScheme() ?? 'light'
  }

  return savedMode
}

/**
 * Get current theme mode from storage
 *
 * @returns ThemeMode
 */
export const getThemeMode = (): ThemeMode => {
  return (storage.getItem(storage.keys.themeMode) as ThemeMode) ?? 'system'
}

/**
 * Get the actual theme to use (resolves 'system' to actual theme)
 *
 * @returns 'light' | 'dark'
 */
export const getCurrentTheme = (): 'light' | 'dark' => {
  const mode = getThemeMode()

  if (mode === 'system') {
    const systemTheme = Appearance.getColorScheme()
    return systemTheme ?? 'light'
  }

  return mode
}

/**
 * Set theme mode in storage
 *
 * @param mode - Theme mode to set
 */
export const setThemeMode = (mode: ThemeMode): void => {
  storage.setItem(storage.keys.themeMode, mode)
}
