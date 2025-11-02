/**
 * Popover Service
 *
 * Centralized popover service using react-native-popover-view.
 *
 * To switch to a different popover library, replace the implementation
 * in this file while keeping the PopoverService API interface.
 *
 * @example
 * import { PopoverService } from '@/services/popover'
 * import { useRef } from 'react'
 *
 * function MyComponent() {
 *   const triggerRef = useRef<TouchableOpacity>(null)
 *
 *   // Show a popover
 *   const handleShow = () => {
 *     PopoverService.show(
 *       triggerRef,
 *       <View>
 *         <Text>Popover Content</Text>
 *       </View>,
 *       { placement: 'bottom', mode: 'js-modal' }
 *     )
 *   }
 *
 *   // Hide popover
 *   PopoverService.hide()
 *
 *   // Check if visible
 *   if (PopoverService.isVisible()) {
 *     // Do something
 *   }
 *
 *   return (
 *     <TouchableOpacity ref={triggerRef} onPress={handleShow}>
 *       <Text>Show Popover</Text>
 *     </TouchableOpacity>
 *   )
 * }
 */

import type { ReactNode, RefObject } from 'react'

import { usePopoverStore } from './store'
import type { IPopoverService, PopoverOptions } from './types'

const getStore = () => usePopoverStore.getState()

export const PopoverService: IPopoverService = {
  /**
   * Show a popover with content anchored to a trigger element
   */
  show(triggerRef: RefObject<any>, content: ReactNode, options?: PopoverOptions): void {
    getStore().show(triggerRef, content, options)
  },

  /**
   * Hide the currently visible popover
   */
  hide(): void {
    getStore().hide()
  },

  /**
   * Check if a popover is currently visible
   */
  isVisible(): boolean {
    return getStore().isVisible()
  },
}
