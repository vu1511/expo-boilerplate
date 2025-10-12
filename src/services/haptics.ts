import * as Haptics from 'expo-haptics'

export const haptics = {
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
}
