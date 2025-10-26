/**
 * Icon System
 *
 * Re-export all icon utilities from a single entry point
 *
 * Usage:
 *   import { createSinglePathSVG, createSvgIcon, IconProps } from '@/lib/icons'
 */

// Path-based icon factories (for simple icons)
export { createMultiPathSVG, createSinglePathSVG, createStrokeSVG } from './factory'

// Types and utilities
export type { IconProps } from './types'
export { useIconProps } from './types'
