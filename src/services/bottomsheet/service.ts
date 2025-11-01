/**
 * Bottom Sheet Service
 *
 * Centralized bottom sheet service using @gorhom/bottom-sheet.
 *
 * To switch to a different bottom sheet library, replace the implementation
 * in this file while keeping the BottomSheetService API interface.
 *
 * @example
 * import { BottomSheetService } from '@/services/bottomsheet'
 *
 * // Show a bottom sheet
 * BottomSheetService.show(
 *   <View>
 *     <Text>Bottom Sheet Content</Text>
 *   </View>,
 *   { snapPoints: ['50%', '90%'], enablePanDownToClose: true }
 * )
 *
 * // Dismiss bottom sheet
 * BottomSheetService.dismiss()
 * // or
 * BottomSheetService.close()
 *
 * // Check if visible
 * if (BottomSheetService.isVisible()) {
 *   // Do something
 * }
 */

import { useBottomSheetStore } from './store'
import type { BottomSheetOptions, IBottomSheetService } from './types'

const getStore = () => useBottomSheetStore.getState()

export const BottomSheetService: IBottomSheetService = {
  /**
   * Show a bottom sheet with content
   */
  show(content: React.ReactNode, options?: BottomSheetOptions): void {
    getStore().show(content, options)
  },

  /**
   * Dismiss the currently visible bottom sheet
   */
  dismiss(): void {
    getStore().dismiss()
  },

  /**
   * Check if a bottom sheet is currently visible
   */
  isVisible(): boolean {
    return getStore().isVisible()
  },

  /**
   * Close the bottom sheet (alias for dismiss)
   */
  close(): void {
    getStore().dismiss()
  },
}
