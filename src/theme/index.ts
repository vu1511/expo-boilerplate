import { borderRadius } from './borderRadius'
import { breakpoints } from './breakpoints'
import { colorsDark, colorsLight } from './colors'
import { fontFamily, fontSize, fontsToLoad, fontWeight, lineHeight, typography, type TypographyVariant } from './fonts'
import { spacing } from './spacing'
import { commonStyles } from './styles'
import { timing } from './timing'

export {
  borderRadius,
  breakpoints,
  colorsDark,
  colorsLight,
  commonStyles,
  fontFamily,
  fontSize,
  fontsToLoad,
  fontWeight,
  lineHeight,
  spacing,
  timing,
  typography,
  type TypographyVariant,
}

export { type AppBreakpoints, type AppThemes, darkTheme, lightTheme } from './unistyles'
export * from './utils'

/**
 * Generate nested color key paths for TypeScript autocomplete
 * This creates paths like 'palette.neutral900', 'palette.primary500', etc.
 */
export type NestedColorKeys<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? `${K}.${keyof T[K] & string}`
    : K
  : never

/**
 * Theme color keys derived from the actual colors object, including nested paths
 */
export type ThemeColorKey = NestedColorKeys<typeof colorsLight>
