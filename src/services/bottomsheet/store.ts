import { create } from 'zustand'

import type { BottomSheetOptions, BottomSheetState } from './types'

interface BottomSheetStore extends BottomSheetState {
  show: (content: React.ReactNode, options?: BottomSheetOptions) => void
  reset: () => void
  dismiss: () => void
  isVisible: () => boolean
}

const defaultOptions: BottomSheetOptions = {
  snapPoints: ['50%'],
  enableDismissOnClose: true,
  enableHandlePanningGesture: true,
  enablePanDownToClose: true,
  initialSnapPointIndex: 0,
  enableDynamicSizing: false,
}

const initialState: BottomSheetState = {
  visible: false,
  content: null,
  options: defaultOptions,
}

export const useBottomSheetStore = create<BottomSheetStore>((set, get) => ({
  ...initialState,

  show: (content, options) => {
    set({
      visible: true,
      content,
      options: { ...defaultOptions, ...options },
    })
  },

  dismiss: () => {
    const currentOptions = get().options
    set({ ...currentOptions, visible: false })
  },

  reset: () => {
    set(initialState)
  },

  isVisible: () => {
    return get().visible
  },
}))
