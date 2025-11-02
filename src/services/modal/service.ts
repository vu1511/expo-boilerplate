/**
 * Modal Service
 *
 * Centralized modal service using react-native-modal.
 *
 * To switch to a different modal library, replace the implementation
 * in this file while keeping the ModalService API interface.
 *
 * @example
 * import { ModalService } from '@/services/modal'
 *
 * // Show a modal
 * ModalService.show(
 *   <View>
 *     <Text>Modal Content</Text>
 *   </View>,
 *   { dismissible: true, animationType: 'slide' }
 * )
 *
 * // Hide modal
 * ModalService.hide()
 *
 * // Check if visible
 * if (ModalService.isVisible()) {
 *   // Do something
 * }
 */

import { useModalStore } from './store'
import type { IModalService, ModalOptions } from './types'

const getStore = () => useModalStore.getState()

export const ModalService: IModalService = {
  /**
   * Show a modal with content
   */
  show(content: React.ReactNode, options?: ModalOptions): void {
    getStore().show(content, options)
  },

  /**
   * Hide the currently visible modal
   */
  hide(): void {
    getStore().hide()
  },

  /**
   * Check if a modal is currently visible
   */
  isVisible(): boolean {
    return getStore().isVisible()
  },
}
