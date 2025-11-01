import { create } from 'zustand'

import type { ModalOptions, ModalState } from './types'

interface ModalStore extends ModalState {
  show: (content: React.ReactNode, options?: ModalOptions) => void
  hide: () => void
  reset: () => void
  isVisible: () => boolean
}

const defaultOptions: ModalOptions = {
  dismissible: true,
  animationType: 'slide',
  transparent: true,
}

const initialState: ModalState = {
  visible: false,
  content: null,
  options: defaultOptions,
}

export const useModalStore = create<ModalStore>((set, get) => ({
  ...initialState,

  show: (content, options) => {
    set({
      visible: true,
      content,
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
