import type { PropsWithChildren, ReactElement } from 'react'
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollOffset } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { ThemedView } from '@/components/themed-view'

const HEADER_HEIGHT = 250

type Props = PropsWithChildren<{
  headerImage: ReactElement
}>

export default function ParallaxScrollView({ children, headerImage }: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollOffset(scrollRef)
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    }
  })

  return (
    <Animated.ScrollView ref={scrollRef} style={styles.container} scrollEventThrottle={16}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>{headerImage}</Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xxl,
    gap: spacing.md,
    overflow: 'hidden',
  },
}))
