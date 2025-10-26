import get from 'lodash.get'
import React, { memo } from 'react'
import { StyleProp, Text, type TextProps, type TextStyle } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

import { ThemeColorKey, typography, type TypographyVariant } from '@/theme'

/**
 * Color prop supports both theme color keys (with autocomplete) and custom color strings
 */
export type ColorProp = ThemeColorKey | (string & {})

export type TypographyProps = TextProps & {
  variant?: TypographyVariant
  color?: ColorProp
}

/**
 * Typography component following design system best practices
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Main Heading</Typography>
 * <Typography variant="body" color="text">Body text with theme color</Typography>
 * <Typography variant="body" color="palette.neutral900">Body text with nested color</Typography>
 * <Typography variant="body" color="#FF0000">Body text with custom color</Typography>
 * <Typography variant="caption" color="tint">Small caption</Typography>
 * ```
 */
export const Typography: React.FC<TypographyProps> = memo(({ variant = 'body', color, style, children, ...props }) => {
  const { theme } = useUnistyles()
  const typographyStyle = typography[variant] as TextStyle

  // Resolve color: use lodash.get for nested paths, fallback to direct access, then custom color
  const resolvedColor = color && (get(theme.colors, color) || theme.colors[color as keyof typeof theme.colors] || color)
  const combinedStyle = [typographyStyle, resolvedColor && { color: resolvedColor }, style] as StyleProp<TextStyle>

  return (
    <Text style={combinedStyle} {...props}>
      {children}
    </Text>
  )
})
