export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  /**
   * Duration in milliseconds (default: 3000)
   */
  duration?: number

  /**
   * Custom description text (optional)
   */
  description?: string

  /**
   * Position of the toast (default: 'top')
   */
  position?: 'top' | 'bottom'

  /**
   * Custom icon component (optional)
   */
  icon?: 'success' | 'error' | 'warning' | 'info'
}

export interface ToastMessage {
  message: string
  type?: ToastType
  options?: ToastOptions
}

/**
 * Toast Service Interface
 *
 * This interface defines the contract that any toast implementation must follow.
 * To switch libraries, simply create a new adapter implementing this interface.
 */
export interface IToastService {
  /**
   * Show a toast message with a specific type
   */
  show(message: string, type?: ToastType, options?: ToastOptions): void

  /**
   * Show a success toast
   */
  success(message: string, options?: ToastOptions): void

  /**
   * Show an error toast
   */
  error(message: string, options?: ToastOptions): void

  /**
   * Show a warning toast
   */
  warning(message: string, options?: ToastOptions): void

  /**
   * Show an info toast
   */
  info(message: string, options?: ToastOptions): void

  /**
   * Hide currently visible toast
   */
  hide(): void
}
