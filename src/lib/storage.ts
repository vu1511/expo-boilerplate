/**
 * Storage adapter for Zustand persist middleware
 * Uses MMKV for high-performance storage in React Native
 */

import { MMKV } from 'react-native-mmkv'

const mmkv = new MMKV()

export const storage = {
  getItem: (name: string): string | null => {
    try {
      return mmkv.getString(name) ?? null
    } catch (error) {
      console.error('Error getting item from storage:', error)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      mmkv.set(name, value)
    } catch (error) {
      console.error('Error setting item in storage:', error)
    }
  },
  removeItem: (name: string): void => {
    try {
      mmkv.delete(name)
    } catch (error) {
      console.error('Error removing item from storage:', error)
    }
  },
}
