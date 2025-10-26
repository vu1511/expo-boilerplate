/**
 * Icon Types and Utilities
 *
 * Shared types and hooks for the icon system
 */

import { ForwardedRef } from 'react'
import { StyleSheet, type TextProps } from 'react-native'
import type { PathProps, Svg, SvgProps } from 'react-native-svg'
import { useUnistyles } from 'react-native-unistyles'

import { spacing } from '@/theme'

export type IconProps = {
  ref?: ForwardedRef<Svg>
  fill?: PathProps['fill']
  style?: TextProps['style']
  size?: keyof typeof spacing | number
} & Omit<SvgProps, 'style' | 'size'>

export function useIconProps(props: IconProps) {
  const { theme } = useUnistyles()
  const { fill, size, ...rest } = props
  const style = StyleSheet.flatten(rest.style)
  const _size = Number(size ? (typeof size === 'string' ? spacing[size] : size) : rest.width || spacing.lg)
  const _fill = fill || style?.color || theme.colors.tint

  return {
    ...rest,
    fill: _fill,
    size: _size,
    style: style as SvgProps['style'],
  }
}
