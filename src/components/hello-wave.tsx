import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

export function HelloWave() {
  const { theme } = useUnistyles()

  return (
    <Animated.Text
      style={{
        fontSize: theme.fontSize.xxl,
        lineHeight: theme.lineHeight.xxl,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}
    >
      👋
    </Animated.Text>
  )
}
