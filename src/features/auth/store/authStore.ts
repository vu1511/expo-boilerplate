/**
 * Auth Store (Zustand)
 * Central state management for authentication
 */

import { router } from 'expo-router'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { authService } from '@/api/authService'
import { storage } from '@/lib/storage'

import type { AuthStore, LoginCredentials, RegisterCredentials } from '../types'

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      ...initialState,

      // Setters
      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: (tokens) => set({ tokens }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(credentials)
          set({
            user: response.user,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
          })
          router.replace('/(tabs)')
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          })
          throw error
        }
      },

      // Register
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register(credentials)
          set({
            user: response.user,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
          })
          router.replace('/(tabs)')
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          })
          throw error
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
          set({ ...initialState })
          router.replace('/(auth)/login')
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Logout failed',
            isLoading: false,
          })
        }
      },

      // Reset store
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
