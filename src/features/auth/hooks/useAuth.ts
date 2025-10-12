/**
 * useAuth Hook
 * Main hook for authentication operations
 */

import { useCallback } from 'react'

import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, RegisterCredentials } from '../types'

export function useAuth() {
  const store = useAuthStore()

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return store.login(credentials)
    },
    [store],
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      return store.register(credentials)
    },
    [store],
  )

  const logout = useCallback(async () => {
    return store.logout()
  }, [store])

  return {
    // State
    user: store.user,
    tokens: store.tokens,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    login,
    register,
    logout,
    clearError: store.clearError,
  }
}
