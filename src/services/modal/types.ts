import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface ModalOptions {
  /**
   * Whether the modal can be dismissed by tapping the backdrop (default: true)
   */
  dismissible?: boolean

  /**
   * Animation type (default: 'slide')
   */
  animationType?: 'none' | 'slide' | 'fade'

  /**
   * Whether to show backdrop (default: true)
   */
  transparent?: boolean

  /**
   * Custom styles for the modal content
   */
  style?: StyleProp<ViewStyle>

  /**
   * Callback when modal is dismissed
   */
  onDismiss?: () => void
}

export interface ModalState {
  visible: boolean
  content: ReactNode | null
  options: ModalOptions
}

/**
 * Modal Service Interface
 *
 * This interface defines the contract that any modal implementation must follow.
 * To switch libraries, simply create a new adapter implementing this interface.
 */
export interface IModalService {
  /**
   * Show a modal with content
   */
  show(content: ReactNode, options?: ModalOptions): void

  /**
   * Hide the currently visible modal
   */
  hide(): void

  /**
   * Check if a modal is currently visible
   */
  isVisible(): boolean
}
