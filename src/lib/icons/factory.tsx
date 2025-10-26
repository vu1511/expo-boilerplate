/**
 * Icon Factory Functions
 *
 * Factory functions for creating SVG icon components
 * These are used to generate consistent icon components from SVG path data
 */

import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { IconProps, useIconProps } from './types'

/**
 * Creates a single-path filled SVG icon component
 * Best for: Simple icons with solid fills
 *
 * @example
 * export const MyIcon = createSinglePathSVG({
 *   path: 'M12 2L2 7v10l10 5 10-5V7L12 2z'
 * })
 */
export function createSinglePathSVG({ path, viewBox = '0 0 24 24' }: { path: string; viewBox?: string }) {
  return function IconImpl(props: IconProps) {
    const { fill, size, ref, ...rest } = useIconProps(props)

    return (
      <Svg fill="none" {...rest} ref={ref} viewBox={viewBox} width={size} height={size}>
        <Path fill={fill} fillRule="evenodd" clipRule="evenodd" d={path} />
      </Svg>
    )
  }
}

/**
 * Creates a multi-path filled SVG icon component
 * Best for: Complex icons with multiple filled paths
 *
 * @example
 * export const MyIcon = createMultiPathSVG({
 *   paths: [
 *     'M12 2L2 7v10l10 5 10-5V7L12 2z',
 *     'M12 8l-4 2v4l4 2 4-2v-4l-4-2z'
 *   ]
 * })
 */
export function createMultiPathSVG({ paths, viewBox = '0 0 24 24' }: { paths: string[]; viewBox?: string }) {
  return function IconImpl(props: IconProps) {
    const { fill, size, ref, ...rest } = useIconProps(props)

    return (
      <Svg fill="none" {...rest} ref={ref} viewBox={viewBox} width={size} height={size}>
        {paths.map((path, i) => (
          <Path key={i} fill={fill} fillRule="evenodd" clipRule="evenodd" d={path} />
        ))}
      </Svg>
    )
  }
}

/**
 * Creates a stroked SVG icon component
 * Best for: Line-based icons, outline icons
 *
 * @example
 * export const MyIcon = createStrokeSVG({
 *   path: 'M12 2L2 7v10l10 5 10-5V7L12 2z',
 *   strokeWidth: 2
 * })
 */
export function createStrokeSVG({
  path,
  strokeWidth = 2,
  viewBox = '0 0 24 24',
}: {
  path: string
  strokeWidth?: number
  viewBox?: string
}) {
  return function IconImpl(props: IconProps) {
    const { fill, size, ref, ...rest } = useIconProps(props)

    return (
      <Svg fill="none" {...rest} ref={ref} viewBox={viewBox} width={size} height={size}>
        <Path
          stroke={fill}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          d={path}
        />
      </Svg>
    )
  }
}
