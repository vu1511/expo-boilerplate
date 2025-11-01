export type HapticImpactStyle = 'light' | 'medium' | 'heavy'

export type HapticNotificationType = 'success' | 'warning' | 'error'

/**
 * Haptics Service Interface
 *
 * This interface defines the contract that any haptics implementation must follow.
 * To switch libraries, simply create a new adapter implementing this interface.
 */
export interface IHapticsService {
  /**
   * Trigger a light impact haptic feedback
   */
  light(): void

  /**
   * Trigger a medium impact haptic feedback
   */
  medium(): void

  /**
   * Trigger a heavy impact haptic feedback
   */
  heavy(): void

  /**
   * Trigger a success notification haptic feedback
   */
  success(): void

  /**
   * Trigger a warning notification haptic feedback
   */
  warning(): void

  /**
   * Trigger an error notification haptic feedback
   */
  error(): void
}
