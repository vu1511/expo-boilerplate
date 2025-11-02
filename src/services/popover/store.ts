import type { ReactNode, RefObject } from 'react'
import { PopoverPlacement } from 'react-native-popover-view'
import { create } from 'zustand'

import type { PopoverOptions, PopoverState } from './types'

interface PopoverStore extends PopoverState {
  show: (triggerRef: RefObject<any>, content: ReactNode, options?: PopoverOptions) => void
  hide: () => void
  reset: () => void
  isVisible: () => boolean
}

const defaultOptions: PopoverOptions = {
  placement: PopoverPlacement.AUTO,
  onRequestClose: undefined,
}

const initialState: PopoverState = {
  visible: false,
  content: null,
  triggerRef: null,
  options: defaultOptions,
}

export const usePopoverStore = create<PopoverStore>((set, get) => ({
  ...initialState,

  show: (triggerRef, content, options) => {
    set({
      visible: true,
      content,
      triggerRef,
      options: { ...defaultOptions, ...options },
    })
  },

  hide: () => {
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
