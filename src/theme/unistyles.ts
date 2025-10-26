/* eslint-disable @typescript-eslint/no-empty-object-type */
import { StyleSheet } from 'react-native-unistyles'

import { borderRadius } from './borderRadius'
import { breakpoints } from './breakpoints'
import { colorsDark, colorsLight } from './colors'
import { fontFamily, fontSize, fontWeight, lineHeight, typography } from './fonts'
import { spacing } from './spacing'
import { timing } from './timing'
import { getInitialTheme } from './utils'

/**
 * Light theme configuration
 * Contains all design tokens for light mode
 */
export const lightTheme = {
  colors: colorsLight,
  timing,
  spacing,
  fontSize,
  fontFamily,
  lineHeight,
  fontWeight,
  typography,
  borderRadius,
} as const

/**
 * Dark theme configuration
 * Contains all design tokens for dark mode
 */
export const darkTheme = {
  colors: colorsDark,
  timing,
  spacing,
  fontSize,
  fontFamily,
  lineHeight,
  fontWeight,
  typography,
  borderRadius,
} as const

// Configure unistyles
StyleSheet.configure({
  settings: {
    initialTheme: getInitialTheme,
  },
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
})

export type AppBreakpoints = typeof breakpoints

export type AppThemes = {
  light: typeof lightTheme
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}
