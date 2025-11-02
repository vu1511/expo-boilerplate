import type { ReactNode, RefObject } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { PopoverPlacement } from 'react-native-popover-view'

export interface PopoverOptions {
  /**
   * Placement of the popover relative to the trigger (default: 'auto')
   */
  placement?: PopoverPlacement

  /**
   * Whether the popover can be dismissed by tapping outside (default: true)
   */
  onRequestClose?: () => void

  /**
   * Custom styles for the popover content
   */
  style?: StyleProp<ViewStyle>

  /**
   * Custom background color
   */
  backgroundColor?: string

  /**
   * Offset from the trigger element
   */
  offset?: number

  /**
   * Whether to show arrow
   */
  arrowSize?: { width: number; height: number }

  /**
   * Animation duration in milliseconds
   */
  animationConfig?: {
    duration?: number
  }

  /**
   * Callback when popover is dismissed
   */
  onDismiss?: () => void
}

export interface PopoverState {
  visible: boolean
  content: ReactNode | null
  triggerRef: RefObject<any> | null
  options: PopoverOptions
}

/**
 * Popover Service Interface
 *
 * This interface defines the contract that any popover implementation must follow.
 * To switch libraries, simply create a new adapter implementing this interface.
 */
export interface IPopoverService {
  /**
   * Show a popover with content anchored to a trigger element
   */
  show(triggerRef: RefObject<any>, content: ReactNode, options?: PopoverOptions): void

  /**
   * Hide the currently visible popover
   */
  hide(): void

  /**
   * Check if a popover is currently visible
   */
  isVisible(): boolean
}
