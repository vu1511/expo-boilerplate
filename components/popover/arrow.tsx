import React, { memo } from 'react'
import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { PopoverDirection } from './types'

export type ArrowProps = {
  size?: number
  color?: ColorValue
  style?: StyleProp<ViewStyle>
  direction: PopoverDirection
}

const Arrow: React.FC<ArrowProps> = memo(({ style, size = 10, color, direction }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={StyleSheet.flatten([
        styles.arrow,
        style,
        {
          borderLeftWidth: size,
          borderRightWidth: size,
          borderBottomWidth: size,
          borderBottomColor: color,
          left: -(size / 2),
        },
        direction === 'left' && {
          transform: [{ rotate: '90deg' }],
        },
        direction === 'right' && {
          transform: [{ rotate: '-90deg' }],
        },
        direction === 'top' && {
          transform: [{ rotate: '180deg' }],
        },
      ])}
    />
  </View>
))

const styles = StyleSheet.create({
  arrow: {
    ...StyleSheet.absoluteFillObject,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
})

export default Arrow
