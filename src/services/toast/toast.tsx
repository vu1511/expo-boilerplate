import { Platform } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import { StyleSheet } from 'react-native-unistyles'

/**
 * Toast Component
 *
 * Renders the FlashMessage component for displaying toast notifications.
 * Configure default options here if needed.
 */
export function Toast() {
  return <FlashMessage position="top" titleStyle={styles.title} textStyle={styles.description} style={styles.toast} />
}

const styles = StyleSheet.create(({ typography, colors, fontSize, lineHeight, spacing }, rt) => ({
  toast: {
    paddingTop: Platform.select({ android: Math.max(rt.insets.top, spacing.md) }),
  },
  title: {
    ...typography.caption,
    color: colors.white,
  },
  description: {
    ...typography.caption,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    color: colors.white,
  },
}))
