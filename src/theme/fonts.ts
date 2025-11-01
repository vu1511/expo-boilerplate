/**
 * Font files to load - using require() for Expo font loading
 * Best Practice: Only load fonts you actually use to optimize bundle size
 */
export const fontsToLoad = {
  'Inter-Regular': require('@/assets/fonts/Inter-Regular.otf'),
  'Inter-Medium': require('@/assets/fonts/Inter-Medium.otf'),
  'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.otf'),
  'Inter-Bold': require('@/assets/fonts/Inter-Bold.otf'),
} as const

/**
 * Font family names for use in styles
 * Best Practice: Use consistent naming that matches font file names
 */
export const fontFamily = {
  inter: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  // Fallback system fonts for better performance
  system: {
    ios: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      semiBold: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
    web: {
      regular: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      medium: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      semiBold: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bold: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
} as const

/**
 * Font weights - using string values for React Native compatibility
 * Best Practice: Use standard font weight values
 */
export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const

/**
 * Typography scale - following 8pt grid system
 * Best Practice: Use consistent scale for better visual hierarchy
 */
export const fontSize = {
  xs: 12, // Small captions
  sm: 14, // Body small
  md: 16, // Body regular
  lg: 18, // Body large
  xl: 20, // Subheading
  xxl: 24, // Heading
  xxxl: 32, // Large heading
  display: 40, // Display text
} as const

/**
 * Line heights - optimized for readability
 * Best Practice: Line height should be 1.2-1.6x font size for optimal readability
 */
export const lineHeight = {
  xs: 16, // 1.33x
  sm: 20, // 1.43x
  md: 24, // 1.5x
  lg: 28, // 1.56x
  xl: 28, // 1.4x
  xxl: 32, // 1.33x
  xxxl: 40, // 1.25x
  display: 48, // 1.2x
} as const

/**
 * Typography presets - semantic text styles
 * Best Practice: Create semantic styles for consistent usage
 */
export const typography = {
  // Display styles
  display: {
    fontFamily: fontFamily.inter.bold,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    fontWeight: fontWeight.bold,
  },

  // Heading styles
  h1: {
    fontFamily: fontFamily.inter.bold,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
    fontWeight: fontWeight.bold,
  },
  h2: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
    fontWeight: fontWeight.semiBold,
  },
  h3: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: fontWeight.semiBold,
  },

  // Body text styles
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.regular,
  },
  bodyMedium: {
    fontFamily: fontFamily.inter.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.medium,
  },
  bodyLarge: {
    fontFamily: fontFamily.inter.regular,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.regular,
  },

  // Small text styles
  caption: {
    fontFamily: fontFamily.inter.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.regular,
  },
  captionMedium: {
    fontFamily: fontFamily.inter.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.medium,
  },
  captionSmall: {
    fontFamily: fontFamily.inter.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.regular,
  },
  captionSmallMedium: {
    fontFamily: fontFamily.inter.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.medium,
  },

  // Button text styles
  button: {
    fontFamily: fontFamily.inter.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.medium,
  },
  buttonLarge: {
    fontFamily: fontFamily.inter.medium,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.medium,
  },
} as const

/**
 * Typography variant keys for type safety
 */
export type TypographyVariant = keyof typeof typography

/**
 * Legacy exports for backward compatibility
 * @deprecated Use fontFamily instead
 */
export const fonts = fontFamily
