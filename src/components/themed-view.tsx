import { View, type ViewProps } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

export type ThemedViewProps = ViewProps

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const {
    theme: { colors },
  } = useUnistyles()

  return <View style={[{ backgroundColor: colors.background }, style]} {...otherProps} />
}
