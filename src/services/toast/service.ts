/**
 * Toast Service
 *
 * Centralized toast notification service using react-native-flash-message.
 *
 * To switch to a different toast library, replace the implementation
 * in this file while keeping the ToastService API interface.
 *
 * @example
 * import { ToastService } from '@/services/toast'
 *
 * // Show different toast types
 * ToastService.success('Operation completed!')
 * ToastService.error('Something went wrong')
 * ToastService.warning('Please check your input')
 * ToastService.info('New update available')
 *
 * // With options
 * ToastService.success('Saved!', {
 *   duration: 5000,
 *   description: 'Your changes have been saved',
 *   position: 'bottom'
 * })
 */

import { hideMessage, MessageOptions, showMessage } from 'react-native-flash-message'

import type { IToastService, ToastOptions, ToastType } from './types'

const mapToastTypeToFlashMessageType = (type?: ToastType): MessageOptions['type'] => {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'danger' // flash-message uses 'danger' for errors
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'default'
  }
}

/**
 * Maps ToastOptions to FlashMessage's MessageOptions
 */
const mapOptionsToFlashMessageOptions = (options?: ToastOptions): Partial<MessageOptions> => {
  const flashMessageOptions: Partial<MessageOptions> = {}

  if (options?.duration) {
    flashMessageOptions.duration = options.duration
  }

  if (options?.description) {
    flashMessageOptions.description = options.description
  }

  if (options?.position) {
    flashMessageOptions.position = options.position === 'top' ? 'top' : 'bottom'
  }

  return flashMessageOptions
}

const showToast = (message: string, type?: ToastType, options?: ToastOptions): void => {
  const messageType = mapToastTypeToFlashMessageType(type)
  const flashMessageOptions = mapOptionsToFlashMessageOptions(options)

  showMessage({
    message,
    type: messageType,
    ...flashMessageOptions,
  })
}

export const ToastService: IToastService = {
  /**
   * Show a toast message with optional type and options
   */
  show(message: string, type?: ToastType, options?: ToastOptions): void {
    showToast(message, type, options)
  },

  /**
   * Show a success toast
   */
  success(message: string, options?: ToastOptions): void {
    showToast(message, 'success', options)
  },

  /**
   * Show an error toast
   */
  error(message: string, options?: ToastOptions): void {
    showToast(message, 'error', options)
  },

  /**
   * Show a warning toast
   */
  warning(message: string, options?: ToastOptions): void {
    showToast(message, 'warning', options)
  },

  /**
   * Show an info toast
   */
  info(message: string, options?: ToastOptions): void {
    showToast(message, 'info', options)
  },

  /**
   * Hide currently visible toast
   */
  hide(): void {
    hideMessage()
  },
}
