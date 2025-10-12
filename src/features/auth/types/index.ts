/**
 * Auth Feature Types
 * All TypeScript types and interfaces for authentication
 */

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User) => void
  setTokens: (tokens: AuthTokens) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  reset: () => void
}

export type SocialProvider = 'google' | 'facebook' | 'apple'

export interface SocialLoginOptions {
  provider: SocialProvider
}
