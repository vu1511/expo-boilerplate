import { Fonts } from '@/styles'
import { forwardRef } from 'react'
import { Text, TextProps, TextStyle } from 'react-native'

export type TypographyProps = TextProps &
  Required<Pick<TextStyle, 'fontWeight'>> & {
    color?: string
    fontSize: number
    lineHeight?: number
  }

const Typography = forwardRef<Text, TypographyProps>(
  ({ color, fontSize, fontWeight, lineHeight, style, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        {...props}
        style={[
          style,
          Fonts.body14Normal,
          {
            color,
            fontSize,
            fontWeight,
            lineHeight: lineHeight ?? fontSize + 6,
          },
        ]}
      />
    )
  }
)

export default Typography
