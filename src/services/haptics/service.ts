/**
 * Haptics Service
 *
 * Centralized haptic feedback service using expo-haptics.
 *
 * To switch to a different haptic library, replace the implementation
 * in this file while keeping the HapticsService API interface.
 *
 * @example
 * import { HapticsService } from '@/services/haptics'
 *
 * // Trigger different haptic feedbacks
 * HapticsService.success()
 * HapticsService.error()
 * HapticsService.warning()
 *
 * // Impact feedbacks
 * HapticsService.light()
 * HapticsService.medium()
 * HapticsService.heavy()
 */

import * as Haptics from 'expo-haptics'

import type { IHapticsService } from './types'

export const HapticsService: IHapticsService = {
  /**
   * Trigger a light impact haptic feedback
   */
  light(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  },

  /**
   * Trigger a medium impact haptic feedback
   */
  medium(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  },

  /**
   * Trigger a heavy impact haptic feedback
   */
  heavy(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  },

  /**
   * Trigger a success notification haptic feedback
   */
  success(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  },

  /**
   * Trigger a warning notification haptic feedback
   */
  warning(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  },

  /**
   * Trigger an error notification haptic feedback
   */
  error(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  },
}
