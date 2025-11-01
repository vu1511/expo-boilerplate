import type { ReactNode } from 'react'

export type BottomSheetSnapPoint = number | string

export interface BottomSheetOptions {
  /**
   * Snap points for the bottom sheet (default: ['50%'])
   */
  snapPoints?: BottomSheetSnapPoint[]

  /**
   * Whether the bottom sheet can be dismissed by swiping down (default: true)
   */
  enableDismissOnClose?: boolean

  /**
   * Whether to show the handle indicator (default: true)
   */
  enableHandlePanningGesture?: boolean

  /**
   * Whether to enable dynamic sizing (default: false)
   */
  enableDynamicSizing?: boolean

  /**
   * Whether to show the pan gesture indicator (default: true)
   */
  enablePanDownToClose?: boolean

  /**
   * Initial snap point index (default: 0)
   */
  initialSnapPointIndex?: number

  /**
   * Callback when bottom sheet is dismissed
   */
  onDismiss?: () => void

  /**
   * Background color of the bottom sheet
   */
  backgroundStyle?: { backgroundColor?: string }

  /**
   * Handle indicator style
   */
  handleIndicatorStyle?: { backgroundColor?: string }
}

export interface BottomSheetState {
  visible: boolean
  content: ReactNode | null
  options: BottomSheetOptions
}

/**
 * Bottom Sheet Service Interface
 *
 * This interface defines the contract that any bottom sheet implementation must follow.
 * To switch libraries, simply create a new adapter implementing this interface.
 */
export interface IBottomSheetService {
  /**
   * Show a bottom sheet with content
   */
  show(content: ReactNode, options?: BottomSheetOptions): void

  /**
   * Dismiss the currently visible bottom sheet
   */
  dismiss(): void

  /**
   * Check if a bottom sheet is currently visible
   */
  isVisible(): boolean

  /**
   * Close the bottom sheet (alias for dismiss)
   */
  close(): void
}
