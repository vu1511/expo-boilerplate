import React, { memo } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, ColorValue } from 'react-native'

type TriangleProps = {
  size?: number
  isDown?: boolean
  color?: ColorValue
  style?: StyleProp<ViewStyle>
}

export const Triangle: React.FC<TriangleProps> = memo(({ style, size = 10, color, isDown }) => (
  <View
    style={StyleSheet.flatten([
      styles.triangle,
      style,
      {
        borderLeftWidth: size,
        borderRightWidth: size,
        borderBottomWidth: size,
        borderBottomColor: color,
      },
      isDown && styles.down,
    ])}
  />
))

const styles = StyleSheet.create({
  down: {
    transform: [{ rotate: '180deg' }],
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
})
