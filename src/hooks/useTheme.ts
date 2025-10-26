import { useCallback, useEffect, useMemo, useState } from 'react'
import { Appearance } from 'react-native'
import { UnistylesRuntime } from 'react-native-unistyles'

import { getCurrentTheme, getThemeMode, setThemeMode as saveThemeMode, type ThemeMode } from '@/theme'

/**
 * Hook to manage theme preferences
 * Supports system theme detection and user preference storage
 * Automatically updates when system theme changes
 */
export const useTheme = () => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getThemeMode())
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme())

  const handleSetThemeMode = useCallback((mode: ThemeMode) => {
    saveThemeMode(mode)
    setThemeModeState(mode)

    const actualTheme = mode === 'system' ? (Appearance.getColorScheme() ?? 'light') : mode
    UnistylesRuntime.setTheme(actualTheme)
    setCurrentTheme(actualTheme)
  }, [])

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const mode = getThemeMode()
      if (mode === 'system') {
        const newTheme = colorScheme ?? 'light'
        UnistylesRuntime.setTheme(newTheme)
        setCurrentTheme(newTheme)
      }
    })

    return () => subscription?.remove()
  }, [])

  return useMemo(
    () => ({
      themeMode,
      currentTheme,
      setThemeMode: handleSetThemeMode,
      isSystemTheme: themeMode === 'system',
    }),
    [themeMode, currentTheme, handleSetThemeMode],
  )
}
