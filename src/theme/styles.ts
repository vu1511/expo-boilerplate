import { StyleSheet } from 'react-native-unistyles'

import { spacing } from './spacing'

type SpacingKey = keyof typeof spacing

type SpacingUtilityKeys =
  | `p_${SpacingKey}`
  | `px_${SpacingKey}`
  | `py_${SpacingKey}`
  | `pt_${SpacingKey}`
  | `pr_${SpacingKey}`
  | `pb_${SpacingKey}`
  | `pl_${SpacingKey}`
  | `m_${SpacingKey}`
  | `mx_${SpacingKey}`
  | `my_${SpacingKey}`
  | `mt_${SpacingKey}`
  | `mr_${SpacingKey}`
  | `mb_${SpacingKey}`
  | `ml_${SpacingKey}`
  | `gap_${SpacingKey}`
  | `r_gap_${SpacingKey}`
  | `c_gap_${SpacingKey}`

// Generate spacing utilities dynamically
const generateSpacingStyles = (): Record<SpacingUtilityKeys, any> => {
  const styles = {} as Record<SpacingUtilityKeys, any>

  Object.entries(spacing).forEach(([key, value]) => {
    const k = key as SpacingKey

    // Padding utilities
    styles[`p_${k}`] = { padding: value }
    styles[`px_${k}`] = { paddingHorizontal: value }
    styles[`py_${k}`] = { paddingVertical: value }
    styles[`pt_${k}`] = { paddingTop: value }
    styles[`pr_${k}`] = { paddingRight: value }
    styles[`pb_${k}`] = { paddingBottom: value }
    styles[`pl_${k}`] = { paddingLeft: value }

    // Margin utilities
    styles[`m_${k}`] = { margin: value }
    styles[`mx_${k}`] = { marginHorizontal: value }
    styles[`my_${k}`] = { marginVertical: value }
    styles[`mt_${k}`] = { marginTop: value }
    styles[`mr_${k}`] = { marginRight: value }
    styles[`mb_${k}`] = { marginBottom: value }
    styles[`ml_${k}`] = { marginLeft: value }

    // Gap utilities
    styles[`gap_${k}`] = { gap: value }
    styles[`r_gap_${k}`] = { rowGap: value }
    styles[`c_gap_${k}`] = { columnGap: value }
  })

  return styles
}

/**
 * Common utility styles for use across the app.
 * Includes flexbox, spacing, and opacity utilities.
 *
 * @example
 * ```tsx
 * <View style={[commonStyles.flex_row, commonStyles.p_md, commonStyles.gap_xs]}>
 *   <Text>Hello</Text>
 * </View>
 * ```
 */
export const commonStyles = StyleSheet.create({
  // Flexbox utilities
  row_items_center: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row_center: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex_row_space_between: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex_row: {
    display: 'flex',
    flexDirection: 'row',
  },
  flex_col: {
    display: 'flex',
    flexDirection: 'column',
  },
  items_center: {
    alignItems: 'center',
  },
  items_start: {
    alignItems: 'flex-start',
  },
  items_end: {
    alignItems: 'flex-end',
  },
  justify_center: {
    justifyContent: 'center',
  },
  justify_start: {
    justifyContent: 'flex-start',
  },
  justify_end: {
    justifyContent: 'flex-end',
  },
  justify_between: {
    justifyContent: 'space-between',
  },
  justify_around: {
    justifyContent: 'space-around',
  },
  justify_evenly: {
    justifyContent: 'space-evenly',
  },
  self_start: {
    alignSelf: 'flex-start',
  },
  self_center: {
    alignSelf: 'center',
  },
  self_end: {
    alignSelf: 'flex-end',
  },
  flex_1: {
    flex: 1,
  },
  grow_1: {
    flexGrow: 1,
  },
  shrink_1: {
    flexShrink: 1,
  },
  shrink_0: {
    flexShrink: 0,
  },

  // Opacity utilities
  opacity_0: {
    opacity: 0,
  },
  opacity_50: {
    opacity: 0.5,
  },
  opacity_75: {
    opacity: 0.75,
  },
  opacity_100: {
    opacity: 1,
  },

  // Spacing utilities (generated from spacing.ts)
  // Includes: p_{size}, px_{size}, py_{size}, pt_{size}, pr_{size}, pb_{size}, pl_{size}
  // m_{size}, mx_{size}, my_{size}, mt_{size}, mr_{size}, mb_{size}, ml_{size}
  // gap_{size}, r_gap_{size}, c_gap_{size}
  // Where size can be: xxxs, xxs, xs, sm, md, lg, xl, xxl, xxxl
  ...generateSpacingStyles(),
})
